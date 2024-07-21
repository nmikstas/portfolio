#ifndef ATMEGA_UART_H
#define ATMEGA_UART_H

//This class performs the primitive operations needed
//for UART functionality. All class members are static.
class atmega_uart
{
	public:
	static void uart_init(const uint16_t ubrr);
	static void tx_byte(const uint8_t data);
	static void tx_word(const uint16_t data);
	static void tx_dword(const uint32_t data);
	static void tx_string(const char *data);
	static void tx_string_p(const char *data);
	static void tx_tf(const bool data);
};

#endif /*ATMEGA_UART_H*/