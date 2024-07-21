#ifndef AQUASIFT_V0012_H_
#define AQUASIFT_V0012_H_

//Unique identifiers.
#define FIRMWARE "00.12"
#define PRODUCT_ID "AQS1"
#define BIN_FIRM_HI 0x00
#define BIN_FIRM_LO 0x12
#define BIN_PID1 'A'
#define BIN_PID2 'Q'
#define BIN_PID3 'S'
#define BIN_PID4 '1'

#define ZERO_VOLT 2047.0	//Zero voltage for the DAC.
#define V_PER_COUNT 805.664	//Voltage per ADC count x1M.
#define VPC_DIV_2 402.832

#define FOSC 7372800		//Clock frequency.	

//USART defines.
#define BAUD 230400			//Desired baud rate.
//#define BAUD 460800			//Desired baud rate.
#define UBRR FOSC/16/BAUD-1	//Baud rate calculation formula.

//Hardware timer calculation. Target is 1 ms interrupt.
#define INT_TIME FOSC/991

#define flgRXC0 0x80		//Receive complete flag.

#define OCAL 4				//Oscillator calibration header.

#define BIN_TIME_MAX 6		//Timeout in ms for binary transmissions.

//EEPROM addresses.
#define OSC_ADDR 130000		//EEPROM address of oscillation calibration value.
#define ARB_NUM 130002		//Stores number of arbitrary waveform entries.
#define ARB_START 0			//Starting address for arbitrary waveform data.

//Data stream defines.
#define DEP_DATA 0x8000			//Start deposition data stream.
#define QUIET_DATA 0x8100		//Start quiet time data.
#define LIN_DATA 0x8200			//Start linear sweep data.
#define DIF_PRE_DATA 0x8400		//Start differential pulse, pre-pulse data.
#define DIF_PLS_DATA 0x8500		//Start differential pulse, pulse data.
#define ARB_DATA 0x8600			//Start arbitrary waveform data.
#define TEST_ABORT 0xF000		//Test aborted indicator.
#define END_BLOCK 0xFF00		//End data block indicator.
#define END_TEST 0xFFF0			//End test indicator.

#endif /*AQUASIFT_V0010_H_*/