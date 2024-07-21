/*
 * Created: 5/19/2012 3:21:50 PM
 *  Author: Nick Mikstas
 */ 

#include <avr/io.h>
#include <avr/interrupt.h>
#include <compat/twi.h>
//#include <util/delay.h>
#include "CerebotNano.h"

//LCD control signal bit numbers.
#define RST bnJA8
#define RS  bnJA7
#define SCL bnJA9
#define SI  bnJA10

//LCD control signal port numbers.
#define prtRST prtJA8
#define prtRS  prtJA7
#define prtSCL prtJA9
#define prtSI  prtJA10

//Global variables for storing ADC values.
unsigned char adc_x;
unsigned char adc_y;
unsigned char adc_z;
unsigned char adc_rz;

//This function waits for delay milliseconds before
//exiting.  number of counts of i can be changed
//to change the timing on the delay.
void Wait_ms(uint16_t delay) {
    uint16_t i;

    while(delay > 0){
        for( i = 0; i < 49; i ++){
            ;;
        }
        delay -= 1;
    }
}

//The following function writes command byte d to the LCD.
/*void write_command(int d) {
    uint8_t serialcounter;  
    
    prtRS &= ~(1 << RS); //A0 = Command
    
    for(serialcounter = 1; serialcounter <= 8; serialcounter++) { //send 8 bits     
        if((d & 0x80) == 0x80) //get only the MSB
            prtSI |=  (1 << SI); //if 1, then SI=1
        else
            prtSI &= ~(1 << SI); //if 0, then SI=0      
        d = (d << 1); //shift data byte left
        prtSCL &= ~(1 << SCL);      
        prtSCL |=  (1 << SCL);      
        prtSCL &= ~(1 << SCL); //SCL
    }
    prtRS &= ~(1 << RS); //Turn off LED
    prtSI &= ~(1 << SI); //Turn off LED
}*/

//The following function writes byte d to LCD to be displayed.
/*void write_byte(int d) {
    uint8_t serialcounter;
    
    prtRS |=  (1 << RS); //A0 = Data
    
    for(serialcounter = 1; serialcounter <= 8; serialcounter++) { //send 8 bits     
        if((d & 0x80) == 0x80) //get only the MSB
            prtSI |=  (1 << SI); //if 1, then SI=1
        else
            prtSI &= ~(1 << SI); //if 0, then SI=0      
        d = (d << 1); //shift data byte left
        prtSCL &= ~(1 << SCL);      
        prtSCL |=  (1 << SCL);      
        prtSCL &= ~(1 << SCL); //SCL
    }
    prtRS &= ~(1 << RS); //Turn off LED
    prtSI &= ~(1 << SI); //Turn off LED
}*/

//initialize the LCD.
/*void init_lcd() {   
    prtRST &= ~(1 << RST); //RESET
    Wait_ms(2);
    prtRST |= (1 << RST); //end reset
    Wait_ms(20);
    write_command(0x30); //wake up
    Wait_ms(2);
    write_command(0x30); //wake up
    write_command(0x30); //wake up
    write_command(0x39); //function set
    write_command(0x14); //internal osc frequency
    write_command(0x56); //power control
    write_command(0x6D); //follower control
    write_command(0x70); //contrast
    write_command(0x0C); //display on
    write_command(0x06); //entry mode
    write_command(0x01); //clear
    Wait_ms(10);
}*/

//Initialize the micro-controller.
void init_micro() {
    //Turn off unused hardware. 
    PRR = (1 << PRTIM2) | (1 << PRTIM1) | (1 << PRTIM0) | (1 << PRSPI);
    ACSR = (1  << ACD); //Turn off analog comparator.
    
    //Disable digital input pins.
    DIDR0 = 0x3F;
    
    TWAR = 0xB0; //Set TWI slave address.
    TWAMR = 0x06; //Slave responds to $B1, $B3, $B5 and $B7.
    
    TWCR |= (1 << TWINT) | (1 << TWEA) | (1 << TWIE) | (1 << TWEN); //Enable TWI and TWI interrupts.
    
    sei(); //Enable global interrupts.
    
    //Setup ADC.
    ADMUX  |= (1 << REFS0); //ADC VREF is AVcc.
    ADMUX  |= (1 << ADLAR); //Left shift results.   
    ADCSRA |= (1 << ADPS2); //Div by 16. 62.5KHz ADC clock.
    
    //Set pins as outputs.
    ddrJA7   |=  (1 << bnJA7 );
    ddrJA8   |=  (1 << bnJA8 );
    ddrJA9   |=  (1 << bnJA9 );
    ddrJA10  |=  (1 << bnJA10);
    
    //Clear bits on pins.
    prtJA7   &= ~(1 << bnJA7 );
    prtJA8   &= ~(1 << bnJA8 );
    prtJA9   &= ~(1 << bnJA9 );
    prtJA10  &= ~(1 << bnJA10); 
}

//The following function writes a string of bytes to the LCD.
/*void write_string(char *p) {
    while(*p) {
        if(*p == 0x12) { //Clear display. ctrl-r
            init_lcd();
            p++;
        }       
        else if(*p == 0x06) { //Return to beginning of first line. ctrl-f
            write_command(0x02);
            write_string("                           "); //Erase line
            write_command(0x02); //Return to beginning of first line    
            p++;            
        }           
        else if(*p == 0x13) { //Return to beginning of second line. ctrl-s
            write_command(0xC0);
            write_string("                           "); //Erase line
            write_command(0x02);
            write_command(0xC0); //Return to beginning of second line.
            p++;
        }
        else if(*p < 0x10)
            p++; //Ignore non-printable characters.
        else {
            write_byte(*p);
            p++; 
        }               
    }
}*/

/*void print_hex(unsigned char b) {
    unsigned char temp; 
    
    temp   = b;
    temp >>= 4;
    
    if(temp > 0x09)
        write_byte(temp + 0x37);
    else
        write_byte(temp + 0x30);
    
    temp  = b; 
    temp &= 0x0F; 
    
    if(temp > 0x09)
        write_byte(temp + 0x37);
    else
        write_byte(temp + 0x30);    
}*/

//Turn on ADC and get result.
unsigned char get_adc() {   
    unsigned char ADCval;
    
    ADCSRA |= (1 << ADEN);
    ADCSRA |= (1 << ADSC);
    
    while(!(ADCSRA & (1 << ADIF)));
    
    ADCval = ADCH;
            
    return ADCval;
}

void adjust_adc_value(unsigned char *c) {
    if(*c > 0x70 && *c < 0x90)
        *c = 0x80;
}

int main(void) {            
    init_micro();
    //init_lcd();
    
    //Display Axes info in the display.
    //write_command(0x02); //Goto beginning of first line.
    //write_string("X  Y  Rz Z"); //Display the axes.
    
    while(1) {                      
        //Do ADC conversion.        
        ADMUX  = 0x01; //ADC1 is input.
        ADMUX  |= (1 << REFS0); //ADC VREF is AVcc.
        ADMUX  |= (1 << ADLAR); //Left shift results.   
        adc_x = get_adc();
        adjust_adc_value(&adc_x);
        
        ADMUX  = 0x00; //ADC0 is input.
        ADMUX  |= (1 << REFS0); //ADC VREF is AVcc.
        ADMUX  |= (1 << ADLAR); //Left shift results.   
        adc_y = get_adc();
        adjust_adc_value(&adc_y);
        
        ADMUX  = 0x03; //ADC3 is input.
        ADMUX  |= (1 << REFS0); //ADC VREF is AVcc.
        ADMUX  |= (1 << ADLAR); //Left shift results.   
        adc_rz = get_adc();
        adjust_adc_value(&adc_rz);
        
        ADMUX  = 0x02; //ADC2 is input.
        ADMUX  |= (1 << REFS0); //ADC VREF is AVcc.
        ADMUX  |= (1 << ADLAR); //Left shift results.   
        adc_z = get_adc();
        adjust_adc_value(&adc_z);
        
        //write_command(0xC0); //Return to beginning of second line.
        
        //print_hex(adc_x);   
        //write_string(" ");
        
        //print_hex(adc_y);       
        //write_string(" ");
        
        //print_hex(adc_rz);      
        //write_string(" ");
        
        //print_hex(adc_z);                   
    }
}

ISR(TWI_vect) {
    //static unsigned char i2c_state;
    unsigned char twi_status;
    unsigned char twi_address;
    
    // Get TWI Status Register, mask the prescalar bits (TWPS1,TWPS0)
    twi_status=TWSR & 0xF8;
    
    switch(twi_status) {
        case TW_ST_SLA_ACK:         // 0xA8: SLA+R received, ACK returned
            twi_address = TWDR;     //Get slave address.
            
            switch(twi_address) {
                case 0xB1:
                    TWDR = adc_x;       
                    TWCR |= (1<<TWINT);
                    break;
                case 0xB3:
                    TWDR = adc_y;       
                    TWCR |= (1<<TWINT);
                    break;
                case 0xB5:
                    TWDR = adc_rz;      
                    TWCR |= (1<<TWINT);
                    break;
                case 0xB7:
                    TWDR = adc_z;       
                    TWCR |= (1<<TWINT);
                    break;
                default:
                    TWCR |= (1<<TWINT);
                    break;
            }           
        
        default:
            TWCR |= (1<<TWINT);     // Clear TWINT Flag
            break;
   }    
}