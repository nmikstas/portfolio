/************************************************************************
*																		*
*	CerebotNano.h	--	General Cerebot Nano Interface Declarations		*
*																		*
*************************************************************************
*	Author:		Mark Taylor												*
*	Copyright 2008, Digilent Inc.										*
*************************************************************************
*	Module Description:													*
*																		*
*	This header file contains symbol declarations describing ports and	*
*	pins for access to the on-board i/o devices and interface connector	*
*	pins on the Digilent Cerebot Nano board.							*
*																		*
*************************************************************************
*	Revision History:													*
*																		*
*	01/03/2008 (MarkT) : created 										*
*																		*
*************************************************************************
*	Programming considerations:											*
*																		*
*	The onboard LEDs share pins as follows:								*
*		LED1 <--> JB8,	(PD5)											*
*		LED2 <--> JA10,	(PD3)											*
*		LED3 <--> JB7,	(PD4)											*
*		LED4 <--> JA7,	(PD2)											*
*																		*
************************************************************************/

/* ---------------------------------------------------------------
				On-Board I/O Declarations
   --------------------------------------------------------------- */

#define	prtLed1		PORTD
#define	prtLed2		PORTD
#define	prtLed3		PORTD
#define prtLed4		PORTD

#define	ddrLed1		DDRD
#define	ddrLed2		DDRD
#define	ddrLed3		DDRD
#define ddrLed4		DDRD

#define	bnLed1		5
#define	bnLed2		3
#define	bnLed3		4
#define bnLed4		2


/* ---------------------------------------------------------------
				General Purpose Port Declarations
   --------------------------------------------------------------- */
//Port JA
#define prtJA1		PORTC
#define prtJA2		PORTC
#define prtJA3		PORTC
#define prtJA4		PORTC
#define prtJA7		PORTD
#define prtJA8		PORTB
#define prtJA9		PORTB
#define prtJA10		PORTD

#define ddrJA1		DDRC
#define ddrJA2		DDRC
#define ddrJA3		DDRC
#define ddrJA4		DDRC
#define ddrJA7		DDRD
#define ddrJA8		DDRB
#define ddrJA9		DDRB
#define ddrJA10		DDRD

#define pinJA1		PINC
#define pinJA2		PINC
#define pinJA3		PINC
#define pinJA4		PINC
#define pinJA7		PIND
#define pinJA8		PINB
#define pinJA9		PINB
#define pinJA10		PIND

#define bnJA1		0
#define bnJA2		1
#define bnJA3		2
#define bnJA4		3
#define bnJA7		2
#define bnJA8		1
#define bnJA9		0
#define bnJA10		3

//Port JB
#define prtJB1		PORTC
#define prtJB2		PORTC
#define prtJB3		PORTD
#define prtJB4		PORTD
#define prtJB7		PORTD
#define prtJB8		PORTD
#define prtJB9		PORTD
#define prtJB10		PORTD

#define ddrJB1		DDRC
#define ddrJB2		DDRC
#define ddrJB3		DDRD
#define ddrJB4		DDRD
#define ddrJB7		DDRD
#define ddrJB8		DDRD
#define ddrJB9		DDRD
#define ddrJB10		DDRD

#define pinJB1		PINC
#define pinJB2		PINC
#define pinJB3		PIND
#define pinJB4		PIND
#define pinJB7		PIND
#define pinJB8		PIND
#define pinJB9		PIND
#define pinJB10		PIND

#define bnJB1		5
#define bnJB2		4
#define bnJB3		0
#define bnJB4		1
#define bnJB7		4
#define bnJB8		5
#define bnJB9		6
#define bnJB10		7

/* ---------------------------------------------------------------
				Interface Connector Declarations
   --------------------------------------------------------------- */

// Symbol definitions for access to the SPI connector
#define	prtSpi		PORTB
#define	pinSpi		PINB
#define	ddrSpi		DDRB

#define	bnSpiSS		2
#define	bnSpiMosi	3
#define	bnSpiMiso	4
#define	bnSpiSck	5

#define	prtSpi1		PORTB
#define	prtSpi2		PORTB
#define	prtSpi3		PORTB
#define	prtSpi4		PORTB

#define	pinSpi1		PINB
#define	pinSpi2		PINB
#define	pinSpi3		PINB
#define	pinSpi4		PINB

#define	ddrSpi1		DDRB
#define	ddrSpi2		DDRB
#define	ddrSpi3		DDRB
#define	ddrSpi4		DDRB

#define	bnSpi1		2
#define	bnSpi2		3
#define	bnSpi3		4
#define	bnSpi4		5


// Symbol definitions for access to the TWI connector
#define	prtTwi		PORTC
#define	pinTwi		PINC
#define	ddrTwi		DDRC

#define	bnTwiScl	5
#define	bnTwiSda	4

#define	prtTwiPU	PORTB
#define	pinTwiPU	PINB
#define	ddrTwiPU	DDRB

#define	bnSclPU		6
#define	bnSdaPU		7

// Symbol definitions for access to the UART

#define ddrUart		DDRD
#define prtUart		PORTD
#define bnTx		1
#define bnRx		0


/***************************************************************/







