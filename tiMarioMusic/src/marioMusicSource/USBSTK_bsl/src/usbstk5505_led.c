//////////////////////////////////////////////////////////////////////////////
// * File name: usbstk5505_led.c
// *                                                                          
// * Description:  LED implementation.
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
#include "usbstk5505_led.h"
#include "soc.h"
#include "cslr_cpu.h"

/*
 *
 *  USBSTK5505_LED_init( )
 *
 *  Description
 *      Initializes LED.
 *
 */
Int16 USBSTK5505_LED_init( )
{
    /* Turn OFF all LEDs */
    return USBSTK5505_LED_off( 0 );
}


/*
 *
 *  USBSTK5505_LED_on( )
 *
 *  Description
 *      Turns on the XF LED.
 *
 */
Int16 USBSTK5505_LED_on()
{
    CSL_CPU_REGS->ST1_55 |= CSL_CPU_ST1_55_XF_MASK;
    return 0;
}

/*
 *
 *  USBSTK5505_LED_off( )
 *
 *  Description
 *      Turns off the XF LED.
 *
 */
Int16 USBSTK5505_LED_off()
{
    CSL_CPU_REGS->ST1_55 &= ~CSL_CPU_ST1_55_XF_MASK;
    return 0;
}

/*
 *
 *  USBSTK5505_LED_get( )
 *
 *  Description
 *      Returns the state of the XF LED.
 *
 */
Int16 USBSTK5505_LED_get()
{      
    return ((CSL_CPU_REGS->ST1_55 & CSL_CPU_ST1_55_XF_MASK) >> CSL_CPU_ST1_55_XF_SHIFT);
}

