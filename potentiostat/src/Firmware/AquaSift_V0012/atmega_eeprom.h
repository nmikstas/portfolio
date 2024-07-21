#ifndef ATMEGA_EEPROM_H
#define ATMEGA_EEPROM_H

#define EEPROM_PARK 0

class atmega_eeprom
{
	public:
	static void write_word(uint16_t *address, uint16_t data);	//Write a 16-bit value to the EEPROM.
	static uint16_t read_word(uint16_t *address);				//Read a 16-bit value from the EEPROM.
	static uint16_t read_word_no_cli(uint16_t *address);		//Read a 16-bit value from the EEPROM without disabling the interrupt.
	static void write_byte(uint8_t *address, uint8_t data);		//Write an 8-bit value to the EEPROM.
	static uint8_t read_byte(uint8_t *address);					//Read an 8-bit value from the EEPROM.
};
#endif /* ATMEGA_EEPROM_H */