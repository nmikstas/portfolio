//////////////////////////////////////////////////////////////////////////////
// * File name: usbstk5505_spirom.c
// *                                                                          
// * Description:  SPI ROM interface.
// *                                                                          
// * Copyright (C) 2010 Texas Instruments Incorporated - http://www.ti.com/ 
// * Copyright (C) 2010 Spectrum Digital, Incorporated
// *                                                                          
// *                                                                          
// *  Redistribution and use in source and binary forms, with or without      
// *  modification, are permitted provided that the following conditions      
// *  are met:                                                                
// *                                                                          
// *    Redistributions of source code must retain the above copyright        
// *    notice, this list of conditions and the following disclaimer.         
// *                                                                          
// *    Redistributions in binary form must reproduce the above copyright     
// *    notice, this list of conditions and the following disclaimer in the   
// *    documentation and/or other materials provided with the                
// *    distribution.                                                         
// *                                                                          
// *    Neither the name of Texas Instruments Incorporated nor the names of   
// *    its contributors may be used to endorse or promote products derived   
// *    from this software without specific prior written permission.         
// *                                                                          
// *  THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS     
// *  "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT       
// *  LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR   
// *  A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT    
// *  OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL,   
// *  SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT        
// *  LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE,   
// *  DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY   
// *  THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT     
// *  (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE   
// *  OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.    
// *                                                                          
//////////////////////////////////////////////////////////////////////////////

#include "usbstk5505.h"
#include "usbstk5505_spirom.h"
#include "csl_spi.h"

static Uint16 spirombuf[spirom_PAGESIZE + 8];
static Uint16 statusbuf[8];
CSL_SpiHandle   hSpi;

/*
 *  USBSTK5505_SPIROM_init( )
 *
 *  Description
 *      Enables and configures SPI for the SPIROM
 *      ( CS0, EBSR Mode 1, 8-bit, 100KHz clock )
 *
 */
Int16 USBSTK5505_SPIROM_init( )
{
    SPI_Config      hwConfig;
    Int16           result = 0;

    hSpi->configured = FALSE;   // Set as unconfigured
    hSpi = NULL;                // Remove previous settings
    result += SPI_init();       // Enable SPI
    hSpi = SPI_open(SPI_CS_NUM_0, SPI_POLLING_MODE); // Enable CS0
    CSL_SYSCTRL_REGS->EBSR = (CSL_SYSCTRL_REGS->EBSR 
                                 & 0x0fff) | 0x1000; // EBSR Mode 1 (7 SPI pins)

    /* Configuration for SPIROM */
    hwConfig.wLen       = SPI_WORD_LENGTH_8;    // 8-bit
    hwConfig.spiClkDiv  = 0x00b1;               // 100KHz clock (12MHz / 120)
    hwConfig.csNum      = SPI_CS_NUM_0;         // Select CS0
    hwConfig.frLen      = 1;
    hwConfig.dataDelay  = SPI_DATA_DLY_0;
    hwConfig.clkPol     = SPI_CLKP_LOW_AT_IDLE;
    
    /* Configure SPIROM */
    result += SPI_config(hSpi, &hwConfig);
    
    return result;  
}

/*
 *  USBSTK5505_SPIROM_status( )  
 *
 *     Returns: Uint16 statusbuf[0]  <- Value of SPIROM Status Register
 * 
 *  Description
 *      Returns the SPIROM Status Register
 *
 */
Uint16 USBSTK5505_SPIROM_status( )  
{
    Int16 result;
    
    /* Issue read status command */
    statusbuf[0] = spirom_CMD_RDSR;
    
    /* Send read status command */
    CSL_SPI_REGS->SPICMD1 = 0x0000 | 1;
    result = SPI_dataTransaction(hSpi ,statusbuf, 1, SPI_WRITE );
    result = SPI_dataTransaction(hSpi ,statusbuf, 1, SPI_READ);

    return statusbuf[0];
}

/*
 *  USBSTK5505_SPIROM_read( src, dst, len )
 *      Uint16 src   <-  Source from SPIROM
 *      Uint16 dst   <-  Destination in memory
 *      Uint32 len   <-  Length of block of data
 *
 *  Description
 *      Read chunk of data from "src" that is "len" long
 *      and copy it to "dst".
 *
 */
Int16 USBSTK5505_SPIROM_read( Uint16 src, Uint32 dst, Uint32 len )
{
    Int16 i, result = 0;
    Uint16 *psrc, *pdst;

    /* Setup command */
    spirombuf[0] = spirom_CMD_READ;
    spirombuf[1] = ( src >> 8 );
    spirombuf[2] = ( src >> 0 );

    /* Execute spirom read cycle */
    CSL_SPI_REGS->SPICMD1 = 0x0000 | len + 3 - 1;
    result += SPI_dataTransaction(hSpi ,spirombuf, 3, SPI_WRITE);
    result += SPI_dataTransaction(hSpi ,spirombuf, len, SPI_READ);

    /* Copy returned data */
    pdst = ( Uint16 * )dst;
    psrc = spirombuf;
    for ( i = 0 ; i < len ; i++ )
        *pdst++ = *psrc++;
        
    return result;
}

/*
 *  USBSTK5505_SPIROM_write( src, dst, len )
 *      Uint32 src   <-  Source from memory
 *      Uint16 dst   <-  Destination in SPIROM
 *      Uint32 len   <-  Length of block of data
 *
 *  Description
 *      Write chunk of data from "src" that is "len" long
 *      to the location "dst".
 *
 */
Int16 USBSTK5505_SPIROM_write( Uint32 src, Uint16 dst, Uint32 len )
{
    Int16 i, result = 0;
    Int32 bytes_left;
    Int32 bytes_to_program;
    Uint16 *psrc;

    /* Establish source */
    psrc = ( Uint16 * )src;
    bytes_left = len;

    /* SPIROM write loop */
    while ( bytes_left > 0 )
    {
        bytes_to_program = bytes_left;
        
        /* Most to program is spirom_PAGESIZE */
        if ( bytes_to_program > spirom_PAGESIZE )  
             bytes_to_program = spirom_PAGESIZE;
             
        /* Make sure you don't run off the end of a block */
        if ( ( dst & spirom_PAGEMASK ) != ( ( dst + bytes_to_program ) & spirom_PAGEMASK ) )
            bytes_to_program -= ( dst + bytes_to_program ) - ( ( dst + bytes_to_program ) & spirom_PAGEMASK );

        /* Issue WPEN */
        CSL_SPI_REGS->SPICMD1 = 0x0000 | 0;
        spirombuf[0] = spirom_CMD_WREN;
        result += SPI_dataTransaction(hSpi ,spirombuf, 1, SPI_WRITE);
        while( ( USBSTK5505_SPIROM_status( ) & 0x01 ) );
        
        /* Create command block for program operation */
        spirombuf[0] = spirom_CMD_WRITE;
        spirombuf[1] = ( Uint16 )( dst >> 8 );
        spirombuf[2] = ( Uint16 )( dst );

        /* Execute write command */
        CSL_SPI_REGS->SPICMD1 = 0x0000 | len + 3 - 1;
        result += SPI_dataTransaction(hSpi ,spirombuf, 3, SPI_WRITE);
        
        /* Load source to spirombuf */
        for ( i = 0 ; i < bytes_to_program ; i++ )
        spirombuf[i] = *psrc++;
        
        /* Send data to write */
        result += SPI_dataTransaction(hSpi ,spirombuf, len, SPI_WRITE);

        /* Wait while busy */
        while( ( USBSTK5505_SPIROM_status( ) & 0x01 ) );

        /* Get ready for next iteration */
        bytes_left -= bytes_to_program;
        dst += bytes_to_program;
    }
    
    return result;
}
