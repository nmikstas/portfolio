#include <avr/io.h>
#include "atmega_twi.h"

//TWI initialize as master.
void atmega_twi::twi_master_init(void)
{
	TWCR = 0x00;	//disable twi.
	TWBR = 0x02;	//set bit rate 400KHz @ 8 MHz CPU clock.
	TWSR = 0x00;	//set prescale = 1.
	TWCR = 0x44;	//enable twi.
}

//Function to start i2c communication.  No return value.  Sets errno 
//with error code if function failed, clears errno if function successful.
void atmega_twi::i2c_start(uint8_t* errno)
{
	//Send START condition.
	TWCR = (1 << TWINT) | (1 << TWSTA) | (1 << TWEN);
	
	//Wait for TWINT flag set.
    while(!(TWCR & (1 << TWINT)));
	
	//Check value of TWI Status Register.
    (TWSR & 0xF8) == START ? (*errno) = 0 : (*errno) = (TWSR & 0xF8);
}

//Function for repeat start condition.  No return value.  Sets errno
//with error code if function failed, clears errno if function successful.
void atmega_twi::i2c_repeatStart(uint8_t* errno)
{
	//Send START condition.
    TWCR = (1 << TWINT) | (1 << TWSTA) | (1 << TWEN);
	
	//Wait for TWINT flag set. 
	while(!(TWCR & (1 << TWINT)));
	
	//Check value of TWI Status Register.
    (TWSR & 0xF8) == REPEAT_START ? (*errno) = 0 : (*errno) = (TWSR & 0xF8);
}

//Function to transmit address of the slave. No return value.  Sets errno
//with error code if function failed, clears errno if function successful.
void atmega_twi::i2c_sendAddress(const uint8_t address, uint8_t* errno)
{
	uint8_t ack;
   
	//Set ack based on whether receiving or transmitting.
	(address & 0x01) == 0 ? ack = MT_SLA_ACK : ack = MR_SLA_ACK;
	
	//Load SLA_W into TWDR Register. Clear TWINT bit to start transmission.
	TWDR = address; 
	TWCR = (1 << TWINT) | (1 << TWEN);
   
	//Wait for TWINT flag set.
	while(!(TWCR & (1 << TWINT)));
	
	//Check value of TWI Status Register.
	(TWSR & 0xF8) == ack ? (*errno) = 0 : (*errno) = (TWSR & 0xF8);
}

//Function to transmit a data byte.  No return value.  Sets errno
//with error code if function failed, clears errno if function successful.
void atmega_twi::i2c_sendData(const uint8_t data, uint8_t* errno)
{
	//Load SLA_W into TWDR Register. Clear TWINT bit to start transmission.
	TWDR = data; 
	TWCR = (1 << TWINT) | (1 << TWEN);	
	
	//Wait for TWINT flag set.
	while(!(TWCR & (1 << TWINT)));
	
	//Check value of TWI Status Register
	(TWSR & 0xF8) == MT_DATA_ACK ? (*errno) = 0 : (*errno) = (TWSR & 0xF8);
}

//Function to receive a data byte and send ACKnowledge.  Returns received data.
//Sets errno with error code if function failed, clears errno if function successful.
uint8_t atmega_twi::i2c_receiveData_ACK(uint8_t* errno)
{
	uint8_t data;
	
	//Start transmission.
	TWCR = (1 << TWEA) | (1 << TWINT) | (1 << TWEN);

	//Wait for TWINT flag set.
	while(!(TWCR & (1 << TWINT)));
	
	//Check value of TWI Status Register.
	(TWSR & 0xF8) == MR_DATA_ACK ? (*errno) = 0 : (*errno) = (TWSR & 0xF8);
  
	data = TWDR;
	return(data);
}

//Function to receive the last data byte (no acknowledge from master).  Returns received data.
//Sets errno with error code if function failed, clears errno if function successful.
uint8_t atmega_twi::i2c_receiveData_NACK(uint8_t* errno)
{
	uint8_t data;
  
	//Start transmission.
	TWCR = (1 << TWINT) | (1 << TWEN);
  
	//Wait for TWINT flag set.  
	while(!(TWCR & (1 << TWINT)));
	
	//Check value of TWI Status Register.   	   
	(TWSR & 0xF8) == MR_DATA_NACK ? (*errno) = 0 : (*errno) = (TWSR & 0xF8);
  
	data = TWDR;
	return(data);
}

//Function to end the i2c communication.   	
void atmega_twi::i2c_stop()
{
	//Transmit STOP condition.
	TWCR =  (1<<TWINT)|(1<<TWEN)|(1<<TWSTO);
}