#include <avr/io.h>
#include <avr/pgmspace.h>
#include "atmega_uart.h"

///Configure the UART.
void atmega_uart::uart_init(const uint16_t ubrr)
{
	UBRR0H = (uint8_t)(ubrr >> 8);							//Load upper ubrr byte.
	UBRR0L = (uint8_t)ubrr;									//Load lower ubrr byte.
	//UCSR0A = (1 << U2X0);									//Double speed mode.
	UCSR0B = (1 << RXCIE0) | (1 << RXEN0) | (1 << TXEN0);	//Enable RX interrupt, receive and transmit circuits.
	UCSR0C = (3 << UCSZ00);									//Use 8 bit bytes.
}

//Transmits a single byte out the UART.
void atmega_uart::tx_byte(const uint8_t data)
{
	while(!(UCSR0A & (1 << UDRE0))); //Wait for buffer to be free.
	UDR0 = data;
}

//Transmit 16-bit number.
void atmega_uart::tx_word(const uint16_t data)
{
	while(!(UCSR0A & (1 << UDRE0))); //Wait for buffer to be free.
	UDR0 = data >> 8;
	while(!(UCSR0A & (1 << UDRE0))); //Wait for buffer to be free.
	UDR0 = data;
}

//Transmit 32-bit number.
void atmega_uart::tx_dword(const uint32_t data)
{
	while(!(UCSR0A & (1 << UDRE0))); //Wait for buffer to be free.
	UDR0 = data >> 24;
	while(!(UCSR0A & (1 << UDRE0))); //Wait for buffer to be free.
	UDR0 = data >> 16;
	while(!(UCSR0A & (1 << UDRE0))); //Wait for buffer to be free.
	UDR0 = data >> 8;
	while(!(UCSR0A & (1 << UDRE0))); //Wait for buffer to be free.
	UDR0 = data;
}

//Transmits a string from RAM out the UART.
void atmega_uart::tx_string(const char *data)
{
	uint8_t tx_string_index = 0;
	
	while(data[tx_string_index])
	{
		tx_byte(data[tx_string_index++]);	//Transmit byte.
	}
}

//Transmits a string from program space out the UART.
void atmega_uart::tx_string_p(const char *data)
{
	while(pgm_read_byte(data))
	{
		tx_byte(pgm_read_byte(data));
			
		data++;
	}
}

//Transmit 0x01 for true, 0x00 for false.
void atmega_uart::tx_tf(const bool data)
{
	data ? atmega_uart::tx_byte(0x01) : atmega_uart::tx_byte(0x00);
}