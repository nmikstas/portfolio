//////////////////////////////////////////////////////////////////////////////
// * File name: usbstk5505.c
// *                                                                          
// * Description:  Board Setup and functions.
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

/* 
 *  USBSTK5505_wait( delay )
 *
 *      Uint32 delay  <- Number of delay loops
 *
 *  Description
 *      Wait in a software loop for 'delay' loops.
 * 
 */
void USBSTK5505_wait( Uint32 delay )
{
    volatile Uint32 i;
    
    for ( i = 0 ; i < delay ; i++ ){ };
}

/*
 *
 *  USBSTK5505_waitusec( usec )
 * 
 *      Uint32 usec  <- Time in microseconds
 *  
 *  Description
 *      Wait in a software loop for 'usec' microseconds.
 *
 */
void USBSTK5505_waitusec( Uint32 usec )
{
    USBSTK5505_wait( (Uint32)usec * 8 );
}


/*
 *
 *  USBSTK5505_init( )
 *
 *  Description
 *      Setup board board functions.
 *
 */
Int16 USBSTK5505_init( )
{
    /* Enable clocks to all peripherals */
    CSL_SYSCTRL_REGS->PCGCR1 = 0x0000;
    CSL_SYSCTRL_REGS->PCGCR2 = 0x0000;
    
    return 0;
}
