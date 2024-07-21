using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AquaSift_V_00_01
{
    public enum settingsErr
    {
        SETTINGS_NO_ERR, SETTINGS_SRTING_LEN
    };

    public class AqSettings
    {
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

        AquaSift aq;//Pointer to AquaSift object.

        //Array for storing the configuration data.
        public byte[] settingsArray = new byte[SETTINGS_ARRAY_LENGTH];

        private String firmware;
        private String productID;
        private UInt16 electrodes;
        public UInt16 dataRate;
        public UInt16 tiaGain;
        private Boolean enableDeposition;
        public UInt32 depositionTime;
        private Int16 depositionVoltage;
        public UInt32 quietTime;
        private Boolean recordDepSequence;
        public Int16 linearStartVoltage;
        public Int16 linearEndVoltage;
        public UInt16 linearSweepRate;
        public Boolean linearCyclic;
        public UInt16 linearNumCycles;
        public Int16 difStartVoltage;
        public Int16 difEndVoltage;
        public UInt16 difIncVoltage;
        private Int16 difPulseVoltage;
        public UInt16 difPrepulseTime;
        public UInt16 difPulseTime;
        public UInt16 difSampWinWidth;
        private UInt16 arbWaveforms;
        private UInt16 lowpassFilter;

        public AqSettings(AquaSift aqs)
        {
            aq = aqs;
            firmware = "XX.XX";
            productID = "NULL";
            electrodes = 0;
            dataRate = 0;
            tiaGain = 0;
            enableDeposition = false;
            depositionTime = 0;
            depositionVoltage = 0;
            quietTime = 0;
            recordDepSequence = false;
            linearStartVoltage = 0;
            linearEndVoltage = 0;
            linearSweepRate = 0;
            linearCyclic = false;
            linearNumCycles = 0;
            difStartVoltage = 0;
            difEndVoltage = 0;
            difIncVoltage = 0;
            difPulseVoltage = 0;
            difPrepulseTime = 0;
            difPulseTime = 0;
            difSampWinWidth = 0;
            arbWaveforms = 0;
            lowpassFilter = 0;
        }

        public settingsErr doSettings()
        {
            byte[] bArray = settingsArray;
            byte tByte;
            UInt16 temp;

            //Make sure the settings byte array is the proper length.
            if (bArray.Length == SETTINGS_ARRAY_LENGTH)
            {
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

                //Convert porduct ID into string.
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

                return settingsErr.SETTINGS_NO_ERR;
            }

            //Error.  Return.
            return settingsErr.SETTINGS_SRTING_LEN;
        }

        public void updateGUI()
        {
            //Update frimeware and product ID.
            aq.lblDevice.Text = productID;
            aq.lblFirmware.Text = firmware;

            //Update electrode buttons.
            if (electrodes == 0x02)
            {
                aq.cbx2Electrodes.Checked = true;
                aq.cbx3Electrodes.Checked = false;
            }
            else
            {
                aq.cbx2Electrodes.Checked = false;
                aq.cbx3Electrodes.Checked = true;
            }

            //Update the TIA gain buttons.
            if(tiaGain == 0x01)
            {
                aq.cbx16ma.Checked = true;
                aq.cbx1_6ma.Checked = false;
                aq.cbx320ua.Checked = false;
                aq.cbx160ua.Checked = false;
                aq.cbx32ua.Checked = false;
                aq.cbx16ua.Checked = false;
            }
            else if(tiaGain == 0x02)
            {
                aq.cbx16ma.Checked = false;
                aq.cbx1_6ma.Checked = true;
                aq.cbx320ua.Checked = false;
                aq.cbx160ua.Checked = false;
                aq.cbx32ua.Checked = false;
                aq.cbx16ua.Checked = false;
            }
            else if (tiaGain == 0x03)
            {
                aq.cbx16ma.Checked = false;
                aq.cbx1_6ma.Checked = false;
                aq.cbx320ua.Checked = true;
                aq.cbx160ua.Checked = false;
                aq.cbx32ua.Checked = false;
                aq.cbx16ua.Checked = false;
            }
            else if (tiaGain == 0x04)
            {
                aq.cbx16ma.Checked = false;
                aq.cbx1_6ma.Checked = false;
                aq.cbx320ua.Checked = false;
                aq.cbx160ua.Checked = true;
                aq.cbx32ua.Checked = false;
                aq.cbx16ua.Checked = false;
            }
            else if (tiaGain == 0x05)
            {
                aq.cbx16ma.Checked = false;
                aq.cbx1_6ma.Checked = false;
                aq.cbx320ua.Checked = false;
                aq.cbx160ua.Checked = false;
                aq.cbx32ua.Checked = true;
                aq.cbx16ua.Checked = false;
            }
            else
            {
                aq.cbx16ma.Checked = false;
                aq.cbx1_6ma.Checked = false;
                aq.cbx320ua.Checked = false;
                aq.cbx160ua.Checked = false;
                aq.cbx32ua.Checked = false;
                aq.cbx16ua.Checked = true;
            }

            //Update low pass filter.
            if(lowpassFilter == 0x00)
            {
                aq.cbxLPFDis.Checked = true;
                aq.cbxLPF1.Checked = false;
                aq.cbxLPF5.Checked = false;
                aq.cbxLPF10.Checked = false;
                aq.cbxLPF50.Checked = false;
                aq.cbxLPF100.Checked = false;
                aq.cbxLPF150.Checked = false;
                aq.cbxLPF200.Checked = false;
            }
            else if (lowpassFilter == 0x01)
            {
                aq.cbxLPFDis.Checked = false;
                aq.cbxLPF1.Checked = true;
                aq.cbxLPF5.Checked = false;
                aq.cbxLPF10.Checked = false;
                aq.cbxLPF50.Checked = false;
                aq.cbxLPF100.Checked = false;
                aq.cbxLPF150.Checked = false;
                aq.cbxLPF200.Checked = false;
            }
            else if (lowpassFilter == 0x02)
            {
                aq.cbxLPFDis.Checked = false;
                aq.cbxLPF1.Checked = false;
                aq.cbxLPF5.Checked = true;
                aq.cbxLPF10.Checked = false;
                aq.cbxLPF50.Checked = false;
                aq.cbxLPF100.Checked = false;
                aq.cbxLPF150.Checked = false;
                aq.cbxLPF200.Checked = false;
            }
            else if (lowpassFilter == 0x03)
            {
                aq.cbxLPFDis.Checked = false;
                aq.cbxLPF1.Checked = false;
                aq.cbxLPF5.Checked = false;
                aq.cbxLPF10.Checked = true;
                aq.cbxLPF50.Checked = false;
                aq.cbxLPF100.Checked = false;
                aq.cbxLPF150.Checked = false;
                aq.cbxLPF200.Checked = false;
            }
            else if (lowpassFilter == 0x04)
            {
                aq.cbxLPFDis.Checked = false;
                aq.cbxLPF1.Checked = false;
                aq.cbxLPF5.Checked = false;
                aq.cbxLPF10.Checked = false;
                aq.cbxLPF50.Checked = true;
                aq.cbxLPF100.Checked = false;
                aq.cbxLPF150.Checked = false;
                aq.cbxLPF200.Checked = false;
            }
            else if (lowpassFilter == 0x05)
            {
                aq.cbxLPFDis.Checked = false;
                aq.cbxLPF1.Checked = false;
                aq.cbxLPF5.Checked = false;
                aq.cbxLPF10.Checked = false;
                aq.cbxLPF50.Checked = false;
                aq.cbxLPF100.Checked = true;
                aq.cbxLPF150.Checked = false;
                aq.cbxLPF200.Checked = false;
            }
            else if (lowpassFilter == 0x06)
            {
                aq.cbxLPFDis.Checked = false;
                aq.cbxLPF1.Checked = false;
                aq.cbxLPF5.Checked = false;
                aq.cbxLPF10.Checked = false;
                aq.cbxLPF50.Checked = false;
                aq.cbxLPF100.Checked = false;
                aq.cbxLPF150.Checked = true;
                aq.cbxLPF200.Checked = false;
            }
            else
            {
                aq.cbxLPFDis.Checked = false;
                aq.cbxLPF1.Checked = false;
                aq.cbxLPF5.Checked = false;
                aq.cbxLPF10.Checked = false;
                aq.cbxLPF50.Checked = false;
                aq.cbxLPF100.Checked = false;
                aq.cbxLPF150.Checked = false;
                aq.cbxLPF200.Checked = true;
            }

            //Update sample output rate.
            aq.tbxSampleRate_SetText(dataRate.ToString());

            //Update deposition recording setting.
            if (recordDepSequence)
            {
                aq.rbtDepRecordYes.Checked = true;
            }
            else
            {
                aq.rbtDepRecordNo.Checked = true;
            }

            //Update enable deposition setting.
            if(enableDeposition)
            {
                aq.rbtDepEnableYes.Checked = true;
                aq.rbtDepRecordNo.Enabled = true;
                aq.rbtDepRecordYes.Enabled = true;
                aq.tbxDepTime.Enabled = true;
                aq.tbxDepVolt.Enabled = true;
                aq.tbxQuietTime.Enabled = true;
            }
            else
            {
                aq.rbtDepEnableNo.Checked = true;
                aq.rbtDepRecordNo.Enabled = false;
                aq.rbtDepRecordYes.Enabled = false;
                aq.tbxDepTime.Enabled = false;
                aq.tbxDepVolt.Enabled = false;
                aq.tbxQuietTime.Enabled = false;
            }

            //Update deposition time.
            aq.tbxDepTime.Text = depositionTime.ToString();

            //Update deposition voltage.
            aq.tbxDepVolt.Text = depositionVoltage.ToString();

            //Update quiet time.
            aq.tbxQuietTime.Text = quietTime.ToString();

            //Update differential start voltage.
            aq.dTestPanel.tbxDifStartVolt.Text = difStartVoltage.ToString();

            //Update differential end voltage.
            aq.dTestPanel.tbxDifEndVolt.Text = difEndVoltage.ToString();

            //Update differential increment voltage.
            aq.dTestPanel.tbxDifIncVolt.Text = difIncVoltage.ToString();

            //Update differential pulse voltage.
            aq.dTestPanel.tbxDifPulseVolt.Text = difPulseVoltage.ToString();

            //Update differential pre-pulse time.
            aq.dTestPanel.tbxDifPrepulseTime.Text = difPrepulseTime.ToString();

            //Update differential pulse time.
            aq.dTestPanel.tbxDifPulseTime.Text = difPulseTime.ToString();

            //Updte differential pulse sampling window width.
            aq.dTestPanel.tbxDifSampWinWidth.Text = difSampWinWidth.ToString();

            //Update linear sweep start voltage.
            aq.sTestPanel.tbxSweepStartVolt.Text = linearStartVoltage.ToString();

            //Update linear sweep end voltage.
            aq.sTestPanel.tbxSweepEndVolt.Text = linearEndVoltage.ToString();

            //Update linear sweep rate.
            aq.sTestPanel.tbxSweepRate.Text = linearSweepRate.ToString();

            //Update linear sweep cyclic.
            if (linearCyclic == true)
            {
                aq.sTestPanel.rbtSweepCyclicYes.Checked = true;
                aq.sTestPanel.tbxSweepNumCycles.Enabled = true;               
            }
            else
            {
                aq.sTestPanel.rbtSweepCyclicNo.Checked = true;
                aq.sTestPanel.tbxSweepNumCycles.Enabled = false;
            }

            //Update number of sweep cycles.
            aq.sTestPanel.tbxSweepNumCycles.Text = linearNumCycles.ToString();
        }

        public void printSettings()
        {
            System.Console.Write("Firmware Version: " + firmware + '\n');
            System.Console.Write("Product ID: " + productID + '\n');
            System.Console.Write("Number of Electrodes: " + electrodes.ToString() + '\n');
            System.Console.Write("Output Sample Rate: " + dataRate.ToString() + '\n');
            System.Console.Write("TIA Gain Resistor " + tiaGain.ToString() + '\n');
            System.Console.Write("Enable Deposition: " + enableDeposition.ToString() + '\n');
            System.Console.Write("Deposition Time: " + depositionTime.ToString() + '\n');
            System.Console.Write("Deposition Voltage: " + depositionVoltage.ToString() + '\n');
            System.Console.Write("Quiet Time: " + quietTime.ToString() + '\n');
            System.Console.Write("Record Deposition Sequence: " + recordDepSequence.ToString() + '\n');
            System.Console.Write("Liner Sweep Start Voltage: " + linearStartVoltage.ToString() + '\n');
            System.Console.Write("Linear Sweep End Voltage: " + linearEndVoltage.ToString() + '\n');
            System.Console.Write("Liner Sweep Rate: " + linearSweepRate.ToString() + '\n');
            System.Console.Write("Cyclic: " + linearCyclic.ToString() + '\n');
            System.Console.Write("Number of Cycles: " + linearNumCycles.ToString() + '\n');
            System.Console.Write("Differential Pulse Start Voltage: " + difStartVoltage.ToString() + '\n');
            System.Console.Write("Differential Pulse End Voltage: " + difEndVoltage.ToString() + '\n');
            System.Console.Write("Differential Pulse Increment Voltage: " + difIncVoltage.ToString() + '\n');
            System.Console.Write("Differential Pulse Voltage: " + difPulseVoltage.ToString() + '\n');
            System.Console.Write("Differential Pulse Pre-pulse Time: " + difPrepulseTime.ToString() + '\n');
            System.Console.Write("Differential Pulse Pulse Time: " + difPulseTime.ToString() + '\n');
            System.Console.Write("Differential Pulse Sampling Window Width: " + difSampWinWidth.ToString() + '\n');
            System.Console.Write("Number of Arbitrary Waveforms: " + arbWaveforms.ToString() + '\n');
            System.Console.Write("Lowpass Filter Cutoff Frequency: " + lowpassFilter.ToString() + '\n');
        }

        /***********************************Settings Interaction Functions**********************************/
        public void updateSettingsArray(byte[] data, int dataCount, int settingsOffset)
        {
            for (int i = 0; i < dataCount; i++)
            {                        
                if(settingsOffset < SETTINGS_ARRAY_LENGTH)
                    settingsArray[settingsOffset++] = data[i];
            }
        }
    }
}
