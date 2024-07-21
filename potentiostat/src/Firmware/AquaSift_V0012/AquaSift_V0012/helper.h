#ifndef HELPER_H_
#define HELPER_H_

//32-bit defines.
#define U32_MAX 4294967295UL
#define INT_MAX 2147483647UL
#define INT_MIN 2147483648UL

//I2C read/write addresses.
#define I2C_POT_R_ADDR 0x59
#define I2C_POT_W_ADDR 0x58
#define I2C_ANS_R_ADDR 0x97
#define I2C_ANS_W_ADDR 0x96

//Analog switch channel masks.
#define ANS_CE 0x01
#define ANS_2_ELEC 0x02

//Oscillator calibration states.
enum cal_states{CALREADY, CALSTART, CALSTOP};

//UART receive max string length.
#define RX_ARRAY_LENGTH	25
#define BIN_RX_LENGTH 9

//Error defines.
#define ER_NO_ERROR 0
#define ER_ERROR 1

//Binary error defines.
#define ER_BIN_NO_ERR 0			//No error.
#define ER_BIN_VAL_LOW 1		//Value low.
#define ER_BIN_VAL_HIGH 2		//Value high.
#define ER_BIN_INV_PARAM 3		//Invalid parameter.
#define ER_BIN_AR_OVERFLOW 4	//Input array overflow.
#define ER_BIN_MEM_FULL 5		//EEPROM memory full.
#define ER_BIN_INV_CMD 6		//Invalid binary command.
#define ER_BIN_DIF_RANGE 7		//Dif pulse start/end volt plus amplitude out of range.
#define ER_BIN_SAMP_WIN 8		//Dif pulse sampling window too wide.

//Binary commands.
#define BIN_GET_TX1 0x54		//Get transmission mode.
#define BIN_GET_TX2 0x74		//Get transmission mode.
#define BIN_STRT_LIN1 0x4C		//Start linear sweep test.
#define BIN_STRT_LIN2 0x6C		//Start linear sweep test.
#define BIN_STRT_DIF1 0x44		//Start differential pulse test.
#define BIN_STRT_DIF2 0x64		//Start differential pulse test.
#define BIN_STRT_ARB1 0x41		//Start arbitrary waveform test.
#define BIN_STRT_ARB2 0x61		//Start arbitrary waveform test.
#define BIN_ABRT1 0x58			//Abort test.
#define BIN_ABRT2 0x78			//Abort test.

#define BIN_TX 0x01				//Set transmission mode.
#define BIN_ELECS 0x02			//Set electrode configuration.
#define BIN_ADC 0x03			//Set ADC rate.
#define BIN_SET 0x0A			//Get settings.
#define BIN_RES 0x0B			//Set TIA resistor.

#define BIN_DEP_EN 0x0C			//Set deposition enable. 
#define BIN_DEP_T 0x0D			//Set deposition time.
#define BIN_DEP_V 0x0E			//Set deposition voltage.
#define BIN_QUIET_T 0x0F		//Set quiet time.
#define BIN_DEP_REC 0x10		//Set deposition record.

#define BIN_LIN_SV 0x11			//Set linear sweep start voltage.
#define BIN_LIN_EV 0x12			//Set linear sweep end voltage.
#define BIN_LIN_SR 0x13			//Set linear sweep rate.
#define BIN_LIN_C 0x14			//Set linear sweep cyclic.
#define BIN_LIN_CS 0x15			//Set linear sweep cycles.

#define BIN_DIF_SV 0x16			//Set differential start voltage.
#define BIN_DIF_EV 0x17			//Set differential end voltage.
#define BIN_DIF_INC 0x18		//Set differential increment.
#define BIN_DIF_AMP 0x19		//Set differential amplitude.
#define BIN_DIF_PRE 0x1A		//Set differential step time.
#define BIN_DIF_PLS 0x1B		//Set differential pulse time.
#define BIN_DIF_WIN 0x1C		//Set differential sampling window width.

#define BIN_ARB_AE 0x1D			//Append arbitrary waveform entry.
#define BIN_ARB_RE 0x1E			//Replace arbitrary waveform entry.
#define BIN_ARB_DLE 0x1F		//Delete last arbitrary waveform entry.
#define BIN_ARB_DAE 0x20		//Delete all arbitrary waveform entries.
#define BIN_ARB_SV 0x21			//Get arbitrary waveform data.

#define BIN_LPF_SF 0x22			//Set low-pass filter selection.

//Polarity defines.
#define POSITIVE 0
#define NEGATIVE 1

//ADC control defines.
#define prtADCS PORTB
#define ddrADCS DDRB
#define ADCS 1

//DAC control defines
#define prtDACS PORTB
#define ddrDACS DDRB
#define DACS 2

//FRAM1 control defines.
#define prtRCS1 PORTD
#define ddrRCS1 DDRD
#define RCS1 3

//FRAM2 control defines.
#define prtRCS2 PORTD
#define ddrRCS2 DDRD
#define RCS2 4

//FRAM opcodes.
#define FRAM_WREN  0x06 //Set write enable latch
#define FRAM_WRDI  0x04 //Reset write enable latch
#define FRAM_RDSR  0x05 //Read Status Register
#define FRAM_WRSR  0x01 //Write Status Register
#define FRAM_READ  0x03 //Read memory data
#define FRAM_FSTRD 0x0B //Fast read memory data
#define FRAM_WRITE 0x02 //Write memory data
#define FRAM_SLEEP 0xB9 //Enter sleep mode
#define FRAM_RDID  0x9F //Read device ID
#define FRAM_SNR   0xC3 //Read S/N

//Initialization and Configuration Routines.
void init_processor(as_class *as);
void init_i2c_devices(as_class *as);
void i2c_load_electrodes(as_class *as);
void i2c_load_res(as_class *as);
void calibrate_osc();
void i2c_connect_ce();
void i2c_disconnect_ce();

//ADC and DAC routines.
void write_dac(uint16_t data);
uint16_t read_adc();

//FRAM routines.
void fram1_set_write_en(void);
void fram1_write_byte(uint32_t address, uint8_t data);
uint8_t fram1_read_byte(uint32_t address);
void fram1_write_word(uint32_t address, uint16_t data);
uint16_t fram1_read_word(uint32_t address);
void fram_read_arb_block(uint32_t *addr, int16_t *sv, int16_t *ev, uint16_t *rt);

//DSP Routines.
uint16_t lpf(uint16_t input, as_class *as);

//String Manipulation Routines.
void tx_u16_to_ascii(uint16_t number);
void tx_int_to_ascii(int32_t number);
void tx_u32_to_ascii(uint32_t number);
uint32_t string_to_u32(const uint8_t *array, uint8_t *errno, uint8_t term);
int32_t string_to_int(const uint8_t *array, uint8_t *errno, uint8_t term);
int32_t string_to_int_p(const uint8_t *array, uint8_t *errno, uint8_t *pend, uint8_t term);
uint16_t load_u16(const uint8_t *array);
int16_t load_int16(const uint8_t *array);
uint32_t load_u32(const uint8_t *array);

//Menu Writing Routines.
void uart_print_settings(as_class *as);
void uart_yes_no(bool yes_no);
void uart_min_max_u32(uint32_t min, uint32_t max);
void uart_min_max_int(int min, int max);
void uart_true_false(bool t_f);
void uart_print_spaces();
void uart_err();
void uart_ok();

//Update Menu Items Routines (ASCII).
void uart_tokenizer(uint8_t rx_byte, as_class *as);

//Append value at end of arbitrary waveform list.
uint8_t arb_append(const uint8_t *rx_array);

//Replace value in the arbitrary waveform list.
uint8_t arb_replace(const uint8_t *rx_array);

//Set value in as_class object that is a bool value (ASCII).
uint8_t set_bool(const uint8_t *rx_array, as_class *as, uint8_t (as_class::*)(bool));

//Set value in as_class object that is an unsigned 8 bit value (ASCII).
uint8_t set_u8(const uint8_t *rx_array, as_class *as, uint8_t (as_class::*)(uint8_t));

//Set value in as_class object that is a signed 16 bit value (ASCII).
uint8_t set_int16(const uint8_t *rx_array, as_class *as, uint8_t (as_class::*)(int16_t));

//Set value in as_class object that is an unsigned 16 bit value (ASCII).
uint8_t set_u16(const uint8_t *rx_array, as_class *as, uint8_t (as_class::*)(uint16_t));

//Set value in as_class object that is an unsigned 32 bit value (ASCII).
uint8_t set_u32(const uint8_t *rx_array, as_class *as, uint8_t (as_class::*)(uint32_t));

//Update input array function(binary).
void bin_build_array(uint8_t rx_byte);
void bin_tokenize(as_class *as);
#endif