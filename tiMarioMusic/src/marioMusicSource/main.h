#ifndef MAIN_H_
#define MAIN_H_

//function defines
#define INACTIVE 0
#define ACTIVE 1

/*Math defines*/
#define PI 3.1416

/*Number of filter coefficients*/
#define FILT_SIZE 51

/*Number of delayed samples in echo buffer*/
#define ECHO_SIZE 2000

/*CODEC initialization defines*/
#define SF 8000L
#define GDAC 0
#define GADC 0

/*Output volume*/
#define AMPLITUDE 4000

/*Musical Notes*/
#define C0  16.35
#define C_0 17.32
#define D0  18.35
#define D_0 19.45
#define E0  20.60
#define F0  21.83
#define F_0 23.12
#define G0  24.50
#define G_0 25.96
#define A0  27.50
#define A_0 29.14
#define B0  30.87
#define C1  32.70
#define C_1 34.65
#define D1  36.71
#define D_1 38.89
#define E1  41.20
#define F1  43.65
#define F_1 46.25
#define G1  49.00
#define G_1 51.91
#define A1  55.00
#define A_1 58.27
#define B1  61.74
#define C2  65.41
#define C_2 69.30
#define D2  73.42
#define D_2 77.78
#define E2  82.41
#define F2  87.31
#define F_2 92.50
#define G2  98.00
#define G_2 103.83
#define A2  110.00
#define A_2 116.54
#define B2  123.47
#define C3  130.81
#define C_3 138.59
#define D3  146.83
#define D_3 155.56
#define E3  164.81
#define F3  174.61
#define F_3 185.00
#define G3  196.00
#define G_3 207.65
#define A3  220.00
#define A_3 233.08
#define B3  246.94
#define C4  261.63
#define C_4 277.18
#define D4  293.66
#define D_4 311.13
#define E4  329.63
#define F4  349.23
#define F_4 369.99
#define G4  392.00
#define G_4 415.30
#define A4  440.00
#define A_4 466.16
#define B4  493.88
#define C5  523.25
#define C_5 554.37
#define D5  587.33
#define D_5 622.25
#define E5  659.25
#define F5  698.46
#define F_5 739.99
#define G5  783.99
#define G_5 830.61
#define A5  880.00
#define A_5 932.33
#define B5  987.77
#define C6  1046.50
#define C_6 1108.73
#define D6  1174.66
#define D_6 1244.51
#define E6  1318.51
#define F6  1396.91
#define F_6 1479.98
#define G6  1567.98
#define G_6 1661.22
#define A6  1760.00
#define A_6 1864.66
#define B6  1975.53
#define C7  2093.00
#define C_7 2217.46
#define D7  2349.32
#define D_7 2489.02
#define E7  2637.02
#define F7  2793.83
#define F_7 2959.96
#define G7  3135.96
#define G_7 3322.44
#define A7  3520.00
#define A_7 3729.31
#define B7  3951.07
#define C8  4186.01
#define C_8 4434.92
#define D8  4698.63
#define D_8 4978.03
#define E8  5274.04
#define F8  5587.65
#define F_8 5919.91
#define G8  6271.93
#define G_8 6644.88
#define A8  7040.00
#define A_8 7458.62
#define B8  7902.13
#define NOT 0

#define NOTE_LEN 83L    //Length in milliseconds to play each note.

//NES Frames to milliseconds (60 frames per second).
#define NINE        150
#define TWELVE      200
#define EIGHTEEN    300
#define TWENTYSEVEN 450
#define THIRTYSIX   600
#define FIFTYFOUR   900

/*Note type and duration structure*/
typedef struct
{
    uint16_t note;       /*Which note*/
    uint16_t duration;   /*Delay after note*/
} playback_t;

/*Array of notes to play and their durations*/
                        //Outdoor1
playback_t od1_SQ2[] =  {{E5,NINE},{E5,EIGHTEEN}, {E5,EIGHTEEN},{C5,NINE},{E5,EIGHTEEN},{G5,THIRTYSIX},{NOT,THIRTYSIX},
                        {NOT,NOT}};
                        //Outdoor2
playback_t od2_SQ2[] =  {{C5,TWENTYSEVEN},{G4,TWENTYSEVEN},{E4,TWENTYSEVEN},{A4,EIGHTEEN},{B4,EIGHTEEN},{A_4,NINE},{A4,NINE},
                        {NOT,NINE},{G4,TWELVE},{E5,TWELVE},{G5,TWELVE},{A5,NINE},{NOT,NINE},{F5,NINE},
                        {G5,EIGHTEEN},{E5,EIGHTEEN},{C5,NINE},{D5,NINE},{B4,TWENTYSEVEN},{NOT,NOT}};
                        //Outdoor4
playback_t od4_SQ2[] =  {{NOT,EIGHTEEN},{G5,NINE},{F_5,NINE},{F5,NINE},{D_5,NINE},{NOT,NINE},{E5,NINE},
                        {NOT,NINE},{G_4,NINE},{A4,NINE},{C5,NINE},{NOT,NINE},{A4,NINE},{C5,NINE},
                        {D5,NINE},{NOT,NOT}};
                        //Outdoor5
playback_t od5_SQ2[] =  {{NOT,EIGHTEEN},{G5,NINE},{F_5,NINE},{F5,NINE},{D_5,NINE},{NOT,NINE},{E5,NINE},
                        {NOT,NINE},{C6,NINE},{NOT,NINE},{C6,NINE},{C6,THIRTYSIX},{NOT,NOT}};
                        //Outdoor7
playback_t od7_SQ2[] =  {{NOT,EIGHTEEN},{D_5,TWENTYSEVEN},{D5,TWENTYSEVEN},{C5,THIRTYSIX},{NOT,THIRTYSIX},{NOT,NOT}};
                        //Outdoor12
playback_t od12_SQ2[] = {{C5,NINE},{C5,EIGHTEEN},{C5,EIGHTEEN},{C5,NINE},{D5,NINE},{NOT,NINE},{E5,NINE},
                        {C5,NINE},{NOT,NINE},{A4,NINE},{G4,THIRTYSIX},{NOT,NOT}};
                        //Outdoor13
playback_t od13_SQ2[] = {{C5,NINE},{C5,NINE},{NOT,NINE},{C5,NINE},{NOT,NINE},{C5,NINE},{D5,NINE},
                        {E5,TWENTYSEVEN},{NOT,TWENTYSEVEN},{NOT,TWENTYSEVEN},{NOT,NOT}};
                        //Outdoor18
playback_t od18_SQ2[] = {{E5,NINE},{C5,EIGHTEEN},{G4,TWENTYSEVEN},{G_4,EIGHTEEN},{A4,NINE},{F5,NINE},{NOT,NINE},
                        {F5,NINE},{A4,THIRTYSIX},{NOT,NOT}};
                        //Outdoor19
playback_t od19_SQ2[] = {{B4,TWELVE},{A5,TWELVE},{A5,TWELVE},{A5,TWELVE},{G5,TWELVE},{F5,TWELVE},{E5,NINE},
                        {C5,NINE},{NOT,NINE},{A4,NINE},{G4,THIRTYSIX},{NOT,NOT}};
                        //Outdoor21
playback_t od21_SQ2[] = {{B4,NINE},{F5,NINE},{NOT,NINE},{F5,NINE},{F5,TWELVE},{E5,TWELVE},{D5,TWELVE},
                        {C5,THIRTYSIX},{NOT,THIRTYSIX},{NOT,NOT}};

                        //Outdoor1
playback_t od1_SQ1[] =  {{F_4,NINE},{F_4,EIGHTEEN},{F_4,EIGHTEEN},{F_4,NINE},{F_4,EIGHTEEN},{B4,EIGHTEEN},{NOT,EIGHTEEN},
                        {G4,THIRTYSIX},{NOT,NOT}};
                        //Outdoor2
playback_t od2_SQ1[] =  {{E4,TWENTYSEVEN},{C4,TWENTYSEVEN},{G3,TWENTYSEVEN},{C4,EIGHTEEN},{D4,EIGHTEEN},{C_4,NINE},{C4,EIGHTEEN},
                        {C4,TWELVE},{G4,TWELVE},{G4,TWELVE},{C5,EIGHTEEN},{A4,NINE},{B4,EIGHTEEN},{A4,EIGHTEEN},
                        {E4,NINE},{F4,NINE},{D4,TWENTYSEVEN},{NOT,NOT}};
                        //Outdoor4
playback_t od4_SQ1[] =  {{NOT,EIGHTEEN},{E5,NINE},{D_5,NINE},{D5,NINE},{B4,EIGHTEEN},{C5,NINE},{NOT,NINE},
                        {E4,NINE},{F4,NINE},{G4,NINE},{NOT,NINE},{C4,NINE},{E4,NINE},{F4,NINE},{NOT,NOT}};
                        //Outdoor5
playback_t od5_SQ1[] =  {{NOT,EIGHTEEN},{E5,NINE},{D_5,NINE},{D5,NINE},{B4,EIGHTEEN},{C5,NINE},{NOT,NINE},
                        {F5,EIGHTEEN},{F5,NINE},{F5,NINE},{NOT,TWENTYSEVEN},{NOT,NOT}};
                        //Outdoor7
playback_t od7_SQ1[] =  {{NOT,EIGHTEEN},{G_4,NINE},{NOT,EIGHTEEN},{F4,NINE},{NOT,EIGHTEEN},{E4,THIRTYSIX},{NOT,THIRTYSIX},
                        {NOT,NOT}};
                        //Outdoor12
playback_t od12_SQ1[] = {{G_4,NINE},{G_4,EIGHTEEN},{G_4,EIGHTEEN},{G_4,NINE},{A_4,EIGHTEEN},{G4,NINE},{E4,EIGHTEEN},
                        {E4,NINE},{C4,THIRTYSIX},{NOT,NOT}};
                        //Outdoor13
playback_t od13_SQ1[] = {{G_4,NINE},{G_4,EIGHTEEN},{G_4,EIGHTEEN},{G_4,NINE},{A_4,NINE},{G4,TWENTYSEVEN},{NOT,FIFTYFOUR},
                        {NOT,NOT}};
                        //Outdoor18
playback_t od18_SQ1[] = {{C5,NINE},{A4,EIGHTEEN},{E4,TWENTYSEVEN},{E4,EIGHTEEN},{F4,NINE},{C5,EIGHTEEN},{C5,NINE},
                        {F4,THIRTYSIX},{NOT,NOT}};
                        //Outdoor19
playback_t od19_SQ1[] = {{G4,TWELVE},{F5,TWELVE},{F5,TWELVE},{F5,TWELVE},{E5,TWELVE},{D5,TWELVE},{C5,NINE},
                        {A4,EIGHTEEN},{F4,NINE},{E4,THIRTYSIX},{NOT,NOT}};
                        //Outdoor21
playback_t od21_SQ1[] = {{G4,NINE},{D5,EIGHTEEN},{D5,NINE},{D5,TWELVE},{C5,TWELVE},{B4,TWELVE},{G4,NINE},
                        {E4,EIGHTEEN},{E4,NINE},{C4,THIRTYSIX},{NOT,NOT}};

                        //Outdoor1
playback_t od1_tri[] =  {{D4,NINE},{D4,EIGHTEEN},{D4,EIGHTEEN},{D4,NINE},{D4,NINE},{NOT,NINE},{G5,THIRTYSIX},
                        {G4,THIRTYSIX},{NOT,NOT}};
                        //Outdoor2
playback_t od2_tri[] =  {{G4,TWENTYSEVEN},{E4,TWENTYSEVEN},{C4,TWENTYSEVEN},{F4,EIGHTEEN},{G4,EIGHTEEN},{F_4,NINE},{F4,NINE},
                        {NOT,NINE},{E4,TWELVE},{C5,TWELVE},{E5,TWELVE},{F5,NINE},{NOT,NINE},{D5,NINE},
                        {E5,NINE},{NOT,NINE},{C5,NINE},{NOT,NINE},{A4,NINE},{B4,NINE},{G4,TWENTYSEVEN},{NOT,NOT}};
                        //Outdoor4
playback_t od4_tri[] =  {{C4,TWENTYSEVEN},{G4,TWENTYSEVEN},{C5,EIGHTEEN},{F4,TWENTYSEVEN},{C5,NINE},{C5,EIGHTEEN},{F4,EIGHTEEN},
                        {NOT,NOT}};
                        //Outdoor5
playback_t od5_tri[] =  {{C4,TWENTYSEVEN},{E4,TWENTYSEVEN},{G4,NINE},{C5,EIGHTEEN},{G6,EIGHTEEN},{G6,NINE},{G6,EIGHTEEN},
                        {G4,EIGHTEEN},{NOT,NOT}};
                        //Outdoor7
playback_t od7_tri[] =  {{C4,EIGHTEEN},{G_4,TWENTYSEVEN},{A_4,TWENTYSEVEN},{C5,TWENTYSEVEN},{G4,NINE},{G4,EIGHTEEN},{C4,EIGHTEEN},
                        {NOT,NOT}};
                        //Outdoor12
playback_t od12_tri[] = {{E3,TWENTYSEVEN},{D_4,TWENTYSEVEN},{G_4,EIGHTEEN},{G4,TWENTYSEVEN},{C4,TWENTYSEVEN},{G3,EIGHTEEN},{NOT,NOT}};
                        //Outdoor13
playback_t od13_tri[] = {{E3,TWENTYSEVEN},{D_4,TWENTYSEVEN},{G_4,EIGHTEEN},{G4,TWENTYSEVEN},{C4,TWENTYSEVEN},{G3,EIGHTEEN},{NOT,NOT}};
                        //Outdoor18
playback_t od18_tri[] =  {{C4,TWENTYSEVEN},{F_4,NINE},{G4,EIGHTEEN},{C5,EIGHTEEN},{C5,EIGHTEEN},{F4,EIGHTEEN},{F4,EIGHTEEN},
                        {C5,NINE},{C5,NINE},{NOT,NOT}};
                        //Outdoor19
playback_t od19_tri[] = {{D4,TWENTYSEVEN},{F4,NINE},{G4,EIGHTEEN},{D4,EIGHTEEN},{G4,EIGHTEEN},{G4,EIGHTEEN},{C5,NINE},
                        {C5,NINE},{G4,NINE},{NOT,NINE},{NOT,NOT}};
                        //Outdoor21
playback_t od21_tri[] = {{G4,TWENTYSEVEN},{G4,NINE},{G4,TWELVE},{A4,TWELVE},{B4,TWELVE},{C5,EIGHTEEN},{G4,EIGHTEEN},
                        {C4,THIRTYSIX},{NOT,NOT}};

/*State machine states*/
typedef enum
{
    READY, INIT_TONES, PLAY_TONES, DELAY_TONES, STOP
} STATES;

/*50th order filter.  Coefficients are multiplied by 1000*/
int16_t coefficients[FILT_SIZE] =
{
        -1,    -9,    -2,     2,     6,     5,    -2,    -9,    -9,     0,
        12,    15,     4,   -15,   -23,   -10,    17,    36,    23,   -19,
       -60,   -55,    20,   146,   264,   312,   264,   146,    20,   -55,
       -60,   -19,    23,    36,    17,   -10,   -23,   -15,     4,    15,
        12,     0,    -9,    -9,    -2,     5,     6,     2,    -2,    -9,    -1
};

int32_t buffer[FILT_SIZE];
int16_t offset = 0;

int16_t echo_buf[ECHO_SIZE];
uint16_t echo_index = 0;
float echo_gain = .1;

//PLL stuff.
CSL_Status status;
PLL_Obj pll;
Uint32 pllid = 0;
PLL_Handle hpll;
PLL_Config pllconfig;

//SPI config struct.
SPI_Config spiConfig =
{
    10,                             /**< clock division (minimum value is 3)*/
    SPI_WORD_LENGTH_8,              /**< Word length set for data transmission
                                    or receive (supporting 8 bit or 16 bit) */
    1,                              /**<Frame lenghth to transmit or receive*/
    SPI_WORD_IRQ_ENABLE,            /**< Word complete enable               */
    SPI_FRAME_IRQ_DISABLE,          /**< Frame complete enable              */
    SPI_CS_NUM_1,                   /**< Chip select ie.0...3               */
    SPI_DATA_DLY_0,                 /**< Data delay                         */
    SPI_CLKP_LOW_AT_IDLE,           /**< Clock plarity                      */
    SPI_CSP_ACTIVE_LOW,             /**< chip select polarity               */
    SPI_CLK_PH_FALL_EDGE            /**< Clock phase                        */
};

//SPI variables.
CSL_SpiHandle hSpi1;
Uint16 *spi_buff;

//function statuses.
uint8_t paused = INACTIVE;
uint8_t echo = INACTIVE;
uint8_t adp_filt = ACTIVE;

//Function prototypes.
extern void Init_AIC3204(Uint32 sf, Int16 gDAC, Uint16 gADC);
void PlayArray(playback_t *, playback_t *, playback_t *);
int16_t playtone(playback_t *, float *, float *, STATES *, uint16_t *, uint32_t *);
void initcodec(void);
int16_t lpfilter(int16_t);
void lcd_startup(void);
void draw_mario_stand(uint8_t, uint8_t);
void draw_mario_run1(uint8_t, uint8_t);
void draw_mario_run2(uint8_t, uint8_t);
void draw_mario_run3(uint8_t, uint8_t);
void draw_bricks(uint8_t, uint8_t);
void draw_qmark(uint8_t, uint8_t);
void draw_coin(uint8_t, uint8_t);
void draw_shroom(uint8_t, uint8_t);
void update_timer(void);
void update_mario(void);
void update_buttons(void);
#endif /* MAIN_H_ */
