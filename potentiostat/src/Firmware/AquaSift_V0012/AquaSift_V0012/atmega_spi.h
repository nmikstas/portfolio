#ifndef ATMEGA_SPI_H
#define ATMEGA_SPI_H

//SPI control signal port numbers.
#define prtSS   PORTB
#define prtMOSI PORTB
#define prtMISO PORTB
#define prtSCK  PORTB

//Direction ports.
#define ddrSS   DDRB
#define ddrMOSI DDRB
#define ddrMISO DDRB
#define ddrSCK  DDRB

//SPI control signal bit numbers.
#define SS   2
#define MOSI 3
#define MISO 4
#define SCK  5

//This class performs the primitive operations needed
//for SPI functionality. All class members are static.
class atmega_spi
{
	public:
	static void spi_master_init();
	static void spi_write(uint8_t data);
	static uint8_t spi_read();
};

#endif /*ATMEGA_SPI_H*/