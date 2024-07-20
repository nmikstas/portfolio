#include <stdio.h>
#include <math.h>
#include "stdint.h"
#include "usbstk5505.h"
#include "usbstk5505_gpio.h"
#include "usbstk5505_i2c.h"
#include "usbstk5505_i2s.h"
#include "usbstk5505_led.h"
#include "csl_pll.h"
#include "csl_spi.h"
#include "csl_general.h"
#include "cslr_sysctrl.h"
#include "LCD.h"
#include "main.h"

void main(void) {
    int i;

    //Set PLL configuration data for 120 mHz operation.
    pllconfig.PLLCNTL1 = 0x8E4A; //M = 0xE4A.
    pllconfig.PLLINCNTL = 0x8000; //Bypass the reference divider.
    pllconfig.PLLCNTL2 = 0x0806; //Not necessary?
    pllconfig.PLLOUTCNTL = 0x0000; //Bypass the output divider.

    //Initialize the PLL.
    status = PLL_init(&pll, pllid);
    hpll = &pll;

    //Reset PLL registers.
    PLL_reset(hpll);

    //Configure the PLL.
    status = PLL_config(hpll, &pllconfig);

    //Enable the PLL.
    status = PLL_enable(hpll);

    //Wait for power up of peripherals.
    for(i = 0; i < 10000; i++);

    //Zero out echo buffer.
    for(i = 0; i < ECHO_SIZE; i++)
    {
        echo_buf[i] = 0;
    }

    /*Initialize the CODEC*/
    initcodec();

    //SPI initialization.
    SPI_init();
    hSpi1 = SPI_open(SPI_CS_NUM_1, SPI_POLLING_MODE);
    SPI_config(hSpi1, &spiConfig);

    /*LCD Backlight*/
    USBSTK5505_GPIO_setDirection(GPIO10, GPIO_OUT);
    USBSTK5505_GPIO_setOutput(GPIO10, 1);

    /*LED D5*/
    USBSTK5505_GPIO_setDirection(GPIO12, GPIO_OUT);
    USBSTK5505_GPIO_setOutput(GPIO12, 0);

    /*LED D4*/
    USBSTK5505_GPIO_setDirection(GPIO13, GPIO_OUT);
    USBSTK5505_GPIO_setOutput(GPIO13, 1);

    /*LED D3*/
    USBSTK5505_GPIO_setDirection(GPIO14, GPIO_OUT);
    USBSTK5505_GPIO_setOutput(GPIO14, 0);

    //GPIO 4.  LCD command/data select.
    USBSTK5505_GPIO_setDirection(GPIO4, GPIO_OUT);
    USBSTK5505_GPIO_setOutput(GPIO4, 1);

    //GPIO 5.  LCD reset.
    USBSTK5505_GPIO_setDirection(GPIO5, GPIO_OUT);
    USBSTK5505_GPIO_setOutput(GPIO5, 1);

    //Initialize LCD and print screen.
    lcd_startup();

    while(1)
    {
        PlayArray(od1_SQ2 , od1_SQ1 , od1_tri );
        PlayArray(od2_SQ2 , od2_SQ1 , od2_tri );
        PlayArray(od2_SQ2 , od2_SQ1 , od2_tri );
        PlayArray(od4_SQ2 , od4_SQ1 , od4_tri );
        PlayArray(od5_SQ2 , od5_SQ1 , od5_tri );
        PlayArray(od4_SQ2 , od4_SQ1 , od4_tri );
        PlayArray(od7_SQ2 , od7_SQ1 , od7_tri );
        PlayArray(od4_SQ2 , od4_SQ1 , od4_tri );
        PlayArray(od5_SQ2 , od5_SQ1 , od5_tri );
        PlayArray(od4_SQ2 , od4_SQ1 , od4_tri );
        PlayArray(od7_SQ2 , od7_SQ1 , od7_tri );
        PlayArray(od12_SQ2, od12_SQ1, od12_tri);
        PlayArray(od13_SQ2, od13_SQ1, od13_tri);
        PlayArray(od12_SQ2, od12_SQ1, od12_tri);
        PlayArray(od1_SQ2 , od1_SQ1 , od1_tri );
        PlayArray(od2_SQ2 , od2_SQ1 , od2_tri );
        PlayArray(od2_SQ2 , od2_SQ1 , od2_tri );
        PlayArray(od18_SQ2, od18_SQ1, od18_tri);
        PlayArray(od19_SQ2, od19_SQ1, od19_tri);
        PlayArray(od18_SQ2, od18_SQ1, od18_tri);
        PlayArray(od21_SQ2, od21_SQ1, od21_tri);
        PlayArray(od18_SQ2, od18_SQ1, od18_tri);
        PlayArray(od19_SQ2, od19_SQ1, od19_tri);
        PlayArray(od18_SQ2, od18_SQ1, od18_tri);
        PlayArray(od21_SQ2, od21_SQ1, od21_tri);
        PlayArray(od12_SQ2, od12_SQ1, od12_tri);
        PlayArray(od13_SQ2, od13_SQ1, od13_tri);
        PlayArray(od12_SQ2, od12_SQ1, od12_tri);
        PlayArray(od1_SQ2 , od1_SQ1 , od1_tri );
        PlayArray(od18_SQ2, od18_SQ1, od18_tri);
        PlayArray(od19_SQ2, od19_SQ1, od19_tri);
        PlayArray(od18_SQ2, od18_SQ1, od18_tri);
        PlayArray(od21_SQ2, od21_SQ1, od21_tri);
    }
}

void PlayArray(playback_t *sq2, playback_t *sq1, playback_t *tri)
{
    //Digital resonators.
    float y1[3]  = {0.0f, 0.0f, 0.0f}, y2[3] = {0.0f, 0.0f, 0.0f}, y3[3] = {0.0f, 0.0f, 0.0f};
    float c1 = 0, c2 = 0, c3 = 0;

    //State machine variables.
    STATES state1 = READY, state2 = READY, state3 = READY;
    uint16_t numindex1 = 0, numindex2 = 0, numindex3 = 0;
    uint32_t playtime1, playtime2, playtime3;

    //Output data.
    int16_t output1, output2, output3, output, final_out;

    while(state1 != STOP)
    {
        if(paused == INACTIVE)
        {

            /*Play note*/
            output1 = playtone(sq1, y1, &c1, &state1, &numindex1, &playtime1);
            output2 = playtone(sq2, y2, &c2, &state2, &numindex2, &playtime2);
            output3 = playtone(tri, y3, &c3, &state3, &numindex3, &playtime3);

            //Update Mario.
            update_mario();
        }

        if(adp_filt == ACTIVE)
        {
            /*Low pass filter to reduce popping noises*/
            output = lpfilter((output1 + output2) / 2 + output3);
        }
        else
        {
            output = (output1 + output2) / 2 + output3;
        }

        if(echo == ACTIVE)
        {
            //Add in echo.
            echo_buf[echo_index++] = output;
            if(echo_index >= ECHO_SIZE)
            {
                echo_index = 0;
            }

            final_out = output + echo_gain * echo_buf[echo_index];

        }
        else
        {
            final_out = output;
        }

        /*Write 16-bit left channel data*/
        USBSTK5505_I2S_writeLeft(final_out);

        /*Write 16-bit right channel data*/
        USBSTK5505_I2S_writeRight(final_out);

        //Update timer.
        update_timer();

        //Update display.
        lcd_display_buffer(hSpi1);

        //Update buttons.
        update_buttons();
    }
}

int16_t playtone(playback_t *t, float *y, float *c, STATES *state, uint16_t *numindex, uint32_t *playtime)
{
    /*Always update digital resonator first*/
    y[0] = (y[1] * (*c)) - y[2];
    y[2] = y[1];
    y[1] = y[0];

    switch(*state)
    {
    case READY:
        //Do some first time initializations.
        y[0] = y[1] = y[2] = 0.0f;
        *c = 0.0f;
        *state = INIT_TONES;
        break;

    case INIT_TONES:
        //Setup digital resonators with current tones.
        y[1] = sin(2.0f * PI * t[*numindex].note / SF);
        *c = 2.0f * cos(2.0f * PI * t[*numindex].note / SF);
        *playtime = NOTE_LEN * SF / 1000;

        *state = PLAY_TONES;
        break;

    case PLAY_TONES:
        (*playtime)--; //Play for determined amount of time.

        if(!(*playtime)) //Zero out the digital resonators.
        {
            y[0] = y[1] = y[2] = 0.0f;
            *c = 0.0f;

            *playtime = (t[*numindex].duration - NOTE_LEN) * SF / 1000;
            *state = DELAY_TONES; //Delay until next tone.
        }
        break;

    case DELAY_TONES:
        (*playtime)--; //Stay quiet for determined amount of time.

        if(!(*playtime)) //Zero out the digital resonators.
        {
            if(t[++(*numindex)].duration)
            {
                *state = INIT_TONES; //Prepare for next tone to play.
            }
            else //Reached the end of the tones to play.
            {
                *state = STOP;
            }
        }
        break;

    case STOP: //Done playing array.
    default:
        break;
    }

    return (int16_t)(y[0] * AMPLITUDE);
}

void initcodec(void)
{
    /* Initialize BSL */
    USBSTK5505_init();

    /* Set A20_MODE for GPIO mode */
    CSL_FINST(CSL_SYSCTRL_REGS->EBSR, SYS_EBSR_A20_MODE, MODE1);

    /* Use GPIO to enable AIC3204 chip */
    USBSTK5505_GPIO_init();
    USBSTK5505_GPIO_setDirection(GPIO26, GPIO_OUT);
    USBSTK5505_GPIO_setOutput( GPIO26, 1 );    // Take AIC3204 chip out of reset

    /* Initialize I2C */
    USBSTK5505_I2C_init();

    /* Initialized AIC3204 */
    Init_AIC3204(SF, GDAC, GADC);

    /* Initialize I2S */
    USBSTK5505_I2S_init();
}

/*FIR filter that implements a circular buffer*/
int16_t lpfilter(int16_t input)
{
    int16_t *coeff = coefficients;
    int16_t *coeff_end = coefficients + FILT_SIZE;

    int32_t *buf_val = buffer + offset;

    *buf_val = input;
    int32_t output = 0;

    while(buf_val >= buffer)
        output += (*buf_val-- * *coeff++);

    buf_val = buffer + FILT_SIZE - 1;

    while(coeff < coeff_end)
        output += *buf_val-- * *coeff++;

    if(++offset >= FILT_SIZE)
        offset = 0;

    /*Divide amplitude by 1000 to account for coefficient multiplier*/
    return output / 1000;
}

void lcd_startup(void)
{
    //LCD initialization.
    lcd_init(hSpi1);
    lcd_clear_buffer();

    set_cursor(0,0);
    write_string(" SUPER MARIO BROTHERS");
    set_cursor(0,1);
    write_string("   OUTDOOR THEME");
    set_cursor(0,2);
    write_string("Status: PLAY");
    set_cursor(0,3);
    write_string("Echo:   DISABLED");
    set_cursor(0,4);
    write_string("Filter: ENABLED");
    set_cursor(4,7);
    write_string("Run Time: 0:00:00");

    draw_bricks(0, 5);
    draw_qmark(2, 5);
    draw_bricks(4, 5);
    draw_bricks(6, 5);
    draw_qmark(8, 5);
    draw_bricks(10, 5);
    draw_bricks(12, 5);
    draw_qmark(14, 5);
    draw_coin(14, 1);
    draw_shroom(14, 3);
}

void draw_mario_stand(uint8_t x, uint8_t y)
{
    write_tile(0x10, x, y);
    write_tile(0x11, x, y + 1);
    write_tile(0x12, x, y + 2);
    write_tile(0x13, x, y + 3);
    write_tile(0x14, x + 1, y);
    write_tile(0x15, x + 1, y + 1);
    write_tile(0x16, x + 1, y + 2);
    write_tile(0x17, x + 1, y + 3);
}

void draw_mario_run1(uint8_t x, uint8_t y)
{
    write_tile(0x18, x, y);
    write_tile(0x19, x, y + 1);
    write_tile(0x1A, x, y + 2);
    write_tile(0x1B, x, y + 3);
    write_tile(0x1C, x + 1, y);
    write_tile(0x1D, x + 1, y + 1);
    write_tile(0x1E, x + 1, y + 2);
    write_tile(0x1F, x + 1, y + 3);
}

void draw_mario_run2(uint8_t x, uint8_t y)
{
    write_tile(0x20, x, y);
    write_tile(0x21, x, y + 1);
    write_tile(0x22, x, y + 2);
    write_tile(0x23, x, y + 3);
    write_tile(0x24, x + 1, y);
    write_tile(0x25, x + 1, y + 1);
    write_tile(0x26, x + 1, y + 2);
    write_tile(0x27, x + 1, y + 3);
}

void draw_mario_run3(uint8_t x, uint8_t y)
{
    write_tile(0x28, x, y);
    write_tile(0x29, x, y + 1);
    write_tile(0x2A, x, y + 2);
    write_tile(0x2B, x, y + 3);
    write_tile(0x2C, x + 1, y);
    write_tile(0x2D, x + 1, y + 1);
    write_tile(0x2E, x + 1, y + 2);
    write_tile(0x2F, x + 1, y + 3);
}

//Draw Super Mario bricks on LCD.
void draw_bricks(uint8_t x, uint8_t y)
{
    write_tile(0x04, x, y);
    write_tile(0x05, x, y + 1);
    write_tile(0x06, x + 1, y);
    write_tile(0x07, x + 1, y + 1);
}

//Draw Super Mario question mark on LCD.
void draw_qmark(uint8_t x, uint8_t y)
{
    write_tile(0x00, x, y);
    write_tile(0x01, x, y + 1);
    write_tile(0x02, x + 1, y);
    write_tile(0x03, x + 1, y + 1);
}

//Draw Super Mario coin on LCD.
void draw_coin(uint8_t x, uint8_t y)
{
    write_tile(0x08, x, y);
    write_tile(0x09, x, y + 1);
    write_tile(0x0A, x + 1, y);
    write_tile(0x0B, x + 1, y + 1);
}

//Draw Super Mario mushroom on LCD.
void draw_shroom(uint8_t x, uint8_t y)
{
    write_tile(0x0C, x, y);
    write_tile(0x0D, x, y + 1);
    write_tile(0x0E, x + 1, y);
    write_tile(0x0F, x + 1, y + 1);
}

void update_timer()
{
    //Time keeping variables.
    static uint16_t ticks = 0;
    static uint8_t seclo = 0, sechi = 0;
    static uint8_t minlo = 0, minhi = 0;
    static uint8_t hour = 0;

    ticks++;

    //Update clock.
    if(ticks >= SF)
    {
        ticks = 0;
        seclo++;
    }

    if(seclo > 9)
    {
        seclo = 0;
        sechi++;
    }

    if(sechi > 5)
    {
        sechi = 0;
        minlo++;
    }

    if(minlo > 9)
    {
        minlo = 0;
        minhi++;
    }

    if(minhi > 5)
    {
        minhi = 0;
        hour++;
    }

    if(hour > 9)
    {
        hour = 0;
    }

    //Update display.
    set_cursor(14, 7);
    write_char(0x30 + hour);
    write_char(':');
    write_char(0x30 + minhi);
    write_char(0x30 + minlo);
    write_char(':');
    write_char(0x30 + sechi);
    write_char(0x30 + seclo);
}

void update_mario(void)
{
    static uint16_t timer = 0;

    timer++;

    if(timer == 1500)
    {
        draw_mario_run1(12, 1);
    }

    if(timer == 3000)
    {
        draw_mario_run2(12, 1);
    }

    if(timer == 4500)
    {
        draw_mario_run3(12, 1);
        timer = 0;
    }
}

void update_buttons(void)
{
    //Input buttons statuses;
    static uint8_t this_btn1 = 0;
    static uint8_t this_btn2 = 0;
    static uint8_t this_btn3 = 0;
    static uint8_t last_btn1 = 0;
    static uint8_t last_btn2 = 0;
    static uint8_t last_btn3 = 0;

    //Save last button statuses.
    last_btn1 = this_btn1;
    last_btn2 = this_btn2;
    last_btn3 = this_btn3;

    //Get current button statuses.
    this_btn1 = USBSTK5505_GPIO_getInput(GPIO15);
    this_btn2 = USBSTK5505_GPIO_getInput(GPIO16);
    this_btn3 = USBSTK5505_GPIO_getInput(GPIO17);

    //Check for button 1 press (pause).
    if(!last_btn1 && this_btn1)
    {
        if(paused == INACTIVE)
        {
            paused = ACTIVE;
            set_cursor(0,2);
            write_string("Status: PAUSED");
            draw_mario_stand(12, 1);
            USBSTK5505_GPIO_setOutput(GPIO14, 1); //LED D3
        }
        else
        {
            paused = INACTIVE;
            set_cursor(0,2);
            write_string("Status: PLAY  ");
            USBSTK5505_GPIO_setOutput(GPIO14, 0); //LED D3
        }
    }

    //Check for button 2 press (echo).
    if(!last_btn2 && this_btn2)
    {
        if(echo == INACTIVE)
        {
            echo = ACTIVE;
            set_cursor(0,3);
            write_string("Echo:   ENABLED ");
            USBSTK5505_GPIO_setOutput(GPIO13, 0); //LED D4
        }
        else
        {
            echo = INACTIVE;
            set_cursor(0,3);
            write_string("Echo:   DISABLED");
            USBSTK5505_GPIO_setOutput(GPIO13, 1); //LED D4
        }
    }

    //Check for button 3 press.
    if(!last_btn3 && this_btn3)
    {
        if(adp_filt == INACTIVE)
        {
            adp_filt = ACTIVE;
            set_cursor(0,4);
            write_string("Filter: ENABLED ");
            USBSTK5505_GPIO_setOutput(GPIO12, 0); //LED D5
        }
        else
        {
            adp_filt = INACTIVE;
            set_cursor(0,4);
            write_string("Filter: DISABLED");
            USBSTK5505_GPIO_setOutput(GPIO12, 1); //LED D5
        }
    }
}
