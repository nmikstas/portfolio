#ifndef AS_CLASS_H_
#define AS_CLASS_H_

//Tester error codes.
#define AS_NO_ERR 0
#define AS_VALUE_LOW 1
#define AS_VALUE_HIGH 2
#define AS_VALUE_INVALID 3

//Transmission modes.
enum tx_modes{TX_MODE_ASCII, TX_MODE_MATLAB, TX_MODE_BIN};

//Number of electrodes.
enum num_elecs{ELEC_2, ELEC_3};

//Testing sates.
enum test_states{IDLE, DEP_INIT, DEPOSIT, DEP_STOP, QUIET_INIT, QUIET, QUIET_STOP,
			     RAMP_INIT, RAMP, RAMP_STOP, SQUARE_INIT, SQUARE, SQUARE_STOP,
				 ARB_INIT, ARB, ARB_STOP, FOOTER, ABORT};

//Test types.
enum test_types{TEST_LIN, TEST_SQR, TEST_ARB};

//Min/Max values of the as_class variables.
#define ADC_RATE_MIN 1
#define ADC_RATE_MAX 1000

#define TAP_MIN 1
#define TAP_MAX 1023
#define CAP_MIN 0
#define CAP_MAX 63

#define DEP_TIME_MIN 1
#define DEP_TIME_MAX 800000L
#define DEP_VOLT_MIN -1650
#define DEP_VOLT_MAX 1650
#define QUIET_TIME_MIN 0
#define QUIET_TIME_MAX 800000L

#define SWEEP_VOLT_MIN -1650
#define SWEEP_VOLT_MAX 1650
#define SWEEP_RATE_MIN 1
#define SWEEP_RATE_MAX 2000
#define SWEEP_CYCLES_MIN 1
#define SWEEP_CYCLES_MAX 100

#define SQUARE_VOLT_MIN -1650
#define SQUARE_VOLT_MAX 1650
#define SQUARE_AMP_MIN 0
#define SQUARE_AMP_MAX 1650
#define SQUARE_INC_MIN 0
#define SQUARE_INC_MAX 1650
#define SQUARE_PER_MIN 1
#define SQUARE_PER_MAX 10000
#define SQUARE_SAMP_MIN 1
#define SQUARE_SAMP_MAX 10000

#define ARB_ENTRIES_MAX 150
#define ARB_VOLT_MIN -1650
#define ARB_VOLT_MAX 1650
#define ARB_RATE_MIN 1
#define ARB_RATE_MAX 2000
#define ARB_CYCLES_MIN 1
#define ARB_CYCLES_MAX 100

#define LPF_FILT_MIN 1
#define LPF_FILT_MAX 7

//as_class contains all the parameters for the arsenic tester.
class as_class
{
	public:
	as_class();
	
	//Main menu functions.
	uint8_t set_tx_mode(tx_modes set_tx_m);
	tx_modes get_tx_mode();
	
	uint8_t set_num_electrodes(num_elecs set_num_e);
	num_elecs get_num_electrodes();
	
	uint8_t set_adc_rate(uint16_t adc_r);
	uint16_t get_adc_rate();
	
	//TIA functions.
	uint8_t set_tia_res_tap(uint16_t tia_res_t);
	uint16_t get_tia_res_tap();
	
	uint8_t set_tia_cap_mask(uint8_t tia_cap_m);
	uint8_t get_tia_cap_mask();	
	
	//Deposition functions.
	uint8_t set_dep_enable(bool dep_e);
	bool get_dep_enable();
			 
	uint8_t set_dep_time(uint32_t dep_t);
	uint32_t get_dep_time();
	
	uint8_t set_dep_volt(int16_t dep_v);
	int get_dep_volt();
	
	uint8_t set_quiet_time(uint32_t quiet_t);
	uint32_t get_quiet_time();
	
	uint8_t set_dep_rec(bool dep_r);
	bool get_dep_rec();
	
	//Linear sweep functions.
	uint8_t set_sweep_volt_start(int16_t sweep_vs);
	int get_sweep_volt_start();
	
	uint8_t set_sweep_volt_end(int16_t sweep_ve);
	int get_sweep_volt_end();
	
	uint8_t set_sweep_rate(uint16_t sweep_r);
	uint16_t get_sweep_rate();
	
	uint8_t set_sweep_cyclic(bool sweep_c);
	bool get_sweep_cyclic();
	
	uint8_t set_sweep_cycles(uint8_t sweep_cs);
	uint8_t get_sweep_cycles();
	
	//Square wave functions.	
	uint8_t set_square_volt_start(int16_t square_volt_s);
	int get_square_volt_start();
	
	uint8_t set_square_volt_end(int16_t square_volt_e);
	int get_square_volt_end();
	
	uint8_t set_square_amp(uint16_t square_a);
	uint16_t get_square_amp();
	
	uint8_t set_square_inc(uint16_t square_i);
	uint16_t get_square_inc();
	
	uint8_t set_square_period(uint16_t square_p);
	uint16_t get_square_period();
	
	//Arbitrary waveform functions.
	uint8_t set_arb_cyclic(bool arb_c);
	uint8_t get_arb_cyclic();
	
	uint8_t set_arb_cycles(uint8_t arb_cs);
	uint8_t get_arb_cycles();	
	
	//Low-pass filter functions.
	uint8_t set_soft_filt(bool soft_f);
	bool get_soft_filt();
	
	uint8_t set_soft_sel(uint8_t soft_s);
	uint8_t get_soft_sel();
	
	//Test state functions.
	uint8_t set_test_state(test_states test_s);
	test_states get_test_state();
	
	uint8_t set_test_type(test_types test_t);
	test_types get_test_type();
	
	private:
	//Main menu data.
	tx_modes tx_mode;
	num_elecs num_electrodes;
	uint16_t adc_rate;
	
	//TIA data.
	uint16_t tia_res_tap;
	uint8_t tia_cap_mask;
	
	//Deposition data.
	bool dep_enable;
	uint32_t dep_time;
	int16_t dep_volt;
	uint32_t quiet_time;
	bool dep_rec;
	
	//Linear sweep data.
	int16_t sweep_volt_start;
	int16_t sweep_volt_end;
	uint16_t sweep_rate;
	bool sweep_cyclic;
	uint8_t sweep_cycles;
	
	//Square wave data.
	int16_t square_volt_start;
	int16_t square_volt_end;
	uint16_t square_amp;
	uint16_t square_inc;
	uint16_t square_period;
	
	//Arbitrary waveform data.
	bool arb_cyclic;
	uint8_t arb_cycles;
	
	//Low-pass filter data.
	bool soft_filt;
	uint8_t soft_sel;
	
	//Test states.
	test_states test_state;
	test_types test_type;
};

#endif /* AS_CLASS_H_ */