#include <avr/io.h>
#include <avr/eeprom.h>
#include <avr/interrupt.h>
#include "atmega_eeprom.h"

//Write a 16-bit value to the EEPROM.
void atmega_eeprom::write_word(uint16_t *address, uint16_t data)
{
	cli();											//Disable interrupts.
	eeprom_write_word(address, data);				//Write data.
	eeprom_write_word((uint16_t *)EEPROM_PARK, 0);	//Park the pointer.
	sei();											//Enable interrupts.
}

//Read a 16-bit value from the EEPROM.
uint16_t atmega_eeprom::read_word(uint16_t *address)
{
	uint16_t read_data;
	
	cli();											//Disable interrupts.
	read_data = eeprom_read_word(address);			//Get data.
	sei();											//Enable interrupts.
	
	return read_data;
}

//Read a 16-bit value from the EEPROM without disabling the interrupt.
uint16_t atmega_eeprom::read_word_no_cli(uint16_t *address)
{
	return eeprom_read_word(address);
}

//Write an 8-bit value to the EEPROM. 8-bit addressing only.
void atmega_eeprom::write_byte(uint8_t *address, uint8_t data)
{
	cli();											//Disable interrupts.
	eeprom_write_byte(address, data);				//Write data.
	eeprom_write_byte((uint8_t *)EEPROM_PARK, 0);	//Park the pointer.
	sei();											//Enable interrupts.
}

//Read an 8-bit value from the EEPROM. 8-bit addressing only.
uint8_t atmega_eeprom::read_byte(uint8_t *address)
{
	uint8_t read_data;
	
	cli();											//Disable interrupts.
	read_data = eeprom_read_byte(address);			//Get data.
	sei();											//Enable interrupts.
	
	return read_data;
}