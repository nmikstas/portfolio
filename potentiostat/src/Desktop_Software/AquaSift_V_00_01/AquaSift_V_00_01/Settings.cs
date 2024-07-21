using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AquaSift_V_00_01
{
    public enum setErr
    {
        SETTINGS_NO_ERR, SETTINGS_ARRAY_LEN
    };

    public class Settings
    {
        //Settings array offset constants.
        public const int SETTINGS_ARRAY_LENGTH = 47;
        public const int FIRMWARE_INDEX = 0;
        public const int PRODUCTID_INDEX = 2;
        public const int ELECTRODES_INDEX = 6;
        public const int DATARATE_INDEX = 7;
        public const int TIAGAIN_INDEX = 9;
        public const int ENABLEDEP_INDEX = 10;
        public const int DEPTIME_INDEX = 11;
        public const int DEPVOLT_INDEX = 15;
        public const int QUIETTIME_INDEX = 17;
        public const int RECORDDEP_INDEX = 21;
        public const int LINSTARTVOLT_INDEX = 22;
        public const int LINENDVOLT_INDEX = 24;
        public const int LINRATE_INDEX = 26;
        public const int LINCYCLIC_INDEX = 28;
        public const int LINNUMCYCLES_INDEX = 29;
        public const int DIFSTARTVOLT_INDEX = 30;
        public const int DIFENDVOLT_INDEX = 32;
        public const int DIFINCVOLT_INDEX = 34;
        public const int DIFPULSEVOLT_INDEX = 36;
        public const int DIFPREPULSETIME_INDEX = 38;
        public const int DIFPULSETIME_INDEX = 40;
        public const int DIFSAMPWIDTH_INDEX = 42;
        public const int ARBWAVEFORMS_INDEX = 44;
        public const int LOWPASSFILTER_INDEX = 46;     

        //Individual settings data for AQS1.
        private String firmware;
        private String productID;
        private UInt16 electrodes;
        private UInt16 dataRate;
        private UInt16 tiaGain;
        private Boolean enableDeposition;
        private UInt32 depositionTime;
        private Int16 depositionVoltage;
        private UInt32 quietTime;
        private Boolean recordDepSequence;
        private Int16 linearStartVoltage;
        private Int16 linearEndVoltage;
        private UInt16 linearSweepRate;
        private Boolean linearCyclic;
        private UInt16 linearNumCycles;
        private Int16 difStartVoltage;
        private Int16 difEndVoltage;
        private UInt16 difIncVoltage;
        private Int16 difPulseVoltage;
        private UInt16 difPrepulseTime;
        private UInt16 difPulseTime;
        private UInt16 difSampWinWidth;
        private UInt16 arbWaveforms;
        private UInt16 lowpassFilter;

        //Array for storing the configuration data.
        private byte[] settingsArray;

        //Extra string storage.  Used by software only.
        private String ex1String;
        private String ex2String;
        private String ex3String;
        private String ex4String;

        //Extended settings Lists.  Used by software only.
        private List<byte> ex1Data;
        private List<byte> ex2Data;
        private List<byte> ex3Data;
        private List<byte> ex4Data;

        //Constructor.
        public Settings()
        {
            char[] temp = { '0' };
            ex1String = new String(temp);
            ex2String = new String(temp);
            ex3String = new String(temp);
            ex4String = new String(temp);

            ex1Data = new List<byte>();
            ex2Data = new List<byte>();
            ex3Data = new List<byte>();
            ex4Data = new List<byte>();

            settingsArray = new byte[SETTINGS_ARRAY_LENGTH];
        }

        /******************************************String Functions*****************************************/

        public void ex1Set(String s) { ex1String = s; }
        public String ex1Get() { return ex1String; }
        public void ex2Set(String s) { ex2String = s; }
        public String ex2Get() { return ex2String; }
        public void ex3Set(String s) { ex3String = s; }
        public String ex3Get() { return ex3String; }
        public void ex4Set(String s) { ex4String = s; }
        public String ex4Get() { return ex4String; }

        /*******************************************Clear Functions******************************************/

        public void ex1Clear() { ex1Data.Clear(); }
        public void ex2Clear() { ex2Data.Clear(); }
        public void ex3Clear() { ex3Data.Clear(); }
        public void ex4Clear() { ex4Data.Clear(); }

        /********************************************Add Functions******************************************/

        public void ex1Add(byte b) { ex1Data.Add(b); }
        public void ex2Add(byte b) { ex2Data.Add(b); }
        public void ex3Add(byte b) { ex3Data.Add(b); }
        public void ex4Add(byte b) { ex4Data.Add(b); }

        /*******************************************Length Functions****************************************/

        public int ex1Count() { return ex1Data.Count(); }
        public int ex2Count() { return ex2Data.Count(); }
        public int ex3Count() { return ex3Data.Count(); }
        public int ex4Count() { return ex4Data.Count(); }

        /******************************************Get Data Functions***************************************/

        public byte ex1Get(int index) { return ex1Data[index]; }
        public byte ex2Get(int index) { return ex2Data[index]; }
        public byte ex3Get(int index) { return ex3Data[index]; }
        public byte ex4Get(int index) { return ex4Data[index]; }

        /********************************************Get Functions******************************************/

        public byte[] arrayGet() { return settingsArray; }
        public String firmwGet() { return firmware; }
        public String idGet() { return productID; }
        public UInt16 elecGet() { return electrodes; }
        public UInt16 dataRGet() { return dataRate; }
        public UInt16 tiaGet() { return tiaGain; }
        public Boolean depEnGet() { return enableDeposition; }
        public UInt32 depTGet() { return depositionTime; }
        public Int16 depVGet() { return depositionVoltage; }
        public UInt32 quietTGet() { return quietTime; }
        public Boolean recDepGet() { return recordDepSequence; }
        public Int16 linStartVGet() { return linearStartVoltage; }
        public Int16 linEndVGet() { return linearEndVoltage; }
        public UInt16 linSweepRGet() { return linearSweepRate; }
        public Boolean linCycGet() { return linearCyclic; }
        public UInt16 linNumCycGet() { return linearNumCycles; }
        public Int16 difStartVGet() { return difStartVoltage; }
        public Int16 difEndVGet() { return difEndVoltage; }
        public UInt16 difIncVGet() { return difIncVoltage; }
        public Int16 difPulseVGet() { return difPulseVoltage; }
        public UInt16 difPreTGet() { return difPrepulseTime; }
        public UInt16 difPulseTGet() { return difPulseTime; }
        public UInt16 difSampGet() { return difSampWinWidth; }
        public UInt16 arbGet() { return arbWaveforms; }
        public UInt16 lpfGet() { return lowpassFilter; }

        /********************************************Set Functions******************************************/

        public setErr arraySet(byte[] b)
        {
            //Make sure the settings byte array is the proper length.
            if (b.Length == SETTINGS_ARRAY_LENGTH)
            {
                //Copy incomming array into settings array.
                for (int i = 0; i < SETTINGS_ARRAY_LENGTH; i++)
                {
                    settingsArray[i] = b[i];
                }
                return setErr.SETTINGS_NO_ERR;
            }
            //Error.  Return.
            return setErr.SETTINGS_ARRAY_LEN;
        }

        /*****************************************Class Copy Functions**************************************/

        //Copy another class data set to this class.
        public void copyFrom(Settings from)
        {
            setByArray(from.arrayGet());
        }

        //Update settings through the binary array.
        public setErr setByArray(byte[] bArray)
        {
            byte tByte;
            UInt16 temp;

            //Make sure the settings byte array is the proper length.
            if (bArray.Length == SETTINGS_ARRAY_LENGTH)
            {
                //Copy incomming array into settings array.
                for(int i = 0; i < SETTINGS_ARRAY_LENGTH; i++)
                {
                    settingsArray[i] = bArray[i];
                }

                //Convert firmware bytes into string.
                tByte = (byte)(bArray[FIRMWARE_INDEX] >> 4);
                tByte += 0x30;
                firmware = ((char)tByte).ToString();

                tByte = (byte)(bArray[FIRMWARE_INDEX] & 0x0F);
                tByte += 0x30;
                firmware += ((char)tByte).ToString() + ".";

                tByte = (byte)(bArray[FIRMWARE_INDEX + 1] >> 4);
                tByte += 0x30;
                firmware += ((char)tByte).ToString();

                tByte = (byte)(bArray[FIRMWARE_INDEX + 1] & 0x0F);
                tByte += 0x30;
                firmware += ((char)tByte).ToString();

                //Convert product ID into string.
                productID = ((char)bArray[PRODUCTID_INDEX]).ToString() +
                            ((char)bArray[PRODUCTID_INDEX + 1]).ToString() +
                            ((char)bArray[PRODUCTID_INDEX + 2]).ToString() +
                            ((char)bArray[PRODUCTID_INDEX + 3]).ToString();

                //Get electrode config.
                electrodes = bArray[ELECTRODES_INDEX];

                //Get output data rate.
                dataRate = bArray[DATARATE_INDEX];
                dataRate <<= 8;
                dataRate |= bArray[DATARATE_INDEX + 1];

                //Get TIA setting.
                tiaGain = bArray[TIAGAIN_INDEX];

                //Get deposition enabled setting.
                if (bArray[ENABLEDEP_INDEX] == 0)
                    enableDeposition = false;
                else
                    enableDeposition = true;

                //Get deposition time.
                depositionTime = (UInt32)(bArray[DEPTIME_INDEX]);
                depositionTime <<= 8;
                depositionTime |= (UInt32)(bArray[DEPTIME_INDEX + 1]);
                depositionTime <<= 8;
                depositionTime |= (UInt32)(bArray[DEPTIME_INDEX + 2]);
                depositionTime <<= 8;
                depositionTime |= (UInt32)(bArray[DEPTIME_INDEX + 3]);

                //Get deposition voltage.
                temp = bArray[DEPVOLT_INDEX];
                temp <<= 8;
                temp |= bArray[DEPVOLT_INDEX + 1];
                depositionVoltage = (Int16)temp;

                //Get quiet time.
                quietTime = (UInt32)(bArray[QUIETTIME_INDEX]);
                quietTime <<= 8;
                quietTime |= (UInt32)(bArray[QUIETTIME_INDEX + 1]);
                quietTime <<= 8;
                quietTime |= (UInt32)(bArray[QUIETTIME_INDEX + 2]);
                quietTime <<= 8;
                quietTime |= (UInt32)(bArray[QUIETTIME_INDEX + 3]);

                //Get deposition record setting.
                if (bArray[RECORDDEP_INDEX] == 0)
                    recordDepSequence = false;
                else
                    recordDepSequence = true;

                //Get linear sweep start voltage.
                temp = bArray[LINSTARTVOLT_INDEX];
                temp <<= 8;
                temp |= bArray[LINSTARTVOLT_INDEX + 1];
                linearStartVoltage = (Int16)temp;

                //Get linear sweep end voltage.
                temp = bArray[LINENDVOLT_INDEX];
                temp <<= 8;
                temp |= bArray[LINENDVOLT_INDEX + 1];
                linearEndVoltage = (Int16)temp;

                //Get linear sweep rate.
                linearSweepRate = bArray[LINRATE_INDEX];
                linearSweepRate <<= 8;
                linearSweepRate |= bArray[LINRATE_INDEX + 1];

                //Get cyclic setting.
                if (bArray[LINCYCLIC_INDEX] == 0)
                    linearCyclic = false;
                else
                    linearCyclic = true;

                //Get number of linear sweep cycles.
                linearNumCycles = bArray[LINNUMCYCLES_INDEX];

                //Get differential pulse start voltage.
                temp = bArray[DIFSTARTVOLT_INDEX];
                temp <<= 8;
                temp |= bArray[DIFSTARTVOLT_INDEX + 1];
                difStartVoltage = (Int16)temp;

                //Get differential pulse end voltage.
                temp = bArray[DIFENDVOLT_INDEX];
                temp <<= 8;
                temp |= bArray[DIFENDVOLT_INDEX + 1];
                difEndVoltage = (Int16)temp;

                //Get differential increment voltage.
                difIncVoltage = bArray[DIFINCVOLT_INDEX];
                difIncVoltage <<= 8;
                difIncVoltage |= bArray[DIFINCVOLT_INDEX + 1];

                //Get differential pulse voltage.
                temp = bArray[DIFPULSEVOLT_INDEX];
                temp <<= 8;
                temp |= bArray[DIFPULSEVOLT_INDEX + 1];
                difPulseVoltage = (Int16)temp;

                //Get differential pre-pulse time.
                difPrepulseTime = bArray[DIFPREPULSETIME_INDEX];
                difPrepulseTime <<= 8;
                difPrepulseTime |= bArray[DIFPREPULSETIME_INDEX + 1];

                //Get differential pulse time.
                difPulseTime = bArray[DIFPULSETIME_INDEX];
                difPulseTime <<= 8;
                difPulseTime |= bArray[DIFPULSETIME_INDEX + 1];

                //Get differential sample width.
                difSampWinWidth = bArray[DIFSAMPWIDTH_INDEX];
                difSampWinWidth <<= 8;
                difSampWinWidth |= bArray[DIFSAMPWIDTH_INDEX + 1];

                //Get number of arbitrary waveforms in memory.
                arbWaveforms = bArray[ARBWAVEFORMS_INDEX];
                arbWaveforms <<= 8;
                arbWaveforms |= bArray[ARBWAVEFORMS_INDEX + 1];

                //Get lowpass filter selection.
                lowpassFilter = bArray[LOWPASSFILTER_INDEX];

                return setErr.SETTINGS_NO_ERR;
            }

            //Error.  Return.
            return setErr.SETTINGS_ARRAY_LEN;
        }
    }
}
