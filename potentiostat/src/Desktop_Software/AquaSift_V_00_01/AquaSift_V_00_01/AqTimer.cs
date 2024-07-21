using System;
using System.Windows.Forms;

namespace AquaSift_V_00_01
{
    //Different types of timers used in this project.
    public enum timerTypes
    {
        TIMER_NONE,         //No active timer.
        TIMER_COM_VAL2,     //Communication initialization
        TIMER_COM_VAL3,     //And configuration update
        TIMER_COM_VAL4,     //timers.
        TIMER_COM_VAL5,     //
        TIMER_DIF_TEST,     //Wait to start differential pulse test.
        TIMER_DIF_ABORT,    //Wait to go back to idle.
        TIMER_SWP_TEST,     //Wait to start sweep test.
        TIMER_SWP_ABORT,    //Wait to go back to idle.
    };

    //Timer statuses.
    public enum timerStatus
    {
        TSTATUS_IDLE, TSTATUS_ACTIVE, TSTATUS_EXPIRED
    };

    //A timer class used for setting various timers in the application.
    //Used mostly for communication timout errors.
    public class AqTimer
    {
        private AquaSift aq;             //Pointer to main form.
        private Timer aqTimer;           //Main timer for this class.
        private timerTypes tType;        //Type of timer.
        private timerStatus tStatus;     //Indicates if timer has expired.
        private Control control;

        public AqTimer(AquaSift aqsft)
        {
            aq = aqsft;
            aqTimer = new Timer();
            aqTimer.Tick += new EventHandler(OnTimedEvent);
            tStatus = timerStatus.TSTATUS_IDLE;
            tType = timerTypes.TIMER_NONE;
        }
        
        //Arm the timer.
        public void setTimer(int time, timerTypes ttyp, Control c)
        {
            tType = ttyp;
            tStatus = timerStatus.TSTATUS_ACTIVE;
            aqTimer.Interval = time;
            aqTimer.Enabled = true;
            control = c;
        }

        //Turns off the timer.
        public void clearTimer()
        {
            tStatus = timerStatus.TSTATUS_IDLE;
            aqTimer.Enabled = false;
        }

        //Perform tasks when timer expires.
        private void OnTimedEvent(object source, EventArgs e)
        {
            tStatus = timerStatus.TSTATUS_EXPIRED;
            aqTimer.Enabled = false;
            byte[] bArray = new byte[8];

            switch (tType)
            {
                case timerTypes.TIMER_COM_VAL2:
                    //Place device in binary mode and wait.
                    bArray[0] = (byte)'1';
                    bArray[1] = (byte)' ';
                    bArray[2] = (byte)'B';
                    bArray[3] = (byte)'\r';
                    
                    try
                    {
                        aq.sp.Write(bArray, 0, 4);
                    }
                    catch (Exception err)
                    {
                        aqTimer.Stop();
                        aq.comCloser();
                        aq.comErrorHandler(err.ToString());
                        tStatus = timerStatus.TSTATUS_IDLE;
                    }

                    //Set timer to wait for next step in validation process.
                    setTimer(20, timerTypes.TIMER_COM_VAL3, control);
                    break;

                case timerTypes.TIMER_COM_VAL3:
                    aq.rxState = rxStates.RX_IDLE;

                    aq.aqCon.consoleUpdater(aq.txCount, aq.txData, consoleSources.CONSOLE_TX, control);

                    try//Send configuration data to device.
                    {
                        aq.sp.Write(aq.txData, 0, aq.txCount);
                    }
                    catch (Exception err)
                    {
                        aqTimer.Stop();
                        aq.comCloser();
                        aq.comErrorHandler(err.ToString());
                        tStatus = timerStatus.TSTATUS_IDLE;
                    }

                    //Special case.  End if changing to MatLab or ASCII.
                    if(control == aq.btnMatlab || control == aq.btnAscii)
                    {
                        aq.txCount = 0; //Zero out tx count.
                        aq.aqCon.rtbConsoleWindow_Clear();
                        aq.aqCon.rbtAscii_Checked(true);
                    }
                    else
                    {
                        //Set timer to wait for next step in validation process.
                        setTimer(20, timerTypes.TIMER_COM_VAL4, control);
                    }
                    break;

                case timerTypes.TIMER_COM_VAL4:                    
                    aq.rxState = rxStates.RX_GET_SETTINGS;
                    
                    bArray[0] = 0x0A;//Get device settings.

                    try
                    {
                        aq.sp.Write(bArray, 0, 1);
                    }
                    catch (Exception err)
                    {
                        aqTimer.Stop();
                        aq.comCloser();
                        aq.comErrorHandler(err.ToString());
                        tStatus = timerStatus.TSTATUS_IDLE;
                    }

                    //Set timer to wait for next step in validation process.
                    setTimer(100, timerTypes.TIMER_COM_VAL5, control);
                    break;

                case timerTypes.TIMER_COM_VAL5:
                    aq.rxState = rxStates.RX_IDLE;

                    //Check and make sure the entire settings block has been received.
                    if (aq.rxSettingsCount != AqSettings.SETTINGS_ARRAY_LENGTH)
                    {
                        aq.comCloser();
                        aq.comErrorHandler("Device Settings Data Incomplete");
                        break;
                    }

                    //Update the settings in the settings object.
                    aq.aqSettings.doSettings();

                    //Update the GUI based on the current settings.
                    aq.aqSettings.updateGUI();
                    
                    aq.txCount = 0; //Zero out tx count.
                    break;

                case timerTypes.TIMER_DIF_TEST:
                    aq.rxState = rxStates.RX_DIF_TEST;

                    aq.dTestPanel.btnDifTest.Enabled = true;
                    bArray[0] = (byte)'D';

                    try//Start test.
                    {
                        aq.sp.Write(bArray, 0, 1);
                    }
                    catch (Exception err)
                    {
                        aqTimer.Stop();
                        aq.comCloser();
                        aq.comErrorHandler(err.ToString());
                        tStatus = timerStatus.TSTATUS_IDLE;
                    }
                    break;

                case timerTypes.TIMER_DIF_ABORT:
                    //Wait to go to idle to avoid garbage in the console buffer.
                    aq.dTestPanel.btnDifTest.Enabled = true;
                    aq.rxState = rxStates.RX_IDLE;
                    break;

                case timerTypes.TIMER_SWP_TEST:
                    aq.rxState = rxStates.RX_SWP_TEST;

                    aq.sTestPanel.btnSweepTest.Enabled = true;
                    bArray[0] = (byte)'L';

                    try//Start test.
                    {
                        aq.sp.Write(bArray, 0, 1);
                    }
                    catch (Exception err)
                    {
                        aqTimer.Stop();
                        aq.comCloser();
                        aq.comErrorHandler(err.ToString());
                        tStatus = timerStatus.TSTATUS_IDLE;
                    }
                    break;

                case timerTypes.TIMER_SWP_ABORT:
                    //Wait to go to idle to avoid garbage in the console buffer.
                    aq.sTestPanel.btnSweepTest.Enabled = true;
                    aq.rxState = rxStates.RX_IDLE;
                    break;

                default:
                    break;       
            }
        }

        //Get status of timer.
        public timerStatus getTimerStatus()
        {
            return tStatus;
        }

        //Get timer type.
        public timerTypes getTimerType()
        {
            return tType;
        }
    }
}
