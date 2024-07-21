#include <avr/io.h>
#include "as_class.h"

//Constructor that initializes default values of the test parameters.
as_class::as_class() : tx_mode(TX_MODE_MATLAB), num_electrodes(ELEC_3), adc_rate(2), 
tia_res_val(4), dep_enable(true), dep_time(60000), dep_volt(-500), quiet_time(0), 
dep_rec(true), sweep_volt_start(-500), sweep_volt_end(500), sweep_rate(10), 
sweep_cyclic(false), sweep_cycles(5), dif_volt_start(-500), dif_volt_end(500),
dif_volt_inc(50), dif_volt_pls(100), dif_time_pre(150), dif_time_pls(20),
dif_time_win(1), soft_sel(0), test_state(IDLE){}
	
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
uint8_t as_class::set_tia_res(uint8_t tia_res_v)
{
	if(tia_res_v > RES_MAX)
	{
		return AS_VALUE_HIGH;
	}
	
	if(tia_res_v < RES_MIN)
	{
		return AS_VALUE_LOW;
	}
	
	tia_res_val = tia_res_v;
	
	return AS_NO_ERR;
}

//Get TIA resistor tap value.
uint8_t as_class::get_tia_res()
{
	return tia_res_val;
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

/*********************************************Differential Pulse Functions********************************************/
//Set differential pulse start voltage.
uint8_t as_class::set_dif_volt_start(int16_t dif_volt_s)
{
	if(dif_volt_s > DIF_VOLT_MAX)
	{
		return AS_VALUE_HIGH;
	}
	
	if(dif_volt_s < DIF_VOLT_MIN)
	{
		return AS_VALUE_LOW;
	}
	
	dif_volt_start = dif_volt_s;
	return AS_NO_ERR;
}

//Get differential pulse start voltage.
int16_t as_class::get_dif_volt_start()
{
	return dif_volt_start;
}

//Set differential pulse end voltage.
uint8_t as_class::set_dif_volt_end(int16_t dif_volt_e)
{
	if(dif_volt_e > DIF_VOLT_MAX)
	{
		return AS_VALUE_HIGH;
	}
	
	if(dif_volt_e < DIF_VOLT_MIN)
	{
		return AS_VALUE_LOW;
	}
	
	dif_volt_end = dif_volt_e;
	return AS_NO_ERR;
}

//Set differential pulse end voltage.
int16_t as_class::get_dif_volt_end()
{
	return dif_volt_end;
}

//Set differential pulse amplitude.
uint8_t as_class::set_dif_volt_pls(int16_t dif_volt_pl)
{
	if(dif_volt_pl > DIF_AMP_MAX)
	{
		return AS_VALUE_HIGH;
	}
	
	if(dif_volt_pl < DIF_AMP_MIN)
	{
		return AS_VALUE_LOW;
	}
	
	dif_volt_pls = dif_volt_pl;
	return AS_NO_ERR;
}

//Get differential pulse amplitude.
int16_t as_class::get_dif_volt_pls()
{
	return dif_volt_pls;
}

//Set differential pulse increment.
uint8_t as_class::set_dif_volt_inc(uint16_t dif_volt_i)
{
	if(dif_volt_i > DIF_INC_MAX)
	{
		return AS_VALUE_HIGH;
	}
	
	if(dif_volt_i < DIF_INC_MIN)
	{
		return AS_VALUE_LOW;
	}
	
	dif_volt_inc = dif_volt_i;
	return AS_NO_ERR;
}

//Get differential pulse increment.
uint16_t as_class::get_dif_volt_inc()
{
	return dif_volt_inc;
}

//Set differential pulse pre-pulse time.
uint8_t as_class::set_dif_time_pre(uint16_t dif_time_pr)
{
	if(dif_time_pr > DIF_PRE_MAX)
	{
		return AS_VALUE_HIGH;
	}
	
	if(dif_time_pr < DIF_PRE_MIN)
	{
		return AS_VALUE_LOW;
	}
	
	dif_time_pre = dif_time_pr;
	return AS_NO_ERR;
}

//Get differential pulse pre-pulse time.
uint16_t as_class::get_dif_time_pre()
{
	return dif_time_pre;
}

//Set differential pulse time.
uint8_t as_class::set_dif_time_pls(uint16_t dif_time_pl)
{
	if(dif_time_pl > DIF_PLS_MAX)
	{
		return AS_VALUE_HIGH;
	}
	
	if(dif_time_pl < DIF_PLS_MIN)
	{
		return AS_VALUE_LOW;
	}
	
	dif_time_pls = dif_time_pl;
	return AS_NO_ERR;
}

//Get differential pulse time.
uint16_t as_class::get_dif_time_pls()
{
	return dif_time_pls;
}

//Set differential sampling window time.
uint8_t as_class::set_dif_time_win(uint16_t dif_time_wn)
{
	if(dif_time_wn > DIF_WIN_MAX)
	{
		return AS_VALUE_HIGH;
	}
	
	if(dif_time_wn < DIF_WIN_MIN)
	{
		return AS_VALUE_LOW;
	}
	
	dif_time_win = dif_time_wn;
	return AS_NO_ERR;
}

//Get differential sampling window time.
uint16_t as_class::get_dif_time_win()
{
	return dif_time_win;
}

/**********************************************Low-pass Filter Functions**********************************************/
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
