#ifndef ATMEGA_TWI_H
#define ATMEGA_TWI_H

//I2C Defines.
#define	 START				0x08
#define  REPEAT_START		0x10
#define  MT_SLA_ACK			0x18
#define  MT_SLA_NACK		0x20
#define  MT_DATA_ACK		0x28
#define  MT_DATA_NACK		0x30
#define  MR_SLA_ACK			0x40
#define  MR_SLA_NACK		0x48
#define  MR_DATA_ACK		0x50
#define  MR_DATA_NACK		0x58
#define  ARB_LOST			0x38

class atmega_twi
{
	public:
	static void twi_master_init(void);
	static void i2c_start(uint8_t* errno);
	static void i2c_repeatStart(uint8_t* errno);
	static void i2c_sendAddress(const uint8_t address, uint8_t* errno);
	static void i2c_sendData(const uint8_t data, uint8_t* errno);
	static uint8_t i2c_receiveData_ACK(uint8_t* errno);
	static uint8_t i2c_receiveData_NACK(uint8_t* errno);
	static void i2c_stop();
};

#endif /*ATMEGA_TWI_H*/