#include <avr/io.h>
#include <avr/interrupt.h>
#include <avr/pgmspace.h>
#include <stddef.h>
#include <math.h>
#include "atmega_spi.h"
#include "atmega_twi.h"
#include "atmega_uart.h"
#include "atmega_eeprom.h"
#include "as_class.h"
#include "helper.h"
#include "AquaSift_V0011.h"

uint32_t ms_counter;
uint8_t bin_timeout;
as_class as;

int main(void)
{	
	//Setup processor.
	init_processor(&as);
	
	//Set initial value of tia resistor.
	i2c_load_pot(&as);
	
	while(1);
}

//Interrupt based UART RX function.
ISR(USART_RX_vect)
{
	uint8_t rx_byte;
	
	rx_byte = UDR0;	//Get RX byte.
	
	//Check if in binary mode.
	if (as.get_tx_mode() == TX_MODE_BIN)
	{
		//Build input array when idle.
		if(as.get_test_state() == IDLE)
		{
			//Start timeout timer.
			bin_timeout = 1;
			
			//Add byte to array.
			bin_build_array(rx_byte);
		}
		//If not idle and 'x' is received, abort test.
		else if(rx_byte == 'x' || rx_byte == 'X')
		{
			as.set_test_state(ABORT);
		}
	}
	else//Must be in ASCII or MatLab mode.
	{		
		//Go to tokenizer when idle.
		if(as.get_test_state() == IDLE)
		{
			//Pass byte to tokenizer.
			uart_tokenizer(rx_byte, &as);
		}
		//If not idle and 'x' is pressed, abort test.
		else if(rx_byte == 'x' || rx_byte == 'X')
		{
			as.set_test_state(ABORT);
		}
	}
}

//16-bit timer used for 1 ms system timing.
ISR(TIMER1_COMPA_vect)
{
	static int32_t voltage, temp;
	static double sv, ev, rate, this_offset, sq_amp;
	static uint32_t samp_count;
	static uint16_t output, temp_adc;
	static uint8_t this_cyc, tot_cyc, slope, graph_cycles, square_half;
	
	PORTB |= (1 << PORTB0);
	
	switch (as.get_test_state())
	{
		case IDLE://Maintenance stuff that happens every millisecond.
			ms_counter = 0;
			samp_count = 0;
			
			//Binary transmission timeout handling stuff.
			//Binary transmissions have to rely on a timeout function to
			//determine when to evaluate an array because the array can
			//have any combination of characters so a terminating character
			//is not possible as in the ASCII transmission mode.
			if(bin_timeout > 0 && bin_timeout <= BIN_TIME_MAX)
			{
				bin_timeout++;
			}
			
			//If timeout occurs, evaluate input array.
			if(bin_timeout >= BIN_TIME_MAX)
			{
				bin_timeout = 0;
				bin_tokenize(&as);
			}
		break;
		
		case DEP_INIT:
			i2c_connect_ce();//Always connect counter electrode.
			
			//Zero out sample counter.
			samp_count = 0;
			
			//Always print header if in MatLab mode.
			if(as.get_tx_mode() == TX_MODE_MATLAB)
			{
				//send all parameters in MatLab format.
				uart_print_settings(&as);
			}
			
			if(as.get_dep_enable())//Prep for deposition.
			{
				
				//Create MatLab array for deposition currents if they are to be streamed.
				if(as.get_dep_rec() && as.get_tx_mode() == TX_MODE_MATLAB)
				{
					atmega_uart::tx_string_p(PSTR("d=["));
				}
				//Send ASCII deposition data word.
				else if(as.get_dep_rec() && as.get_tx_mode() == TX_MODE_ASCII)
				{
					tx_u16_to_ascii(DEP_DATA);
					atmega_uart::tx_byte(',');
				}
				//send binary deposition word.
				else if(as.get_dep_rec() && as.get_tx_mode() == TX_MODE_BIN)
				{
					atmega_uart::tx_word(DEP_DATA);
				}
				
				//Set deposition voltage.
				voltage = ZERO_VOLT + (1000L * as.get_dep_volt() / V_PER_COUNT);
				write_dac(voltage);
				
				//move to next state.
				as.set_test_state(DEPOSIT);
			}
			else//Skip deposition and quiet time.
			{
				if(as.get_test_type() == TEST_LIN)
				{
					as.set_test_state(RAMP_INIT);//Start linear sweep test.
				}
				else if(as.get_test_type() == TEST_SQR)
				{
					as.set_test_state(SQUARE_INIT);//Start square wave test.
				}
				else
				{
					as.set_test_state(ARB_INIT);//Start arbitrary waveform test.
				}
			}	
		break;
		 
		case DEPOSIT:
			if(ms_counter < as.get_dep_time())
			{
				if(as.get_soft_filt())//Use filter.
				{
					output = lpf(read_adc(), &as);
				}
				else//Do not use software filter.
				{
					output = read_adc();
				}
				
				//Check if time to transmit another sample.
				if((!(ms_counter % as.get_adc_rate())) && as.get_dep_rec())
				{
					//Print MatLab data.
					if(as.get_tx_mode() == TX_MODE_MATLAB)
					{
						tx_u16_to_ascii(output);
						atmega_uart::tx_byte(',');
						
						//Indicate a new sample has been sent.
						samp_count++;
						
						//Start newline if 10 or more samples on this line.
						if(samp_count && !(samp_count % 10))
						{
							atmega_uart::tx_string_p(PSTR("...\r"));
						}
					}
					//Print ASCII data.
					else if(as.get_tx_mode() == TX_MODE_ASCII)
					{
						tx_u16_to_ascii(output);
						atmega_uart::tx_byte(',');
					}
					//Print binary data.
					else
					{
						atmega_uart::tx_word(output);
					}
				}
				
				ms_counter++;//Always increment counter.
			}
			else
			{
				as.set_test_state(DEP_STOP);//Stop deposition.
			}
		break;
		
		case DEP_STOP:
			//Print end character if deposition is being recorded.
			if(as.get_dep_rec())
			{
				//Print MatLab data.
				if(as.get_tx_mode() == TX_MODE_MATLAB)
				{
					atmega_uart::tx_string_p(PSTR("];\r\r"));
				}
				//Print ASCII data.
				else if(as.get_tx_mode() == TX_MODE_ASCII)
				{
					tx_u16_to_ascii(END_BLOCK);
					atmega_uart::tx_byte(',');
				}
				//Print binary data.
				else
				{
					atmega_uart::tx_word(END_BLOCK);
				}
			}
			
			if(as.get_quiet_time())
			{
				//Start quiet time.
				as.set_test_state(QUIET_INIT);
			}
			else if(as.get_test_type() == TEST_LIN)
			{
				//Start linear sweep.
				as.set_test_state(RAMP_INIT);
			}
			else if(as.get_test_type() == TEST_SQR)
			{
				//Start square wave.
				as.set_test_state(SQUARE_INIT);
			}
			else
			{
				//Start arbitrary waveform.
				as.set_test_state(ARB_INIT);
			}	
		break;
		
		case QUIET_INIT:
			//Zero out sample counter.
			samp_count = 0;
			
			//Zero out ms counter.
			ms_counter = 0;
			
			//Create MatLab array for quiet time currents if they are to be streamed.
			if(as.get_dep_rec() && as.get_tx_mode() == TX_MODE_MATLAB)
			{
				atmega_uart::tx_string_p(PSTR("q=["));
			}
			//Send ASCII deposition data word.
			else if(as.get_dep_rec() && as.get_tx_mode() == TX_MODE_ASCII)
			{
				tx_u16_to_ascii(QUIET_DATA);
				atmega_uart::tx_byte(',');
			}
			//send binary deposition word.
			else if(as.get_dep_rec() && as.get_tx_mode() == TX_MODE_BIN)
			{
				atmega_uart::tx_word(QUIET_DATA);
			}
			
			//move to next state.
			as.set_test_state(QUIET);
		break;
		
		case QUIET:
			if(ms_counter < as.get_quiet_time())
			{
				if(as.get_soft_filt())//Use filter.
				{
					output = lpf(read_adc(), &as);
				}
				else//Do not use software filter.
				{
					output = read_adc();
				}
				
				//Check if time to transmit another sample.
				if((!(ms_counter % as.get_adc_rate())) && as.get_dep_rec())
				{
					//Print MatLab data.
					if(as.get_tx_mode() == TX_MODE_MATLAB)
					{
						tx_u16_to_ascii(output);
						atmega_uart::tx_byte(',');
						
						//Indicate a new sample has been sent.
						samp_count++;
						
						//Start newline if 10 or more samples on this line.
						if(samp_count && !(samp_count % 10))
						{
							atmega_uart::tx_string_p(PSTR("...\r"));
						}
					}
					//Print ASCII data.
					else if(as.get_tx_mode() == TX_MODE_ASCII)
					{
						tx_u16_to_ascii(output);
						atmega_uart::tx_byte(',');
					}
					//Print binary data.
					else
					{
						atmega_uart::tx_word(output);
					}
				}
				
				ms_counter++;//Always increment counter.
			}
			else
			{
				as.set_test_state(QUIET_STOP);//Stop quiet time.
			}
		break;
		
		case QUIET_STOP:
			//Print end character if quiet time is being recorded.
			if(as.get_dep_rec())
			{
				//Print MatLab data.
				if(as.get_tx_mode() == TX_MODE_MATLAB)
				{
					atmega_uart::tx_string_p(PSTR("];\r\r"));
				}
				//Print ASCII data.
				else if(as.get_tx_mode() == TX_MODE_ASCII)
				{
					tx_u16_to_ascii(END_BLOCK);
					atmega_uart::tx_byte(',');
				}
				//Print binary data.
				else
				{
					atmega_uart::tx_word(END_BLOCK);
				}
			}
			
			if(as.get_test_type() == TEST_LIN)
			{
				//Start linear sweep.
				as.set_test_state(RAMP_INIT);
			}
			else if(as.get_test_type() == TEST_SQR)
			{
				//Start square wave.
				as.set_test_state(SQUARE_INIT);
			}
			else
			{
				//Start arbitrary waveform.
				as.set_test_state(ARB_INIT);
			}
		break;
		
		case RAMP_INIT:
			//Initialize variables.
			this_cyc = 1;
			samp_count = 0;
			tot_cyc = as.get_sweep_cycles() * 2;
			sv = ZERO_VOLT + (1000.0 * (double)as.get_sweep_volt_start() / V_PER_COUNT);
			ev = ZERO_VOLT + (1000.0 * (double)as.get_sweep_volt_end() / V_PER_COUNT);
			rate = (double)as.get_sweep_rate();	
			ms_counter = 0;	
			
			//Determine initial slope.
			if(sv < ev)
			{
				slope = POS_SLOPE;
			}
			else
			{
				slope = NEG_SLOPE;
			}
			
			//Print initial stream data.
			if(as.get_tx_mode() == TX_MODE_MATLAB)//Print MatLab data.
			{
				atmega_uart::tx_byte('s');
				tx_u16_to_ascii(this_cyc);
				atmega_uart::tx_string_p(PSTR("=["));
			}
			else if(as.get_tx_mode() == TX_MODE_ASCII)//Print ASCII data.
			{
				tx_u16_to_ascii(LIN_DATA + this_cyc);
				atmega_uart::tx_byte(',');
			}
			else//Print binary data.
			{
				atmega_uart::tx_word(LIN_DATA + this_cyc);
			}
			
			write_dac((uint16_t)round(sv));//Write initial DAC value.
			i2c_connect_ce();//Always connect counter electrode.
			ms_counter++;//Always increment counter.
			as.set_test_state(RAMP);
		break;
		
		case RAMP:
			//Calculate current offset for the DAC.
			this_offset = rate * (double)ms_counter / V_PER_COUNT;
			
			if(slope == POS_SLOPE)//Positive slope.
			{
				if(sv + this_offset < ev)//More to go.
				{
					if(as.get_soft_filt())//Use filter.
					{
						output = lpf(read_adc(), &as);
					}
					else//Do not use software filter.
					{
						output = read_adc();
					}
					
					//Check if time to transmit another sample.
					if(!(ms_counter % as.get_adc_rate()))
					{
						//Print MatLab data.
						if(as.get_tx_mode() == TX_MODE_MATLAB)
						{
							tx_u16_to_ascii(output);
							atmega_uart::tx_byte(',');
							
							//Indicate a new sample has been sent.
							samp_count++;
							
							//Start newline if 10 or more samples on this line.
							if(samp_count && !(samp_count % 10))
							{
								atmega_uart::tx_string_p(PSTR("...\r"));
							}
						}
						//Print ASCII data.
						else if(as.get_tx_mode() == TX_MODE_ASCII)
						{
							tx_u16_to_ascii(output);
							atmega_uart::tx_byte(',');
						}
						//Print binary data.
						else
						{
							atmega_uart::tx_word(output);
						}
				    }
				}
				else//Done.
				{
					as.set_test_state(RAMP_STOP);
					
					//Print MatLab data.
					if(as.get_tx_mode() == TX_MODE_MATLAB)
					{
						atmega_uart::tx_string_p(PSTR("];\r\r"));
					}
					//Print ASCII data.
					else if(as.get_tx_mode() == TX_MODE_ASCII)
					{
						tx_u16_to_ascii(END_BLOCK);
						atmega_uart::tx_byte(',');
					}
					//Print binary data.
					else
					{
						atmega_uart::tx_word(END_BLOCK);
					}
				}
				write_dac((uint16_t)round(sv + this_offset)); //Load value into the DAC.
			}
			
			else//Negative slope.
			{				
				if(sv - this_offset > ev)//More to go.
				{
					if(as.get_soft_filt())//Use filter.
					{
						output = lpf(read_adc(), &as);
					}
					else//Do not use software filter.
					{
						output = read_adc();
					}
					
					//Check if time to transmit another sample.
					if(!(ms_counter % as.get_adc_rate()))
					{
						//Print MatLab data.
						if(as.get_tx_mode() == TX_MODE_MATLAB)
						{
							tx_u16_to_ascii(output);
							atmega_uart::tx_byte(',');
							
							//Indicate a new sample has been sent.
							samp_count++;
							
							//Start newline if 10 or more samples on this line.
							if(samp_count && !(samp_count % 10))
							{
								atmega_uart::tx_string_p(PSTR("...\r"));
							}
						}
						//Print ASCII data.
						else if(as.get_tx_mode() == TX_MODE_ASCII)
						{
							tx_u16_to_ascii(output);
							atmega_uart::tx_byte(',');
						}
						//Print binary data.
						else
						{
							atmega_uart::tx_word(output);
						}
					}
				}
				
				else//Done.
				{
					as.set_test_state(RAMP_STOP);
					
					//Print MatLab data.
					if(as.get_tx_mode() == TX_MODE_MATLAB)
					{
						atmega_uart::tx_string_p(PSTR("];\r\r"));
					}
					//Print ASCII data.
					else if(as.get_tx_mode() == TX_MODE_ASCII)
					{
						tx_u16_to_ascii(END_BLOCK);
						atmega_uart::tx_byte(',');
					}
					//Print binary data.
					else
					{
						atmega_uart::tx_word(END_BLOCK);
					}
				}
				
				write_dac((uint16_t)round(sv - this_offset)); //Load value into the DAC.
			}
			
			ms_counter++;//Always increment counter.
		break;
		
		case RAMP_STOP:
			//Reset counter and sample counter.
			ms_counter = 0;
			samp_count = 0;
			
			//Next cycle.
			this_cyc++;
			
			if(as.get_sweep_cyclic() && (this_cyc <= tot_cyc))
			{
				//Change slope.
				slope ^= 0x01;
			
				//Swap start and end voltages.
				temp = sv;
				sv = ev;
				ev = temp;
				
				//Print initial stream data.
				if(as.get_tx_mode() == TX_MODE_MATLAB)//Print MatLab data.
				{
					atmega_uart::tx_byte('s');
					tx_u16_to_ascii(this_cyc);
					atmega_uart::tx_string_p(PSTR("=["));
				}
				else if(as.get_tx_mode() == TX_MODE_ASCII)//Print ASCII data.
				{
					tx_u16_to_ascii(LIN_DATA + this_cyc);
					atmega_uart::tx_byte(',');
				}
				else//Print binary data.
				{
					atmega_uart::tx_word(LIN_DATA + this_cyc);
				}
				
				as.set_test_state(RAMP);
			}
			else
			{
				//Disconnect counter electrode.
				i2c_disconnect_ce();
				//Zero out voltage and return to idle.
				write_dac(ZERO_VOLT);
				
				//Determine how many cycles need to be graphed.
				if(as.get_sweep_cyclic())
				{
					graph_cycles = tot_cyc;
				}
				else
				{
					graph_cycles = 1;
				}
				
				as.set_test_state(FOOTER);//Done.
			}	
		break;
			
		case SQUARE_INIT:
			//Initialize variables.
			samp_count = 0;
			ms_counter = 0;
			tot_cyc = 1;
			square_half = POS_HALF;
			this_offset = 0;
			sv = ZERO_VOLT + (1000.0 * (double)as.get_square_volt_start() / V_PER_COUNT);
			ev = ZERO_VOLT + (1000.0 * (double)as.get_square_volt_end() / V_PER_COUNT);
			sq_amp = 1000.0 * (double)as.get_square_amp() / V_PER_COUNT;
			
			//Determine initial slope.
			if(sv < ev)
			{
				slope = POS_SLOPE;
			}
			else
			{
				slope = NEG_SLOPE;
			}
		
			//Print initial stream data.
			if(as.get_tx_mode() == TX_MODE_MATLAB)//Print MatLab data.
			{
				atmega_uart::tx_byte('s');
				tx_u16_to_ascii(tot_cyc);
				atmega_uart::tx_string_p(PSTR("=["));
			}
			else if(as.get_tx_mode() == TX_MODE_ASCII)//Print ASCII data.
			{
				tx_u16_to_ascii(SQR_DATA + tot_cyc);
				atmega_uart::tx_byte(',');
			}
			else//Print binary data.
			{
				atmega_uart::tx_word(SQR_DATA + tot_cyc);
			}
		
			write_dac((uint16_t)round(sv + sq_amp));
			i2c_connect_ce();//Always connect counter electrode.
			
			as.set_test_state(SQUARE);
		break;
		
		case SQUARE:
			//Do stuff if time to switch square wave halves.
			if(ms_counter >= as.get_square_period())
			{
				if(slope == POS_SLOPE)//Positive slope.
				{
					if(sv + (int32_t)this_offset <= ev)//More to go.
					{
						if(square_half == POS_HALF)//Positive half cycle.
						{
							//Get sample.
							temp_adc = read_adc();
							
							//Update DAC with negative half cycle value.
							write_dac(sv + this_offset - sq_amp);
						}
						else//Negative half cycle.
						{
							//Get sample.
							output = read_adc();
							
							//Make sure this value is not greater than last value.  This can be due to noise.
							(output > temp_adc) ? temp_adc = 0 : temp_adc -= output;
							
							//temp_adc -= read_adc();
							
							output = temp_adc;
							
							//Print MatLab data.
							if(as.get_tx_mode() == TX_MODE_MATLAB)
							{
								tx_u16_to_ascii(output);
								atmega_uart::tx_byte(',');
								
								//Indicate a new sample has been sent.
								samp_count++;
								
								//Start newline if 10 or more samples on this line.
								if(samp_count && !(samp_count % 10))
								{
									atmega_uart::tx_string_p(PSTR("...\r"));
								}
							}
							//Print ASCII data.
							else if(as.get_tx_mode() == TX_MODE_ASCII)
							{
								tx_u16_to_ascii(output);
								atmega_uart::tx_byte(',');
							}
							//Print binary data.
							else
							{
								atmega_uart::tx_word(output);
							}
							
							//Update increment.
							this_offset += (1000L * as.get_square_inc() / V_PER_COUNT);
							
							if(sv + (int32_t)this_offset > ev)//Special stop case.
							{
								as.set_test_state(SQUARE_STOP);
							}
							else
							{
								//Update DAC with positive half cycle value.
								write_dac(sv + this_offset + sq_amp);
							}
						}
					}
					else//Ready to move on.
					{						
						as.set_test_state(SQUARE_STOP);
					}
				}
				else//Negative slope.
				{
					if(sv - (int32_t)this_offset >= ev)//More to go.
					{
						if(square_half == POS_HALF)//Positive half cycle.
						{
							//Get sample.
							temp_adc = read_adc();
							
							//Update DAC with negative half cycle value.
							write_dac(sv - this_offset - sq_amp);
						}
						else//Negative half cycle.
						{
							//Get sample.
							output = read_adc();
							
							//Make sure this value is not greater than last value.  This can be due to noise.
							(output > temp_adc) ? temp_adc = 0 : temp_adc -= output;
							
							//temp_adc -= read_adc();
							
							output = temp_adc;
							
							//Print MatLab data.
							if(as.get_tx_mode() == TX_MODE_MATLAB)
							{
								tx_u16_to_ascii(output);
								atmega_uart::tx_byte(',');
								
								//Indicate a new sample has been sent.
								samp_count++;
								
								//Start newline if 10 or more samples on this line.
								if(samp_count && !(samp_count % 10))
								{
									atmega_uart::tx_string_p(PSTR("...\r"));
								}
							}
							//Print ASCII data.
							else if(as.get_tx_mode() == TX_MODE_ASCII)
							{
								tx_u16_to_ascii(output);
								atmega_uart::tx_byte(',');
							}
							//Print binary data.
							else
							{
								atmega_uart::tx_word(output);
							}
							
							//Update increment.
							this_offset += (1000L * as.get_square_inc() / V_PER_COUNT);
							
							if(sv - (int32_t)this_offset < ev)//Special stop case.
							{
								as.set_test_state(SQUARE_STOP);
							}
							else
							{
								//Update DAC with positive half cycle value.
								write_dac(sv - this_offset + sq_amp);
							}
						}
					}
					else//Ready to move on.
					{
						as.set_test_state(SQUARE_STOP);
					}
				}
				
				ms_counter = 0;//Reset counter.
				square_half ^= 0x01;//Change to other square wave half.
			}
			ms_counter++;//Always Increment counter.
		break;
		
		case SQUARE_STOP:
			//Zero out voltage and return to idle.
			write_dac(ZERO_VOLT);
			
			//Disconnect counter electrode.
			i2c_disconnect_ce();
			
			graph_cycles = 1;//Get ready to graph.
			
			//Print MatLab data.
			if(as.get_tx_mode() == TX_MODE_MATLAB)
			{
				atmega_uart::tx_string_p(PSTR("];\r\r"));
			}
			//Print ASCII data.
			else if(as.get_tx_mode() == TX_MODE_ASCII)
			{
				tx_u16_to_ascii(END_BLOCK);
				atmega_uart::tx_byte(',');
			}
			//Print binary data.
			else
			{
				atmega_uart::tx_word(END_BLOCK);
			}
			
			as.set_test_state(FOOTER);//Done.
		break;
		
		
		
		
		
		
		
		
		
		
		
		case ARB_INIT:
			i2c_connect_ce();//Always connect counter electrode.
			atmega_uart::tx_string_p(PSTR("ARB_INIT\r"));
			as.set_test_state(IDLE);
		break;
		
		case ARB:
			atmega_uart::tx_string_p(PSTR("ARB\r"));
			as.set_test_state(IDLE);
		break;
		
		case ARB_STOP:
			atmega_uart::tx_string_p(PSTR("ARB_STOP\r"));
			as.set_test_state(IDLE);
		break;
		
		
		
		
		
		
		
		
		
		
		
		case FOOTER:
			//Only do stuff if in MatLab mode.
			if(as.get_tx_mode() == TX_MODE_MATLAB)
			{
				//Calculate TIA resistance value.
				atmega_uart::tx_string_p(PSTR("res=tia_rt*100000/1023;\r"));
				
				//Print deposition graph if it is active.
				if(as.get_dep_rec() && as.get_dep_enable())
				{
					atmega_uart::tx_string_p(PSTR("d_ua=((d-2047)*(3.3/4096)/res);\r"));
					atmega_uart::tx_string_p(PSTR("td=linspace(1,dep_t/1000,length(d_ua));\r"));
					atmega_uart::tx_string_p(PSTR("figure(1);\r"));
					atmega_uart::tx_string_p(PSTR("plot(td,d_ua);\r"));
					atmega_uart::tx_string_p(PSTR("ylabel('Current(A)');\r"));
					atmega_uart::tx_string_p(PSTR("xlabel('Time (s)');\r"));
					atmega_uart::tx_string_p(PSTR("title('Deposition Sequence');\r"));
					atmega_uart::tx_string_p(PSTR("grid on;\r\r"));
				}
				
				//Print quiet time graph if it is active.
				if(as.get_dep_rec() && as.get_dep_enable() && (as.get_quiet_time() > 0))
				{
					atmega_uart::tx_string_p(PSTR("q_ua=((q-2047)*(3.3/4096)/res);\r"));
					atmega_uart::tx_string_p(PSTR("tq=linspace(1,quiet_t/1000,length(q_ua));\r"));
					atmega_uart::tx_string_p(PSTR("figure(2);\r"));
					atmega_uart::tx_string_p(PSTR("plot(tq,q_ua);\r"));
					atmega_uart::tx_string_p(PSTR("ylabel('Current(A)');\r"));
					atmega_uart::tx_string_p(PSTR("xlabel('Time (s)');\r"));
					atmega_uart::tx_string_p(PSTR("title('Quiet Time Sequence');\r"));
					atmega_uart::tx_string_p(PSTR("grid on;\r\r"));
				}
				
				//Print voltammetry graphs.
				for(uint16_t i = 1; i <= graph_cycles; i++)
				{
					//First, convert all values to microamps.
					atmega_uart::tx_string_p(PSTR("s_ua"));
					tx_u16_to_ascii(i);
					atmega_uart::tx_string_p(PSTR("=((s"));
					tx_u16_to_ascii(i);
					
					//Only have positive and negative values for linear tests.
					if(as.get_test_type() == TEST_LIN)
						atmega_uart::tx_string_p(PSTR("-2047"));
					
					atmega_uart::tx_string_p(PSTR(")*(3.3/4096)/res);\r"));
					
					//Next, create time arrays.
					atmega_uart::tx_byte('t');
					tx_u16_to_ascii(i);
					atmega_uart::tx_string_p(PSTR("=linspace("));
					if(as.get_test_type() == TEST_SQR)
					{
						atmega_uart::tx_string_p(PSTR("square_vs/1000,square_ve/1000"));
					}
					else
					{
						atmega_uart::tx_string_p(PSTR("sweep_vs/1000,sweep_ve/1000"));
					}
					atmega_uart::tx_string_p(PSTR(",length(s_ua"));
					tx_u16_to_ascii(i);
					atmega_uart::tx_string_p(PSTR("));\r"));
					
					//Then, time reverse every other array.
					if(!(i % 2))
					{
						atmega_uart::tx_string_p(PSTR("s_ua"));
						tx_u16_to_ascii(i);
						atmega_uart::tx_string_p(PSTR("=fliplr(s_ua"));
						tx_u16_to_ascii(i);
						atmega_uart::tx_string_p(PSTR(");\r"));
					}
				}
				
				atmega_uart::tx_string_p(PSTR("figure(3);\r"));
				
				atmega_uart::tx_string_p(PSTR("plot("));
				for(uint16_t i = 1; i <= graph_cycles; i++)
				{
					atmega_uart::tx_byte('t');
					tx_u16_to_ascii(i);
					atmega_uart::tx_byte(',');
					atmega_uart::tx_string_p(PSTR("s_ua"));
					tx_u16_to_ascii(i);
					if(i < graph_cycles)
						atmega_uart::tx_byte(',');
					if(i != 0 && !(i % 5))
						atmega_uart::tx_string_p(PSTR("...\r"));
				}
				atmega_uart::tx_string_p(PSTR(");\r"));
				
				atmega_uart::tx_string_p(PSTR("ylabel('Current(A)');\r"));
				atmega_uart::tx_string_p(PSTR("xlabel('Volts(V)');\r"));
				
				//Customize title of graph.
				atmega_uart::tx_string_p(PSTR("title('"));
				if(graph_cycles > 1)
				{
					atmega_uart::tx_string_p(PSTR("Cyclic "));
				}
				
				//Determine test type.
				if(as.get_test_type() == TEST_LIN)
				{
					atmega_uart::tx_string_p(PSTR("Linear Sweep"));
				}
				else
				{
					atmega_uart::tx_string_p(PSTR("Square Wave"));
				}
				
				if(graph_cycles > 1)
				{
					atmega_uart::tx_string_p(PSTR(" ("));
					tx_u16_to_ascii(graph_cycles / 2);
					atmega_uart::tx_string_p(PSTR(" "));
					atmega_uart::tx_string_p(PSTR("Cycles)"));
				}
				atmega_uart::tx_string_p(PSTR("')\r"));
				
				atmega_uart::tx_string_p(PSTR("grid on;\r\r"));
			}
			else if(as.get_tx_mode() == TX_MODE_ASCII)
			{
				atmega_uart::tx_byte('\r');
			}
			
			as.set_test_state(IDLE);
		break;
		
		case ABORT:
			//Print message if in MatLab mode.
			if(as.get_tx_mode() == TX_MODE_MATLAB)
			{
				atmega_uart::tx_string_p(PSTR("Test Aborted\r"));
			}
			//Print ASCII stream code.
			else if(as.get_tx_mode() == TX_MODE_ASCII)
			{
				tx_u16_to_ascii(TEST_ABORT);
			}
			//Print binary stream code.	
			else
			{
				atmega_uart::tx_word(TEST_ABORT);
			}
			
		default://Unrecognized state or abort.
			//Disconnect counter electrode.
			i2c_disconnect_ce();
			//Zero out voltage and return to idle.
			write_dac(ZERO_VOLT);
			as.set_test_state(IDLE);
		break;
	}
	
	PORTB &= ~(1 << PORTB0);
}
