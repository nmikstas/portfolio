#include <avr/io.h>
#include "as_class.h"

//Constructor that initializes default values of the test parameters.
as_class::as_class() : tx_mode(TX_MODE_MATLAB), num_electrodes(ELEC_3), adc_rate(2), 
tia_res_tap(10), tia_cap_mask(0), dep_enable(true), dep_time(60000), dep_volt(-500),
quiet_time(0), dep_rec(true), sweep_volt_start(-500), sweep_volt_end(500), 
sweep_rate(10), sweep_cyclic(false), sweep_cycles(5), square_volt_start(-500),
square_volt_end(500), square_amp(25), square_inc(10), square_period(10),
arb_cyclic(false), arb_cycles(5), soft_filt(false), soft_sel(1), test_state(IDLE){}
	
/*************************************************Main Menu Functions*************************************************/
//Set transmission mode.
uint8_t as_class::set_tx_mode(tx_modes tx_m)
{
	tx_mode = tx_m;
	return AS_NO_ERR;
}

//Get transmission mode.
tx_modes as_class::get_tx_mode()
{
	return tx_mode;
}

//Set number of electrodes.
uint8_t as_class::set_num_electrodes(num_elecs num_e)
{
	num_electrodes = num_e;
	return AS_NO_ERR;
}

//Get number of electrodes.
num_elecs as_class::get_num_electrodes()
{
	return num_electrodes;
}

//Set ADC sample rate.
uint8_t as_class::set_adc_rate(uint16_t adc_r)
{
	if(adc_r > ADC_RATE_MAX)
	{
		return AS_VALUE_HIGH;
	}
	
	if(adc_r < ADC_RATE_MIN)
	{
		return AS_VALUE_LOW;
	}
	
	adc_rate = adc_r;
	return AS_NO_ERR;
}

//Get ADC sample rate.
uint16_t as_class::get_adc_rate()
{
	return adc_rate;
}

/****************************************************TIA Functions****************************************************/
//Set TIA resistor tap value.
uint8_t as_class::set_tia_res_tap(uint16_t tia_res_t)
{
	if(tia_res_t > TAP_MAX)
	{
		return AS_VALUE_HIGH;
	}
	
	if(tia_res_t < TAP_MIN)
	{
		return AS_VALUE_LOW;
	}
	
	//Hack.  Remove later!
	if(tia_res_t < 5)
		tia_res_tap = 1;
	else if(tia_res_t < 50)
		tia_res_tap = 10;
	else if(tia_res_t < 500)
		tia_res_tap = 102;
	else
		tia_res_tap = 1023;
		
	//tia_res_tap = tia_res_t;
	return AS_NO_ERR;
}

//Get TIA resistor tap value.
uint16_t as_class::get_tia_res_tap()
{
	return tia_res_tap;
}

//Set TIA capacitor 6-bit flag value.
uint8_t as_class::set_tia_cap_mask(uint8_t tia_cap_m)
{
	if(tia_cap_m > CAP_MAX)
	{
		return AS_VALUE_HIGH;
	}
	
	if(tia_cap_m < CAP_MIN)
	{
		return AS_VALUE_LOW;
	}
	
	tia_cap_mask = tia_cap_m;
	return AS_NO_ERR;
}

//Get TIA capacitor 6-bit flag value.
uint8_t as_class::get_tia_cap_mask()
{
	return tia_cap_mask;
}

/************************************************Deposition Functions*************************************************/
//Set deposition enable.
uint8_t as_class::set_dep_enable(bool dep_e)
{
	dep_enable = dep_e;
	return AS_NO_ERR;
}

//Get deposition enable.
bool as_class::get_dep_enable()
{
	return dep_enable;
}

//Set deposition time.
uint8_t as_class::set_dep_time(uint32_t dep_t)
{
	if(dep_t > DEP_TIME_MAX)
	{
		return AS_VALUE_HIGH;
	}
	
	if(dep_t < DEP_TIME_MIN)
	{
		return AS_VALUE_LOW;
	}
	
	dep_time = dep_t;
	return AS_NO_ERR;
}

//Get deposition time.
uint32_t as_class::get_dep_time()
{
	return dep_time;
}

//Set deposition voltage.
uint8_t as_class::set_dep_volt(int16_t dep_v)
{
	if(dep_v > DEP_VOLT_MAX)
	{
		return AS_VALUE_HIGH;
	}
	
	if(dep_v < DEP_VOLT_MIN)
	{
		return AS_VALUE_LOW;
	}
	
	dep_volt = dep_v;
	return AS_NO_ERR;
}

//Get deposition voltage.
int as_class::get_dep_volt()
{
	return dep_volt;
}

//Set quiet time.
uint8_t as_class::set_quiet_time(uint32_t quiet_t)
{
	if(quiet_t > QUIET_TIME_MAX)
	{
		return AS_VALUE_HIGH;
	}
	
	if(quiet_t < QUIET_TIME_MIN)
	{
		return AS_VALUE_LOW;
	}
	
	quiet_time = quiet_t;
	return AS_NO_ERR;
}

//Get quiet time.
uint32_t as_class::get_quiet_time()
{
	return quiet_time;
}

//Set if deposition voltage is to be streamed.
uint8_t as_class::set_dep_rec(bool dep_r)
{
	dep_rec = dep_r;
	return AS_NO_ERR;
}

//Get if deposition voltage is to be streamed.
bool as_class::get_dep_rec()
{
	return dep_rec;
}

/***********************************************Linear Sweep Functions************************************************/
//Set starting sweep voltage.
uint8_t as_class::set_sweep_volt_start(int16_t sweep_vs)
{
	if(sweep_vs > SWEEP_VOLT_MAX)
	{
		return AS_VALUE_HIGH;
	}
	
	if(sweep_vs < SWEEP_VOLT_MIN)
	{
		return AS_VALUE_LOW;
	}
	
	sweep_volt_start = sweep_vs;
	return AS_NO_ERR;
}

//Get starting sweep voltage.
int as_class::get_sweep_volt_start()
{
	return sweep_volt_start;
}

//Set ending sweep voltage.
uint8_t as_class::set_sweep_volt_end(int16_t sweep_ve)
{
	if(sweep_ve > SWEEP_VOLT_MAX)
	{
		return AS_VALUE_HIGH;
	}
	
	if(sweep_ve < SWEEP_VOLT_MIN)
	{
		return AS_VALUE_LOW;
	}
	
	sweep_volt_end = sweep_ve;
	return AS_NO_ERR;
}

//Get ending sweep voltage.
int as_class::get_sweep_volt_end()
{
	return sweep_volt_end;
}

//Set sweep rate.
uint8_t as_class::set_sweep_rate(uint16_t sweep_r)
{
	if(sweep_r > SWEEP_RATE_MAX)
	{
		return AS_VALUE_HIGH;
	}
	
	if(sweep_r < SWEEP_RATE_MIN)
	{
		return AS_VALUE_LOW;
	}
	
	sweep_rate = sweep_r;
	return AS_NO_ERR;
}

//Get sweep rate.
uint16_t as_class::get_sweep_rate()
{
	return sweep_rate;
}

//Set if sweep is cyclic.
uint8_t as_class::set_sweep_cyclic(bool sweep_c)
{
	sweep_cyclic = sweep_c;
	return AS_NO_ERR;
}

//Get if sweep is cyclic.
bool as_class::get_sweep_cyclic()
{
	return sweep_cyclic;
}

//Set number of sweep cycles.
uint8_t as_class::set_sweep_cycles(uint8_t sweep_cs)
{
	if(sweep_cs > SWEEP_CYCLES_MAX)
	{
		return AS_VALUE_HIGH;
	}
	
	if(sweep_cs < SWEEP_CYCLES_MIN)
	{
		return AS_VALUE_LOW;
	}
	
	sweep_cycles = sweep_cs;
	return AS_NO_ERR;
}

//Get number of sweep cycles.
uint8_t as_class::get_sweep_cycles()
{
	return sweep_cycles;
}

/************************************************Square Wave Functions************************************************/
//Set square wave start voltage.
uint8_t as_class::set_square_volt_start(int16_t square_volt_s)
{
	if(square_volt_s > SQUARE_VOLT_MAX)
	{
		return AS_VALUE_HIGH;
	}
	
	if(square_volt_s < SQUARE_VOLT_MIN)
	{
		return AS_VALUE_LOW;
	}
	
	square_volt_start = square_volt_s;
	return AS_NO_ERR;
}

//Get square wave start voltage.
int as_class::get_square_volt_start()
{
	return square_volt_start;
}

//Set square wave end voltage.
uint8_t as_class::set_square_volt_end(int16_t square_volt_e)
{
	if(square_volt_e > SQUARE_VOLT_MAX)
	{
		return AS_VALUE_HIGH;
	}
	
	if(square_volt_e < SQUARE_VOLT_MIN)
	{
		return AS_VALUE_LOW;
	}
	
	square_volt_end = square_volt_e;
	return AS_NO_ERR;
}

//Set square wave end voltage.
int as_class::get_square_volt_end()
{
	return square_volt_end;
}

//Set square wave amplitude.
uint8_t as_class::set_square_amp(uint16_t square_a)
{
	if(square_a > SQUARE_AMP_MAX)
	{
		return AS_VALUE_HIGH;
	}
	
	if(square_a < SQUARE_AMP_MIN)
	{
		return AS_VALUE_LOW;
	}
	
	square_amp = square_a;
	return AS_NO_ERR;
}

//Get square wave amplitude.
uint16_t as_class::get_square_amp()
{
	return square_amp;
}

//Set square wave increment.
uint8_t as_class::set_square_inc(uint16_t square_i)
{
	if(square_i > SQUARE_INC_MAX)
	{
		return AS_VALUE_HIGH;
	}
	
	if(square_i < SQUARE_INC_MIN)
	{
		return AS_VALUE_LOW;
	}
	
	square_inc = square_i;
	return AS_NO_ERR;
}

//Get square wave increment.
uint16_t as_class::get_square_inc()
{
	return square_inc;
}

//Set square wave period.
uint8_t as_class::set_square_period(uint16_t square_p)
{
	if(square_p > SQUARE_PER_MAX)
	{
		return AS_VALUE_HIGH;
	}
	
	if(square_p < SQUARE_PER_MIN)
	{
		return AS_VALUE_LOW;
	}
	
	square_period = square_p;
	return AS_NO_ERR;
}

//Get square wave period.
uint16_t as_class::get_square_period()
{
	return square_period;
}

/*********************************************Arbitrary Waveform Functions********************************************/
//Set if arbitrary waveform is cyclic.
uint8_t as_class::set_arb_cyclic(bool arb_c)
{
	arb_cyclic = arb_c;
	return AS_NO_ERR;
}

//Get if arbitrary waveform is cyclic.
uint8_t as_class::get_arb_cyclic()
{
	return arb_cyclic;
}

//Set number of arbitrary waveform cycles.
uint8_t as_class::set_arb_cycles(uint8_t arb_cs)
{
	if(arb_cs > ARB_CYCLES_MAX)
	{
		return AS_VALUE_HIGH;
	}
	
	if(arb_cs < ARB_CYCLES_MIN)
	{
		return AS_VALUE_LOW;
	}
	
	arb_cycles = arb_cs;
	return AS_NO_ERR;
}

//Get number of arbitrary waveform cycles.
uint8_t as_class::get_arb_cycles()
{
	return arb_cycles;
}

/**********************************************Low-pass Filter Functions**********************************************/
//Set if software filter is to be used.
uint8_t as_class::set_soft_filt(bool soft_f)
{
	soft_filt = soft_f;
	return AS_NO_ERR;
}

//Get if software filter is to be used.
bool as_class::get_soft_filt()
{
	return soft_filt;
}

//Set software filter to use.
uint8_t as_class::set_soft_sel(uint8_t soft_s)
{
	if(soft_s > LPF_FILT_MAX)
	{
		return AS_VALUE_HIGH;
	}
	
	if(soft_s < LPF_FILT_MIN)
	{
		return AS_VALUE_LOW;
	}
	
	soft_sel = soft_s;
	return AS_NO_ERR;
}

//Get software filter to use.
uint8_t as_class::get_soft_sel()
{
	return soft_sel;
}

/*************************************************Test State Functions************************************************/
//Set current test state.
uint8_t as_class::set_test_state(test_states test_s)
{
	test_state = test_s;
	return AS_NO_ERR;
}

//Get current test state.
test_states as_class::get_test_state()
{
	return test_state;
}

//Set test type.
uint8_t as_class::set_test_type(test_types test_t)
{
	test_type = test_t;
	return AS_NO_ERR;
}

//Get test type.
test_types as_class::get_test_type()
{
	return test_type;
}
