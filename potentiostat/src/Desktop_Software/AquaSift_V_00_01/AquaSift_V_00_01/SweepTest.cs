using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Drawing;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Forms;
using System.Windows.Forms.DataVisualization.Charting;
using System.Timers;
using System.Threading;

namespace AquaSift_V_00_01
{
    public enum swpState
    {
        SWP_IDLE,
        SWP_DEP, SWP_DEP_END,
        SWP_QUIET, SWP_QUIET_END,
        SWP_COUNT, SWP_SWEEP, SWP_END,
        SWP_COMP, SWP_ABORT, SWP_ERR
    };

    public partial class SweepTest : UserControl
    {
        //A simple class for holding pre-pulse and pulse data.
        public class SweepClass
        {
            public List<double> data = new List<double>();
        }

        const double I_CONSTANT = 805.664;//Current calculation constant (3.3 * 1000000 / 4096)
        const UInt16 ADC_MAX_VALUE = 4095;//Max. count of the 12-bit ADC.

        //Control word defines.
        const UInt16 START_DEP = 0x8000;
        const UInt16 START_QUIET = 0x8100;
        const UInt16 START_LIN_SWEEP = 0x8200;
        const UInt16 START_DIF_PRE = 0x8400;
        const UInt16 START_DIF_PULSE = 0x8500;
        const UInt16 START_ARB = 0x8600;
        const UInt16 ABORT = 0xF000;
        const UInt16 END_BLOCK = 0xFF00;
        const UInt16 END_TEST = 0xFFF0;

        AquaSift aq;//Pointer to main form.
        bool testStarted = false;

        public System.Timers.Timer updateTimer;//Non-GUI timer.
        private AqTimer sweepTimer;//GUI timer.
        swpState sweepState = swpState.SWP_IDLE;
        System.Windows.Forms.Timer timer = new System.Windows.Forms.Timer() { Interval = 1000 };

        List<byte> incommingData;//Raw data from the device.
        List<UInt16> wordData;//Raw data converted into word data.

        List<SweepClass> sweepData;//Array of sweep data.

        DataSet ds = new DataSet();

        List<int> thisIVCounts;

        private int totalIndex = 0;
        private int wordBuildingIndex = 0;
        private int thisWordIndex = 0;

        private int thisDepIndex = 0;
        private int thisQuietIndex = 0;
        private int thisTotalDataIndex = 0;

        private double thisDepTime = 0;
        private double thisQuietTime = 0;
        private double thisSweepVoltage = 0;
        
        private int sweepCount = 0;

        private double depDT;
        private double quietDT;
        private double sweepDV;

        /************************************GUI Lock/Restore Functions*************************************/

        public void disableGUI()
        {
            //Reset graphing markers in tree view only.
            aq.dataTree.treeUngraphAll();

            //Disable sweep components.
            btnSweepTest.Enabled = false;
            gbxSweepStartVolt.Enabled = false;
            gbxSweepEndVolt.Enabled = false;
            gbxSweepRate.Enabled = false;
            gbxSweepCyclic.Enabled = false;
            gbxSweepNumCycles.Enabled = false;
            
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

            thisIVCounts.Clear();

            //Zero out data lists.
            incommingData.Clear();
            wordData.Clear();
            sweepData.Clear();
            
            //Data set class variables.
            ds.depClear();
            ds.QuietClear();
            ds.rawClear();
            ds.ivClear();
            
            //Reset index variables.
            totalIndex = 0;
            wordBuildingIndex = 0;
            thisWordIndex = 0;
            thisDepIndex = 0;
            thisQuietIndex = 0;
            thisTotalDataIndex = 0;

            thisDepTime = 0;
            thisQuietTime = 0;
            thisSweepVoltage = 0;
      
            sweepCount = -1;
            
            depDT = 0;
            quietDT = 0;
            sweepDV = 0;
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
            //Enable sweep components.
            btnSweepTest.Enabled = false;
            gbxSweepStartVolt.Enabled = true;
            gbxSweepEndVolt.Enabled = true;
            gbxSweepRate.Enabled = true;
            gbxSweepCyclic.Enabled = true;
            gbxSweepNumCycles.Enabled = true;

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
            btnSweepTest.Text = "Start Linear Sweep Test";
            btnSweepTest.Enabled = true;
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
            double totalSamples = (((double)aq.aqSettings.linearEndVoltage - (double)aq.aqSettings.linearStartVoltage) /
                ((double)aq.aqSettings.linearSweepRate)) / ((double)aq.aqSettings.dataRate / 1000.0);
           
            if (totalSamples < 0)//Find absolute value.
            {
                totalSamples *= -1;
            }

            //Take into account cylic samples, if it is enabled.
            if (aq.aqSettings.linearCyclic)
            {
                totalSamples *= aq.aqSettings.linearNumCycles * 2;
            }

            double totalTime = totalSamples * ((double)aq.aqSettings.dataRate / 1000.0);
            
            BeginInvoke((MethodInvoker)delegate
            {
                //Add raw data tab to GUI.
                aq.aqPlotter.tbcPlotTabs.TabPages.Add(aq.aqPlotter.tabRawData);

                //Size raw data plot.
                aq.aqPlotter.chtRawData.ChartAreas[0].AxisX.Minimum = 0;
                aq.aqPlotter.chtRawData.ChartAreas[0].AxisX.Maximum = totalSamples - 1;

                //Reset zoom.
                aq.aqPlotter.chtRawData.ChartAreas[0].AxisX.ScaleView.ZoomReset();
                aq.aqPlotter.chtRawData.ChartAreas[0].AxisY.ScaleView.ZoomReset();

                //Add timer to bottom strip.
                var startTime = DateTime.Now;
                timer.Tick += (obj, args) => aq.lblTestTime.Text =
                (TimeSpan.FromSeconds(totalTime) - (DateTime.Now - startTime)).ToString("mm\\:ss");
                timer.Enabled = true;

                //Make timer visible.
                aq.lblTestTime.Visible = true;
                aq.lblTestType.Text = "Linear Sweep";
                aq.lblTestType.Visible = true;
            });
        }

        public void prepIVChart()
        {
            //Calculate the total number of samples between start and end voltages..
            double totalSamples = (((double)aq.aqSettings.linearEndVoltage - (double)aq.aqSettings.linearStartVoltage) /
                ((double)aq.aqSettings.linearSweepRate)) / ((double)aq.aqSettings.dataRate / 1000.0);

            if (totalSamples < 0)//Find absolute value.
            {
                totalSamples *= -1;
            }

            //Get initial voltage.
            thisSweepVoltage = aq.aqSettings.linearStartVoltage;

            //Calculate difDV.
            sweepDV = ((double)aq.aqSettings.linearEndVoltage - (double)aq.aqSettings.linearStartVoltage) / totalSamples;
            
            //Calculate x-axis minumum and maximum.
            double xMin, xMax;
            if (aq.aqSettings.linearEndVoltage > aq.aqSettings.linearStartVoltage)
            {
                xMin = aq.aqSettings.linearStartVoltage;
                xMax = aq.aqSettings.linearEndVoltage;
            }
            else
            {
                xMin = aq.aqSettings.linearEndVoltage;
                xMax = aq.aqSettings.linearStartVoltage;
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
                btnSweepTest.Text = "Start Linear Sweep Test";
                testStarted = false;

                enableGUI();//Enable the GUI
                addListeners();//Add listeners back onto the charts.
                hidePlotter();//Remove plots.

                //Stop test timer and hide it.
                timer.Enabled = false;
                timer.Dispose();
                updateTimer.Stop();

                aq.lblTestTime.Text = "      ";
                aq.lblTestType.Text = "";
                aq.lblTestTime.Visible = false;
                aq.lblTestType.Visible = false;

                //Allow waveform image to be displayed.
                aq.wfHelper.dataLoaded = false;

                //Abort test.
                aq.rxState = rxStates.RX_IDLE;
                sweepTimer.setTimer(200, timerTypes.TIMER_SWP_ABORT, this.btnSweepTest);
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
            for (int i = 0; i < arraySize; i++)
            {
                incommingData.Add(bArray[i]);
            }

            //Update index value.
            totalIndex += arraySize;

            //Populate the word list.
            while (wordBuildingIndex < totalIndex - 1)
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

                switch (sweepState)
                {
                    /*****************************************Idle******************************************/

                    case swpState.SWP_IDLE:
                        if (tempWord == START_DEP)//Prepare for deposition.
                        {
                            prepDepChart();
                            sweepState = swpState.SWP_DEP;//Move to deposition state.
                        }
                        else if (tempWord == START_QUIET)
                        {
                            prepQuietChart();
                            sweepState = swpState.SWP_QUIET;//Move to quiet time state.
                        }
                        else if (tempWord == START_LIN_SWEEP)
                        {
                            prepRawChart();
                            prepIVChart();
                            sweepState = swpState.SWP_COUNT;//Move to linear sweep state.
                        }
                        else if (tempWord == ABORT)
                        {
                            doAbort();
                            sweepState = swpState.SWP_ABORT;//Already handled by above function.
                        }
                        else//Error state.
                        {
                            doError();
                            sweepState = swpState.SWP_ERR;//Already handled above.
                        }
                        break;

                    /**************************************Deposition***************************************/

                    case swpState.SWP_DEP:
                        if (tempWord == END_BLOCK)//End of deposition.  Move on.
                        {
                            sweepState = swpState.SWP_DEP_END;
                        }
                        else if (tempWord == ABORT)//Already handled by above function.
                        {
                            doAbort();
                            sweepState = swpState.SWP_ABORT;
                        }
                        else if (tempWord < ADC_MAX_VALUE)
                        {
                            //Convert data to current and add to list;
                            ds.depAdd(new DataPoint(thisDepTime, (tempWord - 2047) * I_CONSTANT / gainResistance));
                            thisDepTime += depDT;
                        }
                        else//Error state.
                        {
                            doError();
                            sweepState = swpState.SWP_ERR;//Already handled above.
                        }
                        break;

                    case swpState.SWP_DEP_END:
                        updateTimer.Enabled = false;

                        if (tempWord == START_QUIET)
                        {
                            prepQuietChart();
                            sweepState = swpState.SWP_QUIET;//Move to quiet time state.
                        }
                        else if (tempWord == START_LIN_SWEEP)
                        {
                            prepRawChart();
                            prepIVChart();
                            sweepState = swpState.SWP_COUNT;//Move to linear sweep state.
                        }
                        else if (tempWord == ABORT)
                        {
                            doAbort();
                            sweepState = swpState.SWP_ABORT;//Already handled by above function.
                        }
                        else//Error state.
                        {
                            doError();
                            sweepState = swpState.SWP_ERR;//Already handled above.
                        }
                        break;

                    /*****************************************Quiet*****************************************/

                    case swpState.SWP_QUIET:
                        if (tempWord == END_BLOCK)//End of quiet time.  Move on.
                        {
                            sweepState = swpState.SWP_QUIET_END;
                        }
                        else if (tempWord == ABORT)//Already handled by above function.
                        {
                            doAbort();
                            sweepState = swpState.SWP_ABORT;
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
                            sweepState = swpState.SWP_ERR;//Already handled above.
                        }
                        break;

                    case swpState.SWP_QUIET_END:
                        updateTimer.Enabled = false;

                        if (tempWord == START_LIN_SWEEP)
                        {
                            prepRawChart();
                            prepIVChart();
                            sweepState = swpState.SWP_COUNT;//Move to linear sweep state.
                        }
                        else if (tempWord == ABORT)
                        {
                            doAbort();
                            sweepState = swpState.SWP_ABORT;//Already handled by above function.
                        }
                        else//Error state.
                        {
                            doError();
                            sweepState = swpState.SWP_ERR;//Already handled above.
                        }
                        break;

                    /*****************************************Sweep*****************************************/

                    case swpState.SWP_COUNT:
                        ds.ivAdd();//Add new array to sweep data list.  
                        thisIVCounts.Add(0);             
                        sweepCount++;
                        sweepState = swpState.SWP_SWEEP;
                        break;

                    case swpState.SWP_SWEEP:
                        if (tempWord == END_BLOCK)
                        {
                            sweepDV *= -1;  //Change slope of sweep.
                            sweepState = swpState.SWP_END;
                        }
                        else if (tempWord == ABORT)
                        {
                            doAbort();
                            sweepState = swpState.SWP_ABORT;//Already handled by above function.
                        }
                        else if (tempWord < ADC_MAX_VALUE)
                        {
                            //Add data to raw data chart.
                            ds.rawAdd(new DataPoint(ds.rawCount(), tempWord));

                            //Convert data to current and add to list;
                            ds.ivAddSub(sweepCount, new DataPoint(thisSweepVoltage, (tempWord - 2047) * I_CONSTANT / gainResistance));
                            thisSweepVoltage += sweepDV;
                        }
                        else//Error state.
                        {
                            doError();
                            sweepState = swpState.SWP_ERR;//Already handled above.
                        }
                        break;

                    case swpState.SWP_END:
                        if (tempWord == START_LIN_SWEEP)
                        {
                            sweepState = swpState.SWP_COUNT;
                        }
                        else if (tempWord == ABORT)
                        {
                            doAbort();
                            sweepState = swpState.SWP_ABORT;//Already handled by above function.
                        }
                        else if (tempWord == END_TEST)
                        {
                            //Add test type.
                            ds.typeSet("SWP");

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
                            sweepState = swpState.SWP_COMP;
                            aq.rxState = rxStates.RX_IDLE;
                        }
                        else//Error state.
                        {
                            doError();
                            sweepState = swpState.SWP_ERR;//Already handled above.
                        }
                        break;

                    /**************************************End States***************************************/

                    case swpState.SWP_COMP:
                        sweepState = swpState.SWP_IDLE;//Shouldn't get here.
                        break;

                    case swpState.SWP_ABORT:
                        sweepState = swpState.SWP_IDLE;//Shouldn't get here.
                        break;

                    case swpState.SWP_ERR://Nothing to do.  Already handled.
                    default:
                        sweepState = swpState.SWP_IDLE;
                        break;
                }
            }
        }

        /**************************************Non-GUI Timer Functions**************************************/

        //Non-GUI timer for updating data from serial port.
        void update_timer_Elapsed(object sender, ElapsedEventArgs e)
        {
            //Add deposition data to the graph.
            while (ds.depCount() > thisDepIndex)
            {
                aq.aqPlotter.addDepositionDataPoint(ds.depGet(thisDepIndex++), 0);
            }

            //Add quiet time data to the graph.
            while (ds.quietCount() > thisQuietIndex)
            {
                aq.aqPlotter.addQuietDataPoint(ds.quietGet(thisQuietIndex++), 0);
            }

            //Add raw data output to the graph.
            while (ds.rawCount() > thisTotalDataIndex)
            {
                aq.aqPlotter.addRawDataPoint(ds.rawGet(thisTotalDataIndex++), 0);
            }
            
            //Add any new series to the IV graph.
            BeginInvoke((MethodInvoker)delegate
            {
                int seriesNumber = aq.aqPlotter.chtIVCurve.Series.Count + 1;

                while (aq.aqPlotter.chtIVCurve.Series.Count < ds.ivCount())
                {
                    //Add new series to IV curve tab.
                    var IVCurveSeries = new Series
                    {
                        Name = "Series" + seriesNumber,
                        ChartType = SeriesChartType.FastLine,
                        ChartArea = "ChartArea1"
                    };
                    aq.aqPlotter.chtIVCurve.Series.Add(IVCurveSeries);
                }

                //Add IVCurve data to graph.
                for (int i = 0; i < ds.ivCount(); i++)
                {
                    while (aq.aqPlotter.chtIVCurve.Series[i].Points.Count < ds.ivCountSub(i))
                    {
                        aq.aqPlotter.addIVCurveDataPoint(ds.ivGetSub(i, thisIVCounts[i]++), i);
                    }
                }
            });      
        }

        /**************************************GUI Component Functions**************************************/

        public SweepTest(AquaSift aqs)
        {
            aq = aqs;
            InitializeComponent();
            sweepTimer = new AqTimer(aq);

            incommingData = new List<byte>();
            wordData = new List<UInt16>();
            sweepData = new List<SweepClass>();
            
            ds = new DataSet();

            thisIVCounts = new List<int>();

            //Non-GUI timer for updating linear sweep data.
            updateTimer = new System.Timers.Timer(200);
            updateTimer.Elapsed += new ElapsedEventHandler(update_timer_Elapsed);
            updateTimer.Enabled = false;
        }

        private void tbxSweepStartVolt_ValueChanged(object sender, EventArgs e)
        {
            Int16 temp;

            temp = (Int16)tbxSweepStartVolt.Value;

            aq.txData[0] = 0x11;
            aq.txData[1] = (byte)(temp >> 8);
            aq.txData[2] = (byte)temp;
            aq.txCount = 3;

            aq.validateDevice(this.tbxSweepStartVolt);
        }

        private void tbxSweepStartVolt_KeyDown(object sender, KeyEventArgs e)
        {
            Int16 temp;

            if (e.KeyCode == Keys.Enter)
            {
                temp = (Int16)tbxSweepStartVolt.Value;
               
                aq.txData[0] = 0x11;
                aq.txData[1] = (byte)(temp >> 8);
                aq.txData[2] = (byte)temp;
                aq.txCount = 3;

                aq.validateDevice(this.tbxSweepStartVolt);

                //Stop annoying chime sound after every enter key press.
                e.Handled = true;
                e.SuppressKeyPress = true;
            }
        }

        private void tbxSweepEndVolt_ValueChanged(object sender, EventArgs e)
        {
            Int16 temp;

            temp = (Int16)tbxSweepEndVolt.Value;
            
            aq.txData[0] = 0x12;
            aq.txData[1] = (byte)(temp >> 8);
            aq.txData[2] = (byte)temp;
            aq.txCount = 3;

            aq.validateDevice(this.tbxSweepEndVolt);
        }

        private void tbxSweepEndVolt_KeyDown(object sender, KeyEventArgs e)
        {
            Int16 temp;

            if (e.KeyCode == Keys.Enter)
            {
                temp = (Int16)tbxSweepEndVolt.Value;
                
                aq.txData[0] = 0x12;
                aq.txData[1] = (byte)(temp >> 8);
                aq.txData[2] = (byte)temp;
                aq.txCount = 3;

                aq.validateDevice(this.tbxSweepEndVolt);

                //Stop annoying chime sound after every enter key press.
                e.Handled = true;
                e.SuppressKeyPress = true;
            }
        }

        private void tbxSweepRate_ValueChanged(object sender, EventArgs e)
        {
            UInt16 temp;

            temp = (UInt16)tbxSweepRate.Value;
            
            aq.txData[0] = 0x13;
            aq.txData[1] = (byte)(temp >> 8);
            aq.txData[2] = (byte)temp;
            aq.txCount = 3;

            aq.validateDevice(this.tbxSweepRate);
        }

        private void tbxSweepRate_KeyDown(object sender, KeyEventArgs e)
        {
            UInt16 temp;

            if (e.KeyCode == Keys.Enter)
            {
                temp = (UInt16)tbxSweepRate.Value;
                
                aq.txData[0] = 0x13;
                aq.txData[1] = (byte)(temp >> 8);
                aq.txData[2] = (byte)temp;
                aq.txCount = 3;

                aq.validateDevice(this.tbxSweepRate);

                //Stop annoying chime sound after every enter key press.
                e.Handled = true;
                e.SuppressKeyPress = true;
            }
        }

        private void tbxSweepNumCycles_ValueChanged(object sender, EventArgs e)
        {
            UInt16 temp;

            temp = (UInt16)tbxSweepNumCycles.Value;
            
            aq.txData[0] = 0x15;
            aq.txData[1] = (byte)temp;
            aq.txCount = 2;

            aq.validateDevice(this.tbxSweepNumCycles);
        }

        private void tbxSweepNumCycles_KeyDown(object sender, KeyEventArgs e)
        {
            UInt16 temp;

            if (e.KeyCode == Keys.Enter)
            {
                temp = (UInt16)tbxSweepNumCycles.Value;
                
                aq.txData[0] = 0x15;
                aq.txData[1] = (byte)temp;
                aq.txCount = 2;

                aq.validateDevice(this.tbxSweepNumCycles);

                //Stop annoying chime sound after every enter key press.
                e.Handled = true;
                e.SuppressKeyPress = true;
            }
        }

        private void rbtSweepCyclicYes_Enter(object sender, EventArgs e)
        {
            if (!rbtSweepCyclicYes.Checked)//Make sure the button is not already selected.
            {
                rbtSweepCyclicYes.Checked = true;

                aq.txData[0] = 0x14;
                aq.txData[1] = 0x01;
                aq.txCount = 2;

                aq.validateDevice(this.rbtSweepCyclicYes);
            }
        }

        private void rbtSweepCyclicNo_Enter(object sender, EventArgs e)
        {
            if (!rbtSweepCyclicNo.Checked)//Make sure the button is not already selected.
            {
                rbtSweepCyclicNo.Checked = true;

                aq.txData[0] = 0x14;
                aq.txData[1] = 0x00;
                aq.txCount = 2;

                aq.validateDevice(this.rbtSweepCyclicNo);
            }
        }

        private void btnSweepTest_Click(object sender, EventArgs e)
        {
            if (!testStarted)//Start test.
            {
                //Indicate test has started.
                btnSweepTest.Text = "Abort Test";
                testStarted = true;

                disableGUI();//Disable all GUI components.
                resetData();//Reset all data.
                removeListeners();//Remove action listeners from the charts.

                //Reset state machine.
                sweepState = swpState.SWP_IDLE;

                //Start test.
                aq.validateDevice(this.btnSweepTest);
                sweepTimer.setTimer(400, timerTypes.TIMER_SWP_TEST, this.btnSweepTest);
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
    }
}
