;+------------------------------------------------------------------------------------------------------------+;
;|                                                   Defines                                                  |;
;+------------------------------------------------------------------------------------------------------------+;

;Special function registers and direct addressing registers.  Registers starting with
;a double underscore (__) are undefined and should not be used.

;===============================================Register Defines===============================================;

.equ R0BNK0, $00
.equ R1BNK0, $01
.equ R2BNK0, $02
.equ R3BNK0, $03
.equ R4BNK0, $04
.equ R5BNK0, $05
.equ R6BNK0, $06
.equ R7BNK0, $07
.equ R0BNK1, $08
.equ R1BNK1, $09
.equ R2BNK1, $0a
.equ R3BNK1, $0b
.equ R4BNK1, $0c
.equ R5BNK1, $0d
.equ R6BNK1, $0e
.equ R7BNK1, $0f
.equ R0BNK2, $10
.equ R1BNK2, $11
.equ R2BNK2, $12
.equ R3BNK2, $13
.equ R4BNK2, $14
.equ R5BNK2, $15
.equ R6BNK2, $16
.equ R7BNK2, $17
.equ R0BNK3, $18
.equ UPPER_MS_DELAY,    $19             ;Used in millisecond timer - upper byte.
.equ LOWER_MS_DELAY,    $1a             ;Used in millisecond timer - lower byte.
.equ R3BNK3, $1b
.equ R4BNK3, $1c
.equ R5BNK3, $1d
.equ R6BNK3, $1e
.equ R7BNK3, $1f
.equ R20, $20                           ;Contains various bit flags.
.equ I2CS_CPY,          $21             ;Stores copy of I2CS register.
.equ I2CDAT_CPY,        $22             ;Stores copy of I2CDAT register.
.equ I2CTL_CPY,         $23             ;Stores copy of I2CTL register.
.equ I2CSTAT,           $24             ;Status of Current I2C transfer.
.equ R25, $25
.equ R26, $26
.equ R27, $27
.equ R28, $28
.equ R29, $29
.equ R2A, $2a
.equ R2B, $2b
.equ R2C, $2c
.equ R2D, $2d
.equ R2E, $2e
.equ R2F, $2f
.equ R30, $30
.equ R31, $31
.equ R32, $32
.equ R33, $33
.equ R34, $34
.equ FIRMWARE_MAJ_PNTR, $35             ;Pointer to 7 seg digit for firmware major number.
.equ R36, $36
.equ FIRMWARE_MIN_PNTR, $37             ;Pointer to 7 seg digit for firmware minor number.
.equ CONFIG_BYTE,       $38             ;Stores set/get config value. Has no real function.                     
.equ TEMP_ACC,          $39             ;Temp storage of accumulator in interrupts.
.equ TEMP_DPH0,         $3a             ;Temp storage of data pointer in interrupts.
.equ TEMP_DPL0,         $3b             ;Temp storage of data pointer in interrupts.
.equ REP_DESC_HI,       $3c             ;Record descriptor pointer, high byte.
.equ REP_DESC_LO,       $3d             ;Record descriptor pointer, low byte.
.equ R3E, $3e
.equ R3F, $3f
.equ R40, $40
.equ CFG_DESC_HS_HI,    $41             ;High-speed configuration descriptor pointer, high byte.
.equ CFG_DESC_HS_LO,    $42             ;High-speed configuration descriptor pointer, low byte.
.equ DEV_DESC_HI,       $43             ;Device descriptor pointer, high byte.
.equ DEV_DESC_LO,       $44             ;Device descriptor pointer, low byte.
.equ THIS_CFG_HI,       $45             ;Current configuration descriptor pointer, high byte.
.equ THIS_CFG_LO,       $46             ;Current configuration descriptor pointer, low byte.
.equ OS_CFG_HI,         $47             ;Other speed configuration descriptor pointer, high byte.
.equ OS_CFG_LO,         $48             ;Other speed configuration descriptor pointer, low byte.
.equ CFG_DESC_FS_HI,    $49             ;Full-speed configuration descriptor pointer, high byte.
.equ CFG_DESC_FS_LO,    $4a             ;Full-speed configuration descriptor pointer, low byte.
.equ DEV_QUAL_HI,       $4b             ;Device qualifier pointer, high byte.
.equ DEV_QUAL_LO,       $4c             ;Device qualifier pointer, low byte.
.equ STRING_DESC_HI,    $4d             ;String descriptor pointer, high byte.
.equ STRING_DESC_LO,    $4e             ;String descriptor pointer, low byte.
.equ INTERFACE_BYTE,    $4f             ;Stores set/get interface value. Has no real function.
.equ LAST_SW_STATE,     $50             ;Stores the last state of the switches.
.equ I2CBYTE0,          $51             ;
.equ I2CBYTE1,          $52             ;Storage for I2C data bytes read from bus.
.equ I2CBYTE2,          $53             ;
.equ I2CBYTE3,          $54             ;
.equ HEX_LO,            $55             ;Upper and lower ascii characters of hex values.
.equ HEX_HI,            $56             ;
.equ BTN_LO,            $57             ;Storage of button statuses.
.equ BTN_HI,            $58             ;
.equ DPAD,              $59             ;Storage of Dpad bits.
.equ I2CWAITLO,         $5a
.equ I2CWAITHI,         $5b
.equ R5C, $5c
.equ R5D, $5d
.equ R5E, $5e
.equ R5F, $5f
.equ R60, $60
.equ R61, $61
.equ R62, $62
.equ R63, $63
.equ R64, $64
.equ R65, $65
.equ R66, $66
.equ R67, $67
.equ R68, $68
.equ R69, $69
.equ R6A, $6a
.equ R6B, $6b
.equ R6C, $6c
.equ R6D, $6d
.equ R6E, $6e
.equ R6F, $6f
.equ R70, $70
.equ R71, $71
.equ R72, $72
.equ R73, $73
.equ R74, $74
.equ R75, $75
.equ R76, $76
.equ R77, $77
.equ R78, $78
.equ R79, $79
.equ R7A, $7a
.equ R7B, $7b
.equ R7C, $7c
.equ R7D, $7d
.equ R7E, $7e
.equ R7F, $7f
.equ IOA, $80
.equ SP, $81
.equ DPL0, $82
.equ DPH0, $83
.equ DPL1, $84
.equ DPH1, $85
.equ DPS, $86
.equ PCON, $87
.equ TCON, $88
.equ TMOD, $89
.equ TL0, $8a
.equ TL1, $8b
.equ TH0, $8c
.equ TH1, $8d
.equ CKCON, $8e
.equ __8F, $8f
.equ IOB, $90
.equ EXIF, $91
.equ MPAGE, $92
.equ __93, $93
.equ __94, $94
.equ __95, $95
.equ __96, $96
.equ __97, $97
.equ SCON0, $98
.equ SBUF0, $99
.equ AUTOPTRH1, $9a
.equ AUTOPTRL1, $9b
.equ __9C, $9c
.equ AUTOPTRH2, $9d
.equ AUTOPTRL2, $9e
.equ __9F, $9f
.equ IOC, $a0
.equ INT2CLR, $a1
.equ INT4CLR, $a2
.equ __A3, $a3
.equ __A4, $a4
.equ __A5, $a5
.equ __A6, $a6
.equ __A7, $a7
.equ IE, $a8
.equ __A9, $a9
.equ EP2468STAT, $aa
.equ EP24FIFOLGS, $ab
.equ EP68FIFOLGS, $ac
.equ __AD, $ad
.equ __AE, $ae
.equ AUTOPTR_SETUP, $af
.equ IOD, $b0
.equ IOE, $b1
.equ OEA, $b2
.equ OEB, $b3
.equ OEC, $b4
.equ OED, $b5
.equ OEE, $b6
.equ __B7, $b7
.equ IP, $b8
.equ __B9, $b9
.equ EP01STAT, $ba
.equ GPIFTRIG, $bb
.equ __BC, $bc
.equ GPIFSGLDATH, $bd
.equ GPIFSGLDATLX, $be
.equ GPIFSGLDATLNOX, $bf
.equ SCON1, $c0
.equ SBUF1, $c1
.equ __C2, $c2
.equ __C3, $c3
.equ __C4, $c4
.equ __C5, $c5
.equ __C6, $c6
.equ __C7, $c7
.equ T2CON, $c8
.equ __C9, $c9
.equ RCAP2L, $ca
.equ RCAP2H, $cb
.equ TL2, $cc
.equ TH2, $cd
.equ __CE, $ce
.equ __CF, $cf
.equ PSW, $d0
.equ __D1, $d1
.equ __D2, $d2
.equ __D3, $d3
.equ __D4, $d4
.equ __D5, $d5
.equ __D6, $d6
.equ __D7, $d7
.equ EICON, $d8
.equ __D9, $d9
.equ __DA, $da
.equ __DB, $db
.equ __DC, $dc
.equ __DD, $dd
.equ __DE, $de
.equ __DF, $df
.equ ACC, $e0
.equ __E1, $e1
.equ __E2, $e2
.equ __E3, $e3
.equ __E4, $e4
.equ __E5, $e5
.equ __E6, $e6
.equ __E7, $e7
.equ EIE, $e8
.equ __E9, $e9
.equ __EA, $ea
.equ __EB, $eb
.equ __EC, $ec
.equ __ED, $ed
.equ __EE, $ee
.equ __EF, $ef
.equ B, $f0
.equ __F1, $f1
.equ __F2, $f2
.equ __F3, $f3
.equ __F4, $f4
.equ __F5, $f5
.equ __F6, $f6
.equ __F7, $f7
.equ EIP, $f8
.equ __F9, $f9
.equ __FA, $fa
.equ __FB, $fb
.equ __FC, $fc
.equ __FD, $fd
.equ __FE, $fe
.equ __FF, $ff

;============================================Bit Addressable Defines===========================================;

.equ REMOTE_WAKEUP,     $00             ;1=Remote wakeup enabled, 0=Remote wakeup disabled.
.equ SETUP_DAT_PEND,    $01             ;1=Setup data pending, 0=No setup data pending.
.equ SELF_POWERED,      $02             ;Always set to 0 to indicate device is never self powered.
.equ IS_SUSPENDED,      $03             ;1=Chip is suspended, 0=Chip is awake.
.equ R20_4, $04
.equ R20_5, $05
.equ R20_6, $06
.equ R20_7, $07
.equ I2CS_0,            $08
.equ I2CS_1,            $09
.equ I2CS_2,            $0a
.equ I2CS_3,            $0b
.equ I2CS_4,            $0c
.equ I2CS_5,            $0d
.equ I2CS_6,            $0e
.equ I2CS_7,            $0f
.equ I2CDAT_0,          $10
.equ I2CDAT_1,          $11
.equ I2CDAT_2,          $12
.equ I2CDAT_3,          $13
.equ I2CDAT_4,          $14
.equ I2CDAT_5,          $15
.equ I2CDAT_6,          $16
.equ I2CDAT_7,          $17
.equ I2CTL_0,           $18
.equ I2CTL_1,           $19
.equ I2CTL_2,           $1a
.equ I2CTL_3,           $1b
.equ I2CTL_4,           $1c
.equ I2CTL_5,           $1d
.equ I2CTL_6,           $1e
.equ I2CTL_7,           $1f
.equ I2CSTAT_0,         $20
.equ I2CSTAT_1,         $21
.equ I2CSTAT_2,         $22
.equ I2CSTAT_3,         $23
.equ I2CSTAT_4,         $24
.equ I2CSTAT_5,         $25
.equ I2CSTAT_6,         $26
.equ I2CSTAT_7,         $27
.equ R25_0, $28
.equ R25_1, $29
.equ R25_2, $2a
.equ R25_3, $2b
.equ R25_4, $2c
.equ R25_5, $2d
.equ R25_6, $2e
.equ R25_7, $2f
.equ R26_0, $30
.equ R26_1, $31
.equ R26_2, $32
.equ R26_3, $33
.equ R26_4, $34
.equ R26_5, $35
.equ R26_6, $36
.equ R26_7, $37
.equ R27_0, $38
.equ R27_1, $39
.equ R27_2, $3a
.equ R27_3, $3b
.equ R27_4, $3c
.equ R27_5, $3d
.equ R27_6, $3e
.equ R27_7, $3f
.equ R28_0, $40
.equ R28_1, $41
.equ R28_2, $42
.equ R28_3, $43
.equ R28_4, $44
.equ R28_5, $45
.equ R28_6, $46
.equ R28_7, $47
.equ R29_0, $48
.equ R29_1, $49
.equ R29_2, $4a
.equ R29_3, $4b
.equ R29_4, $4c
.equ R29_5, $4d
.equ R29_6, $4e
.equ R29_7, $4f
.equ R2A_0, $50
.equ R2A_1, $51
.equ R2A_2, $52
.equ R2A_3, $53
.equ R2A_4, $54
.equ R2A_5, $55
.equ R2A_6, $56
.equ R2A_7, $57
.equ R2B_0, $58
.equ R2B_1, $59
.equ R2B_2, $5a
.equ R2B_3, $5b
.equ R2B_4, $5c
.equ R2B_5, $5d
.equ R2B_6, $5e
.equ R2B_7, $5f
.equ R2C_0, $60
.equ R2C_1, $61
.equ R2C_2, $62
.equ R2C_3, $63
.equ R2C_4, $64
.equ R2C_5, $65
.equ R2C_6, $66
.equ R2C_7, $67
.equ R2D_0, $68
.equ R2D_1, $69
.equ R2D_2, $6a
.equ R2D_3, $6b
.equ R2D_4, $6c
.equ R2D_5, $6d
.equ R2D_6, $6e
.equ R2D_7, $6f
.equ R2E_0, $70
.equ R2E_1, $71
.equ R2E_2, $72
.equ R2E_3, $73
.equ R2E_4, $74
.equ R2E_5, $75
.equ R2E_6, $76
.equ R2E_7, $77
.equ R2F_0, $78
.equ R2F_1, $79
.equ R2F_2, $7a
.equ R2F_3, $7b
.equ R2F_4, $7c
.equ R2F_5, $7d
.equ R2F_6, $7e
.equ R2F_7, $7f
.equ IOA_0, $80
.equ IOA_1, $81
.equ IOA_2, $82
.equ IOA_3, $83
.equ IOA_4, $84
.equ IOA_5, $85
.equ IOA_6, $86
.equ IOA_7, $87
.equ TCON_0, $88
.equ TCON_1, $89
.equ TCON_2, $8a
.equ TCON_3, $8b
.equ TCON_4, $8c
.equ TCON_5, $8d
.equ TCON_6, $8e
.equ TCON_7, $8f
.equ IOB_0, $90
.equ IOB_1, $91
.equ IOB_2, $92
.equ IOB_3, $93
.equ IOB_4, $94
.equ IOB_5, $95
.equ IOB_6, $96
.equ IOB_7, $97
.equ SCON0_0, $98
.equ SCON0_1, $99
.equ SCON0_2, $9a
.equ SCON0_3, $9b
.equ SCON0_4, $9c
.equ SCON0_5, $9d
.equ SCON0_6, $9e
.equ SCON0_7, $9f
.equ IOC_0, $a0
.equ IOC_1, $a1
.equ IOC_2, $a2
.equ IOC_3, $a3
.equ IOC_4, $a4
.equ IOC_5, $a5
.equ IOC_6, $a6
.equ IOC_7, $a7
.equ IE_0, $a8
.equ IE_1, $a9
.equ IE_2, $aa
.equ IE_3, $ab
.equ IE_4, $ac
.equ IE_5, $ad
.equ IE_6, $ae
.equ IE_7, $af
.equ IOD_0, $b0
.equ IOD_1, $b1
.equ IOD_2, $b2
.equ IOD_3, $b3
.equ IOD_4, $b4
.equ IOD_5, $b5
.equ IOD_6, $b6
.equ IOD_7, $b7
.equ IP_0, $b8
.equ IP_1, $b9
.equ IP_2, $ba
.equ IP_3, $bb
.equ IP_4, $bc
.equ IP_5, $bd
.equ IP_6, $be
.equ IP_7, $bf
.equ SCON1_0, $c0
.equ SCON1_1, $c1
.equ SCON1_2, $c2
.equ SCON1_3, $c3
.equ SCON1_4, $c4
.equ SCON1_5, $c5
.equ SCON1_6, $c6
.equ SCON1_7, $c7
.equ T2CON_0, $c8
.equ T2CON_1, $c9
.equ T2CON_2, $ca
.equ T2CON_3, $cb
.equ T2CON_4, $cc
.equ T2CON_5, $cd
.equ T2CON_6, $ce
.equ T2CON_7, $cf
.equ PSW_0, $d0
.equ PSW_1, $d1
.equ PSW_2, $d2
.equ PSW_3, $d3
.equ PSW_4, $d4
.equ PSW_5, $d5
.equ PSW_6, $d6
.equ PSW_7, $d7
.equ EICON_0, $d8
.equ EICON_1, $d9
.equ EICON_2, $da
.equ EICON_3, $db
.equ EICON_4, $dc
.equ EICON_5, $dd
.equ EICON_6, $de
.equ EICON_7, $df
.equ ACC_0, $e0
.equ ACC_1, $e1
.equ ACC_2, $e2
.equ ACC_3, $e3
.equ ACC_4, $e4
.equ ACC_5, $e5
.equ ACC_6, $e6
.equ ACC_7, $e7
.equ EIE_0, $e8
.equ EIE_1, $e9
.equ EIE_2, $ea
.equ EIE_3, $eb
.equ EIE_4, $ec
.equ EIE_5, $ed
.equ EIE_6, $ee
.equ EIE_7, $ef
.equ B_0, $f0
.equ B_1, $f1
.equ B_2, $f2
.equ B_3, $f3
.equ B_4, $f4
.equ B_5, $f5
.equ B_6, $f6
.equ B_7, $f7
.equ EIP_0, $f8
.equ EIP_1, $f9
.equ EIP_2, $fa
.equ EIP_3, $fb
.equ EIP_4, $fc
.equ EIP_5, $fd
.equ EIP_6, $fe
.equ EIP_7, $ff

;==============================================USB Register Defines============================================;

.equ CPUCS                              #$E600
.equ IFCONFIG                           #$E601

.equ FIFORESET                          #$E604

.equ EP1INCFG                           #$E611
.equ EP2CFG                             #$E612
.equ EP4CFG                             #$E613
.equ EP6CFG                             #$E614
.equ EP8CFG                             #$E615

.equ USBIE                              #$E65C
.equ USBIRQ                             #$E65D

.equ EPIRQ                              #$E65F

.equ INTSETUP                           #$E668

.equ I2CS                               #$E678
.equ I2CDAT                             #$E679
.equ I2CTL                              #$E67A

.equ XAUTODAT1                          #$E67B
.equ XAUTODAT2                          #$E67C

.equ USBCS                              #$E680
.equ SUSPEND                            #$E681
.equ WAKEUPCS                           #$E682
.equ TOGCTL                             #$E683

.equ EP0BCH                             #$E68A
.equ EP0BCL                             #$E68B

.equ EP1INBC                            #$E68F

.equ EP6BCH                             #$E698
.equ EP6BCL                             #$E699

.equ EP8BCH                             #$E69C
.equ EP8BCL                             #$E69D

.equ EP0CS                              #$E6A0

.equ EP1INCS                            #$E6A2

.equ SUDPTRH                            #$E6B3
.equ SUDPTRL                            #$E6B4

.equ SETUPDAT_0                         #$E6B8
.equ SETUPDAT_1                         #$E6B9
.equ SETUPDAT_2                         #$E6BA
.equ SETUPDAT_3                         #$E6BB
.equ SETUPDAT_4                         #$E6BC
.equ SETUPDAT_5                         #$E6BD
.equ SETUPDAT_6                         #$E6BE
.equ SETUPDAT_7                         #$E6BF

.equ EP0BUF                             #$E740

.equ EP1INBUF                           #$E7C0

;================================================Constant Defines==============================================;

;ASCII numbers.
.equ ZERO                               #$30
.equ ONE                                #$31
.equ TWO                                #$32
.equ THREE                              #$33
.equ FOUR                               #$34
.equ FIVE                               #$35
.equ SIX                                #$36
.equ SEVEN                              #$37
.equ EIGHT                              #$38
.equ NINE                               #$39

;ASCII letters.
.equ _A                                 #$41
.equ _B                                 #$42
.equ _C                                 #$43
.equ _D                                 #$44
.equ _E                                 #$45
.equ _F                                 #$46
.equ _G                                 #$47
.equ _H                                 #$48
.equ _I                                 #$49
.equ _J                                 #$4A
.equ _K                                 #$4B
.equ _L                                 #$4C
.equ _M                                 #$4D
.equ _N                                 #$4E
.equ _O                                 #$4F
.equ _P                                 #$50
.equ _Q                                 #$51
.equ _R                                 #$52
.equ _S                                 #$53
.equ _T                                 #$54
.equ _U                                 #$55
.equ _V                                 #$56
.equ _W                                 #$57
.equ _X                                 #$58
.equ _Y                                 #$59
.equ _Z                                 #$5A

.equ _a                                 #$61
.equ _b                                 #$62
.equ _c                                 #$63
.equ _d                                 #$64
.equ _e                                 #$65
.equ _f                                 #$66
.equ _g                                 #$67
.equ _h                                 #$68
.equ _i                                 #$69
.equ _j                                 #$6A
.equ _k                                 #$6B
.equ _l                                 #$6C
.equ _m                                 #$6D
.equ _n                                 #$6E
.equ _o                                 #$6F
.equ _p                                 #$70
.equ _q                                 #$71
.equ _r                                 #$72
.equ _s                                 #$73
.equ _t                                 #$74
.equ _u                                 #$75
.equ _v                                 #$76
.equ _w                                 #$77
.equ _x                                 #$78
.equ _y                                 #$79
.equ _z                                 #$7A

;ASCII symbols.
.equ SPACE                              #$20
.equ COLON                              #$3A
.equ COMMA                              #$2C
.equ PERIOD                             #$2E
.equ CR                                 #$0D    ;Carriage return.
.equ FSLASH                             #$2F    ;Forward slash.
.equ LBAR                               #$5F    ;Underscore.
.equ MBAR                               #$2D    ;Minus sign.
.equ UBAR                               #$FF    ;Upper bar.
.equ STAR                               #$2A    ;Multiply sign.

;bRequest byte defines.
.equ GET_STATUS                         #$00
.equ CLEAR_FEATURE                      #$01
.equ RESERVED_02                        #$02
.equ SET_FEATURE                        #$03
.equ RESERVED_04                        #$04
.equ SET_ADDRESS                        #$05
.equ GET_DESCRIPT                       #$06
.equ SET_DESCRIPT                       #$07
.equ GET_CONFIG                         #$08
.equ SET_CONFIG                         #$09
.equ GET_INTRFC                         #$0A
.equ SET_INTRFC                         #$0B
.equ SYNC_FRAME                         #$0C

;bmRequestType byte defines for Get Status request.
.equ WK_PWR_STAT                        #$80
.equ ZERO_STAT                          #$81
.equ STALL_STAT                         #$82

;bmRequestType byte defines for Clear Feature request.
.equ CLR_REM_WAKE                       #$00
.equ CLR_STALL                          #$02

;bmRequestType byte defines for Set Feature request.
.equ SET_OTHR_FTR                       #$00
.equ SET_STALL                          #$02

;wValueH byte defines for Get Descriptor request.
.equ DEVICE_DESC                        #$01
.equ CONFIG_DESC                        #$02
.equ STRING_DESC                        #$03
.equ DEV_QUAL_DESC                      #$06
.equ OS_DESC                            #$07
.equ REP_DESC                           #$22

;Stall bit index defines.
.equ EP1_OUT                            #$01
.equ EP1_IN                             #$81
.equ EP2                                #$02
.equ EP4                                #$04
.equ EP6                                #$06
.equ EP8                                #$08

;Enpoint control and status registers lower byte defines.
.equ EP1_OUT_CS                         #$A1
.equ EP1_IN_CS                          #$A2
.equ EP2_CS                             #$A3
.equ EP4_CS                             #$A4
.equ EP6_CS                             #$A5
.equ EP8_CS                             #$A6

;Enpoint control and status registers upper byte define.
.equ EP_CS                              #$E6

;Endpoint 0 upper and lower bytes defines.
.equ EP0BUF_HI                          #$E7
.equ EP0BUF_LO                          #$40

;+------------------------------------------------------------------------------------------------------------+;
;|                                            Initial Configuration                                           |;
;+------------------------------------------------------------------------------------------------------------+;

.ebyte  $c2                             ;Indicate valid EEPROM on I2C bus.
.vid    $0547                           ;Vendor ID.
.pid    $2131                           ;Product ID.
.did    $0000                           ;Device ID.
.cbyte  $04                             ;Configuration byte. I2C 400KHz.

;+------------------------------------------------------------------------------------------------------------+;
;|                                              Interrupt Vectors                                             |;
;+------------------------------------------------------------------------------------------------------------+;

.org    $0000                           ;Reset vector.
    ljmp  RESET                         ;

.org    $0033                           ;Resume interrupt vector.
    ljmp  RESUME                        ;

.org    $0043                           ;USB interrupt vector (autovector table).
    ljmp USB_AND_IE4                    ;

.org    $0053                           ;IE4 interrupt vector (autovector table).
    ljmp USB_AND_IE4                    ;

;+------------------------------------------------------------------------------------------------------------+;
;|                                                Start of Code                                               |;
;+------------------------------------------------------------------------------------------------------------+;

;==============================================Interrupt Routines==============================================;

.org    $0080

RESET:
    mov r0, #$7F                        ;Prepare to clear lower 128.
    clr a                               ;

    clr_loop:
    mov @r0, a                          ;Loop to clear all lower 128 registers.
    djnz r0, clr_loop                   ;

    mov FIRMWARE_MAJ_PNTR, #$03         ;Firmware revision.
    mov FIRMWARE_MIN_PNTR, #$05         ;

    ljmp InitBoard                      ;Initialize OSR FX2 board.

RESUME:
    anl EICON, #$EF                     ;Clear wake-up interrupt flag.
    reti                                ;Return from interrupt.

;===========================================Initialization Functions===========================================;

InitBoard:
    clr   a                             ;
    mov   R3BNK2, a                     ;
    mov   R2BNK2, a                     ;
    mov   R1BNK2, a                     ;
    mov   R0BNK2, a                     ;Clear various registers on startup.
    clr   IS_SUSPENDED                  ;
    clr   REMOTE_WAKEUP                 ;
    clr   SELF_POWERED                  ;
    clr   SETUP_DAT_PEND                ;

    mov   dptr, CPUCS                   ;Get CPU status register ($e600).
    movx  a, @dptr                      ;
    anl   a, #$e7                       ;Keep all values except clock speed.
    orl   a, #$10                       ;Set CPU clock speed to 48 MHz.
    movx  @dptr, a                      ;Set CPU status register.

    mov   dptr, IFCONFIG                ;Get interface configuration.
    movx  a, @dptr                      ;
    orl   a, #$40                       ;Set GPIF/FIFO clock speed to 48MHz.
    movx  @dptr, a                      ;Set interface configuration.

    mov   OEA, #$00                     ;Make all 8 bits of port A inputs.
    mov   OEB, #$00                     ;Make all 8 bits of port B inputs.
    mov   OED, #$00                     ;Make all 8 bits of port D inputs.

    orl   AUTOPTR_SETUP, #$01           ;Enable auto pointers.

    mov   dptr, EP1INCFG                ;
    mov   a, #$b0                       ;Enable endpoint 1 as an interrupt endpoint.
    movx  @dptr, a                      ;
    
    clr   a                             ;
    mov   dptr, EP2CFG                  ;Disable endpoint 2.
    movx  @dptr, a                      ;
        
    mov   dptr, EP4CFG                  ;Disable endpoint 4.
    movx  @dptr, a                      ;

    mov   dptr, EP6CFG                  ;Disable endpoint 6.
    movx  @dptr, a                      ;

    mov   dptr, EP8CFG                  ;Disable endpoint 8.
    movx  @dptr, a                      ;

    inc   a                             ;
    mov   dptr, I2CTL                   ;Set I2C bus speed to 400KHz.
    movx  @dptr, a                      ;

    EnableRemoteWakeup:
    setb  REMOTE_WAKEUP                 ;Enable remote wakeup.

    mov   DEV_DESC_HI,    {DeviceDesc   ;
    mov   DEV_DESC_LO,    }DeviceDesc   ;
    mov   DEV_QUAL_HI,    {DeviceQual   ;
    mov   DEV_QUAL_LO,    }DeviceQual   ;
    mov   CFG_DESC_HS_HI, {ConfigDescHS ;
    mov   CFG_DESC_HS_LO, }ConfigDescHS ;Setup descriptor pointers.
    mov   CFG_DESC_FS_HI, {ConfigDescFS ;
    mov   CFG_DESC_FS_LO, }ConfigDescFS ;
    mov   STRING_DESC_HI, {StringDesc0  ;
    mov   STRING_DESC_LO, }StringDesc0  ;
    mov   REP_DESC_HI,    {RecordDesc0  ;
    mov   REP_DESC_LO,    }RecordDesc0  ;

    EnableInterrupts:
    setb  EIE_0                         ;Enable USB interrupt.
    orl   EICON, #$20                   ;Enable resume interrupt.
    mov   dptr, INTSETUP                ;
    movx  a, @dptr                      ;
    orl   a, #$09                       ;
    movx  @dptr, a                      ;Enable INT2 and INT4 autovectoring.
    mov   dptr, USBIE                   ;
    movx  a, @dptr                      ;
    orl   a, #$3d                       ;
    movx  @dptr, a                      ;Enable USB interrupts: HSGRANT, URES, SUSP, SUTOK, SUDAV.
    setb  IE_7                          ;Enable serial port 1 interrupt.
    mov   dptr, USBCS                   ;
    movx  a, @dptr                      ;
    jb    ACC_1, SetControlRegs         ;Is RENUM disabled? If so, branch.
    lcall InitializeUSB                 ;Setup USB registers.

    SetControlRegs:
    mov   dptr, USBCS                   ;
    movx  a, @dptr                      ;
    anl   a, #$f7                       ;Clear disconnect bit in USBCS.
    movx  @dptr, a                      ;
    anl   CKCON, #$f8                   ;Set timer 0, 1 and 2 frequencies to CLKOUT/4.
    clr   IS_SUSPENDED                  ;Indicate processor is not suspended.

    ;lcall LCDInit                      ;Initialize LCD display.

    ljmp MainLoop                       ;Jump to main processing loop.

InitializeUSB:
    mov   dptr, USBCS                   ;
    movx  a, @dptr                      ;
    orl   a, #$0a                       ;Disconnect USB and allow firmware to handle all USB requests.
    movx  @dptr, a                      ;
    sjmp  USBDelay                      ;Jump to continue USB setup.

    DisconnectUSB:
    mov   dptr, USBCS                   ;
    movx  a, @dptr                      ;Disconnect USB.
    orl   a, #$08                       ;
    movx  @dptr, a                      ;

    USBDelay:
    mov   r7, #$dc                      ;
    mov   r6, #$05                      ;Delay for 1500 milliseconds.
    lcall DoDelay                       ;

    mov   dptr, USBIRQ                  ;
    mov   a, #$ff                       ;Clear any USB interrupt flags.
    movx  @dptr, a                      ;

    mov   dptr, EPIRQ                   ;Clear any endpoint interrupt requests.
    movx  @dptr, a                      ;

    anl   EXIF, #$ef                    ;Clear USB interrupt request.

    mov   dptr, USBCS                   ;
    movx  a, @dptr                      ;
    anl   a, #$f7                       ;Clear SIGRSUME bit in USB control and status register.
    movx  @dptr, a                      ;
    ret                                 ;

;=============================================Main Processing Loop=============================================;

MainLoop:   
    lcall SendReport                    ;Send controller status over endpoint1.
    sjmp  MainLoop                      ;Loop forever.

;===========================================Wakeup/Suspend Functions===========================================;

CheckPinWakeup:
    CheckWakeupPin1:
    mov   dptr, WAKEUPCS                ;Get wakeup control and status register contents.
    movx  a, @dptr                      ;
    
    jnb   ACC_0, CheckWakeupPin2        ;Is wakeup 1 enabled? If not, branch to check wakeup 2.
    movx  a, @dptr                      ;Is wakeup 1 signal active? If so, branch to send-->
    jb    ACC_6, SendSigResume          ;on the USB bus.

    CheckWakeupPin2:
    mov   dptr, WAKEUPCS                ;Get wakeup control and status register contents.
    movx  a, @dptr                      ;

    jnb   ACC_1, ExitWakeupRoutine      ;Is wakeup 2 enabled? If not, branch to exit.
    movx  a, @dptr                      ;
    jnb   ACC_7, ExitWakeupRoutine      ;Is wakeup 2 signal active? If not, branch to exit.

    SendSigResume:
    mov   dptr, USBCS                   ;Set SIGRSUME bit in USBCS register.-->
    movx  a, @dptr                      ;This drives the 'K' state onto the-->
    orl   a, #$01                       ;bus as per page 297 of the EZ-USB TRM.
    movx  @dptr, a                      ;

    mov   r7, #$14                      ;
    mov   r6, #$00                      ;Delay for 20 milliseconds.
    lcall DoDelay                       ;

    ClearSigResume:
    mov   dptr, USBCS                   ;Clear SIGRSUME bit in USBCS register.-->
    movx  a, @dptr                      ;After a delay of 10 to 15 milliseconds,-->
    anl   a, #$fe                       ;The 'K' state on the bus should be -->
    movx  @dptr, a                      ;cleared as per page 297 of the EZ-USB TRM.

    ExitWakeupRoutine:
    ret                                 ;Exit wakeup routine.

PowerDown:
    mov   dptr, WAKEUPCS                ;
    movx  a, @dptr                      ;Clear wakeup pin indication flags.
    orl   a, #$c0                       ;
    movx  @dptr, a                      ;

    mov   dptr, SUSPEND                 ;Writes to SUSPEND register and forces the-->
    movx  @dptr, a                      ;chip to go into a suspend state.
    orl   PCON, #$01                    ;Place chip into low power state.

    nop                                 ;
    nop                                 ;
    nop                                 ;Wait here until wakeup signal received.
    nop                                 ;
    nop                                 ;
    ret                                 ;

DisplayActive:
    ;mov   IOB, #$88                        ;Display an 'A' on the 7 segment display for "Active".

    mov   r7, #$f4                      ;   
    mov   r6, #$01                      ;Delay for 500 milliseconds.    
    lcall DoDelay                       ;   

    mov   LAST_SW_STATE, IOA            ;Get status of switches and increment it.  This ensures-->
    inc   LAST_SW_STATE                 ;an interrupt will be sent with the status of the switches-->
    setb  c                             ;every time the device wakes up from being suspended.
    ret                                 ;

DisplaySuspended:
    ;mov   IOB, #$1a                        ;Display an 'S' on the 7 segment display for "Suspended".

    mov   r7, #$f4                      ;
    mov   r6, #$01                      ;Delay for 500 milliseconds.
    lcall DoDelay                       ;

    setb  c                             ;Set carry bit before returning.
    ret                                 ;

;=======================================Setup Data Processing Entry Point======================================;

;A complete description of the different values of bRequest can be found in the EZ-USB TRM on page 40.
ProcessSetupData:
    mov   dptr, SETUPDAT_1              ;Get bRequest byte from setup data.
    movx  a, @dptr                      ;

    ChkGetStat:
    cjne  a, GET_STATUS, ChkClrFeature  ;Is bRequest #$00? If not, branch.
    ljmp  DoGetStatus                   ;bRequest = GET_STATUS.

    ChkClrFeature:
    cjne  a, CLEAR_FEATURE, ChkRes02    ;Is bRequest #$01? If not, branch.
    ljmp  DoClearFeature                ;bRequest = CLEAR_FEATURE.

    ChkRes02:
    cjne  a, RESERVED_02, ChkSetFeature ;Is bRequest #$02? If not, branch.
    ljmp  DoReserved02                  ;bRequest = RESERVED_02.

    ChkSetFeature:
    cjne  a, SET_FEATURE, ChkRes04      ;Is bRequest #$03? If not, branch.
    ljmp  DoSetFeature                  ;bRequest = SET_FEATURE.

    ChkRes04:
    cjne  a, RESERVED_04, ChkSetAddr    ;Is bRequest #$04? If not, branch.
    ljmp  DoReserved04                  ;bRequest = RESERVED_04.
    
    ChkSetAddr:
    cjne  a, SET_ADDRESS, ChkGetDesc    ;Is bRequest #$05? If not, branch.
    ljmp  DoSetAddress                  ;bRequest = RESERVED_05.

    ChkGetDesc:
    cjne  a, GET_DESCRIPT, ChkSetDesc   ;Is bRequest #$06? If not, branch.
    ljmp  DoGetDescriptor               ;bRequest = GET_DESCRIPT.
    
    ChkSetDesc:
    cjne  a, SET_DESCRIPT, ChkGetConfig ;Is bRequest #$07? If not, branch.
    ljmp  DoSetDescriptor               ;bRequest = SET_DESCRIPT.

    ChkGetConfig:
    cjne  a, GET_CONFIG, ChkSetConfig   ;Is bRequest #$08? If not, branch.
    ljmp  DoGetConfig                   ;bRequest = GET_CONFIG.

    ChkSetConfig:
    cjne  a, SET_CONFIG, ChkGetIntrfc   ;Is bRequest #$09? If not, branch.
    ljmp  DoSetConfig                   ;bRequest = SET_CONFIG.             

    ChkGetIntrfc:
    cjne  a, GET_INTRFC, ChkSetIntrfc   ;Is bmRequest #$0A? If not, branch.
    ljmp  DoGetInterface                ;bmRequest = GET_INTRFC.

    ChkSetIntrfc:
    cjne  a, SET_INTRFC, ChkSyncFrame   ;Is bmRequest #$0B? If not, branch.
    ljmp  DoSetInterface                ;bmRequest = SET_INTRFC.

    ChkSyncFrame:
    cjne  a, SYNC_FRAME, DoOtherReqs    ;is bRequest #$0C? If not, branch.
    ljmp  DoSyncFrame                   ;bRequest = SYNC_FRAME.

    DoOtherReqs:
    lcall DoVendorCommands              ;Check for any other requests to be handled and-->
    jnc   EndControlTransfer            ;end the control transfer.

;===============================================Utility Functions==============================================;
    
StallControlTransfer:
    mov   dptr, EP0CS                   ;
    movx  a, @dptr                      ;Set the stall bit in the end point 0 control register.
    orl   a, #$01                       ;
    movx  @dptr, a                      ;

EndControlTransfer:
    mov   dptr, EP0CS                   ;
    movx  a, @dptr                      ;
    orl   a, #$80                       ;Clear end point 0 NAK.
    movx  @dptr, a                      ;
    ret                                 ;

GetEndpointReg:
    mov   dptr, SETUPDAT_4              ;Get endpoint byte.
    movx  a, @dptr                      ;
    
    ChkEP1Out:
    cjne  a, EP1_OUT, ChkEP1In          ;Is wIndexL #$01? If not, branch.
    mov   r7, EP1_OUT_CS                ;Set lower byte of EP1 OUT CS register.
    ret                                 ;

    ChkEP1In:
    cjne  a, EP1_IN, ChkEP2             ;Is wIndexL #$81? If not, branch.
    mov   r7, EP1_IN_CS                 ;Set lower byte of EP1 IN CS register.
    ret                                 ;

    ChkEP2:
    anl   a, #$7f                       ;Direction bit no longer needed.
    cjne  a, EP2, ChkEP4                ;Is wIndexL #$02? If not, branch.
    mov   r7, EP2_CS                    ;Set lower byte of EP2 CS register.
    ret                                 ;

    ChkEP4:
    cjne  a, EP4, ChkEP6                ;Is wIndexL #$04? If not, branch.
    mov   r7, EP4_CS                    ;Set lower byte of EP4 CS register.
    ret                                 ;

    ChkEP6:
    cjne  a, EP6, ChkEP8                ;Is wIndexL #$06? If not, branch.
    mov   r7, EP6_CS                    ;Set lower byte of EP6 CS register.
    ret                                 ;

    ChkEP8:
    mov   r7, EP8_CS                    ;Set lower byte of EP8 CS register.
    ret                                 ;

;=============================================Get Status Functions=============================================;

DoGetStatus:
    mov   dptr, SETUPDAT_0              ;Get bmRequestType from setup data.
    movx  a, @dptr                      ;

    ChkWkPwrStatus:
    cjne  a, WK_PWR_STAT, ChkZeroStatus ;Is bmRequestType #$80? If not, branch.
    ljmp  WakeupAndPowerStatus          ;bmRequestType = WK_PWR_STAT.
    
    ChkZeroStatus:
    cjne  a, ZERO_STAT, ChkStallStatus  ;Is bmRequestType #$81? If not, branch.
    ljmp  ZeroBytesStatus               ;bmRequestType = ZERO_STAT.

    ChkStallStatus:
    cjne  a, STALL_STAT, EndDoGetStatus ;Is bmRequestType #$82? If not, branch.
    ljmp  GetStallStatus                ;bmRequestType = STALL_STAT.

    EndDoGetStatus:
    ljmp  StallControlTransfer          ;Unrecognized 'Get Status' request. Jump to stall.

    WakeupAndPowerStatus:
    mov   c, REMOTE_WAKEUP              ;
    clr   a                             ;Move remote wakeup status bit into accumulator.
    rlc   a                             ;
    mov   r7, a                         ;

    add   a, ACC                        ;Move bit to second position in byte.
    mov   r7, a                         ;

    mov   c, SELF_POWERED               ;Constant 0 moved into carry bit. Device not self powered.
    clr   a                             ;
    rlc   a                             ;Move self powered status bit into accumulator.
    orl   a, r7                         ;OR the two bytes together to get complete status byte.
    mov   dptr, EP0BUF                  ;Put byte in endpoint 0 buffer.
    movx  @dptr, a                      ;

    clr   a                             ;
    inc   dptr                          ;Load second byte with 0.
    movx  @dptr, a                      ;

    mov   dptr, EP0BCH                  ;
    movx  @dptr, a                      ;
    mov   dptr, EP0BCL                  ;Load endpoint 0 byte count with 2.
    mov   a, #$02                       ;
    movx  @dptr, a                      ;
    ljmp  EndControlTransfer            ;

    ZeroBytesStatus:
    clr   a                             ;
    mov   dptr, EP0BUF                  ;
    movx  @dptr, a                      ;Load endpoint 0 buffer with two empty bytes.
    inc   dptr                          ;
    movx  @dptr, a                      ;

    mov   dptr, EP0BCH                  ;
    movx  @dptr, a                      ;
    mov   dptr, EP0BCL                  ;Load endpoint 0 byte count with 2.
    mov   a, #$02                       ;
    movx  @dptr, a                      ;
    ljmp  EndControlTransfer            ;

    GetStallStatus:
    mov   dptr, SETUPDAT_4              ;Get endpoint byte.
    movx  a, @dptr                      ;
    
    lcall GetEndpointReg                ;Find the lower byte of the proper endpoint CS register.

    GetStallBits:
    mov   DPL0, r7                      ;Set lower byte of endpoint control and status register.
    mov   DPH0, EP_CS                   ;Set upper byte of endpoint control and status register.
    movx  a, @dptr                      ;Get control and status bit for selected endpoint.
    anl   a, #$01                       ;Discard all bits except the stall bit.
    mov   dptr, EP0BUF                  ;
    movx  @dptr, a                      ;Place stall bit in enpoint 0 buffer.

    clr   a                             ;
    inc   dptr                          ;Load second byte with 0.
    movx  @dptr, a                      ;

    mov   dptr, EP0BCH                  ;
    movx  @dptr, a                      ;
    mov   dptr, EP0BCL                  ;Load endpoint 0 byte count with 2.
    mov   a, #$02                       ;
    movx  @dptr, a                      ;
    ljmp  EndControlTransfer            ;

;============================================Clear Feature Functions===========================================;

DoClearFeature:
    mov   dptr, SETUPDAT_0              ;Get bmRequestType from setup data.
    movx  a, @dptr                      ;

    ChkClrWake:
    cjne  a, CLR_REM_WAKE, ChkClrStall  ;Is bmRequestType #$00? If not, branch.
    ljmp  ClearWakeup                   ;bmRequestType = CLR_REM_WAKE.

    ChkClrStall:
    cjne  a, CLR_STALL, EndDoClrFtr     ;Is bmRequestType #$02? If not, branch.
    ljmp  ClearStall                    ;bmRequestType = CLR_STALL.
    
    EndDoClrFtr:
    ljmp  StallControlTransfer          ;Unrecognized 'Clear Feature' request. Jump to stall.

    ClearWakeup:
    mov   dptr, SETUPDAT_2              ;Get wValueL.
    movx  a, @dptr                      ;
    
    cjne  a, #$01, EndClearWakeup       ;#$01 is only valid value.  Any other value will stall.
    clr   REMOTE_WAKEUP                 ;Clear remote wakeup enable bit.
    ljmp  EndControlTransfer            ;

    EndClearWakeup:
    ljmp StallControlTransfer           ;Invalid 'Clear Wakeup' request. Jump to stall.

    ClearStall:
    mov   dptr, SETUPDAT_2              ;
    movx  a, @dptr                      ;If wValueL != #$00, stall endpoint 0.
    jnz   EndClearStall                 ;

    lcall GetEndpointReg                ;Find the lower byte of the proper endpoint CS register.

    mov   DPL0, r7                      ;
    mov   DPH0, EP_CS                   ;Get endpoint control and status register contents.-->
    movx  a, @dptr                      ;Clear the stall bit and save the result back into-->
    anl   a, #$fe                       ;the control and status register.
    movx  @dptr, a                      ;

    mov   dptr, SETUPDAT_4              ;Get endpoint again.
    movx  a, @dptr                      ;

    anl   a, #$80                       ;Keep only IN/OUT bit.
    mov   r7, a                         ;
    rrc   a                             ;
    rrc   a                             ;Move I/O bit to bit 4.  This is the I/O-->
    rrc   a                             ;indicator in TOGCTL.
    anl   a, #$1f                       ;
    mov   r7, a                         ;

    movx  a, @dptr                      ;Get endpoint again.
    anl   a, #$0f                       ;Extract only the endpoint address.
    add   a, r7                         ;Add address to I/O bit for a complete TOGCTL byte.

    mov   dptr, TOGCTL                  ;A two step toggle clear process is used as per page 95-->
    movx  @dptr, a                      ;of the EZ-USB TRM.
    movx  a, @dptr                      ;First, write enpoind address and I/O bits.
    orl   a, #$20                       ;
    movx  @dptr, a                      ;Second, write the same data with the reset bit high.
    ljmp  EndControlTransfer            ;

    EndClearStall:
    ljmp StallControlTransfer           ;Invalid 'Clear Stall' request. Jump to stall.

;===============================================Reserved Request===============================================;

DoReserved02:
    ljmp StallControlTransfer           ;Reserved request. Stall as per the EZ-USB TRM page 40.

;=============================================Set Feature Functions============================================;

DoSetFeature:
    mov   dptr, SETUPDAT_0              ;Get bmRequestType.
    movx  a, @dptr                      ;

    ChkSetFtr:
    cjne  a, SET_OTHR_FTR, ChkSetStall  ;Is bmRequestType #$00? If not, branch.
    ljmp  ChkSetOthrFtr                 ;bmRequestType = SET_OTHR_FTR.

    ChkSetStall:
    cjne  a, SET_STALL, EndDoSetFtr     ;Is bmRequestType #$02? If not, branch.
    ljmp  SetStall                      ;bmRequestType = SET_STALL.

    EndDoSetFtr:
    ljmp  StallControlTransfer          ;Unrecognized 'Set Feature' request. Jump to stall.

    ChkSetOthrFtr:
    mov   dptr, SETUPDAT_2              ;Get wValueL.
    movx  a, @dptr                      ;

    ChkSetWake:
    cjne  a, #$01, ChkSetTest           ;Is wValueL = #$01? If not, branch.
    ljmp SetWakeup                      ;wValueL = #$01.

    ChkSetTest:
    cjne  a, #$02, EndChkSetOthrFtr     ;Is wValueL = #$02? If not, branch.
    ljmp SetTestMode                    ;wValueL = #$02.

    EndChkSetOthrFtr:
    ljmp  StallControlTransfer          ;Unrecognized set feature command.
    
    SetWakeup:
    setb  REMOTE_WAKEUP                 ;Enable remote wakeup.
    ljmp  EndControlTransfer            ;End set feature request.

    SetTestMode:
    ljmp  EndControlTransfer            ;Nothing to do. End set feature request.

    SetStall:
    lcall GetEndpointReg                ;Find the lower byte of the proper endpoint CS register.

    mov   DPL0, r7                      ;
    mov   DPH0, EP_CS                   ;Get endpoint control and status register contents.-->
    movx  a, @dptr                      ;Set the stall bit and save the result back into-->
    orl   a, #$01                       ;the control and status register.
    movx  @dptr, a                      ;
    ljmp  EndControlTransfer            ;

    EndSetStall:
    ljmp StallControlTransfer           ;Invalid 'Set Stall' request. Jump to stall.

;===============================================Reserved Request===============================================;

DoReserved04:
    ljmp StallControlTransfer           ;Reserved request. Stall as per the EZ-USB TRM page 40.

;=============================================Set Address Function=============================================;

DoSetAddress:
    ljmp  EndControlTransfer            ;Nothing to do as per the EZ-USB TRM page 40.

;===========================================Get Descriptor Functions===========================================;

DoGetDescriptor:
    mov   dptr, SETUPDAT_3              ;Get descriptor type byte from setup data.
    movx  a, @dptr                      ;

    ChkDevDesc:
    cjne  a, DEVICE_DESC, ChkCfgDesc    ;Is wValueH = #$01? If not, branch.
    ljmp  DoDeviceDesc                  ;wValueH = DEVICE_DESC.

    ChkCfgDesc:
    cjne  a, CONFIG_DESC, ChkStringDesc ;Is wValueH = #$02? If not, branch.
    ljmp  DoCfgDesc                     ;wValueH = CONFIG_DESC.

    ChkStringDesc:
    cjne  a, STRING_DESC, ChkQualDesc   ;Is wValueH = #$03? If not, branch.
    ljmp  DoStringDesc                  ;wValueH = STRING_DESC.

    ChkQualDesc:
    cjne  a, DEV_QUAL_DESC, ChkOSDesc   ;Is wValueH = #$06? If not, branch.
    ljmp  DoDevQualDesc                 ;wValueH = DEV_QUAL_DESC.

    ChkOSDesc:
    cjne  a, OS_DESC, ChkRecDesc        ;Is wValueH = #$07? If not, branch.
    ljmp  DoOSConfigDesc                ;wValueH = OS_DESC.

    ChkRecDesc:
    cjne  a, REP_DESC, EndDoGetDesc     ;Is wValueH = #$22? If not, branch.
    ljmp  DoRepDesc                     ;wValueH = REC_DESC.

    EndDoGetDesc:
    ljmp StallControlTransfer           ;Usupported Get Descriptor request. Jump to stall.

    DoDeviceDesc:
    mov   a, DEV_DESC_HI                ;Setting EP0 byte count not necessary. handled-->
    mov   dptr, SUDPTRH                 ;automatically by setup data pointer.
    movx  @dptr, a                      ;
    mov   a, DEV_DESC_LO                ;Point the setup data pointer to the device descriptor.
    mov   dptr, SUDPTRL                 ;The device descriptor is stored at memory location $0600.
    movx  @dptr, a                      ;
    ljmp  EndControlTransfer            ;

    DoDevQualDesc:
    mov   a, DEV_QUAL_HI                ;Setting EP0 byte count not necessary. handled-->
    mov   dptr, SUDPTRH                 ;automatically by setup data pointer.
    movx  @dptr, a                      ;
    mov   a, DEV_QUAL_LO                ;Point the setup data pointer to the device qualifier.
    mov   dptr, SUDPTRL                 ;The device qualifier is stored at memory location $0612.
    movx  @dptr, a                      ;
    ljmp  EndControlTransfer            ;

    DoCfgDesc:
    mov   a, THIS_CFG_HI                ;Setting EP0 byte count not necessary. handled-->
    mov   dptr, SUDPTRH                 ;automatically by setup data pointer.
    movx  @dptr, a                      ;
    mov   a, THIS_CFG_LO                ;
    mov   dptr, SUDPTRL                 ;Point the setup data pointer to the current config descriptor.
    movx  @dptr, a                      ;
    ljmp  EndControlTransfer            ;

    DoOSConfigDesc:
    mov   a, OS_CFG_HI                  ;Setting EP0 byte count not necessary. handled-->
    mov   dptr, SUDPTRH                 ;automatically by setup data pointer.
    movx  @dptr, a                      ;
    mov   a, OS_CFG_LO                  ;
    mov   dptr, SUDPTRL                 ;Point the setup data pointer to the other speed config descriptor.
    movx  @dptr, a                      ;
    ljmp  EndControlTransfer            ;

    DoStringDesc:
    mov   dptr, SETUPDAT_2              ;
    movx  a, @dptr                      ;Get string number from setup data.
    mov   r7, a                         ;
    lcall GetStringDescriptor           ;Retrieve string descriptor.

    mov   r2, R6BNK0                    ;Make a copy of string descriptor to test for null pointer.
    mov   r1, R7BNK0                    ;
    mov   a, r2                         ;Ensure a null pointer to the string descriptor is not passed-->
    orl   a, r1                         ;to the setup data pointer.
    
    cjne  a, #$00, LoadStringDesc       ;If null pointer to string descriptor, stall the control transfer.
    ljmp  StallControlTransfer          ;

    LoadStringDesc:
    mov   a, r6                         ;Setting EP0 byte count not necessary. handled-->
    mov   dptr, SUDPTRH                 ;automatically by setup data pointer.
    movx  @dptr, a                      ;
    mov   a, r7                         ;
    mov   dptr, SUDPTRL                 ;Point the setup data pointer to the string descriptor.
    movx  @dptr, a                      ;
    ljmp  EndControlTransfer            ;

    GetStringDescriptor:
    mov   r1, R7BNK0                    ;r7 is loaded with string number to get before function is called.
    mov   r6, STRING_DESC_HI            ;
    mov   r7, STRING_DESC_LO            ;r6, r7 is loaded with $066c. The beginning of the string descriptor.

    GetStringLoop:
    mov   DPL0, r7                      ;
    mov   DPH0, r6                      ;Get second byte of string descriptor to ensure it-->
    inc   dptr                          ;is a string descriptor.
    movx  a, @dptr                      ;

    xrl   a, #$03                       ;Is current descriptor a string descriptor?-->
    jnz   ExitStringDescriptor          ;If not, branch to exit.

    mov   r5, R1BNK0                    ;Get number of strings left to traverse.
    dec   r1                            ;Prepare to move to next string after this loop if needed.
    mov   a, r5                         ;
    jnz   SetStringPointer              ;Is dptr pointing to the desired string?-->
    ret                                 ;If so, exit.

    SetStringPointer:
    mov   DPL0, r7                      ;Load data pointer with current string pointer.
    mov   DPH0, r6                      ;
    movx  a, @dptr                      ;Load a with length of current string descriptor.
    mov   r4, #$00                      ;
    add   a, r7                         ;Get lower data byte of next string descriptor pointer.
    mov   r5, a                         ;
    mov   a, r4                         ;
    addc  a, r6                         ;Get upper data byte of next string descriptor pointer.
    mov   r6, a                         ;
    mov   r7, R5BNK0                    ;
    sjmp  GetStringLoop                 ;Loop to check next string descriptor.

    ExitStringDescriptor:
    mov   r6, #$00                      ;
    mov   r7, #$00                      ;Clear string pointer info before exiting.
    ret                                 ;

    DoRepDesc:
    ;Send 64 bytes.

    mov   r3, #$00                      ;Byte counter.
    mov   r4, EP0BUF_HI                 ;Upper byte of endpoint 0 buffer pointer.
    mov   r5, EP0BUF_LO                 ;Lower byte of endpoint 0 buffer pointer.
    mov   r6, {RecordDesc0              ;Upper byte of report descriptor pointer.
    mov   r7, }RecordDesc0              ;Lower byte of report descriptor pointer.

    SendRep0:
    mov   DPH0, r6                      ;
    mov   DPL0, r7                      ;Get byte from report descriptor.
    movx  a, @dptr                      ;
    
    mov   DPH0, r4                      ;
    mov   DPL0, r5                      ;Put byte in endpoint 0 buffer.
    movx  @dptr, a                      ;

    inc   r7                            ;Increment report descriptor pointer.   
    inc   r5                            ;Increment endpoint 0 buffer pointer.
    inc   r3                            ;Increment byte counter.

    cjne  r3, #$40, SendRep0

    clr   a                             ;
    mov   dptr, EP0BCH                  ;
    movx  @dptr, a                      ;Load endpoint 0 byte count with 64.
    mov   dptr, EP0BCL                  ;
    mov   a, #$40                       ;
    movx  @dptr, a                      ;

    lcall EndControlTransfer            ;Send first 64 bytes.

    ;Wait for EP0 to be idle.
    CheckEP0:
    mov   dptr, EP0CS                   ;Get status of endpoint 0.
    movx  a, @dptr                      ;
    jb    ACC_1, CheckEP0               ;If end point is busy, loop to wait.

    ;Send another 64 bytes.
    mov   r3, #$00                      ;Byte counter.
    mov   r4, EP0BUF_HI                 ;Upper byte of endpoint 0 buffer pointer.
    mov   r5, EP0BUF_LO                 ;Lower byte of endpoint 0 buffer pointer.
    mov   r6, {RecordDesc1              ;Upper byte of report descriptor pointer.
    mov   r7, }RecordDesc1              ;Lower byte of report descriptor pointer.
    
    SendRep1:
    mov   DPH0, r6                      ;
    mov   DPL0, r7                      ;Get byte from report descriptor.
    movx  a, @dptr                      ;
    
    mov   DPH0, r4                      ;
    mov   DPL0, r5                      ;Put byte in endpoint 0 buffer.
    movx  @dptr, a                      ;

    inc   r7                            ;Increment report descriptor pointer.   
    inc   r5                            ;Increment endpoint 0 buffer pointer.
    inc   r3                            ;Increment byte counter.

    cjne  r3, #$40, SendRep1            ;

    clr   a                             ;
    mov   dptr, EP0BCH                  ;
    movx  @dptr, a                      ;Load endpoint 0 byte count with 64.
    mov   dptr, EP0BCL                  ;
    mov   a, #$40                       ;
    movx  @dptr, a                      ;
    
    lcall EndControlTransfer            ;Send second 64 bytes.

    ;Wait for EP0 to be idle.
    _CheckEP0:
    mov   dptr, EP0CS                   ;Get status of endpoint 0.
    movx  a, @dptr                      ;
    jb    ACC_1, _CheckEP0              ;If end point is busy, loop to wait.
    
    ;Send final 9 bytes.
    mov   r3, #$00                      ;Byte counter.
    mov   r4, EP0BUF_HI                 ;Upper byte of endpoint 0 buffer pointer.
    mov   r5, EP0BUF_LO                 ;Lower byte of endpoint 0 buffer pointer.
    mov   r6, {RecordDesc2              ;Upper byte of report descriptor pointer.
    mov   r7, }RecordDesc2              ;Lower byte of report descriptor pointer.
    
    SendRep2:
    mov   DPH0, r6                      ;
    mov   DPL0, r7                      ;Get byte from report descriptor.
    movx  a, @dptr                      ;
    
    mov   DPH0, r4                      ;
    mov   DPL0, r5                      ;Put byte in endpoint 0 buffer.
    movx  @dptr, a                      ;

    inc   r7                            ;Increment report descriptor pointer.   
    inc   r5                            ;Increment endpoint 0 buffer pointer.
    inc   r3                            ;Increment byte counter.

    cjne  r3, #$09, SendRep2            ;

    clr   a                             ;
    mov   dptr, EP0BCH                  ;
    movx  @dptr, a                      ;Load endpoint 0 byte count with 9.
    mov   dptr, EP0BCL                  ;
    mov   a, #$09                       ;
    movx  @dptr, a                      ;

    ljmp  EndControlTransfer            ;

;==============================================Set Descriptor Function=========================================;

DoSetDescriptor:
    ljmp  EndControlTransfer            ;Set descriptor not implemented in this firmware.

;============================================Get Configuration Function========================================;

DoGetConfig:
    mov   dptr, EP0BUF                  ;
    mov   a, CONFIG_BYTE                ;Get config byte and put in enpoint 0 buffer.
    movx  @dptr, a                      ;

    clr   a                             ;
    mov   dptr, EP0BCH                  ;
    movx  @dptr, a                      ;
    mov   dptr, EP0BCL                  ;Set endpoint 0 byte count to 1 byte.
    inc   a                             ;
    movx  @dptr, a                      ;
    ljmp  EndControlTransfer            ;

;============================================Set Configuration Function========================================;

DoSetConfig:
    mov   dptr, SETUPDAT_2              ;
    movx  a, @dptr                      ;Get config byte from setup data and store it.
    mov   CONFIG_BYTE, a                ;
    ljmp  EndControlTransfer            ;

;==============================================Get Interface Function==========================================;

DoGetInterface:
    mov   dptr, EP0BUF                  ;
    mov   a, INTERFACE_BYTE             ;Get interface byte and put in enpoint 0 buffer.
    movx  @dptr, a                      ;

    clr   a                             ;
    mov   dptr, EP0BCH                  ;
    movx  @dptr, a                      ;
    mov   dptr, EP0BCL                  ;Set endpoint 0 byte count to 1 byte.
    inc   a                             ;
    movx  @dptr, a                      ;
    ljmp  EndControlTransfer            ;

;==============================================Set Interface Function==========================================;

DoSetInterface:
    mov   dptr, SETUPDAT_2              ;
    movx  a, @dptr                      ;Get interface byte from setup data and store it.
    mov   INTERFACE_BYTE, a             ;
    ljmp  EndControlTransfer            ;

;===============================================Sync Frame Function============================================;

DoSyncFrame:
    ljmp  EndControlTransfer            ;Sync frame not implemented in this firmware.

;==========================================Bulk Data Loopback Functions========================================;

    SendReport:
    mov   dptr, EP1INCS                 ;Get status of end point 1 IN.
    movx  a, @dptr                      ;
    jb    ACC_1, EP1NotReady            ;If end point is busy, branch to exit.

    sjmp  BuildReport                   ;Jump to fill endpoint 1 buffer.

    EP1NotReady:
    ljmp  EndCheckEP1                   ;Jump to exit function.

    BuildReport:
    lcall GetAnalogValues               ;Get analog values from the ATMega168 via I2C.

    mov   r7, IOA                       ;
    mov   r6, IOB                       ;Get input button presses.
    mov   r5, IOD                       ;

    mov   r4, #$00                      ;Zero out working register.
    
    mov   dptr, EP1INBUF                ;Point data pointer to endpoint 1 in buffer.
    clr   a                             ;Clear out accumulator to build button press status.

    ;Do first byte of buttons.

    ;***Button 1***;
    DoBtn1:
    mov   a, r5                         ;Get byte containing button bit.
    anl   a, #$40                       ;
    jz    DoBtn2                        ;Is button pressed? If not, branch.
    mov   a, r4                         ;
    orl   a, #$01                       ;Add button press to output byte.
    mov   r4, a                         ;

    ;***Button 2***;
    DoBtn2:
    mov   a, r5                         ;Get byte containing button bit.
    anl   a, #$08                       ;
    jz    DoBtn3                        ;Is button pressed? If not, branch.
    mov   a, r4                         ;
    orl   a, #$02                       ;Add button press to output byte.
    mov   r4, a                         ;

    ;***Button 3***;
    DoBtn3:
    mov   a, r5                         ;Get byte containing button bit.
    anl   a, #$04                       ;
    jz    DoBtn4                        ;Is button pressed? If not, branch.
    mov   a, r4                         ;
    orl   a, #$04                       ;Add button press to output byte.
    mov   r4, a                         ;

    ;***Button 4***;
    DoBtn4:
    mov   a, r5                         ;Get byte containing button bit.
    anl   a, #$10                       ;
    jz    DoBtn5                        ;Is button pressed? If not, branch.
    mov   a, r4                         ;
    orl   a, #$08                       ;Add button press to output byte.
    mov   r4, a                         ;

    ;***Button 5***;
    DoBtn5:
    mov   a, r6                         ;Get byte containing button bit.
    anl   a, #$02                       ;
    jz    DoBtn6                        ;Is button pressed? If not, branch.
    mov   a, r4                         ;
    orl   a, #$10                       ;Add button press to output byte.
    mov   r4, a                         ;

    ;***Button 6***;
    DoBtn6:
    mov   a, r5                         ;Get byte containing button bit.
    anl   a, #$20                       ;
    jz    DoBtn7                        ;Is button pressed? If not, branch.
    mov   a, r4                         ;
    orl   a, #$20                       ;Add button press to output byte.
    mov   r4, a                         ;
    
    ;***Button 7***;
    DoBtn7:
    mov   a, r6                         ;Get byte containing button bit.
    anl   a, #$08                       ;
    jz    DoBtn8                        ;Is button pressed? If not, branch.
    mov   a, r4                         ;
    orl   a, #$40                       ;Add button press to output byte.
    mov   r4, a                         ;

    ;***Button 8***;
    DoBtn8:
    mov   a, r5                         ;Get byte containing button bit.
    anl   a, #$80                       ;
    jz    SendByte1                     ;Is button pressed? If not, branch.
    mov   a, r4                         ;
    orl   a, #$80                       ;Add button press to output byte.
    mov   r4, a                         ;

    SendByte1:
    mov   BTN_LO, r4                    ;Store status for later use.
    mov   a, r4                         ;Put byte in endpoint 1 buffer.
    movx  @dptr, a                      ;

    inc   dptr                          ;Move to next buffer spot.
    mov   r4, #$00                      ;Zero out working register.

    ;Do second byte of buttons.

    ;***Button 9***;
    DoBtn9:
    mov   a, r7                         ;Get byte containing button bit.
    anl   a, #$04                       ;
    jz    DoBtn10                       ;Is button pressed? If not, branch.
    mov   a, r4                         ;
    orl   a, #$01                       ;Add button press to output byte.
    mov   r4, a                         ;

    ;***Button 10***;
    DoBtn10:
    mov   a, r7                         ;Get byte containing button bit.
    anl   a, #$02                       ;
    jz    DoBtn11                       ;Is button pressed? If not, branch.
    mov   a, r4                         ;
    orl   a, #$02                       ;Add button press to output byte.
    mov   r4, a                         ;

    ;***Button 11***;
    DoBtn11:
    mov   a, r7                         ;Get byte containing button bit.
    anl   a, #$08                       ;
    jz    DoBtn12                       ;Is button pressed? If not, branch.
    mov   a, r4                         ;
    orl   a, #$04                       ;Add button press to output byte.
    mov   r4, a                         ;

    ;***Button 12***;
    DoBtn12:
    mov   a, r7                         ;Get byte containing button bit.
    anl   a, #$10                       ;
    jz    SendByte2                     ;Is button pressed? If not, branch.
    mov   a, r4                         ;
    orl   a, #$08                       ;Add button press to output byte.
    mov   r4, a                         ;

    SendByte2:
    mov   BTN_HI, r4                    ;Store status for later use.
    mov   a, r4                         ;Put second byte in endpoint 1 buffer.
    movx  @dptr, a                      ;

    inc   dptr                          ;
    mov   a, I2CBYTE0                   ;X analog value.
    movx  @dptr, a                      ;

    inc   dptr                          ;
    mov   a, I2CBYTE1                   ;Y analog value.
    movx  @dptr, a                      ;

    inc   dptr                          ;
    mov   a, I2CBYTE2                   ;Rz analog value.
    movx  @dptr, a                      ;

    inc   dptr                          ;
    mov   a, I2CBYTE3                   ;Z analog value.
    movx  @dptr, a                      ;

    mov   a, IOB                        ;Get port a values again.
    anl   a, #$74                       ;Keep only D-pad buttons.

    ChkUp:
    cjne  a, #$04, ChkUpRight           ;Is up being pressed? If not, branch.
    mov   a, #$00                       ;
    ljmp  FinishDPad                    ;Jump to load last byte.

    ChkUpRight:
    cjne  a, #$14, ChkRight             ;Is up and right being pressed? If not, branch.
    mov   a, #$01                       ;
    ljmp  FinishDPad                    ;Jump to load last byte.            

    ChkRight:
    cjne  a, #$10, ChkDownRight         ;Is right being pressed? If not, branch.
    mov   a, #$02                       ;
    ljmp  FinishDPad                    ;Jump to load last byte.

    ChkDownRight:
    cjne  a, #$50, ChkDown              ;Is down and right being pressed? If not, branch.
    mov   a, #$03                       ;
    ljmp  FinishDPad                    ;Jump to load last byte.

    ChkDown:
    cjne  a, #$40, ChkLeftDown          ;Is down being pressed? If not, branch.
    mov   a, #$04                       ;
    ljmp  FinishDPad                    ;Jump to load last byte.

    ChkLeftDown:
    cjne  a, #$60, ChkLeft              ;Is down and left being pressed? If not, branch.
    mov   a, #$05                       ;
    ljmp  FinishDPad                    ;Jump to load last byte.

    ChkLeft:
    cjne  a, #$20, ChkUpLeft            ;Is left being pressed? If not, branch.
    mov   a, #$06                       ;
    ljmp  FinishDPad                    ;Jump to load last byte.

    ChkUpLeft:
    cjne  a, #$24, InvDPad              ;Is up and left being pressed? If not, branch.
    mov   a, #$07                       ;
    ljmp  FinishDPad                    ;Jump to load last byte.

    InvDPad:
    mov   a, #$ff                       ;Invalid D-pad combination or no button press.

    FinishDPad:
    mov   DPAD, a                       ;Save copy of D-pad value.
    inc   dptr                          ;Save D-pad value in the buffer.
    movx  @dptr, a                      ;

    mov   dptr, EP1INBC                 ;
    mov   a, #$07                       ;Set end point 1 byte count to 7 bytes.
    movx  @dptr, a                      ;

    ;lcall DisplayAnalogValues          ;Send analog values to the LCD display.
    ;lcall DisplayButtons               ;Display button presses on LCD.
    ;lcall DisplayDPad                  ;Display D-pad value.

    EndCheckEP1:

    mov   r7, #$14                      ;
    mov   r6, #$00                      ;Delay for 20 milliseconds.
    lcall DoDelay                       ;

    ret                                 ;Return from generating report.

;==============================================Time Delay Functions============================================;

DoDelay:
    mov   UPPER_MS_DELAY, r6            ;Load upper and lower millisecond delay bytes.
    mov   LOWER_MS_DELAY, r7            ;

    Check12MHz:
    mov   dptr, CPUCS                   ;Get CPU status.
    movx  a, @dptr                      ;
    anl   a, #$18                       ;Discard all bits except CPU clock bits.
    jnz   Check48MHz                    ;Is processor running at 12 MHz? If not, branch.

    Adjust12MHz:
    mov   a, LOWER_MS_DELAY             ;
    add   a, #$01                       ;
    mov   r7, a                         ;Get carry bit from lower byte if lower byte = $ff.
    clr   a                             ;
    addc  a, UPPER_MS_DELAY             ;
    clr   c                             ;
    rrc   a                             ;Divide upper millisecond byte by 2 and save.
    mov   UPPER_MS_DELAY, a             ;
    mov   a, r7                         ;
    rrc   a                             ;Divide lower millisecond byte by 2 and save.
    mov   LOWER_MS_DELAY, a             ;
    sjmp  TimeDelayLoop                 ;Branch to begin delay loop.

    Check48MHz:
    mov   dptr, CPUCS                   ;Get CPU status.
    movx  a, @dptr                      ;
    anl   a, #$18                       ;Discard all bits except CPU clock bits.
    mov   r7, a                         ;
    cjne  r7, #$10, TimeDelayLoop       ;Is processor running at 48 MHz? If not, branch.

    Adjust48MHz:
    mov   a, LOWER_MS_DELAY             ;
    add   a, ACC                        ;Multiply lower millisecond delay byte by-->
    mov   LOWER_MS_DELAY, a             ;2 and save (a + a = 2a).
    mov   a, UPPER_MS_DELAY             ;
    rlc   a                             ;Multiply upper millisecond delay byte by 2 including-->
    mov   UPPER_MS_DELAY, a             ;carry from lower byte and save.

    TimeDelayLoop:
    mov   a, LOWER_MS_DELAY             ;Save pre-decremented value.
    dec   LOWER_MS_DELAY                ;Decrement lower millisecond byte.
    mov   r6, UPPER_MS_DELAY            ;Save pre-decremented value.
    jnz   CheckEndDelay                 ;Does upper byte need to be decremented? If not, branch.
    dec   UPPER_MS_DELAY                ;Decrement upper millisecond byte.

    CheckEndDelay:
    orl   a, r6                         ;Check to see if upper and lower bytes are both zero.
    jz    DelayExit                     ;Jump to exit if time delay complete.
    lcall MsWait                        ;Call the function that burns some time.
    sjmp  TimeDelayLoop                 ;Loop again.
    
    DelayExit:
    ret                                 ;Delay done. Exit function.

;This function takes 1 millisecond to complete when the processor is running at 24 MHz.
MsWait:
    mov   a, #$00                       ;
    mov   DPS, a                        ;Select data pointer 0.
    mov   dptr, #$fda5                  ;Load data pointer initial value.
    mov   r4, #$05                      ;Kill some time?  Not referenced again.

    CounterLoop:
    inc   dptr                          ;Increment data pointer.
    mov   a, DPL0                       ;
    orl   a, DPH0                       ;Check if high byte and low byte are both 0.-->
    jnz   CounterLoop                   ;If not, branch to increment counter again.
    ret                                 ;Loop complete.  Exit function.

;============================================Vendor Command Functions==========================================;

DoVendorCommands:
    mov   dptr, SETUPDAT_1              ;Get vendor command from bmRequest byte.
    movx  a, @dptr                      ;Convert vendor command to VendCmdTbl index.-->
    add   a, #$30                       ;Valid values are #$D0 thru #$DC.
    cjne  a, #$0d, CheckValidJump       ;Set carry if valid entry in table below.   
    CheckValidJump:
    jnc   InvalidFunction               ;Is valid entry into table? If not, branch.
    mov   dptr, VendCmdTbl              ;Point data pointer to the beginning of VendCmdTbl below.
    add   a, ACC                        ;a = 2 * a. 2 bytes per entry in table below.
    jmp   @a+dptr                       ;Indirect jump to routine in table below.

    VendCmdTbl:
    ajmp  InvalidFunction               ;
    ajmp  InvalidFunction               ;
    ajmp  InvalidFunction               ;
    ajmp  InvalidFunction               ;
    ajmp  Get7Seg                       ;The following is a table of indirect jumps to-->
    ajmp  InvalidFunction               ;the individual vendor commands.  The first-->
    ajmp  GetSwitches                   ;entry in the table is vendor command $d0. Some-->
    ajmp  GetBargraph                   ;of the commands are not implemented.
    ajmp  SetBargraph                   ;
    ajmp  IsHighSpeed                   ;
    ajmp  Renumerate                    ;
    ajmp  Set7Seg                       ;
    ajmp  InvalidFunction               ;

InvalidFunction:                        ;No function specified for given vendor command.-->
    setb  c                             ;Exit and indicated a stall is required.
    ret                                 ;

Get7Seg:
    mov   a, IOB                        ;
    cpl   a                             ;Get 7 segment bits and invert them.
    mov   dptr, EP0BUF                  ;Put the 7 segment byte into the end point 0 buffer.
    movx  @dptr, a                      ;

    ajmp  SetEP0To1Byte                 ;Set enpoint 0 buffer byte count to 1.

GetSwitches:
    mov   dptr, EP0BUF                  ;
    mov   a, IOA                        ;Get switch states.
    movx  @dptr, a                      ;Load states into endpoint 0 buffer.

    ajmp  SetEP0To1Byte                 ;Set enpoint 0 buffer byte count to 1.

GetBargraph:
    ;mov   a, IOD                       ;
    cpl   a                             ;Get bargraph bits and invert them.
    mov   dptr, EP0BUF                  ;Put the bargraph byte into the end point 0 buffer.
    movx  @dptr, a                      ;

    ajmp  SetEP0To1Byte                 ;Set enpoint 0 buffer byte count to 1.

SetBargraph:
    acall ClearEP0ByteCount             ;Clear endpoint 0 byte count.
    acall EP0BusyLoop                   ;Check endpoint 0 busy flag.

    mov   dptr, EP0BUF                  ;Get bargraph data from end point 0.
    movx  a, @dptr                      ;
    cpl   a                             ;
    ;mov   IOD, a                       ;Invert and present byte on LED bargraph.

    ajmp  ClearEP0ByteCount             ;Clear endpoint 0 byte count.

IsHighSpeed:
    mov   dptr, USBCS                   ;
    movx  a, @dptr                      ;Get USB control and status byte.
    anl   a, #$80                       ;Save only HSM (hish-speed mode) bit.
    mov   dptr, EP0BUF                  ;Save bit in end point 0 buffer.
    movx  @dptr, a                      ;

    ajmp  SetEP0To1Byte                 ;Set enpoint 0 buffer byte count to 1.

Renumerate:
    mov   dptr, EP0BUF                  ;
    mov   a, #$07                       ;Send #$07 to host.
    movx  @dptr, a                      ;

    acall SetEP0To1Byte                 ;Set enpoint 0 buffer byte count to 1.
    
    mov   dptr, EP0CS                   ;
    movx  a, @dptr                      ;ACK the control transfer.
    orl   a, #$80                       ;
    movx  @dptr, a                      ;

    mov   r7, #$e8                      ;
    mov   r6, #$03                      ;Delay for 1000 milliseconds.
    lcall DoDelay                       ;

    lcall InitializeUSB                 ;
    clr   c                             ;Reninitialize the USB device.
    ret                                 ;

Set7Seg:
    acall ClearEP0ByteCount             ;Clear endpoint 0 byte count.
    acall EP0BusyLoop                   ;Check endpoint 0 busy flag.

    mov   dptr, EP0BUF                  ;Get 7 segment display byte from endpoint 0 buffer.
    movx  a, @dptr                      ;
    cpl   a                             ;
    ;mov   IOB, a                       ;Invert and present byte on 7 segment display.

    ajmp  ClearEP0ByteCount             ;Clear endpoint 0 byte count.

SetEP0To1Byte:
    clr   a                             ;
    mov   dptr, EP0BCH                  ;
    movx  @dptr, a                      ;
    mov   dptr, EP0BCL                  ;Indicate 1 byte of data is in the endpoint 0 buffer.
    inc   a                             ;
    movx  @dptr, a                      ;
    clr   c                             ;
    ret                                 ;

ClearEP0ByteCount:
    clr   a                             ;
    mov   dptr, EP0BCH                  ;
    movx  @dptr, a                      ;
    mov   dptr, EP0BCL                  ;Clear endpoint 0 byte count.
    movx  @dptr, a                      ;
    clr   c                             ;
    ret                                 ;

EP0BusyLoop:
    mov   dptr, EP0CS                   ;
    movx  a, @dptr                      ;Check endpoint 0 busy flag. Loop unil endpoint 0 is not busy.
    jb    ACC_1, EP0BusyLoop            ;
    ret                                 ;

;=============================================I2C Control Functions============================================;

;r7 = data to write to bus.
;r6 = data read from bus.
I2CStart:
    mov   dptr, I2CS                    ;
    mov   a, #$80                       ;Set start bit in I2CS register.
    movx  @dptr, a                      ;
    ret                                 ;

I2CStop:
    mov   dptr, I2CS                    ;
    mov   a, #$40                       ;Set stop bit in I2CS register.
    movx  @dptr, a                      ;

    WaitForStop:
    mov   dptr, I2CS                    ;
    movx  a, @dptr                      ;Has stop been sent? Loop if not.
    jb    ACC_6, WaitForStop            ;
    ret                                 ;

I2CWrite:
    mov   a, r7                         ;
    mov   dptr, I2CDAT                  ;Write data to I2CDAT register.
    movx  @dptr, a                      ;

    WaitForWrite:
    mov   dptr, I2CS                    ;
    movx  a, @dptr                      ;Is write complete? Loop if not.
    jnb   ACC_0, WaitForWrite           ;
    ret                                 ;

I2CFirstRead:
    mov   dptr, I2CDAT                  ;Read I2CDAT to initiate read.  Results discarded.
    movx  a, @dptr                      ;

    WaitForFirstRead:
    mov   dptr, I2CS                    ;
    movx  a, @dptr                      ;Is the first read complete? Loop if not.
    jnb   ACC_0, WaitForFirstRead       ;
    ret                                 ;

I2CRead:
    mov   dptr, I2CDAT                  ;Read valid byte from I2C bus.
    movx  a, @dptr                      ;
    mov   r6, a                         ;Save read byte.
    
    WaitForRead:
    mov   dptr, I2CS                    ;
    movx  a, @dptr                      ;Is read complete? Loop if not.
    jnb   ACC_0, WaitForRead            ;   
    ret                                 ;

I2CLastRead:
    mov   dptr, I2CS                    ;
    mov   a, #$40                       ;Set stop bit in I2CS register.
    movx  @dptr, a                      ;

    mov   dptr, I2CDAT                  ;Read valid byte from I2C bus.
    movx  a, @dptr                      ;
    mov   r6, a                         ;Save read byte.
    ret                                 ;

I2CSetLast:
    mov   dptr, I2CS                    ;
    mov   a, #$20                       ;Set last read bit.
    movx  @dptr, a                      ;
    ret                                 ;

;=================================================LCD Functions================================================;

LCDInit:
    lcall I2CStart                      ;Send start signal.

    mov   r7, #$7c                      ;Address LCD display, write.
    lcall I2CWrite                      ;

    mov   r7, #$00                      ;No more control bytes before stop,
    lcall I2CWrite                      ;write to config registers.

    mov   r7, #$38                      ;Wake up display.
    lcall I2CWrite                      ;

    lcall I2CStop                       ;Send stop signal.

    mov   r7, #$02                      ;
    mov   r6, #$00                      ;Delay for 2 milliseconds.
    lcall DoDelay                       ;

    lcall I2CStart                      ;Send start signal.

    mov   r7, #$7c                      ;Address LCD display, write.
    lcall I2CWrite                      ;

    mov   r7, #$00                      ;No more control bytes before stop,
    lcall I2CWrite                      ;write to config registers.

    mov   r7, #$39                      ;Function set. Interface data = 8 bits. Line numbers = 2.
    lcall I2CWrite                      ;Single height font. Instruction table 1.

    lcall I2CStop                       ;Send stop signal.

    mov   r7, #$02                      ;
    mov   r6, #$00                      ;Delay for 2 milliseconds.
    lcall DoDelay                       ;

    ClearLCD:
    lcall I2CStart                      ;Send start signal.

    mov   r7, #$7c                      ;Address LCD display, write.
    lcall I2CWrite                      ;

    mov   r7, #$00                      ;No more control bytes before stop,
    lcall I2CWrite                      ;write to config registers.

    mov   r7, #$14                      ;Internal OSC frequency.
    lcall I2CWrite                      ;

    mov   r7, #$78                      ;Contrast set.
    lcall I2CWrite                      ;

    mov   r7, #$5c                      ;ICON control.
    lcall I2CWrite                      ;

    mov   r7, #$6f                      ;Follower control.
    lcall I2CWrite                      ;

    mov   r7, #$0c                      ;Display ON. Entire display on.
    lcall I2CWrite                      ;

    mov   r7, #$01                      ;Clear display.
    lcall I2CWrite                      ;
    
    mov   r7, #$06                      ;Entry mode set.
    lcall I2CWrite                      ;

    lcall I2CStop                       ;Send stop signal.

    mov   r7, #$02                      ;
    mov   r6, #$00                      ;Delay for 2 milliseconds.
    lcall DoDelay                       ;

    ret                                 ;End LCD init.

DisplayAnalogValues:
    lcall I2CStart                      ;Send start signal.

    mov   r7, #$7c                      ;Address LCD display, write.
    lcall I2CWrite                      ;

    mov   r7, #$00                      ;No more control bytes before stop,-->
    lcall I2CWrite                      ;write to config registers.

    mov   r7, #$80                      ;Switch to first line of display.
    lcall I2CWrite                      ;

    lcall I2CStop                       ;Send stop signal.

    lcall I2CStart                      ;Send start signal.

    mov   r7, #$7c                      ;Address LCD display, write.
    lcall I2CWrite                      ;

    mov   r7, #$40                      ;No more control bytes before stop,-->
    lcall I2CWrite                      ;write to display.

    mov   r7, _X                        ;Write X.
    lcall I2CWrite                      ;

    lcall I2CStop                       ;Send stop signal.

    mov   r7, I2CBYTE0                  ;Print hex value of analog byte 0.
    lcall PrintHex                      ;

    lcall I2CStart                      ;Send start signal.

    mov   r7, #$7c                      ;Address LCD display, write.
    lcall I2CWrite                      ;

    mov   r7, #$40                      ;No more control bytes before stop,-->
    lcall I2CWrite                      ;write to display.

    mov   r7, _Y                        ;Write Y.
    lcall I2CWrite                      ;

    lcall I2CStop                       ;Send stop signal.
    
    mov   r7, I2CBYTE1                  ;Print hex value of analog byte 1.
    lcall PrintHex                      ;

    lcall I2CStart                      ;Send start signal.

    mov   r7, #$7c                      ;Address LCD display, write.
    lcall I2CWrite                      ;

    mov   r7, #$40                      ;No more control bytes before stop,-->
    lcall I2CWrite                      ;write to display.

    mov   r7, _R                        ;Write R.
    lcall I2CWrite                      ;

    mov   r7, _z                        ;Write z.
    lcall I2CWrite                      ;

    lcall I2CStop                       ;Send stop signal.

    mov   r7, I2CBYTE2                  ;Print hex value of analog byte 2.
    lcall PrintHex                      ;

    lcall I2CStart                      ;Send start signal.

    mov   r7, #$7c                      ;Address LCD display, write.
    lcall I2CWrite                      ;

    mov   r7, #$40                      ;No more control bytes before stop,-->
    lcall I2CWrite                      ;write to display.

    mov   r7, _z                        ;Write z.
    lcall I2CWrite                      ;

    lcall I2CStop                       ;Send stop signal.

    mov   r7, I2CBYTE3                  ;Print hex value of analog byte 3.
    lcall PrintHex                      ;

    lcall I2CStart                      ;Send start signal.

    mov   r7, #$7c                      ;Address LCD display, write.
    lcall I2CWrite                      ;

    mov   r7, #$00                      ;No more control bytes before stop,-->
    lcall I2CWrite                      ;write to control registers.

    mov   r7, #$c0                      ;Move to beginning of second row.
    lcall I2CWrite                      ;

    lcall I2CStop                       ;Send stop signal.

    ret                                 ;Exit print function.

PrintHex:
    UpperNibble:
    mov   a, r7                         ;
    anl   a, #$f0                       ;
    rr    a                             ;Transfer byte into a and move upper nibble-->
    rr    a                             ;to lower nibble. Discard lower nibble.
    rr    a                             ;
    rr    a                             ;

    cjne  a, #$0a, Compare01            ;Compare and set or clear carry.

    Compare01:
    jnc GreaterThan01                   ;Is value greater than #$09?  If so, branch.

    LessThan01:
    add  a, #$30                        ;
    mov  HEX_HI, a                      ;Add #$37 to get ascii A through F.
    ljmp LowerNibble                    ;

    GreaterThan01:
    add  a, #$37                        ;
    mov  HEX_HI, a                      ;Add #$30 to get ascii 0 through 9.
    
    LowerNibble:
    mov   a, r7                         ;Transfer byte into a and discard upper nibble.
    anl   a, #$0f                       ;

    cjne  a, #$0a, Compare02            ;Compare and set or clear carry.

    Compare02:
    jnc GreaterThan02                   ;Is value greater than #$09?  If so, branch.

    LessThan02:
    add  a, #$30                        ;
    mov  HEX_LO, a                      ;Add #$37 to get ascii A through F.
    ljmp HexToLCD                       ;

    GreaterThan02:
    add  a, #$37                        ;
    mov  HEX_LO, a                      ;Add #$30 to get ascii 0 through 9.

    HexToLCD:
    lcall I2CStart                      ;Send start signal.

    mov   r7, #$7c                      ;Address LCD display, write.
    lcall I2CWrite                      ;

    mov   r7, #$40                      ;No more control bytes before stop,-->
    lcall I2CWrite                      ;Write to display.

    mov   r7, HEX_HI                    ;Write upper hex nibble.
    lcall I2CWrite                      ;
    
    mov   r7, HEX_LO                    ;Write lower hex nibble.
    lcall I2CWrite                      ;

    mov   r7, SPACE                     ;Write a space.
    lcall I2CWrite                      ;

    lcall I2CStop                       ;Send stop signal.
    ret                                 ;

DisplayButtons:
    mov   a, BTN_HI                     ;Get Upper byte of button statuses.
    mov   c, ACC_3                      ;Move desired bit into carry position.
    lcall WriteLCDBit                   ;   

    mov   a, BTN_HI                     ;Get Upper byte of button statuses.
    mov   c, ACC_2                      ;Move desired bit into carry position.
    lcall WriteLCDBit                   ;

    mov   a, BTN_HI                     ;Get Upper byte of button statuses.
    mov   c, ACC_1                      ;Move desired bit into carry position.
    lcall WriteLCDBit                   ;
    
    mov   a, BTN_HI                     ;Get Upper byte of button statuses.
    mov   c, ACC_0                      ;Move desired bit into carry position.
    lcall WriteLCDBit                   ;

    mov   a, BTN_LO                     ;Get Upper byte of button statuses.
    mov   c, ACC_7                      ;Move desired bit into carry position.
    lcall WriteLCDBit                   ;

    mov   a, BTN_LO                     ;Get Upper byte of button statuses.
    mov   c, ACC_6                      ;Move desired bit into carry position.
    lcall WriteLCDBit                   ;

    mov   a, BTN_LO                     ;Get Upper byte of button statuses.
    mov   c, ACC_5                      ;Move desired bit into carry position.
    lcall WriteLCDBit                   ;

    mov   a, BTN_LO                     ;Get Upper byte of button statuses.
    mov   c, ACC_4                      ;Move desired bit into carry position.
    lcall WriteLCDBit                   ;

    mov   a, BTN_LO                     ;Get Upper byte of button statuses.
    mov   c, ACC_3                      ;Move desired bit into carry position.
    lcall WriteLCDBit                   ;

    mov   a, BTN_LO                     ;Get Upper byte of button statuses.
    mov   c, ACC_2                      ;Move desired bit into carry position.
    lcall WriteLCDBit                   ;

    mov   a, BTN_LO                     ;Get Upper byte of button statuses.
    mov   c, ACC_1                      ;Move desired bit into carry position.
    lcall WriteLCDBit                   ;

    mov   a, BTN_LO                     ;Get Upper byte of button statuses.
    mov   c, ACC_0                      ;Move desired bit into carry position.
    lcall WriteLCDBit                   ;

    ret                                 ;End display buttons function.

WriteLCDBit:
    jnc   WriteZero                     ;Is carry bit set? If not, Jump.
    
    WriteOne:
    mov  r6, ONE                        ;Prepare to write a '1' to the LCD display.
    ljmp WriteLCDBitEnd                 ;

    WriteZero:
    mov  r6, ZERO                       ;Prepare to write a '0' to the LCD display.

    WriteLCDBitEnd:
    lcall I2CStart                      ;Send start signal.

    mov   r7, #$7c                      ;Address LCD display, write.
    lcall I2CWrite                      ;

    mov   r7, #$40                      ;No more control bytes before stop,-->
    lcall I2CWrite                      ;Write to display.

    mov   r7, R6BNK0                    ;Write bit to display.
    lcall I2CWrite                      ;

    lcall I2CStop                       ;Send stop signal.
    ret                                 ;

DisplayDPad:
    lcall I2CStart                      ;Start read.

    mov   r7, #$7c                      ;Address LCD display, write.
    lcall I2CWrite                      ;

    mov   r7, #$40                      ;No more control bytes before stop,-->
    lcall I2CWrite                      ;Write to display.

    mov   r7, SPACE                     ;Write a space.
    lcall I2CWrite                      ;

    mov   a, DPAD                       ;Get D-pad value.

    WriteUP:
    cjne  a, #$00, WriteUR              ;Is up being pressed? If not, branch.

    mov   r7, _U                        ;Write U.
    lcall I2CWrite                      ;

    mov   r7, _P                        ;Write P.
    lcall I2CWrite                      ;

    ljmp  DisplayDPadEnd                ;Jump to end.

    WriteUR:
    cjne  a, #$01, WriteRT              ;Is up-right being pressed? If not, branch.

    mov   r7, _U                        ;Write U.
    lcall I2CWrite                      ;

    mov   r7, _R                        ;Write R.
    lcall I2CWrite                      ;

    ljmp  DisplayDPadEnd                ;Jump to end.

    WriteRT:
    cjne  a, #$02, WriteDR              ;Is right being pressed? If not, branch.

    mov   r7, _R                        ;Write R.
    lcall I2CWrite                      ;

    mov   r7, _T                        ;Write T.
    lcall I2CWrite                      ;

    ljmp  DisplayDPadEnd                ;Jump to end.

    WriteDR:
    cjne  a, #$03, WriteDN              ;Is down-right being pressed? If not, branch.

    mov   r7, _D                        ;Write D.
    lcall I2CWrite                      ;

    mov   r7, _R                        ;Write R.
    lcall I2CWrite                      ;

    ljmp  DisplayDPadEnd                ;Jump to end.

    WriteDN:
    cjne  a, #$04, WriteDL              ;Is down being pressed? If not, branch.

    mov   r7, _D                        ;Write D.
    lcall I2CWrite                      ;

    mov   r7, _N                        ;Write N.
    lcall I2CWrite                      ;

    ljmp  DisplayDPadEnd                ;Jump to end.

    WriteDL:
    cjne  a, #$05, WriteLT              ;Is down-left being pressed? If not, branch.

    mov   r7, _D                        ;Write D.
    lcall I2CWrite                      ;

    mov   r7, _L                        ;Write L.
    lcall I2CWrite                      ;

    ljmp  DisplayDPadEnd                ;Jump to end.

    WriteLT:
    cjne  a, #$06, WriteUL              ;Is left being pressed? If not, branch.

    mov   r7, _L                        ;Write L.
    lcall I2CWrite                      ;

    mov   r7, _T                        ;Write T.
    lcall I2CWrite                      ;

    ljmp  DisplayDPadEnd                ;Jump to end.

    WriteUL:
    cjne  a, #$07, WriteNA              ;Is up-left being pressed? If not, branch.

    mov   r7, _U                        ;Write U.
    lcall I2CWrite                      ;

    mov   r7, _L                        ;Write L.
    lcall I2CWrite                      ;

    ljmp  DisplayDPadEnd                ;Jump to end.

    WriteNA:
    mov   r7, _N                        ;Write N.
    lcall I2CWrite                      ;

    mov   r7, _A                        ;Write A.
    lcall I2CWrite                      ;

    DisplayDPadEnd:
    lcall I2CStop                       ;Send stop signal.
    ret                                 ;

;============================================Analog capture function===========================================;

GetAnalogValues:
    lcall I2CStart                      ;Start read.

    mov   r7, #$b1                      ;Slave address of ATMega168 + read bit.
    lcall I2CWrite                      ;

    lcall I2CSetLast                    ;Prepare to NAK last byte.
    lcall I2CFirstRead                  ;Initiate read. Discard read byte.

    lcall I2CLastRead                   ;Save first analog byte.
    mov   I2CBYTE0, r6                  ;

    lcall I2CStop                       ;Stop read.

    lcall I2CStart                      ;Start read.

    mov   r7, #$b3                      ;Slave address of ATMega168 + read bit.
    lcall I2CWrite                      ;
    
    lcall I2CSetLast                    ;Prepare to NAK last byte.
    lcall I2CFirstRead                  ;Initiate read. Discard read byte.

    lcall I2CLastRead                   ;Save first analog byte.
    mov   I2CBYTE1, r6                  ;

    lcall I2CStop                       ;Stop read.

    lcall I2CStart                      ;Start read.

    mov   r7, #$b5                      ;Slave address of ATMega168 + read bit.
    lcall I2CWrite                      ;
    
    lcall I2CSetLast                    ;Prepare to NAK last byte.
    lcall I2CFirstRead                  ;Initiate read. Discard read byte.

    lcall I2CLastRead                   ;Save first analog byte.
    mov   I2CBYTE2, r6                  ;

    lcall I2CStop                       ;Stop read.

    lcall I2CStart                      ;Start read.

    mov   r7, #$b7                      ;Slave address of ATMega168 + read bit.
    lcall I2CWrite                      ;
    
    lcall I2CSetLast                    ;Prepare to NAK last byte.
    lcall I2CFirstRead                  ;Initiate read. Discard read byte.

    lcall I2CLastRead                   ;Save first analog byte.
    mov   I2CBYTE3, r6                  ;

    lcall I2CStop                       ;Stop read.
    ret                                 ;

;==============================================================================================================;

;+------------------------------------------------------------------------------------------------------------+;
;|                                                 Data Tables                                                |;
;+------------------------------------------------------------------------------------------------------------+;

;These 9 bytes represent the height of Leds being illuminated on the bargraph. The first
;value is no lights while the last value is all lights turned on.
BarGraphTbl:
    .db $00, $20, $60, $e0, $e1, $e3, $e7, $ef, $ff

;These 10 bytes represent numbers 0 through 9 converted to be displayed on the 7 segment display.
NumberTbl:
    .db $d7, $06, $b3, $a7, $66, $e5, $f4, $07, $f7, $67

;+------------------------------------------------------------------------------------------------------------+;
;|                                                 Descriptors                                                |;
;+------------------------------------------------------------------------------------------------------------+;

;================================================USB Descriptors===============================================;

.org $1000

DeviceDesc:                             ;Device descriptor.
    .db $12, $01, $02, $00, $00, $00, $00, $40, $31, $86, $28, $11, $00, $01, $01, $02
    .db $00, $01

DeviceQual:                             ;Device qualifier.
    .db $0a, $06, $02, $00, $00, $00, $00, $40, $01, $00

ConfigDescHS:                           ;High speed configuration descriptor.
    .db $09, $02, $22, $00, $01, $01, $04, $a0, $32

DefaultIntHS:                           ;High speed default interface descriptor.
    .db $09, $04, $00, $00, $01, $03, $00, $00, $00

HIDDescHS:
    .db $09, $21, $01, $10, $00, $01, $22, $89, $00

EP1DescHS:                              ;High speed endpoint 1 descriptor.
    .db $07, $05, $81, $03, $07, $00, $01

;   .db $00                             ;Word alignment.

ConfigDescFS:                           ;Full speed configuration descriptor.
    .db $09, $02, $22, $00, $01, $01, $03, $a0, $32

DefaultIntFS:                           ;Full speed default interface descriptor.
    .db $09, $04, $00, $00, $01, $03, $00, $00, $00

HIDDescFS:
    .db $09, $21, $01, $10, $00, $01, $22, $89, $00

EP1DescFS:                              ;Full speed endpoint 1 descriptor.
    .db $07, $05, $81, $03, $07, $00, $01

;==============================================String Descriptors==============================================;

;   .db $00                             ;Word alignment.

StringDesc0:
    .db $04                             ;Descriptor size-4 bytes.
    .db $03                             ;Descriptor type-String descriptor.
    .db $09, $04                        ;English-United States ($0409).

StringDesc1:
    .db $18, $03                        ;Descriptor size and type.
    ;      P         S         X         /         U         S         B        space
    .db $50, $00, $53, $00, $58, $00, $2F, $00, $55, $00, $53, $00, $42, $00, $20, $00
    ;      P         a         d
    .db $50, $00, $61, $00, $64, $00
    
StringDesc2:
    .db $18, $03                        ;Descriptor size and type.
    ;      P         S         X         /         U         S         B        space
    .db $50, $00, $53, $00, $58, $00, $2F, $00, $55, $00, $53, $00, $42, $00, $20, $00
    ;      P         a         d
    .db $50, $00, $61, $00, $64, $00

StringDesc3:
    .db $18, $03                        ;Descriptor size and type.
    ;      P         S         X         /         U         S         B        space
    .db $50, $00, $53, $00, $58, $00, $2F, $00, $55, $00, $53, $00, $42, $00, $20, $00
    ;      P         a         d
    .db $50, $00, $61, $00, $64, $00

;End string descriptors.
    .db $00, $00

.org $1200                          

;Record Descriptor.
RecordDesc0:                            ;Size: 137 bytes.
    .db $05, $01, $09, $04, $A1, $01, $09, $01, $A1, $00, $05, $09, $19, $01, $29, $0C
    .db $15, $00, $25, $01, $35, $00, $45, $01, $75, $01, $95, $0C, $81, $02, $75, $04
    .db $95, $01, $81, $01, $05, $01, $09, $30, $09, $31, $15, $00, $26, $FF, $00, $35
    .db $00, $46, $FF, $00, $66, $00, $00, $75, $08, $95, $02, $81, $02, $05, $01, $09
RecordDesc1:
    .db $35, $09, $32, $15, $00, $26, $FF, $00, $35, $00, $46, $FF, $00, $66, $00, $00
    .db $75, $08, $95, $02, $81, $02, $C0, $09, $39, $15, $00, $25, $07, $35, $00, $46
    .db $3B, $01, $65, $14, $75, $04, $95, $01, $81, $42, $75, $04, $95, $01, $81, $01
    .db $05, $8C, $09, $01, $A1, $00, $09, $02, $15, $00, $26, $FF, $00, $75, $18, $95
RecordDesc2:
    .db $01, $91, $02, $09, $02, $B1, $02, $C0, $C0

;+------------------------------------------------------------------------------------------------------------+;
;|                                  Autovector Interrupt Tables and Functions                                 |;
;+------------------------------------------------------------------------------------------------------------+;

;==========================================Autovector Interrupt Table==========================================;

.org $1400

;The following vector table is for the USB and FIFO/GPIF interrupts and is accessed by
;the USB autovector functionality of the EZ-USB microprocessor. MUST BE PAGE ALIGNED!

;USB interrupts.
USB_AND_IE4:
    ljmp SUDAV_ISR
    nop
    ljmp SOF_ISR
    nop
    ljmp SUTOK_ISR
    nop
    ljmp SUSPEND_ISR
    nop
    ljmp USBRESET_ISR
    nop
    ljmp HISPEED_ISR
    nop
    ljmp EP0ACK_ISR
    nop
    ljmp SPARE_ISR
    nop
    ljmp EP0IN_ISR
    nop
    ljmp EP0OUT_ISR
    nop
    ljmp EP1IN_ISR
    nop
    ljmp EP1OUT_ISR
    nop
    ljmp EP2_ISR
    nop
    ljmp EP4_ISR
    nop
    ljmp EP6_ISR
    nop
    ljmp EP8_ISR
    nop
    ljmp IBN_ISR
    nop
    ljmp SPARE_ISR
    nop
    ljmp EP0PING_ISR
    nop
    ljmp EP1PING_ISR
    nop
    ljmp EP2PING_ISR
    nop
    ljmp EP4PING_ISR
    nop
    ljmp EP6PING_ISR
    nop
    ljmp EP8PING_ISR
    nop
    ljmp ERRLIMIT_ISR
    nop
    ljmp SPARE_ISR
    nop
    ljmp SPARE_ISR
    nop
    ljmp SPARE_ISR
    nop
    ljmp EP2ISOERR_ISR
    nop
    ljmp EP4ISOERR_ISR
    nop
    ljmp EP6ISOERR_ISR
    nop
    ljmp EP8ISOERR_ISR
    nop

;FIFO/GPIF interrupts.
    ljmp EP2PF_ISR
    nop
    ljmp EP4PF_ISR
    nop
    ljmp EP6PF_ISR
    nop
    ljmp EP8PF_ISR
    nop
    ljmp EP2EF_ISR
    nop
    ljmp EP4EF_ISR
    nop
    ljmp EP6EF_ISR
    nop
    ljmp EP8EF_ISR
    nop
    ljmp EP2FF_ISR
    nop
    ljmp EP4FF_ISR
    nop
    ljmp EP6FF_ISR
    nop
    ljmp EP8FF_ISR
    nop
    ljmp GPIFDONE_ISR
    nop
    ljmp GPIFWF_ISR
    nop

;=============================================Autovector Interrupts============================================;

SUDAV_ISR:
    lcall SaveStatus                    ;Store data pointer and accumulator.

    lcall ProcessSetupData

    ;setb  SETUP_DAT_PEND               ;Set bit indicating setup data is pending.

    anl   EXIF, #$ef                    ;Clear USB interrupt flag.
    mov   dptr, USBIRQ                  ;
    mov   a, #$01                       ;Clear SUDAV interrupt flag.
    movx  @dptr, a                      ;

    ljmp  RestoreStatus                 ;Restore data pointer and accumulator.

SOF_ISR:
    lcall SaveStatus                    ;Store data pointer and accumulator.

    anl   EXIF, #$ef                    ;Clear USB interrupt flag.
    mov   dptr, USBIRQ                  ;
    mov   a, #$02                       ;Clear SOF interrupt flag.
    movx  @dptr, a                      ;

    ljmp  RestoreStatus                 ;Restore data pointer and accumulator.

SUTOK_ISR:
    lcall SaveStatus                    ;Store data pointer and accumulator.

    anl   EXIF, #$ef                    ;Clear USB interrupt flag.
    mov   dptr, USBIRQ                  ;
    mov   a, #$04                       ;Clear SUTOK interrupt flag.
    movx  @dptr, a                      ;

    ljmp  RestoreStatus                 ;Restore data pointer and accumulator.

SUSPEND_ISR:
    lcall SaveStatus                    ;Store data pointer and accumulator.

    setb  IS_SUSPENDED                  ;Set bit indicating the device is suspended.

    anl   EXIF, #$ef                    ;Clear USB interrupt flag.
    mov   dptr, USBIRQ                  ;
    mov   a, #$08                       ;Clear SUSP interrupt flag.
    movx  @dptr, a                      ;

    ljmp  RestoreStatus                 ;Restore data pointer and accumulator.

USBRESET_ISR:
    lcall SaveStatus                    ;Store data pointer and accumulator.

    mov   THIS_CFG_HI, CFG_DESC_FS_HI   ;Load current config descriptor with full speed descriptor pointer.
    mov   THIS_CFG_LO, CFG_DESC_FS_LO   ;
    mov   DPL0, THIS_CFG_LO             ;
    mov   DPH0, THIS_CFG_HI             ;Point to bDescriptorType byte.
    inc   dptr                          ;
    mov   a, #$02                       ;Ensure descriptor type is set for configuration.
    movx  @dptr, a                      ;

    mov   OS_CFG_HI, CFG_DESC_HS_HI     ;Load other speed config descriptor with high speed descriptor pointer.
    mov   OS_CFG_LO, CFG_DESC_HS_LO     ;
    mov   DPL0, OS_CFG_LO               ;
    mov   DPH0, OS_CFG_HI               ;Point to bDescriptorType byte.
    inc   dptr                          ;
    mov   a, #$07                       ;Ensure descriptor type is set for other speed configuration.
    movx  @dptr, a                      ;

    anl   EXIF, #$ef                    ;Clear USB interrupt flag.
    mov   dptr, USBIRQ                  ;
    mov   a, #$10                       ;Clear interrupt request.
    movx  @dptr, a                      ;

    ljmp  RestoreStatus                 ;Restore data pointer and accumulator.

HISPEED_ISR:
    lcall SaveStatus                    ;Store data pointer and accumulator.

    mov   dptr, USBCS                   ;Is device already running in high speed mode?-->
    movx  a, @dptr                      ;If yes, branch. Nothing more to do.
    jnb   ACC_7, HS_ISR_Exit            ;

    mov   THIS_CFG_HI, CFG_DESC_HS_HI   ;Load current config descriptor with high speed descriptor pointer.
    mov   THIS_CFG_LO, CFG_DESC_HS_LO   ;   
    mov   DPL0, THIS_CFG_LO             ;
    mov   DPH0, THIS_CFG_HI             ;Point to bDescriptorType byte.
    inc   dptr                          ;
    mov   a, #$02                       ;Ensure descriptor type is set for configuration.
    movx  @dptr, a                      ;

    mov   OS_CFG_HI, CFG_DESC_FS_HI     ;Load other speed config descriptor with high speed descriptor pointer.
    mov   OS_CFG_LO, CFG_DESC_FS_LO     ;
    mov   DPL0, OS_CFG_LO               ;
    mov   DPH0, OS_CFG_HI               ;Point to bDescriptorType byte.
    inc   dptr                          ;
    mov   a, #$07                       ;Ensure descriptor type is set for other speed configuration.
    movx  @dptr, a                      ;

    HS_ISR_Exit:
    anl   EXIF, #$ef                    ;Clear USB interrupt flag.
    mov   dptr, USBIRQ                  ;
    mov   a, #$20                       ;Clear interrupt request.
    movx  @dptr, a                      ;

    ljmp  RestoreStatus                 ;Restore data pointer and accumulator.

SaveStatus:
    mov   TEMP_ACC, ACC                 ;
    mov   TEMP_DPH0, DPH0               ;Store data pointer and accumulator.
    mov   TEMP_DPL0, DPL0               ;
    ret                                 ;

RestoreStatus:
    mov   DPL0, TEMP_DPL0               ;
    mov   DPH0, TEMP_DPH0               ;Restore data pointer and accumulator.
    mov   ACC, TEMP_ACC                 ;
    reti                                ;


;=========================================Unused Autovector Interrupts=========================================;

EP0ACK_ISR:    reti
EP0IN_ISR:     reti
EP0OUT_ISR:    reti
EP1IN_ISR:     reti
EP1OUT_ISR:    reti
EP2_ISR:       reti
EP4_ISR:       reti
EP6_ISR:       reti
EP8_ISR:       reti
IBN_ISR:       reti
EP0PING_ISR:   reti
EP1PING_ISR:   reti
EP2PING_ISR:   reti
EP4PING_ISR:   reti
EP6PING_ISR:   reti
EP8PING_ISR:   reti
ERRLIMIT_ISR:  reti
EP2ISOERR_ISR: reti
EP4ISOERR_ISR: reti
EP6ISOERR_ISR: reti
EP8ISOERR_ISR: reti
EP2PF_ISR:     reti
EP4PF_ISR:     reti
EP6PF_ISR:     reti
EP8PF_ISR:     reti
EP2EF_ISR:     reti
EP4EF_ISR:     reti
EP6EF_ISR:     reti
EP8EF_ISR:     reti
EP2FF_ISR:     reti
EP4FF_ISR:     reti
EP6FF_ISR:     reti
EP8FF_ISR:     reti
GPIFDONE_ISR:  reti
GPIFWF_ISR:    reti
SPARE_ISR:     reti

;==============================================================================================================;
