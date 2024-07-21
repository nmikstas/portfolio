#include <avr/io.h>
#include <stddef.h>
#include <avr/interrupt.h>
#include <avr/pgmspace.h>
#include <math.h>
#include "atmega_uart.h"
#include "atmega_spi.h"
#include "atmega_twi.h"
#include "as_class.h"
#include "AquaSift_V0012.h"
#include "helper.h"

//Error status byte.
uint8_t errno;

//Receive arrays.
union arrays
{
	uint8_t bin_rx[BIN_RX_LENGTH];
	uint8_t rx_array[RX_ARRAY_LENGTH];
};

arrays arr;
uint8_t bin_index;
uint8_t array_index;
bool bin_overflowed;

/*******************************************Initialization and Configuration Routines****************************************/
//Initialize the MCU.
void init_processor(as_class *as)
{
	//Wait for voltage to stabilize on sensor board.
	for(volatile int i = 0; i < 10000; i++);
	
	atmega_twi::twi_master_init();	//I2C init.
	atmega_spi::spi_master_init();	//SPI init.
	atmega_uart::uart_init(UBRR);	//UART init.
	
	//Turn off unused hardware.
	PRR =  (1 << PRTIM2) | (1 << PRTIM0) | (1 << PRADC);
	ACSR = (1  << ACD); //Turn off analog comparator.
	
	//Pull up unused pins.
	PORTB |= 0xC0;
	PORTC |= 0xFF;
	PORTD |= 0xFC;
	
	//Set pins as outputs.
	ddrADCS |= (1 << ADCS);
	ddrDACS |= (1 << DACS);
	ddrRCS1 |= (1 << RCS1);
	ddrRCS2 |= (1 << RCS2);
	DDRB |= (1 << PORTB0);
	
	//Disable ADC and DAC.
	prtADCS |= (1 << ADCS);
	prtDACS |= (1 << DACS);
	
	//Disable the FRAM.
	prtRCS1 |= (1 << RCS1);
	prtRCS2 |= (1 << RCS2);
	
	//Load TIMER1 configuration.
	TCCR1B = 0x09;					//No prescaling, CTC.
	OCR1A  = INT_TIME;				//Match counter every 1 ms.
	TIMSK1 = 0x02;					//Enable TIMER1_COMPA interrupt.
	
	//Zero the DAC.
	write_dac(ZERO_VOLT);
	
	//Set initial config for digital pot and analog switches.
	init_i2c_devices(as);
	
	//Calibrate oscillator if necessary.
	calibrate_osc();
	
	//Load oscillator calibration value.
	OSCCAL = fram1_read_byte(OSC_ADDR);
	
	sei(); //Enable global interrupts.
}

//Update config for one or two electrodes.
void i2c_load_electrodes(as_class *as)
{
	uint8_t temp;
	
	//Get analog switch channel values.
	atmega_twi::i2c_start(&errno);
	atmega_twi::i2c_sendAddress(I2C_ANS_R_ADDR, &errno);
	temp = atmega_twi::i2c_receiveData_NACK(&errno);
	atmega_twi::i2c_stop();
	
	//Setup 2 electrode configuration.
	if(as->get_num_electrodes() == ELEC_2)
	{
		temp |= ANS_2_ELEC;
	}
	//Setup 3 electrode configuration.
	else
	{
		temp &= ~ANS_2_ELEC;
	}
	
	//Set analog switch channel values.
	atmega_twi::i2c_start(&errno);
	atmega_twi::i2c_sendAddress(I2C_ANS_W_ADDR, &errno);
	atmega_twi::i2c_sendData(temp, &errno);
	atmega_twi::i2c_stop();
}

//Connects the counter electrode to the system.
void i2c_connect_ce()
{
	uint8_t temp;
	
	//Get analog switch channel values.
	atmega_twi::i2c_start(&errno);
	atmega_twi::i2c_sendAddress(I2C_ANS_R_ADDR, &errno);
	temp = atmega_twi::i2c_receiveData_NACK(&errno);
	atmega_twi::i2c_stop();
	
	temp |= ANS_CE;	//Set bit for counter electrode.
	
	//Set analog switch channel values.
	atmega_twi::i2c_start(&errno);
	atmega_twi::i2c_sendAddress(I2C_ANS_W_ADDR, &errno);
	atmega_twi::i2c_sendData(temp, &errno);
	atmega_twi::i2c_stop();
}

//Disconnects the counter electrode from the system.
void i2c_disconnect_ce()
{
	uint8_t temp;
	
	//Get analog switch channel values.
	atmega_twi::i2c_start(&errno);
	atmega_twi::i2c_sendAddress(I2C_ANS_R_ADDR, &errno);
	temp = atmega_twi::i2c_receiveData_NACK(&errno);
	atmega_twi::i2c_stop();
	
	temp &= ~ANS_CE;	//Set bit for counter electrode.
	
	//Set analog switch channel values.
	atmega_twi::i2c_start(&errno);
	atmega_twi::i2c_sendAddress(I2C_ANS_W_ADDR, &errno);
	atmega_twi::i2c_sendData(temp, &errno);
	atmega_twi::i2c_stop();
}

//Update the resistor on the TIA.
void i2c_load_res(as_class *as)
{
	//Get current value of resistor tap.
	uint8_t temp = as->get_tia_res();
	uint8_t val;
	
	//Get analog switch channel values.
	atmega_twi::i2c_start(&errno);
	atmega_twi::i2c_sendAddress(I2C_ANS_R_ADDR, &errno);
	val = atmega_twi::i2c_receiveData_NACK(&errno);
	atmega_twi::i2c_stop();
	
	//Strip away resistor data and keep electrode data.
	val &= 0x03;
	
	if(temp == 1)		//100 ohms.
		val |= 0x20;
	else if(temp == 2)	//1k ohm.
		val |= 0x10;	
	else if(temp == 3)	//5.1k ohm.
		val |= 0x40;	
	else if(temp == 4)	//10k ohms.
		val |= 0x08;
	else if(temp == 5)	//51k ohms.
		val |= 0x80;
	else                //100k ohms.
		val |= 0x04;
	
	//Set analog switch channel values.
	atmega_twi::i2c_start(&errno);
	atmega_twi::i2c_sendAddress(I2C_ANS_W_ADDR, &errno);
	atmega_twi::i2c_sendData(val, &errno);
	atmega_twi::i2c_stop();
}

//Set initial capacitor and resistor values for the TIA.
void init_i2c_devices(as_class *as)
{
	//Enable updates to the digital pot wiper.
	atmega_twi::i2c_start(&errno);
	atmega_twi::i2c_sendAddress(I2C_POT_W_ADDR, &errno);
	atmega_twi::i2c_sendData(0x1C, &errno);
	atmega_twi::i2c_sendData(0x02, &errno);
	atmega_twi::i2c_stop();
	
	//Ensure all analog channels are configured to their default states
	//and the working electrode is disconnected on startup.  Also
	//set initial resistance for TIA digital pot.
	i2c_disconnect_ce();
	i2c_load_electrodes(as);
	i2c_load_res(as);
}

//Oscillator calibration function.  This function monitors the serial
//port looking for a 'U' to be received.  U has the most transitions in
//it so it should be hardest character to detect properly.  Once
//the first U is detected, it keeps track of how many Us have been
//detected sequentially while incrementing the oscillator calibration
//register.  Once it can no longer detect Us on the serial port, it
//finds the midpoint of the oscillation calibration register values
//that Us were detected and uses this value as the final oscillator
//calibration value.  The processor then freezes until reset.
void calibrate_osc()
{
	uint8_t cal_start = 0, cal_stop = 0, rx_byte, cal_state = CALREADY;
	
	//Exit if calibration header is not in place.
	if(PIND & OCAL) return;
	
	OSCCAL = 0;
	
	//Else go into calibration loop.
	while(1)
	{
		//Check if byte received.
		if(UCSR0A & flgRXC0)
		{
			rx_byte = UDR0;
			
			switch(cal_state)
			{
				//Increment oscillation calibration register until 'U' is detected.
				case CALREADY:
				if(rx_byte == 'U')
				{
					cal_start = OSCCAL;
					cal_state = CALSTART;
				}
				OSCCAL++;
				break;
				
				case CALSTART:
				//Increment OSCCAL until U is no longer detected.
				if(rx_byte == 'U')
				{
					OSCCAL++;
				}
				//Find OSCCAL range that allows the correct detection of U.
				else
				{
					cal_stop = OSCCAL - 1;
					cal_state = CALSTOP;
				}
				break;
				
				//Calibration complete. Save value and spin lock the processor.
				case CALSTOP:
				default:
				//Calculate final OSCCAL value.
				OSCCAL = cal_start + (cal_stop - cal_start) / 2;
				
				//Indicate calibration complete.
				atmega_uart::tx_string_p(PSTR("OK. OSCCAL = "));
				tx_u32_to_ascii(OSCCAL);
				atmega_uart::tx_byte('\r');
				
				//Save oscillator calibration value.
				fram1_write_byte(OSC_ADDR, OSCCAL);
				cli();	//Disable interrupts.
				
				while(1);	//Done. Spin lock processor.
				break;
			}
		}
	}
}

/****************************************************ADC and DAC Routines****************************************************/
//Write a 16-bit word of data to the DAC.
//This function is designed for a 12-bit DAC.
void write_dac(uint16_t data)
{
	prtDACS &= ~(1 << DACS);	//Select DAC.
	
	//Set control bits and send data.
	atmega_spi::spi_write(0x70 | (data >> 8));
	atmega_spi::spi_write(data);
	
	prtDACS |= (1 << DACS);	//Unselect DAC.
}

//Read a 16-bit word from the ADC.
//This function is designed for a 12-bit ADC.
uint16_t read_adc()
{
	uint8_t lower_byte, upper_byte;
	uint16_t data;
	
	prtADCS &= ~(1 << ADCS);	//Select ADC.
	
	upper_byte = atmega_spi::spi_read();
	lower_byte = atmega_spi::spi_read();
	data = (upper_byte << 7);
	data |= (lower_byte >> 1);
	data &= 0x0FFF;
	
	prtADCS |= (1 << ADCS);	//Unselect ADC.
	
	return data;
}

/********************************************************FRAM Routines*******************************************************/
//Enable writes to the FRAM.
void fram1_set_write_en(void)
{
	prtRCS1 &= ~(1 << RCS1);//Select FRAM1.
	atmega_spi::spi_write(FRAM_WREN);//Enable write latch.
	prtRCS1 |= (1 << RCS1);	//Unselect FRAM1.
}

//Write a byte to the FRAM.
void fram1_write_byte(uint32_t address, uint8_t data)
{
	fram1_set_write_en();
	prtRCS1 &= ~(1 << RCS1);//Select FRAM1.
	atmega_spi::spi_write(FRAM_WRITE);
	atmega_spi::spi_write(address >> 16);
	atmega_spi::spi_write(address >> 8);
	atmega_spi::spi_write(address);
	atmega_spi::spi_write(data);	
	prtRCS1 |= (1 << RCS1);	//Unselect FRAM1.
}

//Read a byte from the FRAM.
uint8_t fram1_read_byte(uint32_t address)
{
	uint8_t data;
	
	prtRCS1 &= ~(1 << RCS1);//Select FRAM1.
	atmega_spi::spi_write(FRAM_READ);
	atmega_spi::spi_write(address >> 16);
	atmega_spi::spi_write(address >> 8);
	atmega_spi::spi_write(address);
	data = atmega_spi::spi_read();
	prtRCS1 |= (1 << RCS1);	//Unselect FRAM1.
	return data;
}

//Write word to FRAM.
void fram1_write_word(uint32_t address, uint16_t data)
{
	fram1_write_byte(address, data >> 8);
	fram1_write_byte(address + 1, data);
}

//Read word from FRAM.
uint16_t fram1_read_word(uint32_t address)
{
	uint16_t data;
	data = fram1_read_byte(address);
	data <<= 8;
	data |= fram1_read_byte(address + 1);
	return data;
}

//Get arbitrary waveform block from FRAM.
void fram_read_arb_block(uint32_t *addr, int16_t *sv, int16_t *ev, uint16_t *rt)
{
	*sv = (int16_t)fram1_read_word(*addr);
	*ev = (int16_t)fram1_read_word(*addr + 2);
	*rt = fram1_read_word(*addr + 4);
	*addr = (*addr + 6);
}

/********************************************************DSP Routines********************************************************/
//DSP software low pass filter.
uint16_t lpf(uint16_t input, as_class *as)
{
	static double x[] = {ZERO_VOLT, ZERO_VOLT, ZERO_VOLT};
	static double y[] = {ZERO_VOLT, ZERO_VOLT};
	double output=0;
	
	//Shift x array to make room for new value.
	x[0] = x[1];
	x[1] = x[2];
	
	//Insert new value.
	x[2] = (double)input;
	
	switch (as->get_soft_sel())
	{
		case 1://1Hz Cutoff	
			output = 0.0000392338884076249 * x[2] +
			0.0000784677768152497 * x[1] +
			0.0000392338884076249 * x[0] +
			1.982205298140594 * y[1] -
			0.982362233694224 * y[0];
		break;
		
		case 2://5Hz cutoff.		
			output = 0.000720040734460 * x[2] +
			0.001440081468920 * x[1] +
			0.000720040734460 * x[0] +
			1.922676771251572 * y[1] -
			0.925556934189412 * y[0];
		break;
		
		case 3://10Hz cutoff.		
			output = 0.002796569909292 * x[2] +
			0.005593139818584 * x[1] +
			0.002796569909292 * x[0] +
			1.844936876367589 * y[1] -
			0.856123156004757 * y[0];
		break;
		
		case 4://50Hz cutoff.		
			output = 0.061913000700701 * x[2] +
			0.123826001401403 * x[1] +
			0.061913000700701 * x[0] +
			1.183374513189903 * y[1] -
			0.431026515992709 * y[0];
		break;
		
		case 5://100Hz cutoff.
			output = 0.228187868199481 * x[2] +
			0.456375736398963 * x[1] +
			0.228187868199481 * x[0] +
			0.271922988606727 * y[1] -
			0.184674461404652 * y[0];
		break;
		
		case 6://150Hz cutoff.
			output = 0.264547113425341 * x[2] +
			0.529094226850682 * x[1] +
			0.264547113425341 * x[0] +
			0.115754044922547 * y[1] -
			0.173942498623910 * y[0];
		break;
		
		default://200Hz cutoff.
			output = 0.365985688242642 * x[2] +
			0.731971376485284 * x[1] +
			0.365985688242642 * x[0] -
			0.278614001640615 * y[1] -
			0.185328751329953 * y[0];
		break;
	}
			 
	//Shift output to make room for new value.
	y[0] = y[1];
	y[1] = output;
	
	//Send value back to calling function.
	return (uint16_t)output;
}

/************************************************String Manipulation Routines************************************************/
//Convert a 16-bit unsigned integer to an ASCII string and transmit it out the UART.
void tx_u16_to_ascii(uint16_t number)
{
	bool number_started = false; //Indicate conversion has started.
	
	for(uint16_t i = 10000; i >= 10; i /= 10)
	{
		if(number / i || number_started)
		{
			number_started = true;
			atmega_uart::tx_byte(number / i + '0');
			number %= i;
		}
	}
	
	//Always do last steps.
	atmega_uart::tx_byte(number + 0x30); //Get last digit.
}

//Convert a 32-bit unsigned integer to an ASCII string and transmit it out the UART.
void tx_u32_to_ascii(uint32_t number)
{
	bool number_started = false; //Indicate conversion has started.
	
	for(uint32_t i = 1000000000; i >= 10; i /= 10)
	{
		if(number / i || number_started)
		{
			number_started = true;
			atmega_uart::tx_byte(number / i + '0');
			number %= i;
		}
	}
	
	//Always do last steps.
	atmega_uart::tx_byte(number + 0x30); //Get last digit.
}

//Convert a 32-bit signed integer to an ASCII string and transmit it out the UART.
void tx_int_to_ascii(int32_t number)
{
	bool number_started = false; //Indicate conversion has started.
	
	//Check if negative.
	if(number < 0)
	{
		atmega_uart::tx_byte('-');
		number *= -1;
	}
	
	for(uint32_t i = 1000000000; i >= 10; i /= 10)
	{
		if(number / i || number_started)
		{
			number_started = true;
			atmega_uart::tx_byte(number / i + '0');
			number %= i;
		}
	}
	
	//Always do last steps.
	atmega_uart::tx_byte(number + 0x30); //Get last digit.
}

//Converts a string into an unsigned integer.
//This function looks for user defined character to stop the conversion.
uint32_t string_to_u32(const uint8_t *array, uint8_t *errno, uint8_t term = '\r')
{
	uint8_t index = 0;
	uint64_t number = 0;
	
	//Continue until termination character is found or function errors out.
	while(array[index] != term && index < 10)
	{
		//Check if valid number character.
		if(array[index] >= '0' && array[index] <= '9')
		{
			//Add character to number.
			number += (array[index] - '0');
			
			//Look ahead to see if there is another valid number coming up.
			if(array[index + 1] >= '0' && array[index + 1] <= '9')
			{
				//If so, shift to make room for next digit.
				number *= 10;
			}
		}
		else //Invalid character.
		{
			*errno = ER_ERROR;
			return 0;
		}
		index++;	//Move to next digit.
	}
	
	//Check to see if there are too many digits, number out of range or no digits at all.
	if((index > 10) || (number > U32_MAX) || (!index)) 
	{
		*errno = ER_ERROR;
		return 0;
	}
	
	//Success.
	*errno = ER_NO_ERROR;
	return (uint32_t)number;
}

//Converts a string into a signed integer.
//This function looks for user defined character to stop the conversion.
int32_t string_to_int(const uint8_t *array, uint8_t *errno, uint8_t term = '\r')
{
	bool is_neg = false;
	uint8_t index = 0;
	uint64_t number = 0;
	int32_t num;
	
	//Switch to new array pointer to account for any negative sign.
	uint8_t *arr = (uint8_t *)array;
	
	//Looks to see if first character is negative sign, if so, set is_neg to true.
	if(arr[index] == '-')
	{
		is_neg = true;
		arr++;
	}
	
	//Continue until termination character is found or function errors out.
	while(arr[index] != term && index < 10)
	{
		//Check if valid number character.
		if(arr[index] >= '0' && arr[index] <= '9')
		{
			//Add character to number.
			number += (arr[index] - '0');
			
			//Look ahead to see if there is another valid number coming up.
			if(arr[index + 1] >= '0' && arr[index + 1] <= '9')
			{
				//If so, shift to make room for next digit.
				number *= 10;
			}
		}
		else //Invalid character.
		{
			*errno = ER_ERROR;
			return 0;
		}
		index++;	//Move to next digit.
	}
	
	//Check to see if there are too many digits, no digits at all.
	if((index > 10) || (!index))
	{
		*errno = ER_ERROR;
		return 0;
	}
	
	//Check to see if number is too big.
	if(!is_neg && (number > INT_MAX))
	{
		*errno = ER_ERROR;
		return 0;
	}
	
	//Check if number is too small.
	if(is_neg && number > INT_MIN)
	{
		*errno = ER_ERROR;
		return 0;
	}
	
	num = number;
	
	//Convert to a negative number, if necessary.
	if(is_neg)
	{
		num *= -1;
	}
	
	//Success.
	*errno = ER_NO_ERROR;
	return num;
}

//Converts a string into a signed integer.
//This function looks for user defined character to stop the conversion.
//Also, it gives the index where the number was terminated.
int32_t string_to_int_p(const uint8_t *array, uint8_t *errno, uint8_t *pend, uint8_t term = '\r')
{
	bool is_neg = false;
	uint8_t index = 0;
	uint64_t number = 0;
	int32_t num;
	
	//Switch to new array pointer to account for any negative sign.
	uint8_t *arr = (uint8_t *)array;
	
	//Looks to see if first character is negative sign, if so, set is_neg to true.
	if(arr[index] == '-')
	{
		is_neg = true;
		arr++;
	}
	
	//Continue until termination character is found or function errors out.
	while(arr[index] != term && index < 10)
	{
		//Check if valid number character.
		if(arr[index] >= '0' && arr[index] <= '9')
		{
			//Add character to number.
			number += (arr[index] - '0');
			
			//Look ahead to see if there is another valid number coming up.
			if(arr[index + 1] >= '0' && arr[index + 1] <= '9')
			{
				//If so, shift to make room for next digit.
				number *= 10;
			}
		}
		else //Invalid character.
		{
			*errno = ER_ERROR;
			return 0;
		}
		index++;	//Move to next digit.
	}
	
	//Check to see if there are too many digits, no digits at all.
	if((index > 10) || (!index))
	{
		*errno = ER_ERROR;
		return 0;
	}
	
	//Check to see if number is too big.
	if(!is_neg && (number > INT_MAX))
	{
		*errno = ER_ERROR;
		return 0;
	}
	
	//Check if number is too small.
	if(is_neg && number > INT_MIN)
	{
		*errno = ER_ERROR;
		return 0;
	}
	
	num = number;
	
	//Convert to a negative number, if necessary.
	if(is_neg)
	{
		num *= -1;
	}
	
	//Update the pointer to the end of the number.
	*pend = index + 1;
	if(is_neg)
	{
		(*pend)++;
	}
	
	//Success.
	*errno = ER_NO_ERROR;
	return num;
}

//Takes a unit8_t array and takes the first 2 values and loads them into a uint16_t.
uint16_t load_u16(const uint8_t *array)
{
	uint16_t temp16;
	
	temp16 = array[0];
	temp16 <<= 8;
	temp16 += array[1];
	return temp16;
}

//Takes a unit8_t array and takes the first 2 values and loads them into an int16_t.
int16_t load_int16(const uint8_t *array)
{
	int16_t temp16;
	
	temp16 = array[0];
	temp16 <<= 8;
	temp16 += array[1];
	return temp16;
}

//Takes a unit8_t array and takes the first 4 values and loads them into a uint32_t.
uint32_t load_u32(const uint8_t *array)
{
	uint32_t temp32_1, temp32_2, temp32_3;
	
	temp32_1 = array[0];
	temp32_1 <<= 24;
	temp32_2 = array[1];
	temp32_2 <<= 16;
	temp32_3 = array[2];
	temp32_3 <<= 8;
	return temp32_1 + temp32_2 + temp32_3 + array[3];
}

/*****************************************************Menu Writing Rountines*************************************************/
//Print device settings.
void uart_print_settings(as_class *as)
{
	uint8_t temp;
	uint16_t arb_num;
	bool t_f;
	
	arb_num = fram1_read_word(ARB_NUM);
	
	atmega_uart::tx_string_p(PSTR("tx_m=\'"));
	temp = as->get_tx_mode();
	if(temp == TX_MODE_ASCII)
	{
		atmega_uart::tx_byte('A');
	}
	else if(temp == TX_MODE_MATLAB)
	{
		atmega_uart::tx_byte('M');
	}
	else
	{
		atmega_uart::tx_byte('B');
	}
	atmega_uart::tx_string_p(PSTR("\';\r"));
	
	atmega_uart::tx_string_p(PSTR("num_e="));
	temp = as->get_num_electrodes();
	
	(temp == ELEC_2) ? atmega_uart::tx_byte('2') : atmega_uart::tx_byte('3');
	atmega_uart::tx_byte(';');
	atmega_uart::tx_byte('\r');
	
	atmega_uart::tx_string_p(PSTR("adc_r="));
	tx_u32_to_ascii(as->get_adc_rate());
	atmega_uart::tx_byte(';');
	atmega_uart::tx_byte('\r');
	
	atmega_uart::tx_string_p(PSTR("tia_r="));
	temp =as->get_tia_res();
	if(temp == 1)
		tx_u16_to_ascii(100);
	else if(temp == 2)
		tx_u16_to_ascii(1000);
	else if(temp == 3)
		tx_u16_to_ascii(5100);
	else if(temp == 4)
		tx_u16_to_ascii(10000);
	else if(temp == 5)
		tx_u16_to_ascii(51000);
	else
		tx_u32_to_ascii(100000);
	atmega_uart::tx_byte(';');
	atmega_uart::tx_byte('\r');
	
	atmega_uart::tx_string_p(PSTR("dep_e="));
	t_f = as->get_dep_enable();
	uart_true_false(t_f);
	
	atmega_uart::tx_string_p(PSTR("dep_t="));
	tx_u32_to_ascii(as->get_dep_time());
	atmega_uart::tx_byte(';');
	atmega_uart::tx_byte('\r');
	
	atmega_uart::tx_string_p(PSTR("dep_v="));
	tx_int_to_ascii(as->get_dep_volt());
	atmega_uart::tx_byte(';');
	atmega_uart::tx_byte('\r');
	
	atmega_uart::tx_string_p(PSTR("quiet_t="));
	tx_u32_to_ascii(as->get_quiet_time());
	atmega_uart::tx_byte(';');
	atmega_uart::tx_byte('\r');
	
	atmega_uart::tx_string_p(PSTR("dep_r="));
	t_f = as->get_dep_rec();
	uart_true_false(t_f);
	
	atmega_uart::tx_string_p(PSTR("sweep_vs="));
	tx_int_to_ascii(as->get_sweep_volt_start());
	atmega_uart::tx_byte(';');
	atmega_uart::tx_byte('\r');
	
	atmega_uart::tx_string_p(PSTR("sweep_ve="));
	tx_int_to_ascii(as->get_sweep_volt_end());
	atmega_uart::tx_byte(';');
	atmega_uart::tx_byte('\r');
	
	atmega_uart::tx_string_p(PSTR("sweep_r="));
	tx_u32_to_ascii(as->get_sweep_rate());
	atmega_uart::tx_byte(';');
	atmega_uart::tx_byte('\r');
	
	atmega_uart::tx_string_p(PSTR("sweep_c="));
	t_f = as->get_sweep_cyclic();
	uart_true_false(t_f);
	
	atmega_uart::tx_string_p(PSTR("sweep_cs="));
	tx_u32_to_ascii(as->get_sweep_cycles());
	atmega_uart::tx_byte(';');
	atmega_uart::tx_byte('\r');
	
	atmega_uart::tx_string_p(PSTR("dif_vs="));
	tx_int_to_ascii(as->get_dif_volt_start());
	atmega_uart::tx_byte(';');
	atmega_uart::tx_byte('\r');
	
	atmega_uart::tx_string_p(PSTR("dif_ve="));
	tx_int_to_ascii(as->get_dif_volt_end());
	atmega_uart::tx_byte(';');
	atmega_uart::tx_byte('\r');
	
	atmega_uart::tx_string_p(PSTR("dif_vi="));
	tx_u16_to_ascii(as->get_dif_volt_inc());
	atmega_uart::tx_byte(';');
	atmega_uart::tx_byte('\r');
	
	atmega_uart::tx_string_p(PSTR("dif_vpl="));
	tx_u16_to_ascii(as->get_dif_volt_pls());
	atmega_uart::tx_byte(';');
	atmega_uart::tx_byte('\r');
	
	atmega_uart::tx_string_p(PSTR("dif_tpr="));
	tx_u16_to_ascii(as->get_dif_time_pre());
	atmega_uart::tx_byte(';');
	atmega_uart::tx_byte('\r');
	
	atmega_uart::tx_string_p(PSTR("dif_tpl="));
	tx_u16_to_ascii(as->get_dif_time_pls());
	atmega_uart::tx_byte(';');
	atmega_uart::tx_byte('\r');
	
	atmega_uart::tx_string_p(PSTR("dif_win="));
	tx_u16_to_ascii(as->get_dif_time_win());
	atmega_uart::tx_byte(';');
	atmega_uart::tx_byte('\r');
	
	atmega_uart::tx_string_p(PSTR("arb_n="));
	tx_u32_to_ascii(arb_num);
	atmega_uart::tx_byte(';');
	atmega_uart::tx_byte('\r');
	
	atmega_uart::tx_string_p(PSTR("filt_s="));
	tx_u32_to_ascii(as->get_soft_sel());
	atmega_uart::tx_byte(';');
	atmega_uart::tx_byte('\r');
	atmega_uart::tx_byte('\r');
}

//Write a Y or N character out the UART.
void uart_yes_no(bool yes_no)
{
	yes_no ? atmega_uart::tx_byte('Y') : atmega_uart::tx_byte('N');
	atmega_uart::tx_byte('\r');
}

//Write minimum and maximum unsigned range of value out the UART.
void uart_min_max_u32(uint32_t min, uint32_t max)
{
	atmega_uart::tx_string_p(PSTR(" ("));
	tx_u32_to_ascii(min);
	atmega_uart::tx_string_p(PSTR(" to "));
	tx_u32_to_ascii(max);
	atmega_uart::tx_string_p(PSTR("): "));
}

//Write minimum and maximum signed range of value out the UART.
void uart_min_max_int(int min, int max)
{
	atmega_uart::tx_string_p(PSTR(" ("));
	tx_int_to_ascii(min);
	atmega_uart::tx_string_p(PSTR(" to "));
	tx_int_to_ascii(max);
	atmega_uart::tx_string_p(PSTR("): "));
}

//Print "true" or "false" out the UART.
void uart_true_false(bool t_f)
{
	t_f ? atmega_uart::tx_string_p(PSTR("true")) : atmega_uart::tx_string_p(PSTR("false"));
	atmega_uart::tx_byte(';');
	atmega_uart::tx_byte('\r');
}

//Print 8 spaces out the UART for indenting.
void uart_print_spaces()
{
	for(int i = 0; i < 8; i++)
	{
		atmega_uart::tx_byte(' ');
	}
}

//Write "ERR" in the terminal window.
void uart_err()
{
	atmega_uart::tx_string_p(PSTR("ERR\r"));
}

//Write "OK" in the terminal window.
void uart_ok()
{
	atmega_uart::tx_string_p(PSTR("OK\r"));
}

/**************************************************Update Menu Items Rountines***********************************************/
//Tokenize the user input.
void uart_tokenizer(uint8_t rx_byte, as_class *as)
{
	uint8_t errno = ER_ERROR;
	
	//Look for single byte commands. when input array is empty.
	if(!array_index && (rx_byte == 't' || rx_byte == 'T'))
	{
		//Send transmission type byte.
		if(as->get_tx_mode() == TX_MODE_ASCII)
			atmega_uart::tx_byte('A');
		else
			atmega_uart::tx_byte('M');
		return;
	}
	
	//Start linear sweep test.
	else if(!array_index && (rx_byte == 'l' || rx_byte == 'L'))
	{
		as->set_test_type(TEST_LIN);
		as->set_test_state(DEP_INIT);
		return;
	}
	
	//Start differential pulse test.
	else if(!array_index && (rx_byte == 'd' || rx_byte == 'D'))
	{
		as->set_test_type(TEST_DIF);
		as->set_test_state(DEP_INIT);
		return;
	}
	
	//Start arbitrary waveform test.
	else if(!array_index && (rx_byte == 'a' || rx_byte == 'A'))
	{
		as->set_test_type(TEST_ARB);
		as->set_test_state(DEP_INIT);
		return;
	}
	
	//Keep building input string.
	atmega_uart::tx_byte(rx_byte);//Echo byte.
	
	//Save byte from UART.
	arr.rx_array[array_index++] = rx_byte;
	
	//Check if array is going to overflow.
	if((array_index >= RX_ARRAY_LENGTH) && (arr.rx_array[RX_ARRAY_LENGTH - 1] != '\r'))
	{
		array_index = 0;
		uart_err();
		return;
	}
	
	//Special case. empty array prints the menu.
	if(arr.rx_array[0] == '\r')
	{
		array_index = 0;
		
		//Menu header.
		atmega_uart::tx_string_p(PSTR("---MAIN MENU---\r"));
		
		//Transmission mode.
		atmega_uart::tx_string_p(PSTR("1.  Transmission Mode (A)SCII, (M)atLab, (B)inary: "));
		if(as->get_tx_mode() == TX_MODE_ASCII)
			atmega_uart::tx_byte('A');
		else if(as->get_tx_mode() == TX_MODE_MATLAB)
			atmega_uart::tx_byte('M');
		else
			atmega_uart::tx_byte('B');
		atmega_uart::tx_byte('\r');
		
		//Number of electrodes.
		atmega_uart::tx_string_p(PSTR("2.  Number of Electrodes (2 or 3): "));
		(as->get_num_electrodes() == ELEC_2) ? atmega_uart::tx_byte('2') : atmega_uart::tx_byte('3');
		atmega_uart::tx_byte('\r');
		
		//ADC sample interval.
		atmega_uart::tx_string_p(PSTR("3.  Output Sample Interval ms"));
		uart_min_max_u32(ADC_RATE_MIN, ADC_RATE_MAX);
		tx_u32_to_ascii(as->get_adc_rate());
		atmega_uart::tx_byte('\r');
		
		//Menus.
		atmega_uart::tx_string_p(PSTR("4.  Transimpedance Amplifier Menu\r"));
		atmega_uart::tx_string_p(PSTR("5.  Deposition Menu\r"));
		atmega_uart::tx_string_p(PSTR("6.  Linear Sweep Menu\r"));
		atmega_uart::tx_string_p(PSTR("7.  Differential Pulse Menu\r"));
		atmega_uart::tx_string_p(PSTR("8.  Arbitrary Waveform Menu\r"));
		atmega_uart::tx_string_p(PSTR("9.  Low-pass Filter Menu\r"));
		
		//Get settings.
		atmega_uart::tx_string_p(PSTR("10. Get Settings\r\r"));
		
		//Unique identifier info.
		atmega_uart::tx_string_p(PSTR("Firmware Revision: "));
		atmega_uart::tx_string(FIRMWARE);
		atmega_uart::tx_byte('\r');
		atmega_uart::tx_string_p(PSTR("Product ID: "));
		atmega_uart::tx_string(PRODUCT_ID);
		atmega_uart::tx_byte('\r');
		
		//Start and stop tests.
		atmega_uart::tx_string_p(PSTR("\rL Start Linear Sweep Test\r"));
		atmega_uart::tx_string_p(PSTR("D Start Differential Pulse Test\r"));
		atmega_uart::tx_string_p(PSTR("A Start Arbitrary Waveform Test\r"));
		atmega_uart::tx_string_p(PSTR("X Abort Test\r\r\r\r\r"));
		return;
	}
	
	//If enter not pressed, keep building array.
	if(arr.rx_array[array_index - 1] != '\r')
		return;
	
	//At this point, enter has been pressed and array is ready for processing.
	//Convert array hex values to uppercase.
	for(int i = 0; i < array_index; i++)
		if(arr.rx_array[i] >= 'a' && arr.rx_array[i] <= 'z')
			arr.rx_array[i] -= 0x20;
	
	//Reset array index for next input string.
	array_index = 0;
	
	//Get number selection from user input and call appropriate function.
	//Change tx mode.
	if(arr.rx_array[0] == '1' && arr.rx_array[1] == ' ')
	{		
		//Check if setting to ASCII mode.
		if(arr.rx_array[2] == 'A' && arr.rx_array[3] == '\r')
		{
			as->set_tx_mode(TX_MODE_ASCII);
			errno = ER_NO_ERROR;
		}
		
		//Check if setting to MatLab mode.
		else if(arr.rx_array[2] == 'M' && arr.rx_array[3] == '\r')
		{
			as->set_tx_mode(TX_MODE_MATLAB);
			errno = ER_NO_ERROR;
		}
		
		//Check if setting to binary mode.
		else if(arr.rx_array[2] == 'B' && arr.rx_array[3] == '\r')
		{
			as->set_tx_mode(TX_MODE_BIN);
			return; //Do not print "OK" if just switched to binary mode.
		}
		else errno = ER_ERROR;//Invalid input.
	}
	
	//Change number of electrodes.
	else if(arr.rx_array[0] == '2' && arr.rx_array[1] == ' ')
	{
		//Check if changing to 2 electrode configuration.
		if(arr.rx_array[2] == '2' && arr.rx_array[3] == '\r')
		{
			as->set_num_electrodes(ELEC_2);
			i2c_load_electrodes(as);
			errno = ER_NO_ERROR;
		}
		
		//Check if changing to 3 electrode configuration.
		else if(arr.rx_array[2] == '3' && arr.rx_array[3] == '\r')
		{
			as->set_num_electrodes(ELEC_3);
			i2c_load_electrodes(as);
			errno = ER_NO_ERROR;
		}
		else errno = ER_ERROR;//Invalid input.
	}
	
	//Change ADC sample interval.
	else if(arr.rx_array[0] == '3' && arr.rx_array[1] == ' ')
		errno = set_u16(&(arr.rx_array[2]), as, &as_class::set_adc_rate);
	
	//Print TIA menu.
	else if(arr.rx_array[0] == '4' && arr.rx_array[1] == '\r')
	{
		//Menu header.
		atmega_uart::tx_string_p(PSTR("---TIA MENU---\r"));
		
		//Resistor tap.
		atmega_uart::tx_string_p(PSTR("11. TIA Gain Resistor "));
		uart_min_max_u32(RES_MIN, RES_MAX);
		tx_u32_to_ascii(as->get_tia_res());
		atmega_uart::tx_byte('\r');
		uart_print_spaces();
		atmega_uart::tx_string_p(PSTR("1. 100\r"));
		uart_print_spaces();
		atmega_uart::tx_string_p(PSTR("2. 1k\r"));
		uart_print_spaces();
		atmega_uart::tx_string_p(PSTR("3. 5.1k\r"));
		uart_print_spaces();
		atmega_uart::tx_string_p(PSTR("4. 10k\r"));
		uart_print_spaces();
		atmega_uart::tx_string_p(PSTR("5. 51k\r"));
		uart_print_spaces();
		atmega_uart::tx_string_p(PSTR("6. 100k\r\r\r\r\r\r\r\r\r\r\r\r\r\r\r\r"));
		return;
	}
	
	//Print deposition menu.
	else if(arr.rx_array[0] == '5' && arr.rx_array[1] == '\r')
	{
		//Menu header.
		atmega_uart::tx_string_p(PSTR("---DEPOSITION MENU---\r"));
		
		//Enable deposition.
		atmega_uart::tx_string_p(PSTR("12. Enable Deposition (Y/N): "));
		uart_yes_no(as->get_dep_enable());
		
		//Deposition time.
		atmega_uart::tx_string_p(PSTR("13. Deposition Time ms"));
		uart_min_max_u32(DEP_TIME_MIN, DEP_TIME_MAX);
		tx_u32_to_ascii(as->get_dep_time());
		atmega_uart::tx_byte('\r');
		
		//Deposition Voltage.
		atmega_uart::tx_string_p(PSTR("14. Deposition Voltage mV"));
		uart_min_max_int(DEP_VOLT_MIN, DEP_VOLT_MAX);
		tx_int_to_ascii(as->get_dep_volt());
		atmega_uart::tx_byte('\r');
		
		//Quiet time.
		atmega_uart::tx_string_p(PSTR("15. Quiet Time ms"));
		uart_min_max_u32(QUIET_TIME_MIN, QUIET_TIME_MAX);
		tx_u32_to_ascii(as->get_quiet_time());
		atmega_uart::tx_byte('\r');
		
		//Record deposition sequence.
		atmega_uart::tx_string_p(PSTR("16. Record Deposition Sequence (Y/N): "));
		uart_yes_no(as->get_dep_rec());
		atmega_uart::tx_string_p(PSTR("\r\r\r\r\r\r\r\r\r\r\r\r\r\r\r\r\r"));
		return;
	}
	
	//Print linear sweep menu.
	else if(arr.rx_array[0] == '6' && arr.rx_array[1] == '\r')
	{
		//Menu header.
		atmega_uart::tx_string_p(PSTR("---LINEAR SWEEP MENU---\r"));
		
		//Start Voltage.
		atmega_uart::tx_string_p(PSTR("17. Start Voltage mV"));
		uart_min_max_int(SWEEP_VOLT_MIN, SWEEP_VOLT_MAX);
		tx_int_to_ascii(as->get_sweep_volt_start());
		atmega_uart::tx_byte('\r');
		
		//End voltage.
		atmega_uart::tx_string_p(PSTR("18. End Voltage mV"));
		uart_min_max_int(SWEEP_VOLT_MIN, SWEEP_VOLT_MAX);
		tx_int_to_ascii(as->get_sweep_volt_end());
		atmega_uart::tx_byte('\r');
		
		//Sweep rate.
		atmega_uart::tx_string_p(PSTR("19. Sweep Rate mV/s"));
		uart_min_max_u32(SWEEP_RATE_MIN, SWEEP_RATE_MAX);
		tx_u32_to_ascii(as->get_sweep_rate());
		atmega_uart::tx_byte('\r');
		
		//Cyclic.
		atmega_uart::tx_string_p(PSTR("20. Cyclic (Y/N): "));
		uart_yes_no(as->get_sweep_cyclic());
		
		//Number of cycles.
		atmega_uart::tx_string_p(PSTR("21. Number of Cycles"));
		uart_min_max_u32(SWEEP_CYCLES_MIN, SWEEP_CYCLES_MAX);
		tx_u32_to_ascii(as->get_sweep_cycles());
		atmega_uart::tx_string_p(PSTR("\r\r\r\r\r\r\r\r\r\r\r\r\r\r\r\r\r\r"));
		return;
	}
	
	//Print differential pulse menu.
	else if(arr.rx_array[0] == '7' && arr.rx_array[1] == '\r')
	{
		//Menu header.
		atmega_uart::tx_string_p(PSTR("---DIFFERENTIAL PULSE MENU---\r"));
		
		//Start voltage.
		atmega_uart::tx_string_p(PSTR("22. Start Voltage mV"));
		uart_min_max_int(DIF_VOLT_MIN, DIF_VOLT_MAX);
		tx_int_to_ascii(as->get_dif_volt_start());
		atmega_uart::tx_byte('\r');
		
		//End voltage.
		atmega_uart::tx_string_p(PSTR("23. End Voltage mV"));
		uart_min_max_int(DIF_VOLT_MIN, DIF_VOLT_MAX);
		tx_int_to_ascii(as->get_dif_volt_end());
		atmega_uart::tx_byte('\r');
		
		//Differential pulse increment.
		atmega_uart::tx_string_p(PSTR("24. Increment mV"));
		uart_min_max_u32(DIF_INC_MIN, DIF_INC_MAX);
		tx_u32_to_ascii(as->get_dif_volt_inc());
		atmega_uart::tx_byte('\r');
		
		//Differential pulse voltage.
		atmega_uart::tx_string_p(PSTR("25. Pulse Voltage mV"));
		uart_min_max_int(DIF_AMP_MIN, DIF_AMP_MAX);
		tx_int_to_ascii(as->get_dif_volt_pls());
		atmega_uart::tx_byte('\r');
		
		//Differential pulse pre-pulse time.
		atmega_uart::tx_string_p(PSTR("26. Pre-pulse Time ms"));
		uart_min_max_u32(DIF_PRE_MIN, DIF_PRE_MAX);
		tx_u32_to_ascii(as->get_dif_time_pre());
		atmega_uart::tx_byte('\r');
		
		//Differential pulse time.
		atmega_uart::tx_string_p(PSTR("27. Pulse Time ms"));
		uart_min_max_u32(DIF_PLS_MIN, DIF_PLS_MAX);
		tx_u32_to_ascii(as->get_dif_time_pls());
		atmega_uart::tx_byte('\r');
		
		//Sampling window width.
		atmega_uart::tx_string_p(PSTR("28. Sampling Window Width ms"));
		uart_min_max_u32(DIF_WIN_MIN, DIF_WIN_MAX);
		tx_u32_to_ascii(as->get_dif_time_win());
		atmega_uart::tx_string_p(PSTR("\r\r\r\r\r\r\r\r\r\r\r\r\r\r\r\r"));
		return;
	}
	
	//Print arbitrary waveform menu.
	else if(arr.rx_array[0] == '8' && arr.rx_array[1] == '\r')
	{
		//Menu header.
		atmega_uart::tx_string_p(PSTR("---ARBITRARY WAVEFORM MENU---\r"));
		
		//Append entry.
		atmega_uart::tx_string_p(PSTR("29. Append Entry (StartmV StopmV RatemV/s)\r"));
		
		//Replace entry.
		atmega_uart::tx_string_p(PSTR("30. Replace Entry (Entry# StartmV StopmV RatemV/s)\r"));
		
		//Delete last entry.
		atmega_uart::tx_string_p(PSTR("31. Delete Last Entry\r"));
		
		//Delete all entries.
		atmega_uart::tx_string_p(PSTR("32. Delete All Entries\r"));
		
		//Show stored values
		atmega_uart::tx_string_p(PSTR("33. Get Stored Values\r"));
		atmega_uart::tx_string_p(PSTR("\r"));
		
		//Stored entries.
		atmega_uart::tx_string_p(PSTR("Number of Stored Entries (Up to "));
		tx_int_to_ascii(ARB_ENTRIES_MAX);
		atmega_uart::tx_string_p(PSTR("): "));
		tx_u32_to_ascii(fram1_read_word(ARB_NUM));
		
		//Arbitrary waveform value limits.
		atmega_uart::tx_string_p(PSTR("\r\rStartmV: "));
		tx_int_to_ascii(ARB_VOLT_MIN);
		atmega_uart::tx_string_p(PSTR(" to "));
		tx_int_to_ascii(ARB_VOLT_MAX);
		atmega_uart::tx_string_p(PSTR("\rEndmV:   "));
		tx_int_to_ascii(ARB_VOLT_MIN);
		atmega_uart::tx_string_p(PSTR(" to "));
		tx_int_to_ascii(ARB_VOLT_MAX);
		atmega_uart::tx_string_p(PSTR("\rRatemV/s: "));
		tx_u32_to_ascii(ARB_RATE_MIN);
		atmega_uart::tx_string_p(PSTR(" to "));
		tx_u32_to_ascii(ARB_RATE_MAX);
		atmega_uart::tx_string_p(PSTR("\r\r\r\r\r\r\r\r\r\r\r\r"));
		return;
	}
	
	//Print low-pass filter menu.
	else if(arr.rx_array[0] == '9' && arr.rx_array[1] == '\r')
	{
		//Menu header.
		atmega_uart::tx_string_p(PSTR("---LOW-PASS FILTER MENU---\r"));
		
		//Selected software filter.
		atmega_uart::tx_string_p(PSTR("34. Selected Filter"));
		uart_min_max_u32(LPF_FILT_MIN, LPF_FILT_MAX);
		tx_u32_to_ascii(as->get_soft_sel());
		atmega_uart::tx_byte('\r');
		
		uart_print_spaces();
		atmega_uart::tx_string_p(PSTR("Cutoff Frequency\r"));
		uart_print_spaces();
		atmega_uart::tx_string_p(PSTR("0: No Filter\r"));
		uart_print_spaces();
		atmega_uart::tx_string_p(PSTR("1:   1Hz\r"));
		uart_print_spaces();
		atmega_uart::tx_string_p(PSTR("2:   5Hz\r"));
		uart_print_spaces();
		atmega_uart::tx_string_p(PSTR("3:  10Hz\r"));
		uart_print_spaces();
		atmega_uart::tx_string_p(PSTR("4:  50Hz\r"));
		uart_print_spaces();
		atmega_uart::tx_string_p(PSTR("5: 100Hz\r"));
		uart_print_spaces();
		atmega_uart::tx_string_p(PSTR("6: 150Hz\r"));
		uart_print_spaces();
		atmega_uart::tx_string_p(PSTR("7: 200Hz\r\r\r\r\r\r\r\r\r\r\r\r\r"));
		return;
	}
	
	//Print settings.
	else if(arr.rx_array[0] == '1' && arr.rx_array[1] == '0' && arr.rx_array[2] == '\r')
	{
		uart_print_settings(as);
		return;
	}
	
	//Change the TIA resistor.
	else if(arr.rx_array[0] == '1' && arr.rx_array[1] == '1' && arr.rx_array[2] == ' ')
	{
		errno = set_u8(&(arr.rx_array[3]), as, &as_class::set_tia_res);
		
		//Update TIA resistor.
		i2c_load_res(as);
	}
	
	//Enable deposition sequence.
	else if(arr.rx_array[0] == '1' && arr.rx_array[1] == '2' && arr.rx_array[2] == ' ')
		errno = set_bool(&(arr.rx_array[3]), as, &as_class::set_dep_enable);
	
	//change deposition time.
	else if(arr.rx_array[0] == '1' && arr.rx_array[1] == '3' && arr.rx_array[2] == ' ')
		errno = set_u32(&(arr.rx_array[3]), as, &as_class::set_dep_time);
	
	//Change deposition voltage.
	else if(arr.rx_array[0] == '1' && arr.rx_array[1] == '4' && arr.rx_array[2] == ' ')
		errno = set_int16(&(arr.rx_array[3]), as, &as_class::set_dep_volt);
	
	//Change quiet time.
	else if(arr.rx_array[0] == '1' && arr.rx_array[1] == '5' && arr.rx_array[2] == ' ')
		errno = set_u32(&(arr.rx_array[3]), as, &as_class::set_quiet_time);
	
	//Record deposition sequence.
	else if(arr.rx_array[0] == '1' && arr.rx_array[1] == '6' && arr.rx_array[2] == ' ')
		errno = set_bool(&(arr.rx_array[3]), as, &as_class::set_dep_rec);
	
	//Change sweep start voltage.
	else if(arr.rx_array[0] == '1' && arr.rx_array[1] == '7' && arr.rx_array[2] == ' ')
		errno = set_int16(&(arr.rx_array[3]), as, &as_class::set_sweep_volt_start);
	
	//Change sweep end voltage.
	else if(arr.rx_array[0] == '1' && arr.rx_array[1] == '8' && arr.rx_array[2] == ' ')
		errno = set_int16(&(arr.rx_array[3]), as, &as_class::set_sweep_volt_end);
	
	//Change sweep rate.
	else if(arr.rx_array[0] == '1' && arr.rx_array[1] == '9' && arr.rx_array[2] == ' ')
		errno = set_u16(&(arr.rx_array[3]), as, &as_class::set_sweep_rate);
	
	//Change if sweep function is cyclic.
	else if(arr.rx_array[0] == '2' && arr.rx_array[1] == '0' && arr.rx_array[2] == ' ')
		errno = set_bool(&(arr.rx_array[3]), as, &as_class::set_sweep_cyclic);
	
	//Change number of sweep cycles.
	else if(arr.rx_array[0] == '2' && arr.rx_array[1] == '1' && arr.rx_array[2] == ' ')
		errno = set_u8(&(arr.rx_array[3]), as, &as_class::set_sweep_cycles);
	
	//Change differential pulse start voltage.
	else if(arr.rx_array[0] == '2' && arr.rx_array[1] == '2' && arr.rx_array[2] == ' ')
	{
		int32_t start_v;
		
		//Attempt to convert user input to number.
		start_v = string_to_int(&arr.rx_array[3], &errno);
		
		if(errno)//Exit if invalid integer detected.
		{
			errno = ER_ERROR;	
		}
		//Check to make sure range is valid.
		else if(start_v + as->get_dif_volt_pls() > DIF_VOLT_MAX)
		{
			atmega_uart::tx_string_p(PSTR("Start+Amp High "));
			errno = ER_ERROR;
		}
		else if(start_v + as->get_dif_volt_pls() < DIF_VOLT_MIN)
		{
			atmega_uart::tx_string_p(PSTR("Start+Amp Low "));
			errno = ER_ERROR;
		}
		else
		{
			errno = as->set_dif_volt_start(start_v);
		}
	}
	
	//Change differential pulse end voltage.
	else if(arr.rx_array[0] == '2' && arr.rx_array[1] == '3' && arr.rx_array[2] == ' ')
	{
		int32_t end_v;
		
		//Attempt to convert user input to number.
		end_v = string_to_int(&arr.rx_array[3], &errno);
		
		if(errno)//Exit if invalid integer detected.
		{
			errno = ER_ERROR;
		}
		//Check to make sure range is valid.
		else if(end_v + as->get_dif_volt_pls() > DIF_VOLT_MAX)
		{
			atmega_uart::tx_string_p(PSTR("End+Amp High "));
			errno = ER_ERROR;
		}
		else if(end_v + as->get_dif_volt_pls() < DIF_VOLT_MIN)
		{
			atmega_uart::tx_string_p(PSTR("End+Amp Low "));
			errno = ER_ERROR;
		}
		else
		{
			errno = as->set_dif_volt_end(end_v);
		}
	}
	
	//Change differential pulse increment.
	else if(arr.rx_array[0] == '2' && arr.rx_array[1] == '4' && arr.rx_array[2] == ' ')
	errno = set_u16(&(arr.rx_array[3]), as, &as_class::set_dif_volt_inc);
	
	//Change differential pulse amplitude.
	else if(arr.rx_array[0] == '2' && arr.rx_array[1] == '5' && arr.rx_array[2] == ' ')
	{
		int32_t amp;
		
		//Attempt to convert user input to number.
		amp = string_to_int(&arr.rx_array[3], &errno);
		
		if(errno)//Exit if invalid integer detected.
		{
			errno = ER_ERROR;
		}
		//Check to make sure range is valid.
		else if(as->get_dif_volt_start() + amp > DIF_VOLT_MAX)
		{
			atmega_uart::tx_string_p(PSTR("Start+Amp High "));
			errno = ER_ERROR;
		}
		else if(as->get_dif_volt_start() + amp < DIF_VOLT_MIN)
		{
			atmega_uart::tx_string_p(PSTR("Start+Amp Low "));
			errno = ER_ERROR;
		}
		else if(as->get_dif_volt_end() + amp > DIF_VOLT_MAX)
		{
			atmega_uart::tx_string_p(PSTR("End+Amp High "));
			errno = ER_ERROR;
		}
		else if(as->get_dif_volt_end() + amp < DIF_VOLT_MIN)
		{
			atmega_uart::tx_string_p(PSTR("End+Amp Low "));
			errno = ER_ERROR;
		}
		else
		{
			errno = as->set_dif_volt_pls(amp);
		}
	}

	//Change differential pulse pre-pulse time.
	else if(arr.rx_array[0] == '2' && arr.rx_array[1] == '6' && arr.rx_array[2] == ' ')
	{
		uint32_t temp;
		
		//Attempt to convert user input to number.
		temp = string_to_u32(&arr.rx_array[3], &errno);
		
		if(errno)//Exit if invalid integer detected.
			errno = ER_ERROR;
		//Check to make sure range is valid.
		else if(temp < as->get_dif_time_win())
		{
			atmega_uart::tx_string_p(PSTR("Pre-pulse < Width "));
			errno = ER_ERROR;
		}
		else		
			errno = set_u16(&(arr.rx_array[3]), as, &as_class::set_dif_time_pre);
	}
		
	//Change differential pulse time.
	else if(arr.rx_array[0] == '2' && arr.rx_array[1] == '7' && arr.rx_array[2] == ' ')
	{
		uint32_t temp;
		
		//Attempt to convert user input to number.
		temp = string_to_u32(&arr.rx_array[3], &errno);
		
		if(errno)//Exit if invalid integer detected.
			errno = ER_ERROR;
		//Check to make sure range is valid.
		else if(temp < as->get_dif_time_win())
		{
			atmega_uart::tx_string_p(PSTR("Pulse < Width "));
			errno = ER_ERROR;
		}
		else
			errno = set_u16(&(arr.rx_array[3]), as, &as_class::set_dif_time_pls);
	}
	
	//Change differential sampling window width.
	else if(arr.rx_array[0] == '2' && arr.rx_array[1] == '8' && arr.rx_array[2] == ' ')
	{
		uint32_t temp;
		
		//Attempt to convert user input to number.
		temp = string_to_u32(&arr.rx_array[3], &errno);
		
		if(errno)//Exit if invalid integer detected.
			errno = ER_ERROR;
		//Check to make sure range is valid.
		else if(temp > as->get_dif_time_pre())
		{
			atmega_uart::tx_string_p(PSTR("Width > Pre-pulse "));
			errno = ER_ERROR;
		}
		else if(temp > as->get_dif_time_pls())
		{
			atmega_uart::tx_string_p(PSTR("Width > Pulse "));
			errno = ER_ERROR;
		}
		else
			errno = set_u16(&(arr.rx_array[3]), as, &as_class::set_dif_time_win);
	}
	
	//Append arbitrary waveform data to end of saved list.
	else if(arr.rx_array[0] == '2' && arr.rx_array[1] == '9' && arr.rx_array[2] == ' ')
		errno = arb_append(&(arr.rx_array[3]));
	
	//Replace arbitrary waveform data at specified location.
	else if(arr.rx_array[0] == '3' && arr.rx_array[1] == '0' && arr.rx_array[2] == ' ')
		errno = arb_replace(&(arr.rx_array[3]));
	
	//Delete last entry in arbitrary waveform data list.
	else if(arr.rx_array[0] == '3' && arr.rx_array[1] == '1' && arr.rx_array[2] == '\r')
	{
		uint8_t entries;
		
		//Get number of entries already in list.
		entries = fram1_read_word(ARB_NUM);
		
		if(entries)//decrement and save.
			fram1_write_word(ARB_NUM, entries - 1);
		
		errno = ER_NO_ERROR;
	}
	
	//Delete all stored arbitrary waveform data.
	else if(arr.rx_array[0] == '3' && arr.rx_array[1] == '2' && arr.rx_array[2] == '\r')
	{
		fram1_write_word(ARB_NUM, 0);
		errno = ER_NO_ERROR;
	}
	
	//Print all saved arbitrary waveform data.
	else if(arr.rx_array[0] == '3' && arr.rx_array[1] == '3' && arr.rx_array[2] == '\r')
	{
		uint16_t entries;
		int16_t val1, val2;
		
		//Get number of entries already in list.
		entries = fram1_read_word(ARB_NUM);
		
		if(!entries)
		{
			atmega_uart::tx_string_p(PSTR("Memory Empty\r"));
			return;
		}
		
		//Put header at top of data.
		atmega_uart::tx_string_p(PSTR("Entry StartmV EndmV Rate\r"));
		
		//Get values from memory.
		for (uint8_t i = 0; i < entries; i++)
		{
			//Align and print entry number.
			tx_u32_to_ascii(i + 1);
			atmega_uart::tx_byte(' ');
			if(i < 9999)
				atmega_uart::tx_byte(' ');
			if(i < 999)
				atmega_uart::tx_byte(' ');
			if(i < 99)
				atmega_uart::tx_byte(' ');
			if(i < 9)
				atmega_uart::tx_byte(' ');
			
			//Align and print start voltage.
			val1 = fram1_read_word(ARB_START + 6 * i);
			if(val1 >= 0)
				atmega_uart::tx_byte(' ');
			else
			{
				atmega_uart::tx_byte('-');
				val1 *= -1;
			}
			tx_int_to_ascii(val1);
			if(val1 < 1000)
				atmega_uart::tx_byte(' ');
			if(val1 < 100)
				atmega_uart::tx_byte(' ');
			if(val1 < 10)
				atmega_uart::tx_byte(' ');
			atmega_uart::tx_byte(' ');
			atmega_uart::tx_byte(' ');
			atmega_uart::tx_byte(' ');
			
			val2 = fram1_read_word(ARB_START + 2 + 6 * i);
			if(val2 >= 0)
			atmega_uart::tx_byte(' ');
			else
			{
				atmega_uart::tx_byte('-');
				val2 *= -1;
			}
			tx_int_to_ascii(val2);
			if(val2 < 1000)
				atmega_uart::tx_byte(' ');
			if(val2 < 100)
				atmega_uart::tx_byte(' ');
			if(val2 < 10)
				atmega_uart::tx_byte(' ');
			atmega_uart::tx_byte(' ');
			
			tx_u32_to_ascii(fram1_read_word(ARB_START + 4 + 6 * i));
			atmega_uart::tx_byte('\r');
		}
		return;
	}
	
	//Select which software filter to use.
	else if(arr.rx_array[0] == '3' && arr.rx_array[1] == '4' && arr.rx_array[2] == ' ')
		errno = set_u8(&(arr.rx_array[3]), as, &as_class::set_soft_sel);
	
	else //Invalid selection.
		errno = ER_ERROR;
	
	if(errno)	//Error out if there was a problem.
	{
		uart_err();
		return;
	}
	
	uart_ok();	
	return;
}

//Append arbitrary waveform data to end of saved list.
uint8_t arb_append(const uint8_t *rx_array)
{
	int16_t start_v, end_v;
	uint16_t rate, entries;
	uint8_t errno, pend1, pend2;
	
	//Get number of entries already in list.
	entries = fram1_read_word(ARB_NUM);
	
	//Error out if memory is already full.
	if(entries >= ARB_ENTRIES_MAX)
	{
		atmega_uart::tx_string_p(PSTR("Memory Full\r"));
		return ER_ERROR;
	}
	
	//Attempt to convert first user input to number.
	start_v = string_to_int_p(rx_array, &errno, &pend1, ' ');
	
	if(errno)
	{
		return ER_ERROR;
	}
	
	//Make sure the number falls within the proper range.
	if(start_v > ARB_VOLT_MAX || start_v < ARB_VOLT_MIN)
	{
		return ER_ERROR;
	}
	
	//Attempt to convert second user input to number.
	end_v = string_to_int_p(rx_array + pend1, &errno, &pend2, ' ');
	
	if(errno)
	{
		return ER_ERROR;
	}
	
	//Make sure the number falls within the proper range.
	if(end_v > ARB_VOLT_MAX || end_v < ARB_VOLT_MIN)
	{
		return ER_ERROR;
	}
	
	//Attempt to convert third user input to number.
	rate = string_to_int_p(rx_array + pend1 + pend2, &errno, &pend2, '\r');
	
	if(errno)
	{
		return ER_ERROR;
	}
	
	//Make sure the number falls within the proper range.
	if(rate > ARB_RATE_MAX || rate < ARB_RATE_MIN)
	{
		return ER_ERROR;
	}
	
	//Save values in the EEPROM.
	fram1_write_word(ARB_START + 6 * entries, start_v);
	fram1_write_word(ARB_START + 2 + 6 * entries, end_v);
	fram1_write_word(ARB_START + 4 + 6 * entries, rate);
	
	//Update number of entries stored.
	fram1_write_word(ARB_NUM, entries + 1);
	
	return ER_NO_ERROR;
}

//Replace arbitrary waveform data at specified location.
uint8_t arb_replace(const uint8_t *rx_array)
{
	int16_t start_v, end_v;
	uint16_t ent, rate, entries;
	uint8_t errno, pend1, pend2, pend3;
	
	//Get number of entries already in list.
	entries = fram1_read_word(ARB_NUM);
	
	//Attempt to convert first user input to number.
	ent = string_to_int_p(rx_array, &errno, &pend1, ' ');
	
	if(errno)
	{
		return ER_ERROR;
	}
	
	//Make sure the number falls within the proper range.
	if(ent > entries)
	{
		atmega_uart::tx_string_p(PSTR("Entry Out of Range\r"));
		return ER_ERROR;
	}
	
	//Attempt to convert second user input to number.
	start_v = string_to_int_p(rx_array + pend1, &errno, &pend2, ' ');
	
	if(errno)
	{
		return ER_ERROR;
	}
	
	//Make sure the number falls within the proper range.
	if(start_v > ARB_VOLT_MAX || start_v < ARB_VOLT_MIN)
	{
		return ER_ERROR;
	}
	
	//Attempt to convert third user input to number.
	end_v = string_to_int_p(rx_array + pend1 + pend2, &errno, &pend3, ' ');
	
	if(errno)
	{
		return ER_ERROR;
	}
	
	//Make sure the number falls within the proper range.
	if(end_v > ARB_VOLT_MAX || end_v < ARB_VOLT_MIN)
	{
		return ER_ERROR;
	}
	
	
	//Attempt to convert fourth user input to number.
	rate = string_to_int_p(rx_array + pend1 + pend2 + pend3, &errno, &pend2, '\r');
	
	if(errno)
	{
		return ER_ERROR;
	}
	
	//Make sure the number falls within the proper range.
	if(rate > ARB_RATE_MAX || rate < ARB_RATE_MIN)
	{
		return ER_ERROR;
	}
	
	//Save values in the EEPROM.
	fram1_write_word(ARB_START + 6 * (ent - 1), start_v);
	fram1_write_word(ARB_START + 2 + 6 * (ent - 1), end_v);
	fram1_write_word(ARB_START + 4 + 6 * (ent - 1), rate);
	
	return ER_NO_ERROR;
}

//Set value in as_class object that is a bool value (ASCII).
uint8_t set_bool(const uint8_t *rx_array, as_class *as, uint8_t (as_class::*func_tf)(bool))
{
	if(as->get_tx_mode() == TX_MODE_BIN)//Binary mode.
	{
		if(bin_index == 2)
		{
			if(arr.bin_rx[1] == 0x00)
			{
				(as->*func_tf)(false);
				atmega_uart::tx_byte(ER_BIN_NO_ERR);
				
			}
			else if(arr.bin_rx[1] == 0x01)
			{
				(as->*func_tf)(true);
				atmega_uart::tx_byte(ER_BIN_NO_ERR);
			}
			else
			{
				atmega_uart::tx_byte(ER_BIN_INV_PARAM);
			}
		}
		else//Transmit error.
		{
			atmega_uart::tx_byte(ER_BIN_INV_PARAM);
		}
		return ER_NO_ERROR;
	}
	else//ASCII or MatLab mode.
	{
		if(rx_array[0] == 'Y' && rx_array[1] == '\r')
		{
			(as->*func_tf)(true);
			return ER_NO_ERROR;
		}
		
		if(rx_array[0] == 'N' && rx_array[1] == '\r')
		{
			(as->*func_tf)(false);
			return ER_NO_ERROR;
		}
		
		return ER_ERROR;
	}
}

//Set value in as_class object that is an unsigned 8 bit value (ASCII).
uint8_t set_u8(const uint8_t *rx_array, as_class *as, uint8_t (as_class::*func_u8)(uint8_t))
{
	uint8_t errno;
	uint32_t number;
	
	if(as->get_tx_mode() == TX_MODE_BIN)//Binary mode.
	{
		if(bin_index == 2)
		{
			errno = (as->*func_u8)(arr.bin_rx[1]);
			atmega_uart::tx_byte(errno);
		}
		else//Transmit error.
		{
			atmega_uart::tx_byte(ER_BIN_INV_PARAM);
		}
		return errno;
	}
	else//ASCII or MatLab mode;
	{
		//Attempt to convert user input to number.
		number = string_to_u32(rx_array, &errno);
		
		if(errno)//Exit if invalid integer detected.
		{
			return ER_ERROR;
		}
		
		//Update parameter.
		errno = (as->*func_u8)(number);
		
		if(errno)
		{
			return ER_ERROR;
		}
		
		return ER_NO_ERROR;
	}
}

//Set value in as_class object that is a signed 16 bit value (ASCII).
uint8_t set_int16(const uint8_t *rx_array, as_class *as, uint8_t (as_class::*func_int16)(int16_t))
{
	uint8_t errno;
	int16_t number;
	
	if(as->get_tx_mode() == TX_MODE_BIN)//Binary mode.
	{
		if(bin_index == 3)
		{
			errno = (as->*func_int16)(load_u16(&(arr.bin_rx[1])));
			atmega_uart::tx_byte(errno);
		}
		else//Transmit error.
		{
			atmega_uart::tx_byte(ER_BIN_INV_PARAM);
		}
		return errno;
	}
	else//ASCII or MatLab mode.
	{
		//Attempt to convert user input to number.
		number = string_to_int(rx_array, &errno);
		
		if(errno)	//Exit if invalid integer detected.
		{
			return ER_ERROR;
		}
		
		//Update parameter.
		errno = (as->*func_int16)(number);
		
		if(errno)
		{
			return ER_ERROR;
		}
		
		return ER_NO_ERROR;
	}
}

//Set value in as_class object that is an unsigned 16 bit value (ASCII).
uint8_t set_u16(const uint8_t *rx_array, as_class *as, uint8_t (as_class::*func_u16)(uint16_t))
{
	uint8_t errno;
	uint32_t number;
	
	if(as->get_tx_mode() == TX_MODE_BIN)//Binary mode.
	{
		if(bin_index == 3)
		{
			errno = (as->*func_u16)(load_u16(&(arr.bin_rx[1])));
			atmega_uart::tx_byte(errno);
		}
		else//Transmit error.
		{
			atmega_uart::tx_byte(ER_BIN_INV_PARAM);
		}
		return errno;
	}
	else//ASCII or MatLab mode.
	{
		//Attempt to convert user input to number.
		number = string_to_u32(rx_array, &errno);
		
		if(errno)//Exit if invalid integer detected.
		{
			return ER_ERROR;
		}
		
		//Update parameter.
		errno = (as->*func_u16)(number);
		
		if(errno)
		{
			return ER_ERROR;
		}
		
		return ER_NO_ERROR;
	}
}

//Set value in as_class object that is an unsigned 32 bit value (ASCII).
uint8_t set_u32(const uint8_t *rx_array, as_class *as, uint8_t (as_class::*func_u32)(uint32_t))
{
	uint8_t errno;
	uint32_t number;
	
	if(as->get_tx_mode() == TX_MODE_BIN)//Binary mode.
	{
		if(bin_index == 5)
		{
			errno = (as->*func_u32)(load_u32(&(arr.bin_rx[1])));
			atmega_uart::tx_byte(errno);
		}
		else//Transmit error.
			atmega_uart::tx_byte(ER_BIN_INV_PARAM);
		return errno;
	}
	else//ASCII or MatLab mode.
	{
		//Attempt to convert user input to number.
		number = string_to_u32(rx_array, &errno);
		
		if(errno)//Exit if invalid integer detected.
			return ER_ERROR;
		
		//Update parameter.
		errno = (as->*func_u32)(number);
		
		if(errno)
			return ER_ERROR;
		
		return ER_NO_ERROR;
	}
}

//Update input array function(binary).
void bin_build_array(uint8_t rx_byte)
{
	//Exit if an overflow occurred.  The tokenizer needs to clear it
	//before any new data can be processed.
	if(bin_overflowed)
	{
		return;
	}
	
	//Add byte to array.
	arr.bin_rx[bin_index++] = rx_byte;
	
	//Array overflow, error and reset array.
	if(bin_index >= BIN_RX_LENGTH)
	{
		bin_index = 0;
		atmega_uart::tx_byte(ER_BIN_AR_OVERFLOW);
		bin_overflowed = true;
	}
}

//Tokenize binary array function.
void bin_tokenize(as_class *as)
{	
	int16_t start_v, end_v, temp1;
	uint16_t rate, entries, ent, temp2;
	
	//Reset overflow and exit. This prevents partial
	//strings from corrupting the settings.
	if(bin_overflowed)
	{
		bin_overflowed = false;
		return;
	}
	
	//Get command byte and act accordingly.
	switch (arr.bin_rx[0])
	{
		case BIN_GET_TX1://Transmit tx mode character.
		case BIN_GET_TX2:
			if(bin_index == 1)
				atmega_uart::tx_byte('B');
			else//Transmit error.
				atmega_uart::tx_byte(ER_BIN_INV_PARAM);
		break;
		
		case BIN_STRT_LIN1://Start linear sweep test.
		case BIN_STRT_LIN2:
			if(bin_index == 1)
			{
				as->set_test_type(TEST_LIN);
				as->set_test_state(DEP_INIT);
			}
			else//Transmit error.
				atmega_uart::tx_byte(ER_BIN_INV_PARAM);
		break;
		
		case BIN_STRT_DIF1://Start square wave test.
		case BIN_STRT_DIF2:
			if(bin_index == 1)
			{
				as->set_test_type(TEST_DIF);
				as->set_test_state(DEP_INIT);
			}
			else//Transmit error.
				atmega_uart::tx_byte(ER_BIN_INV_PARAM);
		break;
		
		case BIN_STRT_ARB1://Start arbitrary waveform test.
		case BIN_STRT_ARB2:
			if(bin_index == 1)
			{
				as->set_test_type(TEST_ARB);
				as->set_test_state(DEP_INIT);
			}
			else//Transmit error.
				atmega_uart::tx_byte(ER_BIN_INV_PARAM);
		break;
		
		case BIN_TX://Change transmission mode.
			if(bin_index == 2)
				switch (arr.bin_rx[1])
				{
					case 'A'://Set to ASCII mode.
					case 'a':
						as->set_tx_mode(TX_MODE_ASCII);
						atmega_uart::tx_byte(ER_BIN_NO_ERR);
					break;
					case 'M'://Set to MatLab mode.
					case 'm':
						as->set_tx_mode(TX_MODE_MATLAB);
						atmega_uart::tx_byte(ER_BIN_NO_ERR);
					break;
					case 'B'://Set to binary mode.
					case 'b':
						atmega_uart::tx_byte(ER_BIN_NO_ERR);
					break;
					default:
						atmega_uart::tx_byte(ER_BIN_INV_PARAM);
					break;
				}
			else//Transmit error.
				atmega_uart::tx_byte(ER_BIN_INV_PARAM);
		break;
		
		case BIN_ELECS://Change number of electrodes.
			if(bin_index == 2)
			{
				if(arr.bin_rx[1] == 0x02)
				{
					as->set_num_electrodes(ELEC_2);
					void i2c_load_electrodes(as_class *as);
					atmega_uart::tx_byte(ER_BIN_NO_ERR);
				}
				else if(arr.bin_rx[1] == 0x03)
				{
					as->set_num_electrodes(ELEC_3);
					void i2c_load_electrodes(as_class *as);
					atmega_uart::tx_byte(ER_BIN_NO_ERR);
				}
				else//Transmit error.
				{
					atmega_uart::tx_byte(ER_BIN_INV_PARAM);
				}
			}
			else//Transmit error.
				atmega_uart::tx_byte(ER_BIN_INV_PARAM);
		break;
		
		case BIN_ADC:
			set_u16(&(arr.bin_rx[1]), as, &as_class::set_adc_rate);
		break;
		
		case BIN_SET://Transmit settings.
			if(bin_index == 1)
			{
				atmega_uart::tx_byte(BIN_FIRM_HI);
				atmega_uart::tx_byte(BIN_FIRM_LO);
				atmega_uart::tx_byte(BIN_PID1);
				atmega_uart::tx_byte(BIN_PID2);
				atmega_uart::tx_byte(BIN_PID3);
				atmega_uart::tx_byte(BIN_PID4);
				(as->get_num_electrodes() == ELEC_2) ? atmega_uart::tx_byte(0x02) : atmega_uart::tx_byte(0x03);
				atmega_uart::tx_word(as->get_adc_rate());
				atmega_uart::tx_byte(as->get_tia_res());
				atmega_uart::tx_tf(as->get_dep_enable());
				atmega_uart::tx_dword(as->get_dep_time());
				atmega_uart::tx_word(as->get_dep_volt());
				atmega_uart::tx_dword(as->get_quiet_time());
				atmega_uart::tx_tf(as->get_dep_rec());
				atmega_uart::tx_word(as->get_sweep_volt_start());
				atmega_uart::tx_word(as->get_sweep_volt_end());
				atmega_uart::tx_word(as->get_sweep_rate());
				atmega_uart::tx_tf(as->get_sweep_cyclic());
				atmega_uart::tx_byte(as->get_sweep_cycles());
				atmega_uart::tx_word(as->get_dif_volt_start());
				atmega_uart::tx_word(as->get_dif_volt_end());
				atmega_uart::tx_word(as->get_dif_volt_inc());
				atmega_uart::tx_word(as->get_dif_volt_pls());
				atmega_uart::tx_word(as->get_dif_time_pre());
				atmega_uart::tx_word(as->get_dif_time_pls());
				atmega_uart::tx_word(as->get_dif_time_win());
				atmega_uart::tx_word(fram1_read_word(ARB_NUM));
				atmega_uart::tx_byte(as->get_soft_sel());	
			}
			else//Transmit error.
				atmega_uart::tx_byte(ER_BIN_INV_PARAM);
		break;
		
		case BIN_RES: //Set TIA resistor.
			set_u8(&(arr.bin_rx[1]), as, &as_class::set_tia_res);
			i2c_load_res(as);
		break;
		
		case BIN_DEP_EN://Enable deposition sequence.
			set_bool(&(arr.bin_rx[1]), as, &as_class::set_dep_enable);
		break;
		
		case BIN_DEP_T://Change deposition time.
			set_u32(&(arr.bin_rx[1]), as, &as_class::set_dep_time);
		break;
		
		case BIN_DEP_V://Set deposition voltage.
			set_int16(&(arr.bin_rx[1]), as, &as_class::set_dep_volt);
		break;
		
		case BIN_QUIET_T://Set quiet time.
			set_u32(&(arr.bin_rx[1]), as, &as_class::set_quiet_time);
		break;
		
		case BIN_DEP_REC://Enable deposition recording.
			set_bool(&(arr.bin_rx[1]), as, &as_class::set_dep_rec);
		break;
		
		case BIN_LIN_SV://Set linear sweep start voltage.
			set_int16(&(arr.bin_rx[1]), as, &as_class::set_sweep_volt_start);
		break;
		
		case BIN_LIN_EV://Set linear sweep end voltage.
			set_int16(&(arr.bin_rx[1]), as, &as_class::set_sweep_volt_end);
		break;
		
		case BIN_LIN_SR://Set linear sweep rate.
			set_u16(&(arr.bin_rx[1]), as, &as_class::set_sweep_rate);
		break;
		
		case BIN_LIN_C://Enable linear sweep cyclic voltammetry.
			set_bool(&(arr.bin_rx[1]), as, &as_class::set_sweep_cyclic);
		break;
		
		case BIN_LIN_CS://Set number of linear sweep cycles.
			set_u8(&(arr.bin_rx[1]), as, &as_class::set_sweep_cycles);
		break;
		
		case BIN_DIF_SV://Set dif pulse start voltage.
			//Get data from input.
			start_v = load_int16(&arr.bin_rx[1]);
				
			//Check to make sure range is valid.
			if(start_v + as->get_dif_volt_pls() > DIF_VOLT_MAX)
				atmega_uart::tx_byte(ER_BIN_DIF_RANGE);
			else if(start_v + as->get_dif_volt_pls() < DIF_VOLT_MIN)
				atmega_uart::tx_byte(ER_BIN_DIF_RANGE);
			else
				set_int16(&(arr.bin_rx[1]), as, &as_class::set_dif_volt_start);
		break;
		
		case BIN_DIF_EV://Set dif pulse end voltage.
			//Get data from input.
			end_v = load_int16(&arr.bin_rx[1]);
			
			//Check to make sure range is valid.
			if(end_v + as->get_dif_volt_pls() > DIF_VOLT_MAX)
				atmega_uart::tx_byte(ER_BIN_DIF_RANGE);
			else if(end_v + as->get_dif_volt_pls() < DIF_VOLT_MIN)
				atmega_uart::tx_byte(ER_BIN_DIF_RANGE);
			else
				set_int16(&(arr.bin_rx[1]), as, &as_class::set_dif_volt_end);
		break;
		
		case BIN_DIF_INC://Set dif pulse increment voltage.
			set_u16(&(arr.bin_rx[1]), as, &as_class::set_dif_volt_inc);
		break;
		
		case BIN_DIF_AMP://Set dif pulse amplitude voltage.
			//Get data from input.
			temp1 = load_int16(&arr.bin_rx[1]);
			
			//Check to make sure range is valid.
			if(temp1 + as->get_dif_volt_start() > DIF_VOLT_MAX)
				atmega_uart::tx_byte(ER_BIN_DIF_RANGE);
			else if(temp1 + as->get_dif_volt_start() < DIF_VOLT_MIN)
				atmega_uart::tx_byte(ER_BIN_DIF_RANGE);
			else if(temp1 + as->get_dif_volt_end() > DIF_VOLT_MAX)
				atmega_uart::tx_byte(ER_BIN_DIF_RANGE);
			else if(temp1 + as->get_dif_volt_end() < DIF_VOLT_MIN)
				atmega_uart::tx_byte(ER_BIN_DIF_RANGE);
			else
				set_int16(&(arr.bin_rx[1]), as, &as_class::set_dif_volt_pls);
		break;
		
		case BIN_DIF_PRE://Set dif pulse pre-pulse time.
			//Get data from input.
			temp2 = load_u16(&arr.bin_rx[1]);
			
			//Check to make sure range is valid.
			if(temp2 < as->get_dif_time_win())
				atmega_uart::tx_byte(ER_BIN_SAMP_WIN);
			else
				set_u16(&(arr.bin_rx[1]), as, &as_class::set_dif_time_pre);
		break;
		
		case BIN_DIF_PLS://Set dif pulse time.
			//Get data from input.
			temp2 = load_u16(&arr.bin_rx[1]);
			
			//Check to make sure range is valid.
			if(temp2 < as->get_dif_time_win())
				atmega_uart::tx_byte(ER_BIN_SAMP_WIN);
			else
				set_u16(&(arr.bin_rx[1]), as, &as_class::set_dif_time_pls);
		break;
		
		case BIN_DIF_WIN://Set dif pulse sampling window length.		
			//Get data from input.
			temp2 = load_u16(&arr.bin_rx[1]);
			
			//Check to make sure range is valid.
			if(temp2 > as->get_dif_time_pre())
				atmega_uart::tx_byte(ER_BIN_SAMP_WIN);
			else if(temp2 > as->get_dif_time_pls())
				atmega_uart::tx_byte(ER_BIN_SAMP_WIN);
			else
				set_u16(&(arr.bin_rx[1]), as, &as_class::set_dif_time_win);
		break;
		
		case BIN_ARB_AE://Append arbitrary waveform entry
			
			if(bin_index == 7)
			{
				//Get number of entries already in list.
				entries = fram1_read_word(ARB_NUM);
				
				//Error out if memory is already full.
				if(entries >= ARB_ENTRIES_MAX)
				{
					atmega_uart::tx_byte(ER_BIN_MEM_FULL);
					break;
				}
				
				//Get numbers out of the array.
				start_v = load_int16(&arr.bin_rx[1]);
				end_v = load_int16(&arr.bin_rx[3]);
				rate = load_u16(&arr.bin_rx[5]);
				
				//Make sure the number falls within the proper range.
				if(start_v > ARB_VOLT_MAX)
				{
					atmega_uart::tx_byte(ER_BIN_VAL_HIGH);
					break;
				}
				else if(start_v < ARB_VOLT_MIN)
				{
					atmega_uart::tx_byte(ER_BIN_VAL_LOW);
					break;
				}
				if(end_v > ARB_VOLT_MAX)
				{
					atmega_uart::tx_byte(ER_BIN_VAL_HIGH);
					break;
				}
				else if(end_v < ARB_VOLT_MIN)
				{
					atmega_uart::tx_byte(ER_BIN_VAL_LOW);
					break;
				}
				if(rate > ARB_RATE_MAX)
				{
					atmega_uart::tx_byte(ER_BIN_VAL_HIGH);
					break;
				}
				else if(rate < ARB_RATE_MIN)
				{
					atmega_uart::tx_byte(ER_BIN_VAL_LOW);
					break;
				}
				
				//Save values in the EEPROM.
				fram1_write_word(ARB_START + 6 * entries, start_v);
				fram1_write_word(ARB_START + 2 + 6 * entries, end_v);
				fram1_write_word(ARB_START + 4 + 6 * entries, rate);
				
				//Update number of entries stored.
				fram1_write_word(ARB_NUM, entries + 1);
				
				atmega_uart::tx_byte(ER_BIN_NO_ERR);
			}
			else//Transmit error.
				atmega_uart::tx_byte(ER_BIN_INV_PARAM);
		break;
		
		case BIN_ARB_RE://Replace arbitrary waveform entry.
			if(bin_index == 8)
			{
				//Get number of entries already in list.
				entries = fram1_read_word(ARB_NUM);
				
				//Get numbers out of the array.
				ent = arr.bin_rx[1];
				start_v = load_int16(&arr.bin_rx[2]);
				end_v = load_int16(&arr.bin_rx[4]);
				rate = load_u16(&arr.bin_rx[6]);
				
				//Make sure the number falls within the proper range.
				if(ent < 1)
				{
					atmega_uart::tx_byte(ER_BIN_VAL_LOW);
					break;
				}
				if(ent > entries)
				{
					atmega_uart::tx_byte(ER_BIN_VAL_HIGH);
					break;
				}
				if(start_v > ARB_VOLT_MAX)
				{
					atmega_uart::tx_byte(ER_BIN_VAL_HIGH);
					break;
				}
				else if(start_v < ARB_VOLT_MIN)
				{
					atmega_uart::tx_byte(ER_BIN_VAL_LOW);
					break;
				}
				if(end_v > ARB_VOLT_MAX)
				{
					atmega_uart::tx_byte(ER_BIN_VAL_HIGH);
					break;
				}
				else if(end_v < ARB_VOLT_MIN)
				{
					atmega_uart::tx_byte(ER_BIN_VAL_LOW);
					break;
				}
				if(rate > ARB_RATE_MAX)
				{
					atmega_uart::tx_byte(ER_BIN_VAL_HIGH);
					break;
				}
				else if(rate < ARB_RATE_MIN)
				{
					atmega_uart::tx_byte(ER_BIN_VAL_LOW);
					break;
				}
				
				//Save values in the EEPROM.
				fram1_write_word(ARB_START + 6 * (ent - 1), start_v);
				fram1_write_word(ARB_START + 2 + 6 * (ent - 1), end_v);
				fram1_write_word(ARB_START + 4 + 6 * (ent - 1), rate);
				
				atmega_uart::tx_byte(ER_BIN_NO_ERR);
			}
			else//Transmit error.
				atmega_uart::tx_byte(ER_BIN_INV_PARAM);
			
		break;
		
		case BIN_ARB_DLE://Delete last arbitrary waveform entry.
					
			//Get number of entries already in list.
			entries = fram1_read_word(ARB_NUM);
			
			if(entries)//decrement and save.
				fram1_write_word(ARB_NUM, entries - 1);
			
			atmega_uart::tx_byte(ER_BIN_NO_ERR);
		break;
		
		case BIN_ARB_DAE://Delete all arbitrary waveform entries.
			fram1_write_word(ARB_NUM, 0);
			atmega_uart::tx_byte(ER_BIN_NO_ERR);
		break;
		
		case BIN_ARB_SV://Get stored arbitrary waveform entries.
					
			//Get number of entries already in list.
			entries = fram1_read_word(ARB_NUM);
			
			if(!entries)//If no entries, exit.
			{
				atmega_uart::tx_byte(ER_BIN_NO_ERR);
				break;
			}
			
			for (uint8_t i = 0; i < entries; i++)//Transmit stored contents.
			{
				atmega_uart::tx_word(fram1_read_word(ARB_START + 6 * i));
				atmega_uart::tx_word(fram1_read_word(ARB_START + 2 + 6 * i));
				atmega_uart::tx_word(fram1_read_word(ARB_START + 4 + 6 * i));
			}
		break;
		
		case BIN_LPF_SF://Set low-pass filter selection.
			set_u8(&(arr.bin_rx[1]), as, &as_class::set_soft_sel);
		break;
		
		default://Unrecognized command.
			atmega_uart::tx_byte(ER_BIN_INV_CMD);
		break;
	}
	
	//Reset index for next string.
	bin_index = 0;
}
