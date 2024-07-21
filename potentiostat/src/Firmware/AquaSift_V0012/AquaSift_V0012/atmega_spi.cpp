#include <avr/io.h>
#include "atmega_spi.h"

//Setup all registers required for an spi master.
void atmega_spi::spi_master_init()
{
	//Set pins as outputs.
	ddrMOSI |= (1 << MOSI);
	ddrSCK  |= (1 << SCK);
	ddrSS   |= (1 << SS);
	
	//Enable SPI controller and clock it at system clock speed / 2.
	SPCR = (1 << SPE) | (1 << MSTR) | (1 << SPR0);
	//SPSR |= (1 << SPI2X);
	
	//Turn on pull-up resistors.
	prtMOSI |= (1 << MOSI);
	prtMISO |= (1 << MISO);
}

//Send data byte.
void atmega_spi::spi_write(uint8_t data)
{
	SPDR = data;
	while(!(SPSR & (1 << SPIF))){}
}

//Receive data byte.
uint8_t atmega_spi::spi_read()
{	
	SPDR = 0xFF;
	while(!(SPSR & (1 << SPIF))){}
	return SPDR;
}
