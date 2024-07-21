using System;
using System.Collections.Generic;
using System.Threading;
using System.Timers;
using System.Windows.Forms;
using System.Windows.Forms.DataVisualization.Charting;

namespace AquaSift_V_00_01
{
    public enum difPulseState
    {
        DIF_IDLE,
        DIF_DEP, DIF_DEP_END,
        DIF_QUIET, DIF_QUIET_END,
        DIF_PRE_COUNT, DIF_PRE, DIF_PRE_END,
        DIF_PULSE_COUNT, DIF_PULSE, DIF_PULSE_END,
        DIF_COMP, DIF_ABORT, DIF_ERR
    };

    public partial class DifTest : UserControl
    {
        //A simple class for holding pre-pulse and pulse data.
        public class PulseClass
        {
            public List<double> data = new List<double>();
        }

        const double I_CONSTANT = 805.664;//Current calculation constant (3.3 * 1000000 / 4096)
        const UInt16 ADC_MAX_VALUE = 4095;//Max. count of the 12-bit ADC.

        //Control word defines.
        const UInt16 START_DEP       = 0x8000;
        const UInt16 START_QUIET     = 0x8100;
        const UInt16 START_LIN_SWEEP = 0x8200;
        const UInt16 START_DIF_PRE   = 0x8400;
        const UInt16 START_DIF_PULSE = 0x8500;
        const UInt16 START_ARB       = 0x8600;
        const UInt16 ABORT           = 0xF000;
        const UInt16 END_BLOCK       = 0xFF00;
        const UInt16 END_TEST        = 0xFFF0;

        AquaSift aq;//Pointer to main form.
        private bool testStarted = false;
                
        public System.Timers.Timer updateTimer;//Non-GUI timer.
        private AqTimer difTimer;//GUI timer.
        difPulseState difState = difPulseState.DIF_IDLE;
        System.Windows.Forms.Timer timer = new System.Windows.Forms.Timer() { Interval = 1000 };

        List<byte> incommingData;//Raw data from the device.
        List<UInt16> wordData;//Raw data converted into word data.
               
        List<PulseClass> preData;//Array of pre-pulse data.
        List<PulseClass> pulseData;//Array of pulse data.

        DataSet ds = new DataSet();
                
        private int totalIndex = 0;
        private int wordBuildingIndex = 0;
        private int thisWordIndex = 0;

        private int thisDepIndex = 0;
        private int thisQuietIndex = 0;
        private int thisTotalDataIndex = 0;
        private int thisDifIndex = 0;
        
        private double thisDepTime = 0;
        private double thisQuietTime = 0;
        private double thisDifVoltage = 0;

        private UInt16 preCount = 0;
        private UInt16 pulseCount = 0;

        private double depDT;
        private double quietDT;
        private double difDV;

        /************************************GUI Lock/Restore Functions*************************************/

        public void disableGUI()
        {
            //Reset graphing markers in tree view only.
            aq.dataTree.treeUngraphAll();

            //Disable differential pulse components.
            btnDifTest.Enabled = false;
            gbxDifStartVolt.Enabled = false;
            gbxDifEndVolt.Enabled = false;
            gbxDifIncVolt.Enabled = false;
            gbxDifPrepulseTime.Enabled = false;
            gbxDifPulseTime.Enabled = false;
            gbxDifPulseVolt.Enabled = false;
            gbxDifSampWin.Enabled = false;

            //Remove waveform drawing and place plotter on the screen.
            aq.aqPlotter.Visible = true;
            aq.wfHelper.Visible = false;

            //Remove chart tabs from the GUI.
            aq.aqPlotter.tbcPlotTabs.TabPages.Remove(aq.aqPlotter.tabDeposition);
            aq.aqPlotter.tbcPlotTabs.TabPages.Remove(aq.aqPlotter.tabQuietTime);
            aq.aqPlotter.tbcPlotTabs.TabPages.Remove(aq.aqPlotter.tabRawData);
            aq.aqPlotter.tbcPlotTabs.TabPages.Remove(aq.aqPlotter.tabIVCurve);

            //Remove all the tabs from the left panel.
            aq.tabControl1.TabPages.Remove(aq.tabDevice);
            aq.tabControl1.TabPages.Remove(aq.tabDeposition);
            aq.tabControl1.TabPages.Remove(aq.tabAdvanced);

            //Disable toolbars and menus.
            aq.aqPlotter.stpPlotting.Enabled = false;
            aq.gbxTestType.Enabled = false;
            aq.menMain.Enabled = false;

            //Disable the console.
            aq.aqCon.rbtBinary_Checked(true);
            aq.aqCon.tbxSendData_Enable(false);
            aq.aqCon.rbtAscii_Enable(false);
            aq.aqCon.rbtBinary_Enable(false);
            aq.aqCon.rtbConsoleWindow_Clear();

            //Disable the data tree.
            aq.dataTree.Enabled = false;
        }

        public void resetData()
        {
            //Clear all data from charts.
            aq.aqPlotter.chtDeposition.Series.Clear();
            aq.aqPlotter.chtQuietTime.Series.Clear();
            aq.aqPlotter.chtRawData.Series.Clear();
            aq.aqPlotter.chtIVCurve.Series.Clear();

            //Add new series to deposition tab.
            var depSeries = new Series
            {
                Name = "Series1",
                ChartType = SeriesChartType.FastLine,
                ChartArea = "ChartArea1"
            };
            aq.aqPlotter.chtDeposition.Series.Add(depSeries);

            //Add new series to quiet time tab.
            var quietSeries = new Series
            {
                Name = "Series1",
                ChartType = SeriesChartType.FastLine,
                ChartArea = "ChartArea1"
            };
            aq.aqPlotter.chtQuietTime.Series.Add(quietSeries);

            //Add new series to raw data tab.
            var rawSeries = new Series
            {
                Name = "Series1",
                ChartType = SeriesChartType.FastLine,
                ChartArea = "ChartArea1"
            };
            aq.aqPlotter.chtRawData.Series.Add(rawSeries);

            //Add new series to IV curve tab.
            var IVCurveSeries = new Series
            {
                Name = "Series1",
                ChartType = SeriesChartType.Line,
                ChartArea = "ChartArea1"
            };
            aq.aqPlotter.chtIVCurve.Series.Add(IVCurveSeries);

            //Zero out data lists.
            incommingData.Clear();
            wordData.Clear();
            preData.Clear();
            pulseData.Clear();

            //Data set class variables.
            ds.depClear();
            ds.QuietClear();
            ds.rawClear();
            ds.ivClear();
            ds.ivAdd();
        
            //Reset index variables.
            totalIndex = 0;
            wordBuildingIndex = 0;
            thisWordIndex = 0;
            thisDepIndex = 0;
            thisQuietIndex = 0;
            thisTotalDataIndex = 0;
            thisDifIndex = 0;

            thisDepTime = 0;
            thisQuietTime = 0;
            thisDifVoltage = 0;

            preCount = 0;
            pulseCount = 0;

            depDT = 0;
            quietDT = 0;
            difDV = 0;
        }

        //Remove action listeners. and reset plot sizes.
        public void removeListeners()
        {
            aq.aqPlotter.chtDeposition.MouseWheel -= aq.aqPlotter.cht_MouseWheel;
            aq.aqPlotter.chtDeposition.MouseDown -= aq.aqPlotter.cht_MouseDown;
            aq.aqPlotter.chtDeposition.MouseHover -= aq.aqPlotter.cht_MouseHover;
            aq.aqPlotter.chtDeposition.MouseLeave -= aq.aqPlotter.cht_MouseLeave;
            aq.aqPlotter.chtDeposition.MouseMove -= aq.aqPlotter.cht_MouseMove;
            aq.aqPlotter.chtDeposition.ChartAreas[0].CursorX.IsUserSelectionEnabled = false;
            aq.aqPlotter.chtDeposition.ChartAreas[0].CursorY.IsUserSelectionEnabled = false;
            aq.aqPlotter.chartZoomRestore(aq.aqPlotter.chtDeposition);
            aq.aqPlotter.chtQuietTime.MouseWheel -= aq.aqPlotter.cht_MouseWheel;
            aq.aqPlotter.chtQuietTime.MouseDown -= aq.aqPlotter.cht_MouseDown;
            aq.aqPlotter.chtQuietTime.MouseHover -= aq.aqPlotter.cht_MouseHover;
            aq.aqPlotter.chtQuietTime.MouseLeave -= aq.aqPlotter.cht_MouseLeave;
            aq.aqPlotter.chtQuietTime.MouseMove -= aq.aqPlotter.cht_MouseMove;
            aq.aqPlotter.chtQuietTime.ChartAreas[0].CursorX.IsUserSelectionEnabled = false;
            aq.aqPlotter.chtQuietTime.ChartAreas[0].CursorY.IsUserSelectionEnabled = false;
            aq.aqPlotter.chartZoomRestore(aq.aqPlotter.chtQuietTime);
            aq.aqPlotter.chtRawData.MouseWheel -= aq.aqPlotter.cht_MouseWheel;
            aq.aqPlotter.chtRawData.MouseDown -= aq.aqPlotter.cht_MouseDown;
            aq.aqPlotter.chtRawData.MouseHover -= aq.aqPlotter.cht_MouseHover;
            aq.aqPlotter.chtRawData.MouseLeave -= aq.aqPlotter.cht_MouseLeave;
            aq.aqPlotter.chtRawData.MouseMove -= aq.aqPlotter.cht_MouseMove;
            aq.aqPlotter.chtRawData.ChartAreas[0].CursorX.IsUserSelectionEnabled = false;
            aq.aqPlotter.chtRawData.ChartAreas[0].CursorY.IsUserSelectionEnabled = false;
            aq.aqPlotter.chartZoomRestore(aq.aqPlotter.chtRawData);
            aq.aqPlotter.chtIVCurve.MouseWheel -= aq.aqPlotter.cht_MouseWheel;
            aq.aqPlotter.chtIVCurve.MouseDown -= aq.aqPlotter.cht_MouseDown;
            aq.aqPlotter.chtIVCurve.MouseHover -= aq.aqPlotter.cht_MouseHover;
            aq.aqPlotter.chtIVCurve.MouseLeave -= aq.aqPlotter.cht_MouseLeave;
            aq.aqPlotter.chtIVCurve.MouseMove -= aq.aqPlotter.cht_MouseMove;
            aq.aqPlotter.chtIVCurve.ChartAreas[0].CursorX.IsUserSelectionEnabled = false;
            aq.aqPlotter.chtIVCurve.ChartAreas[0].CursorY.IsUserSelectionEnabled = false;
            aq.aqPlotter.chartZoomRestore(aq.aqPlotter.chtIVCurve);
        }

        public void enableGUI()
        {
            //Enable differential pulse components.
            btnDifTest.Enabled = false;
            gbxDifStartVolt.Enabled = true;
            gbxDifEndVolt.Enabled = true;
            gbxDifIncVolt.Enabled = true;
            gbxDifPrepulseTime.Enabled = true;
            gbxDifPulseTime.Enabled = true;
            gbxDifPulseVolt.Enabled = true;
            gbxDifSampWin.Enabled = true;

            //Replace all the tabs in the left panel.
            aq.tabControl1.TabPages.Insert(0, aq.tabDevice);
            aq.tabControl1.TabPages.Insert(1, aq.tabDeposition);
            aq.tabControl1.TabPages.Insert(3, aq.tabAdvanced);

            //Disable toolbars and menus.
            aq.aqPlotter.stpPlotting.Enabled = true;
            aq.gbxTestType.Enabled = true;
            aq.menMain.Enabled = true;

            //Enable the console.
            aq.aqCon.Enabled = true;
            aq.aqCon.tbxSendData_Enable(true);
            aq.aqCon.rbtAscii_Enable(true);
            aq.aqCon.rbtBinary_Enable(true);

            //Hide timer visible.
            aq.lblTestTime.Visible = false;
            aq.lblTestType.Visible = false;
            timer.Enabled = false;

            //Enable the data tree.
            aq.dataTree.Enabled = true;
        }

        public void hidePlotter()
        {
            //Indicate no data in charts.
            aq.dataTree.nonePopulated = true;

            //remove the plotter and place the waveform drawing the screen.
            aq.aqPlotter.Visible = false;
            aq.wfHelper.Visible = true;
        }

        public void resetTestButton()
        {
            //Reactivate button at the end of a test.
            btnDifTest.Text = "Start Differential Pulse Test";
            btnDifTest.Enabled = true;
            testStarted = false;
        }
                
        //Add the action listeners back on the charts.
        public void addListeners()
        {
            //Add action listeners.
            aq.aqPlotter.chtDeposition.MouseWheel += aq.aqPlotter.cht_MouseWheel;
            aq.aqPlotter.chtDeposition.MouseDown += aq.aqPlotter.cht_MouseDown;
            aq.aqPlotter.chtDeposition.MouseHover += aq.aqPlotter.cht_MouseHover;
            aq.aqPlotter.chtDeposition.MouseLeave += aq.aqPlotter.cht_MouseLeave;
            aq.aqPlotter.chtDeposition.MouseMove += aq.aqPlotter.cht_MouseMove;
            aq.aqPlotter.chtDeposition.ChartAreas[0].CursorX.IsUserSelectionEnabled = true;
            aq.aqPlotter.chtDeposition.ChartAreas[0].CursorY.IsUserSelectionEnabled = true;
            aq.aqPlotter.chtQuietTime.MouseWheel += aq.aqPlotter.cht_MouseWheel;
            aq.aqPlotter.chtQuietTime.MouseDown += aq.aqPlotter.cht_MouseDown;
            aq.aqPlotter.chtQuietTime.MouseHover += aq.aqPlotter.cht_MouseHover;
            aq.aqPlotter.chtQuietTime.MouseLeave += aq.aqPlotter.cht_MouseLeave;
            aq.aqPlotter.chtQuietTime.MouseMove += aq.aqPlotter.cht_MouseMove;
            aq.aqPlotter.chtQuietTime.ChartAreas[0].CursorX.IsUserSelectionEnabled = true;
            aq.aqPlotter.chtQuietTime.ChartAreas[0].CursorY.IsUserSelectionEnabled = true;
            aq.aqPlotter.chtRawData.MouseWheel += aq.aqPlotter.cht_MouseWheel;
            aq.aqPlotter.chtRawData.MouseDown += aq.aqPlotter.cht_MouseDown;
            aq.aqPlotter.chtRawData.MouseHover += aq.aqPlotter.cht_MouseHover;
            aq.aqPlotter.chtRawData.MouseLeave += aq.aqPlotter.cht_MouseLeave;
            aq.aqPlotter.chtRawData.MouseMove += aq.aqPlotter.cht_MouseMove;
            aq.aqPlotter.chtRawData.ChartAreas[0].CursorX.IsUserSelectionEnabled = true;
            aq.aqPlotter.chtRawData.ChartAreas[0].CursorY.IsUserSelectionEnabled = true;
            aq.aqPlotter.chtIVCurve.MouseWheel += aq.aqPlotter.cht_MouseWheel;
            aq.aqPlotter.chtIVCurve.MouseDown += aq.aqPlotter.cht_MouseDown;
            aq.aqPlotter.chtIVCurve.MouseHover += aq.aqPlotter.cht_MouseHover;
            aq.aqPlotter.chtIVCurve.MouseLeave += aq.aqPlotter.cht_MouseLeave;
            aq.aqPlotter.chtIVCurve.MouseMove += aq.aqPlotter.cht_MouseMove;
            aq.aqPlotter.chtIVCurve.ChartAreas[0].CursorX.IsUserSelectionEnabled = true;
            aq.aqPlotter.chtIVCurve.ChartAreas[0].CursorY.IsUserSelectionEnabled = true;
        }

        /***************************************Chart Prep Functions****************************************/

        public void prepDepChart()
        {
            //Calculate the time difference for each incomming data word.
            double depSec = aq.aqSettings.depositionTime / 1000;
            double totalPoints = aq.aqSettings.depositionTime / aq.aqSettings.dataRate;
            depDT = depSec / totalPoints;

            thisDepTime = depDT;//No zero time data so we offset by 1.

            BeginInvoke((MethodInvoker)delegate
            {
                //Add deposition tab to GUI.
                aq.aqPlotter.tbcPlotTabs.TabPages.Add(aq.aqPlotter.tabDeposition);

                //Size deposition plot.
                aq.aqPlotter.chtDeposition.ChartAreas[0].AxisX.Minimum = 0;
                aq.aqPlotter.chtDeposition.ChartAreas[0].AxisX.Maximum = depSec;

                //Reset zoom.
                aq.aqPlotter.chtDeposition.ChartAreas[0].AxisX.ScaleView.ZoomReset();
                aq.aqPlotter.chtDeposition.ChartAreas[0].AxisY.ScaleView.ZoomReset();

                //Add timer to bottom strip.
                var startTime = DateTime.Now;
                timer.Tick += (obj, args) => aq.lblTestTime.Text =
                (TimeSpan.FromSeconds(depSec) - (DateTime.Now - startTime)).ToString("mm\\:ss");
                timer.Enabled = true;

                //Make timer visible.
                aq.lblTestTime.Visible = true;
                aq.lblTestType.Text = "Deposition";
                aq.lblTestType.Visible = true;
            });
        }

        public void prepQuietChart()
        {
            //Calculate the time difference for each incomming data word.
            double quietSec = aq.aqSettings.quietTime / 1000;
            double totalPoints = aq.aqSettings.quietTime / aq.aqSettings.dataRate;
            quietDT = quietSec / totalPoints;

            thisQuietTime = quietDT;//No zero time data so we offset by 1.

            BeginInvoke((MethodInvoker)delegate
            {
                //Add quiet time tab to GUI.
                aq.aqPlotter.tbcPlotTabs.TabPages.Add(aq.aqPlotter.tabQuietTime);

                //Size quiet time plot.
                aq.aqPlotter.chtQuietTime.ChartAreas[0].AxisX.Minimum = 0;
                aq.aqPlotter.chtQuietTime.ChartAreas[0].AxisX.Maximum = quietSec;

                //Reset zoom.
                aq.aqPlotter.chtQuietTime.ChartAreas[0].AxisX.ScaleView.ZoomReset();
                aq.aqPlotter.chtQuietTime.ChartAreas[0].AxisY.ScaleView.ZoomReset();

                //Add timer to bottom strip.
                var startTime = DateTime.Now;
                timer.Tick += (obj, args) => aq.lblTestTime.Text =
                (TimeSpan.FromSeconds(quietSec) - (DateTime.Now - startTime)).ToString("mm\\:ss");
                timer.Enabled = true;

                //Make timer visible.
                aq.lblTestTime.Visible = true;
                aq.lblTestType.Text = "Quiet Time";
                aq.lblTestType.Visible = true;

                //Change tabs to this plot.
                aq.aqPlotter.tbcPlotTabs.SelectedTab = aq.aqPlotter.tabQuietTime;
                aq.aqCon.rtbConsoleWindow_Focus();
            });
        }

        public void prepRawChart()
        {
            //Calculate the total number of samples for this test.
            double difPairSets = (aq.aqSettings.difEndVoltage - aq.aqSettings.difStartVoltage) / aq.aqSettings.difIncVoltage;
            if (difPairSets < 0)//Find absolute value.
            {
                difPairSets *= -1;
            }
            difPairSets++;

            double totalSamples = difPairSets * (aq.aqSettings.difPrepulseTime + aq.aqSettings.difPulseTime);

            BeginInvoke((MethodInvoker)delegate
            {
                //Add raw data tab to GUI.
                aq.aqPlotter.tbcPlotTabs.TabPages.Add(aq.aqPlotter.tabRawData);

                //Size raw data plot.
                aq.aqPlotter.chtRawData.ChartAreas[0].AxisX.Minimum = 0;
                aq.aqPlotter.chtRawData.ChartAreas[0].AxisX.Maximum = totalSamples;

                //Reset zoom.
                aq.aqPlotter.chtRawData.ChartAreas[0].AxisX.ScaleView.ZoomReset();
                aq.aqPlotter.chtRawData.ChartAreas[0].AxisY.ScaleView.ZoomReset();

                //Add timer to bottom strip.
                var startTime = DateTime.Now;
                timer.Tick += (obj, args) => aq.lblTestTime.Text =
                (TimeSpan.FromSeconds(totalSamples / 1000) - (DateTime.Now - startTime)).ToString("mm\\:ss");
                timer.Enabled = true;

                //Make timer visible.
                aq.lblTestTime.Visible = true;
                aq.lblTestType.Text = "Differential Pulse";
                aq.lblTestType.Visible = true;
            });
        }

        public void prepDifChart()
        {
            //Calculate the total number of samples for this test.
            double difPairSets = (aq.aqSettings.difEndVoltage - aq.aqSettings.difStartVoltage) / aq.aqSettings.difIncVoltage;
            if (difPairSets < 0)//Find absolute value.
            {
                difPairSets *= -1;
            }
            difPairSets++;

            //Get initial voltage.
            thisDifVoltage = aq.aqSettings.difStartVoltage;

            //Calculate difDV.
            difDV = (aq.aqSettings.difEndVoltage - aq.aqSettings.difStartVoltage) / (difPairSets - 1);

            //Calculate x-axis minumum and maximum.
            double xMin, xMax;
            if(aq.aqSettings.difEndVoltage > aq.aqSettings.difStartVoltage)
            {
                xMin = aq.aqSettings.difStartVoltage;
                xMax = aq.aqSettings.difEndVoltage;
            }
            else
            {
                xMin = aq.aqSettings.difEndVoltage;
                xMax = aq.aqSettings.difStartVoltage;
            }

            BeginInvoke((MethodInvoker)delegate
            {
                //Add differential pulse tab to GUI.
                aq.aqPlotter.tbcPlotTabs.TabPages.Add(aq.aqPlotter.tabIVCurve);

                //Size differential pulse plot.
                aq.aqPlotter.chtIVCurve.ChartAreas[0].AxisX.Minimum = xMin;
                aq.aqPlotter.chtIVCurve.ChartAreas[0].AxisX.Maximum = xMax;

                //Reset zoom.
                aq.aqPlotter.chtIVCurve.ChartAreas[0].AxisX.ScaleView.ZoomReset();
                aq.aqPlotter.chtIVCurve.ChartAreas[0].AxisY.ScaleView.ZoomReset();

                //Change tabs to this plot.
                aq.aqPlotter.tbcPlotTabs.SelectedTab = aq.aqPlotter.tabIVCurve;
                aq.aqCon.rtbConsoleWindow_Focus();
            });
        }

        /***************************************Abort/Error Functions***************************************/

        public void doAbort()
        {
            BeginInvoke((MethodInvoker)delegate
            {
                //Enable the GUI components.    
                btnDifTest.Text = "Start Differential Pulse Test";
                testStarted = false;

                enableGUI();//Enable the GUI
                addListeners();//Add listeners back onto the charts.
                hidePlotter();//Remove plots.

                //Stop test timer and hide it.
                timer.Enabled = false;
                timer.Dispose();
                aq.lblTestTime.Text = "      ";
                aq.lblTestType.Text = "";
                aq.lblTestTime.Visible = false;
                aq.lblTestType.Visible = false;
                updateTimer.Stop();

                //Allow waveform image to be displayed.
                aq.wfHelper.dataLoaded = false;

                //Abort test.
                aq.rxState = rxStates.RX_IDLE;
                difTimer.setTimer(200, timerTypes.TIMER_DIF_ABORT, this.btnDifTest);
            });
        }

        public void doError()
        {
            doAbort();
            MessageBox.Show("Invalid values detected in the data stream", "Invalid Data Stream", MessageBoxButtons.OK, MessageBoxIcon.Error);
        }

        /************************************RX State Machine Functions*************************************/
        public void difTestStateMachine(byte[] bArray, int arraySize)
        {
            UInt16 tempWord;

            //Add incomming data to raw data array.
            for(int i = 0; i < arraySize; i++)
            {
                incommingData.Add(bArray[i]);
            }

            //Update index value.
            totalIndex += arraySize;
            
            //Populate the word list.
            while(wordBuildingIndex < totalIndex - 1)
            {
                tempWord = (UInt16)(incommingData[wordBuildingIndex++] << 8);
                tempWord |= (UInt16)(incommingData[wordBuildingIndex++]);
                wordData.Add(tempWord);
            }

            int gain = aq.aqSettings.tiaGain;
            double gainResistance;

            //compute gain resistance for y-axis current.
            if (gain == 1) gainResistance = 100.0;
            else if (gain == 2) gainResistance = 1000.0;
            else if (gain == 3) gainResistance = 5100.0;
            else if (gain == 4) gainResistance = 10000.0;
            else if (gain == 5) gainResistance = 51000.0;
            else gainResistance = 100000.0;

            while (thisWordIndex < wordData.Count)
            {
                tempWord = wordData[thisWordIndex++];
                
                switch (difState)
                {
                    /*****************************************Idle******************************************/

                    case difPulseState.DIF_IDLE:     
                        if (tempWord == START_DEP)//Prepare for deposition.
                        {
                            prepDepChart();
                            difState = difPulseState.DIF_DEP;//Move to deposition state.
                        }
                        else if (tempWord == START_QUIET)
                        {
                            prepQuietChart();
                            difState = difPulseState.DIF_QUIET;//Move to quiet time state.
                        }   
                        else if (tempWord == START_DIF_PRE)
                        {
                            prepRawChart();
                            prepDifChart();
                            difState = difPulseState.DIF_PRE_COUNT;//Move to differential pulse state.
                        }   
                        else if (tempWord == ABORT)
                        {
                            doAbort();
                            difState = difPulseState.DIF_ABORT;//Already handled by above function.
                        }   
                        else//Error state.
                        {
                            doError();
                            difState = difPulseState.DIF_ERR;//Already handled above.
                        }
                        break;

                    /**************************************Deposition***************************************/

                    case difPulseState.DIF_DEP:
                        if(tempWord == END_BLOCK)//End of deposition.  Move on.
                        {
                            difState = difPulseState.DIF_DEP_END;
                        }
                        else if(tempWord == ABORT)//Already handled by above function.
                        {
                            doAbort();
                            difState = difPulseState.DIF_ABORT;
                        }
                        else if(tempWord < ADC_MAX_VALUE)
                        {
                            //Convert data to current and add to list;
                            ds.depAdd(new DataPoint(thisDepTime, (tempWord - 2047) * I_CONSTANT / gainResistance));
                            thisDepTime += depDT;
                        }
                        else//Error state.
                        {
                            doError();
                            difState = difPulseState.DIF_ERR;//Already handled above.
                        }
                        break;

                    case difPulseState.DIF_DEP_END:
                        updateTimer.Enabled = false;

                        if (tempWord == START_QUIET)
                        {
                            prepQuietChart();                            
                            difState = difPulseState.DIF_QUIET;//Move to quiet time state.
                        }
                        else if (tempWord == START_DIF_PRE)
                        {
                            prepRawChart();
                            prepDifChart();
                            difState = difPulseState.DIF_PRE_COUNT;//Move to differential pulse state.
                        }
                        else if (tempWord == ABORT)
                        {
                            doAbort();
                            difState = difPulseState.DIF_ABORT;//Already handled by above function.
                        }
                        else//Error state.
                        {
                            doError();
                            difState = difPulseState.DIF_ERR;//Already handled above.
                        }
                        break;

                    /*****************************************Quiet*****************************************/

                    case difPulseState.DIF_QUIET:
                        if (tempWord == END_BLOCK)//End of quiet time.  Move on.
                        {
                            difState = difPulseState.DIF_QUIET_END;
                        }
                        else if (tempWord == ABORT)//Already handled by above function.
                        {
                            doAbort();
                            difState = difPulseState.DIF_ABORT;
                        }
                        else if (tempWord < ADC_MAX_VALUE)
                        {
                            //Convert data to current and add to list;
                            ds.quietAdd(new DataPoint(thisQuietTime, (tempWord - 2047) * I_CONSTANT / gainResistance));
                            thisQuietTime += quietDT;
                        }
                        else//Error state.
                        {
                            doError();
                            difState = difPulseState.DIF_ERR;//Already handled above.
                        }
                        break;

                    case difPulseState.DIF_QUIET_END:
                        updateTimer.Enabled = false;

                        if (tempWord == START_DIF_PRE)
                        {
                            prepRawChart();
                            prepDifChart();
                            difState = difPulseState.DIF_PRE_COUNT;//Move to differential pulse state.
                        }
                        else if (tempWord == ABORT)
                        {
                            doAbort();
                            difState = difPulseState.DIF_ABORT;//Already handled by above function.
                        }
                        else//Error state.
                        {
                            doError();
                            difState = difPulseState.DIF_ERR;//Already handled above.
                        }
                        break;               
                                                                      
                    /***************************************Pre-pulse***************************************/

                    case difPulseState.DIF_PRE_COUNT:                        
                        preCount++;
                        preData.Add(new PulseClass());//Add new element to pre-pulse data list.
                        difState = difPulseState.DIF_PRE;
                        break;

                    case difPulseState.DIF_PRE:
                        if (tempWord == END_BLOCK)
                        {
                            difState = difPulseState.DIF_PRE_END;
                        }
                        else if (tempWord == ABORT)
                        {
                            doAbort();
                            difState = difPulseState.DIF_ABORT;//Already handled by above function.
                        }
                        else if (tempWord < ADC_MAX_VALUE)
                        {
                            //Add pre-pulse data to list.
                            preData[preCount - 1].data.Add((tempWord - 2047) * I_CONSTANT / gainResistance);
                            ds.rawAdd(new DataPoint(ds.rawCount(), tempWord));
                        }
                        else//Error state.
                        {
                            doError();
                            difState = difPulseState.DIF_ERR;//Already handled above.
                        }
                        break;

                    case difPulseState.DIF_PRE_END:
                        if(tempWord == START_DIF_PULSE)
                        {
                            difState = difPulseState.DIF_PULSE_COUNT;
                        }
                        else if (tempWord == ABORT)
                        {
                            doAbort();
                            difState = difPulseState.DIF_ABORT;//Already handled by above function.
                        }
                        else//Error state.
                        {
                            doError();
                            difState = difPulseState.DIF_ERR;//Already handled above.
                        }
                        break;
                        
                    /**************************************Pulse***************************************/

                    case difPulseState.DIF_PULSE_COUNT:
                        pulseCount++;
                        pulseData.Add(new PulseClass());//Add new element to pulse data list.
                        difState = difPulseState.DIF_PULSE;
                        break;

                    case difPulseState.DIF_PULSE:
                        if (tempWord == END_BLOCK)
                        {
                            UInt16 sampWindow = aq.aqSettings.difSampWinWidth;
                                                        
                            //Get lengths of the pre-pulse and pulse segments
                            int preDataLength = preData[preData.Count - 1].data.Count;
                            int pulseDataLength = pulseData[pulseData.Count - 1].data.Count;

                            double preAverage = 0;
                            double pulseAverage = 0;

                            int preIndex = preData.Count - 1;       //This pre-pulse data set.
                            int pulseIndex = pulseData.Count - 1;   //This pulse data set.

                            int thisPreDataPointer = preData[preIndex].data.Count - 1;
                            int thisPulseDataPointer = pulseData[pulseIndex].data.Count - 1;

                            //Pull the data from the arrays and average it.
                            for (int i = 0; i < aq.aqSettings.difSampWinWidth; i++)
                            {
                                preAverage += preData[preIndex].data[thisPreDataPointer - i];
                                pulseAverage += pulseData[pulseIndex].data[thisPulseDataPointer - i];
                            }

                            preAverage /= aq.aqSettings.difSampWinWidth;
                            pulseAverage /= aq.aqSettings.difSampWinWidth;

                            //Find the difference between them.
                            double pulseDifference = pulseAverage - preAverage;

                            //Save the value in the IV curve list.
                            ds.ivAddSub(0, new DataPoint(thisDifVoltage, pulseDifference));
                            thisDifVoltage += difDV;

                            difState = difPulseState.DIF_PULSE_END;
                        }
                        else if (tempWord == ABORT)
                        {
                            doAbort();
                            difState = difPulseState.DIF_ABORT;//Already handled by above function.
                        }
                        else if (tempWord < ADC_MAX_VALUE)
                        {
                            //Add pulse data to list.
                            pulseData[pulseCount - 1].data.Add((tempWord - 2047) * I_CONSTANT / gainResistance);
                            ds.rawAdd(new DataPoint(ds.rawCount(), tempWord));
                        }
                        else//Error state.
                        {
                            doError();
                            difState = difPulseState.DIF_ERR;//Already handled above.
                        }
                        break;

                    case difPulseState.DIF_PULSE_END:
                        if (tempWord == START_DIF_PRE)
                        {
                            difState = difPulseState.DIF_PRE_COUNT;
                        }
                        else if(tempWord == END_TEST)
                        {
                            //Add test type.
                            ds.typeSet("DFP");

                            //Add test name.  Current date and time.  User can change later.
                            ds.nameSet(DateTime.Now.ToString());

                            //Add settings info.
                            ds.settings.arraySet(aq.aqSettings.settingsArray);
                            ds.settings.setByArray(aq.aqSettings.settingsArray);

                            Thread.Sleep(300);//Give charts time to update.

                            BeginInvoke((MethodInvoker)delegate
                            {
                                //Copy data to top of data tree.
                                aq.dataTree.insertAtIndex(ds, 0);                      

                                //Set graphing markers in tree view for first data set.
                                aq.dataTree.treeGraphFirstItem();

                                //Causes the graphs to be updated based on the tree view graph markers.
                                aq.dataTree.updateGraphs();

                                enableGUI();//Give control back to the user.
                                addListeners();
                                resetTestButton();
                                aq.wfHelper.dataLoaded = true;
                            });                            

                            updateTimer.Enabled = false;
                            difState = difPulseState.DIF_COMP;
                            aq.rxState = rxStates.RX_IDLE;
                        }
                        else if (tempWord == ABORT)
                        {
                            doAbort();
                            difState = difPulseState.DIF_ABORT;//Already handled by above function.
                        }
                        else//Error state.
                        {
                            doError();
                            difState = difPulseState.DIF_ERR;//Already handled above.
                        }
                        break;

                    /**************************************End States***************************************/

                    case difPulseState.DIF_COMP:
                        difState = difPulseState.DIF_IDLE;//Shouldn't get here.
                        break;

                    case difPulseState.DIF_ABORT:
                        difState = difPulseState.DIF_IDLE;//Shouldn't get here.
                        break;

                    case difPulseState.DIF_ERR://Nothing to do.  Already handled.
                    default:
                        difState = difPulseState.DIF_IDLE;
                        break;
                }
            }         
        }

        /**************************************Non-GUI Timer Functions**************************************/

        //Non-GUI timer for updating data from serial port.
        void update_timer_Elapsed(object sender, ElapsedEventArgs e)
        {         
            //Add deposition data to the graph.
            while(ds.depCount() > thisDepIndex)
            {
                aq.aqPlotter.addDepositionDataPoint(ds.depGet(thisDepIndex++), 0);       
            }

            //Add quiet time data to the graph.
            while(ds.quietCount() > thisQuietIndex)
            {
                aq.aqPlotter.addQuietDataPoint(ds.quietGet(thisQuietIndex++), 0);
            }

            //Add raw data output to the graph.
            while(ds.rawCount() > thisTotalDataIndex)
            {
                aq.aqPlotter.addRawDataPoint(ds.rawGet(thisTotalDataIndex++), 0);
            }

            //Add differential pulse data to the graph.
            while(ds.ivCountSub(0) > thisDifIndex)
            {
                aq.aqPlotter.addIVCurveDataPoint(ds.ivGetSub(0, thisDifIndex++), 0);
            }
        }

        /**************************************GUI Component Functions**************************************/

        public DifTest(AquaSift aqs)
        {
            aq = aqs;
            InitializeComponent();
            difTimer = new AqTimer(aq);

            incommingData = new List<byte>();
            wordData = new List<UInt16>();

            preData = new List<PulseClass>();
            pulseData = new List<PulseClass>();

            ds = new DataSet();

            //Non-GUI timer for updating differential pulse data.
            updateTimer = new System.Timers.Timer(200);
            updateTimer.Elapsed += new ElapsedEventHandler(update_timer_Elapsed);
            updateTimer.Enabled = false;
        }

        private void btnDifTest_Click(object sender, EventArgs e)
        {
            if (!testStarted)//Start test.
            {
                //Indicate test has started.
                btnDifTest.Text = "Abort Test";
                testStarted = true;

                disableGUI();//Disable all GUI components.
                resetData();//Reset all data.
                removeListeners();//Remove action listeners from the charts.

                //Reset state machine.
                difState = difPulseState.DIF_IDLE;

                //Start test.
                aq.validateDevice(this.btnDifTest);
                difTimer.setTimer(400, timerTypes.TIMER_DIF_TEST, this.btnDifTest);
            }

            else//Abort the current test.
            {           
                //Send abort message to device.
                byte[] bArray = new byte[8];
                bArray[0] = (byte)'X';

                try
                {
                    aq.sp.Write(bArray, 0, 1);
                }
                catch (Exception err)
                {
                    aq.comCloser();
                    aq.comErrorHandler(err.ToString());
                }
            }
        }

        private void tbxDifStartVolt_ValueChanged(object sender, EventArgs e)
        {
            Int16 temp;

            temp = (Int16)tbxDifStartVolt.Value;
            
            aq.txData[0] = 0x16;
            aq.txData[1] = (byte)(temp >> 8);
            aq.txData[2] = (byte)temp;
            aq.txCount = 3;

            aq.validateDevice(this.tbxDifStartVolt);
        }

        private void tbxDifStartVolt_KeyDown(object sender, KeyEventArgs e)
        {
            Int16 temp;

            if (e.KeyCode == Keys.Enter)
            {
                temp = (Int16)tbxDifStartVolt.Value;
                
                aq.txData[0] = 0x16;
                aq.txData[1] = (byte)(temp >> 8);
                aq.txData[2] = (byte)temp;
                aq.txCount = 3;

                aq.validateDevice(this.tbxDifStartVolt);

                //Stop annoying chime sound after every enter key press.
                e.Handled = true;
                e.SuppressKeyPress = true;
            }
        }

        private void tbxDifEndVolt_ValueChanged(object sender, EventArgs e)
        {
            Int16 temp;

            temp = (Int16)tbxDifEndVolt.Value;
            
            aq.txData[0] = 0x17;
            aq.txData[1] = (byte)(temp >> 8);
            aq.txData[2] = (byte)temp;
            aq.txCount = 3;

            aq.validateDevice(this.tbxDifEndVolt);
        }

        private void tbxDifEndVolt_KeyDown(object sender, KeyEventArgs e)
        {
            Int16 temp;

            if (e.KeyCode == Keys.Enter)
            {
                temp = (Int16)tbxDifEndVolt.Value;
                
                aq.txData[0] = 0x17;
                aq.txData[1] = (byte)(temp >> 8);
                aq.txData[2] = (byte)temp;
                aq.txCount = 3;

                aq.validateDevice(this.tbxDifEndVolt);

                //Stop annoying chime sound after every enter key press.
                e.Handled = true;
                e.SuppressKeyPress = true;
            }
        }

        private void tbxDifIncVolt_ValueChanged(object sender, EventArgs e)
        {
            UInt16 temp;

            temp = (UInt16)tbxDifIncVolt.Value;
            
            aq.txData[0] = 0x18;
            aq.txData[1] = (byte)(temp >> 8);
            aq.txData[2] = (byte)temp;
            aq.txCount = 3;

            aq.validateDevice(this.tbxDifIncVolt);
        }

        private void tbxDifIncVolt_KeyDown(object sender, KeyEventArgs e)
        {
            UInt16 temp;

            if (e.KeyCode == Keys.Enter)
            {
                temp = (UInt16)tbxDifIncVolt.Value;
                
                aq.txData[0] = 0x18;
                aq.txData[1] = (byte)(temp >> 8);
                aq.txData[2] = (byte)temp;
                aq.txCount = 3;

                aq.validateDevice(this.tbxDifIncVolt);

                //Stop annoying chime sound after every enter key press.
                e.Handled = true;
                e.SuppressKeyPress = true;
            }
        }

        private void tbxDifPulseVolt_ValueChanged(object sender, EventArgs e)
        {
            {
                Int16 temp;

                temp = (Int16)tbxDifPulseVolt.Value;
                
                aq.txData[0] = 0x19;
                aq.txData[1] = (byte)(temp >> 8);
                aq.txData[2] = (byte)temp;
                aq.txCount = 3;

                aq.validateDevice(this.tbxDifPulseVolt);
            }
        }

        private void tbxDifPulseVolt_KeyDown(object sender, KeyEventArgs e)
        {
            Int16 temp;

            if (e.KeyCode == Keys.Enter)
            {
                temp = (Int16)tbxDifPulseVolt.Value;
                
                aq.txData[0] = 0x19;
                aq.txData[1] = (byte)(temp >> 8);
                aq.txData[2] = (byte)temp;
                aq.txCount = 3;

                aq.validateDevice(this.tbxDifPulseVolt);

                //Stop annoying chime sound after every enter key press.
                e.Handled = true;
                e.SuppressKeyPress = true;
            }
        }

        private void tbxDifPrepulseTime_ValueChanged(object sender, EventArgs e)
        {
            UInt16 temp;

            temp = (UInt16)tbxDifPrepulseTime.Value;
            
            aq.txData[0] = 0x1A;
            aq.txData[1] = (byte)(temp >> 8);
            aq.txData[2] = (byte)temp;
            aq.txCount = 3;

            aq.validateDevice(this.tbxDifPrepulseTime);
        }

        private void tbxDifPrepulseTime_KeyDown(object sender, KeyEventArgs e)
        {
            UInt16 temp;

            if (e.KeyCode == Keys.Enter)
            {
                temp = (UInt16)tbxDifPrepulseTime.Value;
                
                aq.txData[0] = 0x1A;
                aq.txData[1] = (byte)(temp >> 8);
                aq.txData[2] = (byte)temp;
                aq.txCount = 3;

                aq.validateDevice(this.tbxDifPrepulseTime);

                //Stop annoying chime sound after every enter key press.
                e.Handled = true;
                e.SuppressKeyPress = true;
            }
        }

        private void tbxDifPulseTime_ValueChanged(object sender, EventArgs e)
        {
            UInt16 temp;

            temp = (UInt16)tbxDifPulseTime.Value;
            
            aq.txData[0] = 0x1B;
            aq.txData[1] = (byte)(temp >> 8);
            aq.txData[2] = (byte)temp;
            aq.txCount = 3;

            aq.validateDevice(this.tbxDifPulseTime);
        }

        private void tbxDifPulseTime_KeyDown(object sender, KeyEventArgs e)
        {
            UInt16 temp;

            if (e.KeyCode == Keys.Enter)
            {
                temp = (UInt16)tbxDifPulseTime.Value;
                
                aq.txData[0] = 0x1B;
                aq.txData[1] = (byte)(temp >> 8);
                aq.txData[2] = (byte)temp;
                aq.txCount = 3;

                aq.validateDevice(this.tbxDifPulseTime);

                //Stop annoying chime sound after every enter key press.
                e.Handled = true;
                e.SuppressKeyPress = true;
            }
        }

        private void tbxDifSampWinWidth_ValueChanged(object sender, EventArgs e)
        {
            UInt16 temp;

            temp = (UInt16)tbxDifSampWinWidth.Value;
            
            aq.txData[0] = 0x1C;
            aq.txData[1] = (byte)(temp >> 8);
            aq.txData[2] = (byte)temp;
            aq.txCount = 3;

            aq.validateDevice(this.tbxDifSampWinWidth);
        }

        private void tbxDifSampWinWidth_KeyDown(object sender, KeyEventArgs e)
        {
            UInt16 temp;

            if (e.KeyCode == Keys.Enter)
            {
                temp = (UInt16)tbxDifSampWinWidth.Value;
                
                aq.txData[0] = 0x1C;
                aq.txData[1] = (byte)(temp >> 8);
                aq.txData[2] = (byte)temp;
                aq.txCount = 3;

                aq.validateDevice(this.tbxDifSampWinWidth);

                //Stop annoying chime sound after every enter key press.
                e.Handled = true;
                e.SuppressKeyPress = true;
            }
        }
    }
}
