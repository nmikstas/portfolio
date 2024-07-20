#include "stdint.h"
#include "csl_spi.h"
#include "usbstk5505_gpio.h"
#include "LCD.h"

//The following function writes command byte data to the LCD.
void lcd_write_command(Uint16 data, CSL_SpiHandle hSpi1)
{
    USBSTK5505_GPIO_setOutput(GPIO4, 0);    //A0 = Command.
    SPI_write(hSpi1, &data, 1);
}

//The following function writes byte data to LCD to be displayed.
void lcd_write_byte(Uint16 data, CSL_SpiHandle hSpi1)
{
    USBSTK5505_GPIO_setOutput(GPIO4, 1);        //A0 = Data.
    SPI_write(hSpi1, &data, 1);
}

//Clear the LCD display.
void lcd_clear(CSL_SpiHandle hSpi1)
{
    int k, j, i;

    for(k = 0; k < 8; k++)
    {
        lcd_write_command(0xB0 + k, hSpi1);         //Set page address.

        for(j = 0; j < 8; j++)
        {
            lcd_write_command(0x10 + j, hSpi1);     //Set upper column address.

            for(i = 0; i < 16; i++)
            {
                lcd_write_command(0x00 + i, hSpi1); //Set lower column address.
                lcd_write_byte(0x00, hSpi1);
            }
        }
    }
}

//Send initial configuration data to LCD.
void lcd_init(CSL_SpiHandle hSpi1)
{
    USBSTK5505_GPIO_setOutput(GPIO5, 0);        //Reset LCD.
    USBSTK5505_GPIO_setOutput(GPIO5, 1);        //Clear reset.

    lcd_write_command(0xA3, hSpi1);
    lcd_write_command(0xA0, hSpi1); //Column address 0x00 --> 0x83.
    lcd_write_command(0xC8, hSpi1); //Reverse COM.
    lcd_write_command(0xA4, hSpi1);
    lcd_write_command(0x40, hSpi1);
    lcd_write_command(0x25, hSpi1);
    lcd_write_command(0x81, hSpi1);
    lcd_write_command(0x18, hSpi1);
    lcd_write_command(0x2F, hSpi1);
    lcd_write_command(0xAF, hSpi1);

    lcd_clear(hSpi1);
}

//Clear the LCD buffer.
void lcd_clear_buffer(void)
{
    int i, j;

    for(i = 0; i < 8; i++)
    {
        for(j = 0; j < 128; j++)
        {
            lcd_buffer[128 * i + j] = 0;
        }
    }
}

//Send LCD buffer contents to the display.
void lcd_display_buffer(CSL_SpiHandle hSpi1)
{
    static int k = 0, j = 0, i = 0;
    Uint16 data;

    //Set page address.
    data = 0xB0 + k;
    USBSTK5505_GPIO_setOutput(GPIO4, 0);    //A0 = Command.
    SPI_write(hSpi1, &data, 1);

    //Set upper column address.
    data = 0x10 + j;
    USBSTK5505_GPIO_setOutput(GPIO4, 0);    //A0 = Command.
    SPI_write(hSpi1, &data, 1);

    //Set lower column address.
    data = 0x00 + i;
    USBSTK5505_GPIO_setOutput(GPIO4, 0);    //A0 = Command.
    SPI_write(hSpi1, &data, 1);

    data = lcd_buffer[((j << 4) | i) + 128 * k];
    USBSTK5505_GPIO_setOutput(GPIO4, 1);    //A0 = Data.
    SPI_write(hSpi1, &data, 1);

    i++;

    if(i >= 16)
    {
        i = 0;
        j++;
    }

    if(j >= 8)
    {
        j = 0;
        k++;
    }

    if(k >= 8)
    {
        k = 0;
    }
}

//Draw a single pixel in buffer.
//For graphical functions, the origin is in the lower left corner.
void draw_pixel(int x, int y)
{
    if(x > 127 || x < 0)
        return;
    if(y > 63 || y < 0)
        return;
    lcd_buffer[x + (7 - (y / 8)) * 128] |= 0x80 >> (y % 8);
}

//Draw a line from point x0,y0 to x1,y1.
void draw_line(int x0, int y0, int x1, int y1)
{
    int x = x0, y = y0;
    int dx = x1 - x0, dy = y1 - y0;
    int decy, decx;

    int sx, sy;

    if(dx > 0)
    {
        sx = 1;
    }
    else if(dx < 0)
    {
        sx = -1;
        dx = -dx;
    }
    else
    {
        sx = 0;
    }

    if(dy > 0)
    {
        sy = 1;
    }
    else if(dy < 0)
    {
        sy = -1;
        dy = -dy;
    }
    else
    {
        sy = 0;
    }

    int ax = 2 * dx, ay = 2 * dy;

    if(dy <= dx)
    {
        for(decy = ay - dx; ; x += sx, decy += ay)
        {
            draw_pixel(x, y);

            if(x == x1)
            {
                break;
            }

            if(decy >= 0)
            {
                decy -= ax;
                y += sy;
            }
        }
    }
    else
    {
        for(decx = ax - dy; ; y += sy, decx += ax)
        {
            draw_pixel(x, y);

            if(y == y1)
            {
                break;
            }
            if(decx >= 0)
            {
                decx -= ay;
                x += sx;
            }
        }
    }
}

//Draw a circle in the LCD buffer centered at x0, y0 with radius.
void draw_circle(int x0, int y0, int radius)
{
    int x = radius;
    int y = 0;
    int decisionOver2 = 1 - x;   // Decision criterion divided by 2 evaluated at x=r, y=0

    while(x >= y)
    {
        draw_pixel( x + x0,  y + y0);
        draw_pixel( y + x0,  x + y0);
        draw_pixel(-x + x0,  y + y0);
        draw_pixel(-y + x0,  x + y0);
        draw_pixel(-x + x0, -y + y0);
        draw_pixel(-y + x0, -x + y0);
        draw_pixel( x + x0, -y + y0);
        draw_pixel( y + x0, -x + y0);
        y++;
        if (decisionOver2<=0)
        {
            decisionOver2 += 2 * y + 1;   // Change in decision criterion for y -> y+1
        }
        else
        {
            x--;
            decisionOver2 += 2 * (y - x) + 1;   // Change for y -> y+1, x -> x-1
        }
    }
}

//Sets cursor position on the LCD display.
void set_cursor(uint8_t col, uint8_t row)
{
    cur_col = col;
    cur_row = row;

    validate_cursor();
}

//This function takes pointers to variables to fill with cursor row and column data.
void get_cursor(uint8_t* col, uint8_t* row)
{
    *col = cur_col;
    *row = cur_row;
}

//Write a single graphic tile to the LCD buffer.
void write_tile(const char c, uint8_t g_col, uint8_t g_row)
{
    uint8_t i;

    for(i = 0; i < 8; i++)
    {
        //Place LCD character in buffer..
        lcd_buffer[i + (8 * g_col) + 128 * g_row] = LCD_graph[c][i];
    }
}

//Write a single character to the LCD buffer.
void write_char(const char c)
{
    uint8_t i;

    for(i = 0; i < 5; i++)
    {
        //Place LCD character in buffer..
        lcd_buffer[i + (6 * cur_col) + 128 * cur_row] = LCD_chars[c][i];
    }

    cur_col++;          //Move to next column.
    validate_cursor();
}

//Clear a single character to the LCD buffer.
void clear_char(void)
{
    uint8_t i;

    for(i = 0; i < 5; i++)
    {
        //Place LCD character in buffer..
        lcd_buffer[i + (6 * cur_col) + 128 * cur_row] = 0x00;
    }

    cur_col++;          //Move to next column.
    validate_cursor();
}

//Write a string of characters to the LCD buffer.
void write_string(const char* c)
{
    while(*c)
    {
        switch(*c)
        {
            case 0x0A:  //Line feed.
            cur_row++;
            validate_cursor();
            break;

            case 0x0D:  //Carriage return.
            cur_col = 0;
            break;

            default:
            write_char(*c);
        }
        c++;
    }
}

//This function ensures the cursor stays within the boundaries of the LCD display.
void validate_cursor(void)
{
    if(cur_col > 20)
    {
        cur_col = 0;    //End of current row.  Move to next row.
        cur_row++;
    }

    if(cur_row > 7)
    {
        cur_row = 0;    //End of display, move back to upper left corner.
        cur_col = 0;
    }
}

