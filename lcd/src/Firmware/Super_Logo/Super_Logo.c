#include <avr/io.h>
#include <math.h>
#include <avr/interrupt.h>

//Math defines.
#define PI 3.14159265

//USART defines.
#define FOSC 8000000    //Clock frequency.
#define BAUD 9600       //Desired baud rate.
#define UBRR FOSC/16/BAUD-1

//LCD control signal port numbers.
#define prtCS1 PORTD
#define prtRST PORTB
#define prtA0  PORTB
#define prtSCK PORTB
#define prtSI  PORTB

//LCD control signal bit numbers.
#define CS1 2
#define RST 1
#define A0  2
#define SCK 6
#define SI  7

//Screen buffer for LCD display.
uint8_t LCD_buffer[128][8];

//Array of LCD characters.
uint8_t LCD_chars[][8] = {
    {0xFF, 0xFF, 0x06, 0x1C, 0x30, 0xFF, 0xFF, 0x00}, //N
    {0xC3, 0xC3, 0xC3, 0xFF, 0xFF, 0xC3, 0xC3, 0x00}, //I
    {0x3C, 0x7E, 0xE7, 0xC3, 0xC3, 0x66, 0x66, 0x00}, //C
    {0xFF, 0xFF, 0x18, 0x3C, 0x7E, 0xE7, 0xC3, 0x00}, //K
    {0xFF, 0xFF, 0x06, 0x1C, 0x06, 0xFF, 0xFF,0x00,}, //M
    {0xCE, 0xDF, 0xDB, 0xDB, 0xDB ,0xFB, 0x73, 0x00}, //S
    {0x03, 0x03, 0x03, 0xFF, 0xFF, 0x03, 0x03, 0x00}, //T
    {0xFE, 0xFF, 0x1B, 0x1B, 0x1B, 0xFF, 0xFE, 0x00}, //A
    {0xFF, 0xFF, 0xC3, 0xC3, 0xE7, 0x7E, 0x3C, 0x00}, //D
    {0x7F, 0xFF, 0xE0, 0xC0, 0xE0, 0xFF, 0x7F, 0x00}, //U
    {0x18, 0x18, 0x18, 0x18, 0x18, 0x18, 0x18, 0x00}, //-
    {0xFF, 0xFF, 0x1B, 0x3B, 0x7F, 0xEF, 0xC6, 0x00}, //R
    {0xFF, 0xFF, 0xDB, 0xDB, 0xDB, 0xDB, 0xDB, 0x00} //E
};

//Array containing the logo triangles.
const signed char logo[][3][3] = 
    {
    //Front
    {{-3, 21, 0}, {-1, 22, 0}, {0, 12, 0}},
    {{-1, 22, 0}, {1, 22, 0}, {0, 12, 0}},  
    {{1, 22, 0}, {3, 21, 0}, {0, 12, 0}},
    {{3, 21, 0}, {11, 7, 0}, {0, 12, 0}},
    {{11, 7, 0}, {21, 22, 0}, {15, 0, 0}},
    {{21, 22, 0}, {23, 22, 0}, {11, 7, 0}},
    {{23, 22, 0}, {25, 21, 0}, {11, 7, 0}},
    {{25, 21, 0}, {26, 19, 0}, {11, 7, 0}},
    {{26, 19, 0}, {26, 17, 0}, {11, 7, 0}},
    {{26, 17, 0}, {15, 0, 0}, {11, 7, 0}},
        
    {{15, 0, 0}, {26, -18, 0}, {11, -7, 0}},        
    {{26, -18, 0}, {26, -20, 0}, {11, -7, 0}},
    {{26, -20, 0}, {25, -22, 0}, {11, -7, 0}},
    {{25, -22, 0}, {23, -23, 0}, {11, -7, 0}},
    {{23, -23, 0}, {21, -23, 0}, {11, -7, 0}},
    {{21, -23, 0}, {11, -7, 0}, {15, 0, 0}},
    {{11, -7, 0}, {3, -22, 0}, {0, -13, 0}},
    {{3, -22, 0}, {1, -23, 0}, {0, -13, 0}},
    {{1, -23, 0}, {-1, -23, 0}, {0, -13, 0}},
    {{-1, -23, 0}, {-3, -22, 0}, {0, -13, 0}},
        
    {{-3, -22, 0}, {-11, -7, 0}, {0, -13, 0}},
    {{-11, -7, 0}, {-20, -23, 0}, {-25, -18, 0}},
    {{-20, -23, 0}, {-22, -23, 0}, {-25, -18, 0}},
    {{-22, -23, 0}, {-24, -22, 0}, {-25, -18, 0}},
    {{-24, -22, 0}, {-25, -20, 0}, {-25, -18, 0}},
    {{-25, -20, 0}, {-25, -18, 0}, {-11, -7, 0}},
    {{-25, -18, 0}, {-3, 21, 0}, {-7, 0, 0}},
    {{-7, 0, 0}, {0, 12, 0}, {-3, 21, 0}},
    {{0, 12, 0}, {7, 0, 0}, {11, 7, 0}},
    {{7, 0, 0}, {0, -13, 0}, {3, -22, 0}},
        
    {{0, -13, 0}, {-7, 0, 0}, {-11, -7, 0}},
    {{-27, 20, 0}, {-26, 23, 0}, {-33, 25, 0}},
    {{-26, 23, 0}, {-23, 24, 0}, {-33, 25, 0}},
    {{-23, 24, 0}, {24, 24, 0}, {25, 31, 0}},
    {{24, 24, 0}, {27, 23, 0}, {29, 30, 0}},
    {{27, 23, 0}, {28, 20, 0}, {29, 30, 0}},
    {{28, 20, 0}, {28, -21, 0}, {35, 21, 0}},
    {{28, -21, 0}, {27, -24, 0}, {34, -26, 0}},
    {{27, -24, 0}, {24, -25, 0}, {34, -26, 0}},
    {{24, -25, 0}, {-23, -25, 0}, {-24, -32, 0}},
    
    {{-23, -25, 0}, {-26, -24, 0}, {-31, -29, 0}},
    {{-26, -24, 0}, {-27, -21, 0}, {-31, -29, 0}},
    {{-27, -21, 0}, {-27, 20, 0}, {-34, 21, 0}},
    {{-34, 21, 0}, {-33, 25, 0}, {-27, 20, 0}},
    {{-33, 25, 0}, {-31, 28, 0}, {-27, 20, 0}},
    {{-31, 28, 0}, {-28, 30, 0}, {-26, 23, 0}},
    {{-28, 30, 0}, {-24, 31, 0}, {-23, 24, 0}},
    {{-24, 31, 0}, {25, 31, 0}, {24, 24, 0}},
    {{25, 31, 0}, {29, 30, 0}, {24, 24, 0}},
    {{29, 30, 0}, {32, 28, 0}, {24, 24, 0}},
    
    {{32, 28, 0}, {34, 25, 0}, {27, 23, 0}},
    {{34, 25, 0}, {35, 21, 0}, {28, 20, 0}},
    {{35, 21, 0}, {35, -22, 0}, {28, 20, 0}},
    {{35, -22, 0}, {34, -26, 0}, {28, -21, 0}},
    {{34, -26, 0}, {32, -29, 0}, {28, 21, 0}},
    {{32, -29, 0}, {29, -31, 0}, {27, -24, 0}},
    {{29, -31, 0}, {25, -32, 0}, {24, -25, 0}},
    {{25, -32, 0}, {-24, -32, 0}, {-23, -25, 0}},
    {{-24, -32, 0}, {-28, -31, 0}, {-23, -25, 0}},
    {{-28, -31, 0}, {-31, -29, 0}, {-26, -24, 0}},
    
    {{-31, -29, 0}, {-33, -26, 0}, {-26, -24, 0}},
    {{-33, -26, 0}, {-34, -22, 0}, {-26, -24, 0}},
    {{-34, -22, 0}, {-34, 21, 0}, {-27, 20, 0}},
    //{{, , 0}, {, , 0}, {, , 0}},  
    };

uint8_t logo_length = 63;

uint32_t ms_counter;

uint8_t rotation;       //Select which rotation to use.

float omega = 1.0f;     //rotation speed (rad/s). Default is 1 rad/s.

//The following function writes command byte d to the LCD.
void write_command(uint8_t d)
{
    uint8_t serialcounter;
    
    prtA0 &= ~(1 << A0); //A0 = Command.
    
    for(serialcounter = 1; serialcounter <= 8; serialcounter++) //Send 8 bits.
    {
        if((d & 0x80) == 0x80) //get only the MSB.
        {
            prtSI |=  (1 << SI); //if 1, then SI=1.
        }
        
        else
        {
            prtSI &= ~(1 << SI); //if 0, then SI=0.
        }
        
        d = (d << 1); //shift data byte left.
        
        //Strobe data clock.
        prtSCK &= ~(1 << SCK);
        prtSCK |=  (1 << SCK);
        prtSCK &= ~(1 << SCK);
    }
}

//The following function writes byte d to LCD to be displayed.
void write_byte(uint8_t d)
{
    uint8_t serialcounter;
    
    prtA0 |=  (1 << A0); //A0 = Data.
    
    for(serialcounter = 1; serialcounter <= 8; serialcounter++) //Send 8 bits.
    {
        if((d & 0x80) == 0x80) //get only the MSB.
        {
            prtSI |=  (1 << SI); //if 1, then SI=1.
        }

        else
        {
            prtSI &= ~(1 << SI); //if 0, then SI=0.
        }

        d = (d << 1); //shift data byte left.
        
        //Strobe data clock.
        prtSCK &= ~(1 << SCK);
        prtSCK |=  (1 << SCK);
        prtSCK &= ~(1 << SCK);
    }
}

void clear_LCD()
{
    for(int k = 0; k < 8; k++)
    {
        write_command(0xB0 + k);            //Set page address.
        
        for(int j = 0; j < 8; j++)
        {
            write_command(0x10 + j);        //Set upper column address.
            
            for(int i = 0; i < 16; i++)
            {
                write_command(0x00 + i);    //Set lower column address.
                write_byte(0x00);
            }
        }
    }
}

void clear_LCD_buffer()
{
    for(int i = 0; i < 8; i++)
    {
        for(int j = 0; j < 128; j++)
        {
            LCD_buffer[j][i] = 0;
        }
    }
}

void display_LCD_buffer()
{
    for(int k = 0; k < 8; k++)
    {
        write_command(0xB0 + k);            //Set page address.
        
        for(int j = 0; j < 8; j++)
        {
            write_command(0x10 + j);        //Set upper column address.
            
            for(int i = 0; i < 16; i++)
            {
                write_command(0x00 + i);    //Set lower column address.
                write_byte(LCD_buffer[(j << 4) | i][k]);
            }
        }
    }
}

//This function transmits a single byte to the USART.
void TX_Byte(uint8_t data)
{
    while(!(UCSR0A & (1 << UDRE0))); //Wait for buffer to be free.
    UDR0 = data;
}

void init_processor()
{
    //Variable for setting baud rate.
    uint16_t ubrr = UBRR;
    
    //Set pins as outputs.
    DDRD |= (1 << CS1);
    DDRB |= (1 << RST) | (1 << A0) | (1 << SCK) | (1 << SI);
    DDRC |= (1 << PORTC0);
    
    UBRR0H = (uint8_t)(ubrr >> 8);                          //Load upper ubrr byte.
    UBRR0L = (uint8_t)ubrr;                                 //Load lower ubrr byte
    UCSR0B = (1 << RXCIE0) | (1 << RXEN0) | (1 << TXEN0);   //Enable RX interrupt, receive and transmit circuits.
    UCSR0C = (3 << UCSZ00);                                 //Use 8 bit bytes.
    
    //Tweek oscillator(if necessary). Original value 0xB4.
    OSCCAL = 0xB5;
    
    //Load TIMER1 configuration.
    TCCR1B = 0x09;                  //No prescaling, CTC.
    OCR1A  = 8000;                  //Match counter every 1 ms.
    TIMSK1 = 0x02;                  //Enable TIMER1_COMPA interrupt.
    
    sei(); //Enable global interrupts.
}

void init_LCD()
{
    prtRST &= ~(1 << RST);
    prtRST |= (1 << RST);   
    prtCS1 &= ~(1 << CS1);
    
    write_command(0xA3);
    write_command(0xA0);    //Column address 0x00 --> 0x83.
    write_command(0xC8);    //Reverse COM.
    write_command(0xA4);
    write_command(0x40);
    write_command(0x25);
    write_command(0x81);
    write_command(0x18);
    write_command(0x2F);
    write_command(0xAF);
    
    clear_LCD();
}

void draw_pixel(int x, int y)
{   
    if(x > 127 || x < 0)
        return;
    if(y > 63 || y < 0)
        return;
    LCD_buffer[x][7 - (y / 8)] |= 0x80 >> (y % 8);
}

void draw_line(int x0, int y0, int x1, int y1)
{
    int x = x0, y = y0;
    int dx = x1 - x0, dy = y1 - y0;
    
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
        for(int decy = ay - dx; ; x += sx, decy += ay)
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
        for(int decx = ax - dy; ; y += sy, decx += ax)
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

//Make a copy of the current triangle data.
void copy_triangle(signed char copy[3][3], const signed char orig[3][3], uint8_t i)
{
    for(uint8_t j = 0; j < 3; j++)
    {
        for(uint8_t k = 0; k < 4; k++)
        {
            copy[j][k] = orig[j][k];
        }
    }
}

//This function returns a positive number if the triangle is clockwise, negative if it is not.
float check_cull(signed char copy[3][3])
{
    return ((copy[1][0] - copy[0][0]) * (copy[1][1] + copy[0][1])) + 
           ((copy[2][0] - copy[1][0]) * (copy[2][1] + copy[1][1])) +
           ((copy[0][0] - copy[2][0]) * (copy[0][1] + copy[2][1]));
}

void draw_logo()
{
    //N
    for(int i = 0; i < 8; i++)
    LCD_buffer[16 + i][0] |= (LCD_chars[0][i]);

    //I
    for(int i = 0; i < 8; i++)
    LCD_buffer[24 + i][0] |= (LCD_chars[1][i]);

    //C
    for(int i = 0; i < 8; i++)
    LCD_buffer[32 + i][0] |= (LCD_chars[2][i]);

    //K
    for(int i = 0; i < 8; i++)
    LCD_buffer[40 + i][0] |= (LCD_chars[3][i]);

    //M
    for(int i = 0; i < 8; i++)
    LCD_buffer[56 + i][0] |= (LCD_chars[4][i]);

    //I
    for(int i = 0; i < 8; i++)
    LCD_buffer[64 + i][0] |= (LCD_chars[1][i]);

    //K
    for(int i = 0; i < 8; i++)
    LCD_buffer[72 + i][0] |= (LCD_chars[3][i]);

    //S
    for(int i = 0; i < 8; i++)
    LCD_buffer[80 + i][0] |= (LCD_chars[5][i]);

    //T
    for(int i = 0; i < 8; i++)
    LCD_buffer[88 + i][0] |= (LCD_chars[6][i]);

    //A
    for(int i = 0; i < 8; i++)
    LCD_buffer[96 + i][0] |= (LCD_chars[7][i]);

    //S
    for(int i = 0; i < 8; i++)
    LCD_buffer[104 + i][0] |= (LCD_chars[5][i]);

    //I
    for(int i = 0; i < 8; i++)
    LCD_buffer[24 + i][7] |= (LCD_chars[1][i]);

    //N
    for(int i = 0; i < 8; i++)
    LCD_buffer[32 + i][7] |= (LCD_chars[0][i]);

    //D
    for(int i = 0; i < 8; i++)
    LCD_buffer[40 + i][7] |= (LCD_chars[8][i]);

    //U
    for(int i = 0; i < 8; i++)
    LCD_buffer[48 + i][7] |= (LCD_chars[9][i]);

    //S
    for(int i = 0; i < 8; i++)
    LCD_buffer[56 + i][7] |= (LCD_chars[5][i]);

    //T
    for(int i = 0; i < 8; i++)
    LCD_buffer[64 + i][7] |= (LCD_chars[6][i]);

    //R
    for(int i = 0; i < 8; i++)
    LCD_buffer[72 + i][7] |= (LCD_chars[11][i]);

    //I
    for(int i = 0; i < 8; i++)
    LCD_buffer[80 + i][7] |= (LCD_chars[1][i]);

    //E
    for(int i = 0; i < 8; i++)
    LCD_buffer[88 + i][7] |= (LCD_chars[12][i]);

    //S
    for(int i = 0; i < 8; i++)
    LCD_buffer[96 + i][7] |= (LCD_chars[5][i]);
}

int main(void)
{
    signed char work_tri[3][3] = {{0}};             //Working copy of triangle mesh data.
    uint32_t last_time;                             //Used as base time for time calculations.
    uint32_t dt;                                    //Change in time from last check.
    float theta = 0;                                //Current rotation angle.
    
    init_processor();                               //Setup processor.
    init_LCD();                                     //Setup LCD.
    
    last_time = ms_counter;                         //Get initial copy of time counter
    
    while(1)
    {               
        dt = ms_counter - last_time;                //Calculate the time it took to render the last scene in ms.
        last_time = ms_counter;                     //Update last time.
        theta += omega * dt * .001f;                //Update current rotation angle.
        if(theta >= 2 * PI)
        {
            theta -= 2 * PI;                        //Reset angle if greater than 2 * PI.
        }
        
        for(uint8_t i = 0; i < logo_length; i++)
        {
            //copy_triangle(work_tri, logo[i], i);
            
            //XY Plane.
            if(rotation == 1)
            {
                work_tri[0][0] = (cos(theta) * logo[i][0][0]) + (-1 * sin(theta) * logo[i][0][1]) + 64; //Point 1.
                work_tri[0][1] = (sin(theta) * logo[i][0][0]) + (cos(theta) * logo[i][0][1]) + 32;
            
                work_tri[1][0] = (cos(theta) * logo[i][1][0]) + (-1 * sin(theta) * logo[i][1][1]) + 64; //Point 2.
                work_tri[1][1] = (sin(theta) * logo[i][1][0]) + (cos(theta) * logo[i][1][1]) + 32;
            
                work_tri[2][0] = (cos(theta) * logo[i][2][0]) + (-1 * sin(theta) * logo[i][2][1]) + 64; //Point 3.
                work_tri[2][1] = (sin(theta) * logo[i][2][0]) + (cos(theta) * logo[i][2][1]) + 32;
            }
            
            
            //YZ Plane.
            else if(rotation == 2)
            {
                work_tri[0][0] = (1 * logo[i][0][0]) + (0 * logo[i][0][1]) + (0 * logo[i][0][2]) + 64;          //Point 1.
                work_tri[0][1] = (0 * logo[i][0][0]) + (cos(theta) * logo[i][0][1]) + (-1 * sin(theta) * logo[i][0][2]) + 32;
                work_tri[0][2] = (0 * logo[i][0][0]) + (sin(theta) * logo[i][0][1]) + (cos(theta) * logo[i][0][2]) + 0;
            
                work_tri[1][0] = (1 * logo[i][1][0]) + (0 * logo[i][1][1]) + (0 * logo[i][1][2]) + 64;          //Point 2.
                work_tri[1][1] = (0 * logo[i][1][0]) + (cos(theta) * logo[i][1][1]) + (-1 * sin(theta) * logo[i][1][2]) + 32;
                work_tri[1][2] = (0 * logo[i][1][0]) + (sin(theta) * logo[i][1][1]) + (cos(theta) * logo[i][1][2]) + 0;
            
                work_tri[2][0] = (1 * logo[i][2][0]) + (0 * logo[i][2][1]) + (0 * logo[i][2][2]) + 64;          //Point 3.
                work_tri[2][1] = (0 * logo[i][2][0]) + (cos(theta) * logo[i][2][1]) + (-1 * sin(theta) * logo[i][2][2]) + 32;
                work_tri[2][2] = (0 * logo[i][2][0]) + (sin(theta) * logo[i][2][1]) + (cos(theta) * logo[i][2][2]) + 0;
            }
            
            //XZ Plane.
            else
            {
                work_tri[0][0] = (cos(theta) * logo[i][0][0]) + (0 * logo[i][0][1]) + (sin(theta) * logo[i][0][2]) + 64;            //Point 1.
                work_tri[0][1] = (0 * logo[i][0][0]) + (1 * logo[i][0][1]) + (0 * logo[i][0][2]) + 32;
                work_tri[0][2] = (-1 * sin(theta) * logo[i][0][0]) + (0 * logo[i][0][1]) + (cos(theta) * logo[i][0][2]) + 0;
            
                work_tri[1][0] = (cos(theta) * logo[i][1][0]) + (0 * logo[i][1][1]) + (sin(theta) * logo[i][1][2]) + 64;            //Point 2.
                work_tri[1][1] = (0 * logo[i][1][0]) + (1 * logo[i][1][1]) + (0 * logo[i][1][2]) + 32;
                work_tri[1][2] = (-1 * sin(theta) * logo[i][1][0]) + (0 * logo[i][1][1]) + (cos(theta) * logo[i][1][2]) + 0;
            
                work_tri[2][0] = (cos(theta) * logo[i][2][0]) + (0 * logo[i][2][1]) + (sin(theta) * logo[i][2][2]) + 64;            //Point 3.
                work_tri[2][1] = (0 * logo[i][2][0]) + (1 * logo[i][2][1]) + (0 * logo[i][2][2]) + 32;
                work_tri[2][2] = (-1 * sin(theta) * logo[i][2][0]) + (0 * logo[i][2][1]) + (cos(theta) * logo[i][2][2]) + 0;
            }
            
            //Draw triangle only if the determinant is < 0 (Backface culling).
            //if(check_cull(work_tri) > 0)
            //{
                /*
                if(work_tri[0][0] < 0)
                {
                work_tri[0][0] = 0;
                }
            
                if(work_tri[0][0] > 127)
                {
                    work_tri[0][0] = 127;
                }
            
                if(work_tri[0][1] < 0)
                {
                    work_tri[0][1] = 0;
                }
            
                if(work_tri[0][1] > 63)
                {
                    work_tri[0][1] = 63;
                }
            
                if(work_tri[1][0] < 0)
                {
                    work_tri[1][0] = 0;
                }
            
                if(work_tri[1][0] > 127)
                {
                    work_tri[1][0] = 127;
                }
            
                if(work_tri[1][1] < 0)
                {
                    work_tri[1][1] = 0;
                }
            
                if(work_tri[1][1] > 63)
                {
                    work_tri[1][1] = 63;
                }*/
            
                draw_line(work_tri[0][0], work_tri[0][1], work_tri[1][0], work_tri[1][1]);
                //draw_line(work_tri[1][0], work_tri[1][1], work_tri[2][0], work_tri[2][1]);
                //draw_line(work_tri[2][0], work_tri[2][1], work_tri[0][0], work_tri[0][1]);
            //}
        }
        
        draw_logo();
        
        display_LCD_buffer();                       //Update the LCD display.
        clear_LCD_buffer();                         //Clear the screen buffer.
    }
}

//Interrupt based USART RX function.
ISR(USART_RX_vect)
{
    uint8_t rx_byte;
    
    rx_byte = UDR0; //Get RX byte.
    TX_Byte(rx_byte); //Echo byte.
    
    if(rx_byte == '1')
    {
        rotation = 1;
    }
    
    if(rx_byte == '2')
    {
        rotation = 2;
    }
    
    if(rx_byte == '0')
    {
        rotation = 0;
    }
    
    if(rx_byte == '+')
    {
        omega += 0.25f;
        
        if( omega > 10.0f)
        {
            omega = 10.0f;
        }
    }
    
    if(rx_byte == '-')
    {
        omega -= 0.25f;
        
        if( omega < -10.0f)
        {
            omega = -10.0f;
        }
    }
}

//16-bit timer used for 1 ms system timing.
ISR(TIMER1_COMPA_vect)
{
    //Increment counter every millisecond.
    ms_counter++;
    
    //Used for calibrating the 1 ms timer.
    /*
    static uint8_t port_output = 0;
    
    if(port_output)
    {
        PORTC |= 1 << PORTC0;
    }
    
    else
    {
        PORTC &= ~(1 << PORTC0);
    }
    
    port_output ^= 0x01;
    */
}