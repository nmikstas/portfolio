#include <avr/io.h>
#include <avr/interrupt.h>
#include <avr/pgmspace.h>
#include <stddef.h>
#include <math.h>
#include "atmega_spi.h"
#include "atmega_twi.h"
#include "atmega_uart.h"
#include "as_class.h"
#include "helper.h"
#include "AquaSift_V0012.h"

uint32_t ms_counter;
uint8_t bin_timeout;
as_class as;

int main(void)
{	
	//Setup processor.
	init_processor(&as);
	
	//Set initial value of tia resistor.
	i2c_load_res(&as);
	
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
	static int8_t slope, first;
	static uint8_t this_cyc, tot_cyc, graph_cycles;
	static int16_t this_voltage, start_v, end_v;
	static uint16_t output, rate_time, total_arbs, this_arb;
	static int32_t voltage;
	static uint32_t samp_count, eprom_index;
	static double sv, ev, rate, this_offset, temp;
	
	//PORTB |= (1 << PORTB0);//Toggle port for timing check.
	
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
				bin_timeout++;
			
			//If timeout occurs, evaluate input array.
			if(bin_timeout >= BIN_TIME_MAX)
			{
				bin_timeout = 0;
				bin_tokenize(&as);
			}
		break;
		
		case DEP_INIT:
			samp_count = 0;	//Zero out sample counter.
			
			i2c_connect_ce();//Always connect counter electrode.
			
			//Always print header if in MatLab mode.
			if(as.get_tx_mode() == TX_MODE_MATLAB)				
				uart_print_settings(&as);	//send all parameters in MatLab format.
			
			if(as.get_dep_enable())//Prep for deposition.
			{
				
				//Create MatLab array for deposition currents if they are to be streamed.
				if(as.get_dep_rec() && as.get_tx_mode() == TX_MODE_MATLAB)
					atmega_uart::tx_string_p(PSTR("d=["));
				//Send ASCII deposition data word.
				else if(as.get_dep_rec() && as.get_tx_mode() == TX_MODE_ASCII)
				{
					tx_u16_to_ascii(DEP_DATA);
					atmega_uart::tx_byte(',');
				}
				//send binary deposition word.
				else if(as.get_dep_rec() && as.get_tx_mode() == TX_MODE_BIN)
					atmega_uart::tx_word(DEP_DATA);
				
				//Set deposition voltage.
				voltage = ZERO_VOLT + (1000L * as.get_dep_volt() / V_PER_COUNT);
				write_dac(voltage);
				
				//move to next state.
				as.set_test_state(DEPOSIT);
			}
			else//Skip deposition and quiet time.
			{
				if(as.get_test_type() == TEST_LIN)		//Start linear sweep test.
					as.set_test_state(RAMP_INIT);
				else if(as.get_test_type() == TEST_DIF)	//Start square wave test.
					as.set_test_state(DIF_INIT);
				else                                    //Start arbitrary waveform test.
					as.set_test_state(ARB_INIT);
			}	
		break;
		 
		case DEPOSIT:
			if(ms_counter < as.get_dep_time())
			{
				if(as.get_soft_sel())				//Use filter.
					output = lpf(read_adc(), &as);
				else                                //Do not use software filter.
					output = read_adc();
				
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
							atmega_uart::tx_string_p(PSTR("...\r"));
					}
					//Print ASCII data.
					else if(as.get_tx_mode() == TX_MODE_ASCII)
					{
						tx_u16_to_ascii(output);
						atmega_uart::tx_byte(',');
					}
					//Print binary data.
					else
						atmega_uart::tx_word(output);
				}
				
				ms_counter++;//Always increment counter.
			}
			else
				as.set_test_state(DEP_STOP);//Stop deposition.
		break;
		
		case DEP_STOP:
			//Print end character if deposition is being recorded.
			if(as.get_dep_rec())
			{
				//Print MatLab data.
				if(as.get_tx_mode() == TX_MODE_MATLAB)
					atmega_uart::tx_string_p(PSTR("];\r\r"));
				//Print ASCII data.
				else if(as.get_tx_mode() == TX_MODE_ASCII)
				{
					tx_u16_to_ascii(END_BLOCK);
					atmega_uart::tx_byte(',');
				}
				//Print binary data.
				else
					atmega_uart::tx_word(END_BLOCK);
			}
			
			if(as.get_quiet_time())					//Start quiet time.
				as.set_test_state(QUIET_INIT);
			else if(as.get_test_type() == TEST_LIN)	//Start linear sweep.
				as.set_test_state(RAMP_INIT);
			else if(as.get_test_type() == TEST_DIF)	//Start differential pulse.
				as.set_test_state(DIF_INIT);
			else                                    //Start arbitrary waveform.
				as.set_test_state(ARB_INIT);
		break;
		
		case QUIET_INIT:
			samp_count = 0;	//Zero out sample counter.
			ms_counter = 0;	//Zero out ms counter.
			
			//Create MatLab array for quiet time currents if they are to be streamed.
			if(as.get_dep_rec() && as.get_tx_mode() == TX_MODE_MATLAB)
				atmega_uart::tx_string_p(PSTR("q=["));
			//Send ASCII deposition data word.
			else if(as.get_dep_rec() && as.get_tx_mode() == TX_MODE_ASCII)
			{
				tx_u16_to_ascii(QUIET_DATA);
				atmega_uart::tx_byte(',');
			}
			//send binary deposition word.
			else if(as.get_dep_rec() && as.get_tx_mode() == TX_MODE_BIN)
				atmega_uart::tx_word(QUIET_DATA);
			
			as.set_test_state(QUIET);	//move to next state.
		break;
		
		case QUIET:
			if(ms_counter < as.get_quiet_time())
			{
				if(as.get_soft_sel()) //Use filter.
					output = lpf(read_adc(), &as);
				else //Do not use software filter.
					output = read_adc();
				
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
							atmega_uart::tx_string_p(PSTR("...\r"));
					}
					//Print ASCII data.
					else if(as.get_tx_mode() == TX_MODE_ASCII)
					{
						tx_u16_to_ascii(output);
						atmega_uart::tx_byte(',');
					}
					//Print binary data.
					else
						atmega_uart::tx_word(output);
				}
				
				ms_counter++;//Always increment counter.
			}
			else
				as.set_test_state(QUIET_STOP);//Stop quiet time.
		break;
		
		case QUIET_STOP:
			//Print end character if quiet time is being recorded.
			if(as.get_dep_rec())
			{
				//Print MatLab data.
				if(as.get_tx_mode() == TX_MODE_MATLAB)
					atmega_uart::tx_string_p(PSTR("];\r\r"));
				//Print ASCII data.
				else if(as.get_tx_mode() == TX_MODE_ASCII)
				{
					tx_u16_to_ascii(END_BLOCK);
					atmega_uart::tx_byte(',');
				}
				//Print binary data.
				else
					atmega_uart::tx_word(END_BLOCK);
			}
			
			if(as.get_test_type() == TEST_LIN)		//Start linear sweep.
				as.set_test_state(RAMP_INIT);
			else if(as.get_test_type() == TEST_DIF)	//Start square wave.
				as.set_test_state(DIF_INIT);
			else									//Start arbitrary waveform.
				as.set_test_state(ARB_INIT);
		break;
		
		case RAMP_INIT:					
			//Initialize variables.
			this_cyc = 1;
			samp_count = 0;	
			ms_counter = 0;
			tot_cyc = as.get_sweep_cycles() * 2;
			sv = ZERO_VOLT + (1000.0 * (double)as.get_sweep_volt_start() / V_PER_COUNT);
			ev = ZERO_VOLT + (1000.0 * (double)as.get_sweep_volt_end() / V_PER_COUNT);
			as.get_sweep_volt_start() > as.get_sweep_volt_end() ? slope = -1 : slope = 1;
			rate = (double)as.get_sweep_rate() * (double)slope / V_PER_COUNT;
			this_offset = sv;
			first = 1;
			
			i2c_connect_ce();//Always connect counter electrode.
			write_dac((uint16_t)round(this_offset));//Load value into the DAC.
			
			//Print initial stream data.
			if(as.get_tx_mode() == TX_MODE_MATLAB)//Print MatLab data.
			{
				atmega_uart::tx_byte('s');
				tx_u16_to_ascii(this_cyc);
				atmega_uart::tx_string_p(PSTR("=["));
			}
			else if(as.get_tx_mode() == TX_MODE_ASCII)//Print ASCII data.
			{
				tx_u16_to_ascii(LIN_DATA);
				atmega_uart::tx_byte(',');
				tx_u16_to_ascii(this_cyc);
				atmega_uart::tx_byte(',');
			}
			else//Print binary data.
			{
				atmega_uart::tx_word(LIN_DATA);
				atmega_uart::tx_word(this_cyc);
			}
			
			as.set_test_state(RAMP);
		break;
		
		case RAMP:
			//Load value into the DAC.
			write_dac((uint16_t)round(this_offset));
			
			//Calculate current value for the DAC.
			this_offset += rate;
			
			//Skip the zero time sample.
			if(!first)
			{
				if(as.get_soft_sel())//Use filter.
				output = lpf(read_adc(), &as);
				else//Do not use software filter.
				output = read_adc();
			
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
							atmega_uart::tx_string_p(PSTR("...\r"));
					}
					//Print ASCII data.
					else if(as.get_tx_mode() == TX_MODE_ASCII)
					{
						tx_u16_to_ascii(output);
						atmega_uart::tx_byte(',');
					}
					//Print binary data.
					else
						atmega_uart::tx_word(output);
				}
			}
			
			ms_counter++;//Always increment counter.
			
			first = 0;//Indicate zero time has ended.
			
			//Continue ramping.
			if(((slope > 0) && (this_offset <= ev)) || ((slope < 0) && (this_offset >= ev)))
				break;
			
			//Done ramping.
			if(as.get_tx_mode() == TX_MODE_MATLAB)//Print MatLab data.
			atmega_uart::tx_string_p(PSTR("];\r\r"));
			else if(as.get_tx_mode() == TX_MODE_ASCII)//Print ASCII data.
			{
				tx_u16_to_ascii(END_BLOCK);
				atmega_uart::tx_byte(',');
			}
			else//Print binary data.
				atmega_uart::tx_word(END_BLOCK);
		
			samp_count = 0;	//Reset Sample counter.
			this_cyc++;		//Next cycle.
			
			//If cyclic, do second half.
			if(as.get_sweep_cyclic() && (this_cyc <= tot_cyc))
			{
				slope *= -1;//Change slope.
			
				//Swap start and end voltages.
				temp = sv;
				sv = ev;
				ev = temp;
				
				//Recalculate rate and offset voltages.
				rate = (double)as.get_sweep_rate() * (double)slope / V_PER_COUNT;
				this_offset = sv + rate;
				
				//Print initial stream data.
				if(as.get_tx_mode() == TX_MODE_MATLAB)//Print MatLab data.
				{
					atmega_uart::tx_byte('s');
					tx_u16_to_ascii(this_cyc);
					atmega_uart::tx_string_p(PSTR("=["));
				}
				else if(as.get_tx_mode() == TX_MODE_ASCII)//Print ASCII data.
				{
					tx_u16_to_ascii(LIN_DATA);
					atmega_uart::tx_byte(',');
					tx_u16_to_ascii(this_cyc);
					atmega_uart::tx_byte(',');
				}
				else//Print binary data.
				{
					atmega_uart::tx_word(LIN_DATA);
					atmega_uart::tx_word(this_cyc);
				}
			}
			else
			{
				i2c_disconnect_ce();	//Disconnect counter electrode.
				write_dac(ZERO_VOLT);	//Zero out voltage and return to idle.
				
				//Determine how many cycles need to be graphed.
				if(as.get_sweep_cyclic())
					graph_cycles = tot_cyc;
				else
					graph_cycles = 1;
				
				as.set_test_state(FOOTER);//Done.
			}	
		break;
		
		case DIF_INIT:
			//Initialize variables.
			this_cyc = 1;
			
			//Get starting voltage and ending voltage.
			sv = as.get_dif_volt_start();
			ev = as.get_dif_volt_end();
			
			//Initialize current voltage.
			this_voltage = sv;
			
			//Determine if positive or negative slope.
			sv > ev ? slope = -1 : slope = 1;
			
			as.set_test_state(DIF_PRE_INIT);	
		break;
		
		case DIF_PRE_INIT:			
			//Write DAC value.
			write_dac((uint16_t)(round(ZERO_VOLT + (1000.0 * ((double)this_voltage) / V_PER_COUNT))));
			
			samp_count = 0;//Reset sample counter.
			ms_counter = 0;//Reset timer variable.
			
			//Print initial stream data.
			//Print MatLab data.
			if(as.get_tx_mode() == TX_MODE_MATLAB)
			{
				atmega_uart::tx_string_p(PSTR("pr"));
				tx_u16_to_ascii(this_cyc);
				atmega_uart::tx_string_p(PSTR("=["));
			}
			//Print ASCII data.
			else if(as.get_tx_mode() == TX_MODE_ASCII)
			{
				tx_u16_to_ascii(DIF_PRE_DATA);
				atmega_uart::tx_byte(',');
				tx_u16_to_ascii(this_cyc);
				atmega_uart::tx_byte(',');
			}
			//Print binary data.
			else
			{
				atmega_uart::tx_word(DIF_PRE_DATA);
				atmega_uart::tx_word(this_cyc);
			}
		
			as.set_test_state(DIF_PREPULSE);
			//Fall through to start pre-pulse.
		
		case DIF_PREPULSE:
			//Get value from ADC.
			output = read_adc();
			
			//Print MatLab data.
			if(as.get_tx_mode() == TX_MODE_MATLAB)
			{
				tx_u16_to_ascii(output);
				atmega_uart::tx_byte(',');
				
				//Indicate a new sample has been sent.
				samp_count++;
				
				//Start newline if 10 or more samples on this line.
				if(samp_count && !(samp_count % 10))
				atmega_uart::tx_string_p(PSTR("...\r"));
			}
			//Print ASCII data.
			else if(as.get_tx_mode() == TX_MODE_ASCII)
			{
				tx_u16_to_ascii(output);
				atmega_uart::tx_byte(',');
			}
			//Print binary data.
			else
				atmega_uart::tx_word(output);
			
			//Check if time to end pre-pulse.
			if(ms_counter >= as.get_dif_time_pre() - 1)
			{
				as.set_test_state(DIF_PULSE_INIT);
				
				//Finish array.
				//Print MatLab data.
				if(as.get_tx_mode() == TX_MODE_MATLAB)
					atmega_uart::tx_string_p(PSTR("];\r\r"));
				//Print ASCII data.
				else if(as.get_tx_mode() == TX_MODE_ASCII)
				{
					tx_u16_to_ascii(END_BLOCK);
					atmega_uart::tx_byte(',');
				}
				//Print binary data.
				else
					atmega_uart::tx_word(END_BLOCK);
			}
			
			ms_counter++;
		break;
		
		case DIF_PULSE_INIT:
			//Write DAC value.
			write_dac((uint16_t)(round(ZERO_VOLT + (1000.0 * ((double)(this_voltage + (int16_t)as.get_dif_volt_pls())) / V_PER_COUNT))));
		
			samp_count = 0;//Reset sample counter.
			ms_counter = 0;//Reset timer variable.
			
			//Print initial stream data.
			//Print MatLab data.
			if(as.get_tx_mode() == TX_MODE_MATLAB)
			{
				atmega_uart::tx_string_p(PSTR("pl"));
				tx_u16_to_ascii(this_cyc);
				atmega_uart::tx_string_p(PSTR("=["));
			}
			//Print ASCII data.
			else if(as.get_tx_mode() == TX_MODE_ASCII)
			{
				tx_u16_to_ascii(DIF_PLS_DATA);
				atmega_uart::tx_byte(',');
				tx_u16_to_ascii(this_cyc);
				atmega_uart::tx_byte(',');
			}
			//Print binary data.
			else
			{
				atmega_uart::tx_word(DIF_PLS_DATA);
				atmega_uart::tx_word(this_cyc);
			}
		
			as.set_test_state(DIF_PULSE);
			//Fall through to start pulse.
		
		case DIF_PULSE:
			output = read_adc();//Get value from ADC.
			
			//Print MatLab data.
			if(as.get_tx_mode() == TX_MODE_MATLAB)
			{
				tx_u16_to_ascii(output);
				atmega_uart::tx_byte(',');
				
				//Indicate a new sample has been sent.
				samp_count++;
				
				//Start newline if 10 or more samples on this line.
				if(samp_count && !(samp_count % 10))
				atmega_uart::tx_string_p(PSTR("...\r"));
			}
			//Print ASCII data.
			else if(as.get_tx_mode() == TX_MODE_ASCII)
			{
				tx_u16_to_ascii(output);
				atmega_uart::tx_byte(',');
			}
			else//Print binary data.
				atmega_uart::tx_word(output);
		
			//Check if time to end pulse.
			if(ms_counter >= as.get_dif_time_pls() - 1)
			{
				//Finish array.
				//Print MatLab data.
				if(as.get_tx_mode() == TX_MODE_MATLAB)
					atmega_uart::tx_string_p(PSTR("];\r\r"));
				//Print ASCII data.
				else if(as.get_tx_mode() == TX_MODE_ASCII)
				{
					tx_u16_to_ascii(END_BLOCK);
					atmega_uart::tx_byte(',');
				}
				else//Print binary data.
					atmega_uart::tx_word(END_BLOCK);
				
				//Move to next increment.
				this_voltage += slope * as.get_dif_volt_inc();
				
				if((slope > 0) && (this_voltage > as.get_dif_volt_end()))
				{
					as.set_test_state(DIF_STOP);
					break;
				}
				else if((slope < 0) && (this_voltage < as.get_dif_volt_end()))
				{
					as.set_test_state(DIF_STOP);
					break;
				}
				
				this_cyc++;
				as.set_test_state(DIF_PRE_INIT);
			}
			
			ms_counter++;
		break;
		
		case DIF_STOP:
			//Disconnect counter electrode.
			i2c_disconnect_ce();
			//Zero out voltage and return to idle.
			write_dac(ZERO_VOLT);
			
			as.set_test_state(FOOTER);
		break;	
		
		case ARB_INIT:
			//initialize Variables.
			samp_count = 0;
			ms_counter = 0;
			eprom_index = 0;
			this_arb = 1;
			this_cyc = 1;
			first = 0;
			
			//Get total number of arbitrary waveform entries.
			total_arbs = fram1_read_word(ARB_NUM);
			
			//Exit if no data in arbitrary waveform memory.
			if(!total_arbs)
			{
				//Disconnect counter electrode.
				i2c_disconnect_ce();
				//Zero out voltage and return to idle.
				write_dac(ZERO_VOLT);
				
				as.set_test_state(FOOTER);
				break;
			}
			
			//Get data from FRAM.
			fram_read_arb_block(&eprom_index, &start_v, &end_v, &rate_time);
			
			//Determine next state.
			if(start_v == end_v)//Time data.
			{	
				//Undo the indexing for timing purposes.
				eprom_index -= 6;
				
				//Force FRAM read next state.
				rate_time = 0;
				ms_counter = 1;
				
				as.set_test_state(ARB_PULSE);
			}
			else//Ramp data.
			{				
				//Initialize ramp variables.
				sv = ZERO_VOLT + (1000.0 * (double)start_v / V_PER_COUNT);
				ev = ZERO_VOLT + (1000.0 * (double)end_v / V_PER_COUNT);
				start_v > end_v ? slope = -1 : slope = 1;
				rate = (double)rate_time * (double)slope / V_PER_COUNT;
				this_offset = sv;
				as.set_test_state(ARB_RAMP);
				
				//Begin data array.
				if(as.get_tx_mode() == TX_MODE_MATLAB)//Print MatLab data.
				{
					atmega_uart::tx_string_p(PSTR("a"));
					tx_u16_to_ascii(this_cyc);
					atmega_uart::tx_string_p(PSTR("=["));
				}
				else if(as.get_tx_mode() == TX_MODE_ASCII)//Print ASCII data.
				{
					tx_u16_to_ascii(ARB_DATA);
					atmega_uart::tx_byte(',');
					tx_u16_to_ascii(this_cyc);
					atmega_uart::tx_byte(',');
				}
				else//Print binary data.
				{
					atmega_uart::tx_word(ARB_DATA);
					atmega_uart::tx_word(this_cyc);
				}
				this_cyc++;//Increment for next array.	
			}
		break;
		
		case ARB_RAMP:		
			write_dac((uint16_t)round(this_offset));//Load value into the DAC.
			
			if(first)
			{
				first = 0;
				
				//Finish array.
				//Print MatLab data.
				if(as.get_tx_mode() == TX_MODE_MATLAB)
				atmega_uart::tx_string_p(PSTR("];\r\r"));
				//Print ASCII data.
				else if(as.get_tx_mode() == TX_MODE_ASCII)
				{
					tx_u16_to_ascii(END_BLOCK);
					atmega_uart::tx_byte(',');
				}
				else//Print binary data.
				atmega_uart::tx_word(END_BLOCK);
			}
			
			output = read_adc();//Get value from ADC.
			
			//Print MatLab data.
			if(as.get_tx_mode() == TX_MODE_MATLAB)
			{
				tx_u16_to_ascii(output);
				atmega_uart::tx_byte(',');
				
				//Indicate a new sample has been sent.
				samp_count++;
				
				//Start newline if 10 or more samples on this line.
				if(samp_count && !(samp_count % 10))
				atmega_uart::tx_string_p(PSTR("...\r"));
			}
			//Print ASCII data.
			else if(as.get_tx_mode() == TX_MODE_ASCII)
			{
				tx_u16_to_ascii(output);
				atmega_uart::tx_byte(',');
			}
			else//Print binary data.
				atmega_uart::tx_word(output);
			
			//Calculate current value for the DAC.
			this_offset += rate;
			
			ms_counter++;//Always increment counter.
			
			//Continue ramping.
			if(((slope > 0) && (this_offset < ev)) || ((slope < 0) && (this_offset > ev)))
				break;
			
			this_arb++;//Segment complete.
			
			//Finish array.
			//Print MatLab data.
			if(as.get_tx_mode() == TX_MODE_MATLAB)
				atmega_uart::tx_string_p(PSTR("];\r\r"));
			//Print ASCII data.
			else if(as.get_tx_mode() == TX_MODE_ASCII)
			{
				tx_u16_to_ascii(END_BLOCK);
				atmega_uart::tx_byte(',');
			}
			else//Print binary data.
				atmega_uart::tx_word(END_BLOCK);
			
			samp_count = 0;//Reset sample counter.
						
			//Check if another arbitrary waveform needs to be loaded.
			if(this_arb <= total_arbs)
			{
				//Load next arbitrary waveform data set.
				fram_read_arb_block(&eprom_index, &start_v, &end_v, &rate_time);
				
				//Determine next state.
				if(start_v == end_v)//Time data.
				{
					//Undo the indexing for timing purposes.
					eprom_index -= 6;
					
					//Force FRAM read next state.
					rate_time = 0;
					ms_counter = 1;
					
					as.set_test_state(ARB_PULSE);
				}
				else//Ramp data.
				{
					//Initialize ramp variables.
					sv = ZERO_VOLT + (1000.0 * (double)start_v / V_PER_COUNT);
					ev = ZERO_VOLT + (1000.0 * (double)end_v / V_PER_COUNT);
					start_v > end_v ? slope = -1 : slope = 1;
					rate = (double)rate_time * (double)slope / V_PER_COUNT;
					this_offset = sv;
					
					//Begin data array.
					if(as.get_tx_mode() == TX_MODE_MATLAB)//Print MatLab data.
					{
						atmega_uart::tx_string_p(PSTR("a"));
						tx_u16_to_ascii(this_cyc);
						atmega_uart::tx_string_p(PSTR("=["));
					}
					else if(as.get_tx_mode() == TX_MODE_ASCII)//Print ASCII data.
					{
						tx_u16_to_ascii(ARB_DATA);
						atmega_uart::tx_byte(',');
						tx_u16_to_ascii(this_cyc);
						atmega_uart::tx_byte(',');
					}
					else//Print binary data.
					{
						atmega_uart::tx_word(ARB_DATA);
						atmega_uart::tx_word(this_cyc);
					}
					this_cyc++;//Increment for next array.
				}
			}
			else
			{
				i2c_disconnect_ce();	//Disconnect counter electrode.
				write_dac(ZERO_VOLT);	//Zero out voltage and return to idle.
				as.set_test_state(FOOTER);
			}
		break;
		
		case ARB_PULSE:			
			if(ms_counter >= rate_time)//Check if time to end arb segment.
			{
				ms_counter = 0;
								
				//Check if another arbitrary waveform needs to be loaded.
				if(this_arb <= total_arbs)
				{					
					//Load next arbitrary waveform data set.
					fram_read_arb_block(&eprom_index, &start_v, &end_v, &rate_time);
					
					if(first)
					{
						first = 0;
						
						//Finish array.
						//Print MatLab data.
						if(as.get_tx_mode() == TX_MODE_MATLAB)
						atmega_uart::tx_string_p(PSTR("];\r\r"));
						//Print ASCII data.
						else if(as.get_tx_mode() == TX_MODE_ASCII)
						{
							tx_u16_to_ascii(END_BLOCK);
							atmega_uart::tx_byte(',');
						}
						else//Print binary data.
						atmega_uart::tx_word(END_BLOCK);	
					}		
					
					//Determine next state.
					if(start_v == end_v)//Time data.
					{
						write_dac((uint16_t)(round(ZERO_VOLT + (1000.0 * ((double)start_v) / V_PER_COUNT))));//Write DAC value.
						this_arb++; //Segment complete.
						first = 1;
													
						//Begin data array.
						if(as.get_tx_mode() == TX_MODE_MATLAB)//Print MatLab data.
						{
							atmega_uart::tx_string_p(PSTR("a"));
							tx_u16_to_ascii(this_cyc);
							atmega_uart::tx_string_p(PSTR("=["));
						}
						else if(as.get_tx_mode() == TX_MODE_ASCII)//Print ASCII data.
						{
							tx_u16_to_ascii(ARB_DATA);
							atmega_uart::tx_byte(',');
							tx_u16_to_ascii(this_cyc);
							atmega_uart::tx_byte(',');
						}
						else//Print binary data.
						{
							atmega_uart::tx_word(ARB_DATA);
							atmega_uart::tx_word(this_cyc);
						}
						this_cyc++;//Increment for next array.
					}
					else//Ramp data.
					{						
						//Initialize ramp variables.
						sv = ZERO_VOLT + (1000.0 * (double)start_v / V_PER_COUNT);
						ev = ZERO_VOLT + (1000.0 * (double)end_v / V_PER_COUNT);
						start_v > end_v ? slope = -1 : slope = 1;
						rate = (double)rate_time * (double)slope / V_PER_COUNT;
						this_offset = sv;
						samp_count = 0;//Reset sample counter.
						ms_counter++;
						as.set_test_state(ARB_RAMP);
						
						//Begin data array.
						if(as.get_tx_mode() == TX_MODE_MATLAB)//Print MatLab data.
						{
							atmega_uart::tx_string_p(PSTR("a"));
							tx_u16_to_ascii(this_cyc);
							atmega_uart::tx_string_p(PSTR("=["));
						}
						else if(as.get_tx_mode() == TX_MODE_ASCII)//Print ASCII data.
						{
							tx_u16_to_ascii(ARB_DATA);
							atmega_uart::tx_byte(',');
							tx_u16_to_ascii(this_cyc);
							atmega_uart::tx_byte(',');
						}
						else//Print binary data.
						{
							atmega_uart::tx_word(ARB_DATA);
							atmega_uart::tx_word(this_cyc);
						}
						this_cyc++;//Increment for next array.a_uart::tx_word(this_cyc);						
						
						break;
					}
				}
				else
				{
					//Kill some time.
					i2c_connect_ce();
					i2c_connect_ce();
					i2c_connect_ce();
					i2c_connect_ce();
					i2c_connect_ce();
					i2c_connect_ce();
					
					//Finish array.
					//Print MatLab data.
					if(as.get_tx_mode() == TX_MODE_MATLAB)
					atmega_uart::tx_string_p(PSTR("];\r\r"));
					//Print ASCII data.
					else if(as.get_tx_mode() == TX_MODE_ASCII)
					{
						tx_u16_to_ascii(END_BLOCK);
						atmega_uart::tx_byte(',');
					}
					else//Print binary data.
					atmega_uart::tx_word(END_BLOCK);
					
					i2c_disconnect_ce();//Disconnect counter electrode.
					write_dac(ZERO_VOLT);//Zero out voltage and return to idle.
					as.set_test_state(FOOTER);
					break;
				}
			}
			
			output = read_adc();//Get value from ADC.
			
			//Print MatLab data.
			if(as.get_tx_mode() == TX_MODE_MATLAB)
			{
				tx_u16_to_ascii(output);
				atmega_uart::tx_byte(',');
				
				//Indicate a new sample has been sent.
				samp_count++;
				
				//Start newline if 10 or more samples on this line.
				if(samp_count && !(samp_count % 10))
				atmega_uart::tx_string_p(PSTR("...\r"));
			}
			//Print ASCII data.
			else if(as.get_tx_mode() == TX_MODE_ASCII)
			{
				tx_u16_to_ascii(output);
				atmega_uart::tx_byte(',');
			}
			else//Print binary data.
			atmega_uart::tx_word(output);
			
			ms_counter++;
		break;
		
		case FOOTER:
			//Only do stuff if in MatLab mode.
			if(as.get_tx_mode() == TX_MODE_MATLAB)
			{				
				//Print deposition graph if it is active.
				if(as.get_dep_rec() && as.get_dep_enable())
				{
					atmega_uart::tx_string_p(PSTR("d_ua=((d-2047)*(3.3/4096)/tia_r);\r"));
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
					atmega_uart::tx_string_p(PSTR("q_ua=((q-2047)*(3.3/4096)/tia_r);\r"));
					atmega_uart::tx_string_p(PSTR("tq=linspace(1,quiet_t/1000,length(q_ua));\r"));
					atmega_uart::tx_string_p(PSTR("figure(2);\r"));
					atmega_uart::tx_string_p(PSTR("plot(tq,q_ua);\r"));
					atmega_uart::tx_string_p(PSTR("ylabel('Current(A)');\r"));
					atmega_uart::tx_string_p(PSTR("xlabel('Time (s)');\r"));
					atmega_uart::tx_string_p(PSTR("title('Quiet Time Sequence');\r"));
					atmega_uart::tx_string_p(PSTR("grid on;\r\r"));
				}
				
				//Print linear sweep and cyclic graphs.
				if(as.get_test_type() == TEST_LIN)
				{
				    for(uint16_t i = 1; i <= graph_cycles; i++)
				    {
					    //First, convert all values to microamps.
					    atmega_uart::tx_string_p(PSTR("s_ua"));
					    tx_u16_to_ascii(i);
					    atmega_uart::tx_string_p(PSTR("=((s"));
					    tx_u16_to_ascii(i);
					
					    //Only have positive and negative values for linear tests.
						atmega_uart::tx_string_p(PSTR("-2047"));
					    atmega_uart::tx_string_p(PSTR(")*(3.3/4096)/tia_r);\r"));
					
					    //Next, create time arrays.
					    atmega_uart::tx_byte('t');
					    tx_u16_to_ascii(i);
					    atmega_uart::tx_string_p(PSTR("=linspace("));
						atmega_uart::tx_string_p(PSTR("sweep_vs/1000,sweep_ve/1000"));
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
				
					//Generate plots.
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
					    atmega_uart::tx_string_p(PSTR("Cyclic "));
				
					atmega_uart::tx_string_p(PSTR("Linear Sweep"));
				
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
								
				//Print differential pulse graphs.
				if(as.get_test_type() == TEST_DIF)
				{
					//Convert ADC values to microamps.
					for(uint16_t i = 1; i <= this_cyc; i++)
					{
						atmega_uart::tx_string_p(PSTR("s_pr"));
						tx_u16_to_ascii(i);
						atmega_uart::tx_string_p(PSTR("=((pr"));
						tx_u16_to_ascii(i);
						atmega_uart::tx_string_p(PSTR("-2047"));
						atmega_uart::tx_string_p(PSTR(")*(3.3/4096)/tia_r);\r"));
						
						atmega_uart::tx_string_p(PSTR("s_pl"));
						tx_u16_to_ascii(i);
						atmega_uart::tx_string_p(PSTR("=((pl"));
						tx_u16_to_ascii(i);
						atmega_uart::tx_string_p(PSTR("-2047"));
						atmega_uart::tx_string_p(PSTR(")*(3.3/4096)/tia_r);\r"));
					}
					
					atmega_uart::tx_string_p(PSTR("\rdw = dif_win-1;\r"));
					
					//Create differential current array.
					atmega_uart::tx_string_p(PSTR("\rip=["));
					
					for(uint16_t i = 1; i <= this_cyc; i++)
					{
						atmega_uart::tx_string_p(PSTR("mean(s_pl"));
						tx_u16_to_ascii(i);
						atmega_uart::tx_string_p(PSTR("(length(s_pl"));
						tx_u16_to_ascii(i);
						atmega_uart::tx_string_p(PSTR(")-dw:1:length(s_pl"));
						tx_u16_to_ascii(i);
						atmega_uart::tx_string_p(PSTR(")))-...\rmean(s_pr"));
						tx_u16_to_ascii(i);
						atmega_uart::tx_string_p(PSTR("(length(s_pr"));
						tx_u16_to_ascii(i);
						atmega_uart::tx_string_p(PSTR(")-dw:1:length(s_pr"));
						tx_u16_to_ascii(i);
						atmega_uart::tx_string_p(PSTR("))),...\r"));
					}
					atmega_uart::tx_string_p(PSTR("];\r\r"));
					
					//Create voltage array.
					atmega_uart::tx_string_p(PSTR("i=dif_vs;\rj=1;\r\rwhile i"));
					slope > 0 ? atmega_uart::tx_byte('<') : atmega_uart::tx_byte('>');
					atmega_uart::tx_string_p(PSTR("=dif_ve\rz(j)=i/1000;\ri=i"));
					slope > 0 ? atmega_uart::tx_byte('+') : atmega_uart::tx_byte('-');
					atmega_uart::tx_string_p(PSTR("dif_vi;\rj=j+1;\rend\r\r"));
					
					//Generate raw current vs. samples plot.
					atmega_uart::tx_string_p(PSTR("p=["));
					
					for(uint16_t i = 1; i <= this_cyc; i++)
					{
						//Concatenate all arrays.
						atmega_uart::tx_string_p(PSTR("s_pr"));
						tx_u16_to_ascii(i);
						atmega_uart::tx_byte(',');
						atmega_uart::tx_string_p(PSTR("s_pl"));
						tx_u16_to_ascii(i);
						atmega_uart::tx_byte(',');
						
						if(i != 0 && !(i % 4))
						atmega_uart::tx_string_p(PSTR("...\r"));
					}
					
					//Display current vs. samples plot.
					atmega_uart::tx_string_p(PSTR("];\r\r"));
					atmega_uart::tx_string_p(PSTR("figure(3);\r"));
					atmega_uart::tx_string_p(PSTR("plot(p);\r"));
					atmega_uart::tx_string_p(PSTR("ylabel('Current(A)');\r"));
					atmega_uart::tx_string_p(PSTR("xlabel('Samples');\r"));
					atmega_uart::tx_string_p(PSTR("title('Raw Current vs. Samples');\r"));
					atmega_uart::tx_string_p(PSTR("grid on;\r\r"));
					
					//Display current vs. voltage plot.
					atmega_uart::tx_string_p(PSTR("figure(4);\r"));
					atmega_uart::tx_string_p(PSTR("plot(z, ip);\r"));
					atmega_uart::tx_string_p(PSTR("ylabel('Current(A)');\r"));
					atmega_uart::tx_string_p(PSTR("xlabel('Volts(V)');\r"));
					atmega_uart::tx_string_p(PSTR("title('Differential Pulse');\r"));
					atmega_uart::tx_string_p(PSTR("grid on;\r"));
				}
				//Print differential pulse graphs.
				if(as.get_test_type() == TEST_ARB)
				{
					this_cyc--;
					//Convert ADC values to microamps.
					for(uint16_t i = 1; i <= this_cyc; i++)
					{
						atmega_uart::tx_string_p(PSTR("s_a"));
						tx_u16_to_ascii(i);
						atmega_uart::tx_string_p(PSTR("=((a"));
						tx_u16_to_ascii(i);
						atmega_uart::tx_string_p(PSTR("-2047"));
						atmega_uart::tx_string_p(PSTR(")*(3.3/4096)/tia_r);\r"));
					}
					
					//Generate raw current vs. samples plot.
					atmega_uart::tx_string_p(PSTR("p=["));
					
					for(uint16_t i = 1; i <= this_cyc; i++)
					{
						//Concatenate all arrays.
						atmega_uart::tx_string_p(PSTR("s_a"));
						tx_u16_to_ascii(i);
						atmega_uart::tx_byte(',');
						
						if(i != 0 && !(i % 4))
						atmega_uart::tx_string_p(PSTR("...\r"));
					}
					
					//Display current vs. samples plot.
					atmega_uart::tx_string_p(PSTR("];\r\r"));
					atmega_uart::tx_string_p(PSTR("figure(3);\r"));
					atmega_uart::tx_string_p(PSTR("plot(p);\r"));
					atmega_uart::tx_string_p(PSTR("ylabel('Current(A)');\r"));
					atmega_uart::tx_string_p(PSTR("xlabel('Samples');\r"));
					atmega_uart::tx_string_p(PSTR("title('Raw Current vs. Samples');\r"));
					atmega_uart::tx_string_p(PSTR("grid on;\r\r"));
				}
			}
					
			//Indicate end of test in any other mode.
			//Print ASCII data.
			else if(as.get_tx_mode() == TX_MODE_ASCII)
			{
				tx_u16_to_ascii(END_TEST);
				atmega_uart::tx_byte('\r');
			}
			//Print binary data.
			else
				atmega_uart::tx_word(END_TEST);
			
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
	
	//PORTB &= ~(1 << PORTB0);//Toggle port for timing check.
}
