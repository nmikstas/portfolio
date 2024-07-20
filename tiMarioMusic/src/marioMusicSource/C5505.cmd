/*
 * c5505.cmd
 *
 *  Created on: Mar 17, 2012
 *      Author: BLEE, modified
 *
 *  For the book "Real Time Digital Signal Processing:
 *                Fundamentals, Implementation and Application, 3rd Ed"
 *                By Sen M. Kuo, Bob H. Lee, and Wenshun Tian
 *                Publisher: John Wiley and Sons, Ltd
 */
/*
 * File name: C5505.cmd
 *                                                                          
 * Description: This file provides memory map and section map.
 *                                                                          
 * Copyright (C) 2009 Texas Instruments Incorporated - http://www.ti.com/ 
 *                                                                          
 *                                                                          
 *  Redistribution and use in source and binary forms, with or without      
 *  modification, are permitted provided that the following conditions      
 *  are met:                                                                
 *                                                                          
 *    Redistributions of source code must retain the above copyright        
 *    notice, this list of conditions and the following disclaimer.         
 *                                                                          
 *    Redistributions in binary form must reproduce the above copyright     
 *    notice, this list of conditions and the following disclaimer in the   
 *    documentation and/or other materials provided with the                
 *    distribution.                                                         
 *                                                                          
 *    Neither the name of Texas Instruments Incorporated nor the names of   
 *    its contributors may be used to endorse or promote products derived   
 *    from this software without specific prior written permission.         
 *                                                                          
 *  THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS     
 *  "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT       
 *  LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR   
 *  A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT    
 *  OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL,   
 *  SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT        
 *  LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE,   
 *  DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY   
 *  THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT     
 *  (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE   
 *  OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.    
 *                                                                          
*/


/******************************************************************************/
/* C5505.cmd - COMMAND FILE FOR LINKING C PROGRAMS IN LARGE/HUGE MEMORY MODEL  */
/******************************************************************************/

-stack    0x2000      /* Primary stack size   */
-sysstack 0x1000      /* Secondary stack size */
-heap     0x2000      /* Heap area size       */

-c                    /* Use C linking conventions: auto-init vars at runtime */
-u _Reset             /* Force load of reset interrupt handler                */

MEMORY
{
    MMR     (RW) : origin = 0000000h length = 0000c0h   /* MMRs */
    DARAM (RW)    : origin = 00000c0h length = 00ff40h  /* On-chip DARAM */
    SARAM   (RW)  : origin = 0030000h length = 01e000h  /* On-chip SARAM */

    SAROM_0 (RX)  : origin = 0fe0000h length = 008000h 	/* On-chip ROM 0 */
    SAROM_1 (RX)  : origin = 0fe8000h length = 008000h 	/* On-chip ROM 1 */
    SAROM_2 (RX)  : origin = 0ff0000h length = 008000h 	/* On-chip ROM 2 */
    SAROM_3 (RX)  : origin = 0ff8000h length = 008000h 	/* On-chip ROM 3 */
    
    EMIF_CS0 (RW)  : origin = 0050000h  length = 07B0000h   /* mSDR */ 
	EMIF_CS2 (RW)  : origin = 0800000h  length = 0400000h   /* ASYNC1 : NAND */ 
	EMIF_CS3 (RW)  : origin = 0C00000h  length = 0200000h   /* ASYNC2 : NAND  */
	EMIF_CS4 (RW)  : origin = 0E00000h  length = 0100000h   /* ASYNC3 : NOR */
	EMIF_CS5 (RW)  : origin = 0F00000h  length = 00E0000h   /* ASYNC4 : SRAM */

}


SECTIONS
{
    vectors (NOLOAD)
    .bss        : > DARAM /*, fill = 0 */
    vector      : > DARAM      ALIGN = 256 
    .stack      : > DARAM  
    .sysstack   : > DARAM  
	.sysmem 	: > DARAM 
    .text       : > SARAM  
    .data       : > DARAM
	.cinit 		: > DARAM
	.const 		: > DARAM
	.cio		: > DARAM
	.usect   	: > DARAM
	.switch     : > DARAM 
	.emif_cs0   : > EMIF_CS0
	.emif_cs2   : > EMIF_CS2
	.emif_cs3   : > EMIF_CS3
	.emif_cs4   : > EMIF_CS4
	.emif_cs5   : > EMIF_CS5


}

/* HWAFFT Routines ROM Addresses */
/* (PG 2.0) */
_hwafft_br = 0x00ff6cd6;
_hwafft_8pts = 0x00ff6cea;
_hwafft_16pts = 0x00ff6dd9;
_hwafft_32pts = 0x00ff6f2f;
_hwafft_64pts = 0x00ff7238;
_hwafft_128pts = 0x00ff73cd;
_hwafft_256pts = 0x00ff75de;
_hwafft_512pts = 0x00ff77dc;
_hwafft_1024pts = 0x00ff7a56;
