using System;
using System.IO.Ports;
using System.IO;
using System.Drawing;
using System.Windows.Forms;
using System.Threading;
using System.Windows.Forms.DataVisualization.Charting;

namespace AquaSift_V_00_01
{
    //The different states. of the RX state machine.
    public enum rxStates
    {
        RX_IDLE, RX_COM_VAL, RX_COM_VAL2, RX_GET_SETTINGS, RX_DIF_TEST, RX_SWP_TEST
    };

    public partial class AquaSift : Form
    {
        /*****************************************AquaSift Constants****************************************/
        public const int FIRMWARE_MAJOR = 0;
        public const int FIRMWARE_MINOR = 1;
        public const int SELECTION_DIF_PULSE = 0;
        public const int SELECTION_LIN_SWEEP = 1;
        public const int TAB_CONTROL_TEST_INDEX = 2;

        /**************************************AquaSift Class Variables*************************************/

        public AqTimer aqTimer;                         //Timer object.
        public AqSettings aqSettings;                   //Setings object.
        public SerialPort sp;                           //Serial port object.
        public WavefomrHelper wfHelper;                 //Container for waveform drawing.
        public AqPlotter aqPlotter;                     //User control for data plotting.
        public AqConsole aqCon;                         //Pointer to console object.
        public DifTest dTestPanel;                      //Differential pulse test panel.
        public SweepTest sTestPanel;                    //Linear sweep test panel.
        public DataTree dataTree;                       //Data tree panel.

        private Control cPointer;                       //Pointer to current test panel installed.
        public Control control;                         //Pointer to control to receive focus after validation.

        public rxStates rxState = rxStates.RX_IDLE;     //RX state.

        public byte[] txData = new byte[20];            //Array used to send data.         
        public int txCount;                             //Count of bytes in the tx array.

        public bool connected = false;                  //serial port connection status.

        public bool waveformEnable = true;              //Enables waveform viewer.
        
        public int rxSettingsCount;                     //Keeps track of rx settings bytes received.

        /*************************************Serial Port Read Functions************************************/

        //Data received event handler.
        public void spDataReceived(object sender, SerialDataReceivedEventArgs e)
        {
            int rxCount;
            byte[] rxBytes = new byte[2048];
            SerialPort sp = (SerialPort)sender;

            try
            {
                rxCount = sp.Read(rxBytes, 0, rxBytes.Length);

                if (rxCount > 0)
                {
                    readStateMachine(rxBytes, rxCount);
                }
            }
            catch (Exception err)
            {
                comErrorHandler(err.ToString());
                comCloser();
            }
        }

        //State machine for reading data from device.
        private void readStateMachine(byte[] rxBytes, int byteCount)
        {
            switch (rxState)
            {
                case rxStates.RX_IDLE:
                    aqCon.consoleUpdater(byteCount, rxBytes, consoleSources.CONSOLE_RX, control);
                    break;

                case rxStates.RX_COM_VAL:
                    //Ignore junk data while device changes state.
                    rxSettingsCount = 0;
                    break;

                case rxStates.RX_GET_SETTINGS:
                    aqSettings.updateSettingsArray(rxBytes, byteCount, rxSettingsCount);
                    rxSettingsCount += byteCount;//Keep track of bytes placed in settings array.
                    break;

                case rxStates.RX_DIF_TEST:
                    //Pass data to differential test state machine.
                    dTestPanel.updateTimer.Start();
                    dTestPanel.difTestStateMachine(rxBytes, byteCount);
                    break;

                case rxStates.RX_SWP_TEST:
                    //Pass data to sweep test state machine.
                    sTestPanel.updateTimer.Start();
                    sTestPanel.difTestStateMachine(rxBytes, byteCount);                
                    break;

                default:
                    break;
            }
        }

        /**************************************Communication Functions**************************************/

        //Initialize communications with the device.
        public void comInitializer(Connect c)
        {
            //Configure the serial port.
            sp.PortName = c.cmbComPort.SelectedItem.ToString();
            sp.BaudRate = int.Parse(c.cmbBaudRate.SelectedItem.ToString());
            sp.DataBits = int.Parse(c.cmbDataBits.SelectedItem.ToString());

            if (c.cmbStopBits.SelectedIndex == 1)
                sp.StopBits = StopBits.OnePointFive;
            else if (c.cmbStopBits.SelectedIndex == 2)
                sp.StopBits = StopBits.Two;
            else
                sp.StopBits = StopBits.One;

            if (c.cmbParity.SelectedIndex == 1)
                sp.Parity = Parity.Odd;
            else if (c.cmbParity.SelectedIndex == 2)
                sp.Parity = Parity.Even;
            else if (c.cmbParity.SelectedIndex == 3)
                sp.Parity = Parity.Mark;
            else if (c.cmbParity.SelectedIndex == 4)
                sp.Parity = Parity.Space;
            else
                sp.Parity = Parity.None;

            sp.ReadTimeout = 500;
            sp.WriteTimeout = 500;

            if (!sp.IsOpen)
                sp.Open();

            //Hide window after connection successful.
            c.Hide();

            //Disable connection menu item in main form and enable disconnect.
            connected = true;
            menConnect.Enabled = false;
            menDisconnect.Enabled = true;
            aqCon.tbxSendData_Enable(true);
            lblDisconnected.Text = "Connected";
            lblDisconnected.ForeColor = Color.Green;
            tabControl1.TabPages.Add(tabDevice);
            tabControl1.TabPages.Add(tabDeposition);
            tabControl1.TabPages.Add(tabTests);
            tabControl1.TabPages.Add(tabAdvanced);

            validateDevice(this.menMain);
        }

        public void comCloser()
        {
            try//Shut down read thread.
            {
                if (sp.IsOpen)
                {
                    sp.Close();
                }
                    
                connected = false;
                menConnect.Enabled = true;
                menDisconnect.Enabled = false;
                lblDisconnected.Text = "Disconnected";
                lblDisconnected.ForeColor = Color.Red;
                lblDevice.Text = "NONE";
                lblFirmware.Text = "NONE";
                aqCon.tbxSendData_Enable(false);
                tabControl1.TabPages.Remove(tabDevice);
                tabControl1.TabPages.Remove(tabDeposition);
                tabControl1.TabPages.Remove(tabTests);
                tabControl1.TabPages.Remove(tabAdvanced);
            }
            catch (Exception err)
            {
                comErrorHandler(err.ToString());
            }
        }

        //Shuts down read thread and displays error message when communication error occurs.
        public void comErrorHandler(String err)
        {
            MessageBox.Show(err, "Communication Error", MessageBoxButtons.OK, MessageBoxIcon.Error);
        }

        //Puts the device into binary mode and retreives the settings.
        public void validateDevice(Control c)
        {
            //Save object which called this function to return focus to later.
            control = c;

            //Put console window into binary mode.
            aqCon.consoleToBinary();
            aqCon.rbtBinary_Checked(true);

            //Activate rx state machine.
            rxState = rxStates.RX_COM_VAL;

            //Prepare to send 'X' to stop any running processes.
            byte[] bArray = new byte[8];
            bArray[0] = (byte)'X';
            bArray[1] = (byte)'\r';

            try//Send data to device.
            {
                sp.Write(bArray, 0, 2);
            }
            catch (Exception err)
            {
                comCloser();
                comErrorHandler(err.ToString());
            }

            //Set timer to wait for next step in validation process.
            aqTimer.setTimer(20, timerTypes.TIMER_COM_VAL2, control);
        }

        /**************************************GUI Component Functions**************************************/

        public AquaSift()
        {
            //Create new AquaSift timer object.
            aqTimer = new AqTimer(this);

            //Create new AquaSift settings object.
            aqSettings = new AqSettings(this);

            //Create a new SerialPort object with default settings.
            sp = new SerialPort();
            sp.DataReceived += new SerialDataReceivedEventHandler(spDataReceived);

            //Create new console panel and add it to the main form.
            aqCon = new AqConsole(this);
            
            //Create new wavefor viewer.
            wfHelper = new WavefomrHelper(this);

            //Create new data tree panel.
            dataTree = new DataTree(this);
            
            //Create the test panels.
            sTestPanel = new SweepTest(this);
            dTestPanel = new DifTest(this);
            sTestPanel.Location = new Point(-2, 58);
            dTestPanel.Location = new Point(-2, 58);

            //Create new data plotter.
            aqPlotter = new AqPlotter(this);
            aqPlotter.Visible = false;

            InitializeComponent();

            //Add user controls.
            spcMain.Panel2.Controls.Add(aqCon);
            spcSub2.Panel1.Controls.Add(wfHelper);

            //Set default test type as differential pulse.
            cmbTestTypes.SelectedIndex = SELECTION_DIF_PULSE;

            //Load default waveformm.
            wfHelper.waveformLoader();

            //Differential pulse is default panel.
            cPointer = dTestPanel;
            tabTests.Controls.Add(cPointer);         

            //Hide tabs on startup.
            tabControl1.TabPages.Remove(tabDevice);
            tabControl1.TabPages.Remove(tabDeposition);
            tabControl1.TabPages.Remove(tabTests);
            tabControl1.TabPages.Remove(tabAdvanced);

            //Remove graph tabs.
            aqPlotter.tbcPlotTabs.TabPages.Remove(aqPlotter.tabDeposition);
            aqPlotter.tbcPlotTabs.TabPages.Remove(aqPlotter.tabQuietTime);
            aqPlotter.tbcPlotTabs.TabPages.Remove(aqPlotter.tabRawData);
            aqPlotter.tbcPlotTabs.TabPages.Remove(aqPlotter.tabIVCurve);

            //Add waveform plotter.
            spcSub2.Panel1.Controls.Add(aqPlotter);

            //Add data tree.
            spcSub2.Panel2.Controls.Add(dataTree);
        }

        /*****************************************Resize Functions******************************************/

        //Resize entire form.
        private void AquaSift_Resize(object sender, EventArgs e)
        {
            spcMain.Width = this.Width - 40;
            spcMain.Height = this.Height - 85;

            aqCon.Width = spcMain.Panel2.Width;
            aqCon.Height = spcMain.Panel2.Height;
            aqCon.gbxAquaSiftConsole_Width(spcMain.Panel2.Width-5);
            aqCon.gbxAquaSiftConsole_Height(spcMain.Panel2.Height - 10);
            aqCon.rtbConsoleWindow_Width(spcMain.Panel2.Width - 17);
            aqCon.rtbConsoleWindow_Height(spcMain.Panel2.Height - 65);

            tabControl1.Height = spcMain.Panel1.Height - 5;

            //Resize chart area.
            aqPlotter.Width = spcSub2.Panel1.Width;
            aqPlotter.Height = spcSub2.Panel1.Height;
            aqPlotter.tbcPlotTabs.Width = spcSub2.Panel1.Width - 5;
            aqPlotter.tbcPlotTabs.Height = spcSub2.Panel1.Height - 64;

            //Resize charts
            aqPlotter.chtDeposition.Width = spcSub2.Panel1.Width - 5;
            aqPlotter.chtDeposition.Height = spcSub2.Panel1.Height - 64;
            aqPlotter.chtQuietTime.Width = spcSub2.Panel1.Width - 5;
            aqPlotter.chtQuietTime.Height = spcSub2.Panel1.Height - 64;
            aqPlotter.chtRawData.Width = spcSub2.Panel1.Width - 5;
            aqPlotter.chtRawData.Height = spcSub2.Panel1.Height - 64;
            aqPlotter.chtIVCurve.Width = spcSub2.Panel1.Width - 5;
            aqPlotter.chtIVCurve.Height = spcSub2.Panel1.Height - 64;

            //Resize data tree.
            dataTree.Width = spcSub2.Panel2.Width;
            dataTree.Height = spcSub2.Panel2.Height;
            dataTree.treData_Width(spcSub2.Panel2.Width);
            dataTree.treData_Height(spcSub2.Panel2.Height);     
        }

        //Resize console window.
        private void spcMain_SplitterMoved(object sender, SplitterEventArgs e)
        {
            aqCon.Width = spcMain.Panel2.Width;
            aqCon.Height = spcMain.Panel2.Height;
            aqCon.gbxAquaSiftConsole_Width(spcMain.Panel2.Width-5);
            aqCon.gbxAquaSiftConsole_Height(spcMain.Panel2.Height - 10);
            aqCon.rtbConsoleWindow_Width(spcMain.Panel2.Width - 17);
            aqCon.rtbConsoleWindow_Height(spcMain.Panel2.Height - 65);

            tabControl1.Height = spcMain.Panel1.Height - 5;

            if (tabControl1.Height < 447)
                tabControl1.Height = 447;

            //Resize chart area.
            aqPlotter.Width = spcSub2.Panel1.Width;
            aqPlotter.Height = spcSub2.Panel1.Height;
            aqPlotter.tbcPlotTabs.Width = spcSub2.Panel1.Width - 5;
            aqPlotter.tbcPlotTabs.Height = spcSub2.Panel1.Height - 64;

            //Resize charts
            aqPlotter.chtDeposition.Width = aqPlotter.tbcPlotTabs.Width - 5;
            aqPlotter.chtDeposition.Height = aqPlotter.tbcPlotTabs.Height - 64;
            aqPlotter.chtQuietTime.Width = spcSub2.Panel1.Width - 5;
            aqPlotter.chtQuietTime.Height = spcSub2.Panel1.Height - 64;
            aqPlotter.chtRawData.Width = spcSub2.Panel1.Width - 5;
            aqPlotter.chtRawData.Height = spcSub2.Panel1.Height - 64;
            aqPlotter.chtIVCurve.Width = spcSub2.Panel1.Width - 5;
            aqPlotter.chtIVCurve.Height = spcSub2.Panel1.Height - 64;

            //Resize data tree.
            dataTree.Width = spcSub2.Panel2.Width;
            dataTree.Height = spcSub2.Panel2.Height;
            dataTree.treData_Width(spcSub2.Panel2.Width);
            dataTree.treData_Height(spcSub2.Panel2.Height);
        }

        //Resize configuration window.
        private void spcSub1_SplitterMoved(object sender, SplitterEventArgs e)
        {
            if (spcSub1.SplitterDistance > tabControl1.Width + 5)
            {
                spcSub1.SplitterDistance = tabControl1.Width + 5;
            }

            //Resize chart area.
            aqPlotter.Width = spcSub2.Panel1.Width;
            aqPlotter.Height = spcSub2.Panel1.Height;
            aqPlotter.tbcPlotTabs.Width = spcSub2.Panel1.Width - 5;
            aqPlotter.tbcPlotTabs.Height = spcSub2.Panel1.Height - 64;

            //Resize charts
            aqPlotter.chtDeposition.Width = spcSub2.Panel1.Width - 5;
            aqPlotter.chtDeposition.Height = spcSub2.Panel1.Height - 64;
            aqPlotter.chtQuietTime.Width = spcSub2.Panel1.Width - 5;
            aqPlotter.chtQuietTime.Height = spcSub2.Panel1.Height - 64;
            aqPlotter.chtRawData.Width = spcSub2.Panel1.Width - 5;
            aqPlotter.chtRawData.Height = spcSub2.Panel1.Height - 64;
            aqPlotter.chtIVCurve.Width = spcSub2.Panel1.Width - 5;
            aqPlotter.chtIVCurve.Height = spcSub2.Panel1.Height - 64;
        }

        //Resize data window.
        private void spcSub2_SplitterMoved(object sender, SplitterEventArgs e)
        {
            //Resize chart area.
            aqPlotter.Width = spcSub2.Panel1.Width;
            aqPlotter.Height = spcSub2.Panel1.Height;
            aqPlotter.tbcPlotTabs.Width = spcSub2.Panel1.Width - 5;
            aqPlotter.tbcPlotTabs.Height = spcSub2.Panel1.Height - 64;

            //Resize charts
            aqPlotter.chtDeposition.Width = spcSub2.Panel1.Width - 5;
            aqPlotter.chtDeposition.Height = spcSub2.Panel1.Height - 64;
            aqPlotter.chtQuietTime.Width = spcSub2.Panel1.Width - 5;
            aqPlotter.chtQuietTime.Height = spcSub2.Panel1.Height - 64;
            aqPlotter.chtRawData.Width = spcSub2.Panel1.Width - 5;
            aqPlotter.chtRawData.Height = spcSub2.Panel1.Height - 64;
            aqPlotter.chtIVCurve.Width = spcSub2.Panel1.Width - 5;
            aqPlotter.chtIVCurve.Height = spcSub2.Panel1.Height - 64;

            //Resize data tree.
            dataTree.Width = spcSub2.Panel2.Width;
            dataTree.Height = spcSub2.Panel2.Height;
            dataTree.treData_Width(spcSub2.Panel2.Width);
            dataTree.treData_Height(spcSub2.Panel2.Height);
        }

        /******************************************Menu Functions*******************************************/

        //Pop-up communications settings window.
        private void menConnect_Click(object sender, EventArgs e)
        {
            //No data to send when first connecting to the device.
            txCount = 0;

            Connect c = new Connect(this);
            c.ShowDialog();
        }

        private void menDisconnect_Click(object sender, EventArgs e)
        {
            comCloser();
        }

        private void menSaveConsole_Click(object sender, EventArgs e)
        {
            //Create save file dialog for console window.
            SaveFileDialog consoleSave = new SaveFileDialog();
            consoleSave.Filter = "Text File|*.txt|MatLab File|*.m|All Files|*.*";
            consoleSave.Title = "Save Console Window Contents";
            consoleSave.ShowDialog();

            if (consoleSave.FileName != "")
            {
                File.WriteAllText(consoleSave.FileName, aqCon.rtbConsoleWindow_GetText());
            }
        }

        private void waveformDiagramToolStripMenuItem_Click(object sender, EventArgs e)
        {
            if (waveformEnable == true)
            {
                waveformEnable = false;
                waveformDiagramToolStripMenuItem.Image = null;
                wfHelper.waveformLoader();
            }
            else
            {
                waveformEnable = true;
                waveformDiagramToolStripMenuItem.Image = Properties.Resources.CheckMark2;
                wfHelper.waveformLoader();
            }
        }

        private void AquaSift_FormClosed(object sender, FormClosedEventArgs e)
        {
            BeginInvoke((MethodInvoker)delegate
            {
                rxState = rxStates.RX_IDLE;
                dTestPanel.updateTimer.Stop();
                sTestPanel.updateTimer.Stop();
                comCloser();
            });
        }

        /******************************************Config Functions*****************************************/

        private void cbx2Electrodes_Click(object sender, EventArgs e)
        {
            txData[0] = 0x02;
            txData[1] = 0x02;
            txCount = 2;

            validateDevice(this.cbx2Electrodes);
        }

        private void cbx3Electrodes_Click(object sender, EventArgs e)
        {
            txData[0] = 0x02;
            txData[1] = 0x03;
            txCount = 2;

            validateDevice(this.cbx3Electrodes);
        }

        private void cbx16ma_Click(object sender, EventArgs e)
        {
            txData[0] = 0x0B;
            txData[1] = 0x01;
            txCount = 2;

            validateDevice(this.cbx16ma);
        }

        private void cbx1_6ma_Click(object sender, EventArgs e)
        {
            txData[0] = 0x0B;
            txData[1] = 0x02;
            txCount = 2;

            validateDevice(this.cbx1_6ma);
        }

        private void cbx320ua_Click(object sender, EventArgs e)
        {
            txData[0] = 0x0B;
            txData[1] = 0x03;
            txCount = 2;

            validateDevice(this.cbx320ua);
        }

        private void cbx160ua_Click(object sender, EventArgs e)
        {
            txData[0] = 0x0B;
            txData[1] = 0x04;
            txCount = 2;

            validateDevice(this.cbx160ua);
        }

        private void cbx32ua_Click(object sender, EventArgs e)
        {
            txData[0] = 0x0B;
            txData[1] = 0x05;
            txCount = 2;

            validateDevice(this.cbx32ua);
        }

        private void cbx16ua_Click(object sender, EventArgs e)
        {
            txData[0] = 0x0B;
            txData[1] = 0x06;
            txCount = 2;

            validateDevice(this.cbx16ua);
        }

        private void cbxLPFDis_Click(object sender, EventArgs e)
        {
            txData[0] = 0x22;
            txData[1] = 0x00;
            txCount = 2;

            validateDevice(this.cbxLPFDis);
        }

        private void cbxLPF1_Click(object sender, EventArgs e)
        {
            txData[0] = 0x22;
            txData[1] = 0x01;
            txCount = 2;

            validateDevice(this.cbxLPF1);
        }

        private void cbxLPF5_Click(object sender, EventArgs e)
        {
            txData[0] = 0x22;
            txData[1] = 0x02;
            txCount = 2;

            validateDevice(this.cbxLPF5);
        }

        private void cbxLPF10_Click(object sender, EventArgs e)
        {
            txData[0] = 0x22;
            txData[1] = 0x03;
            txCount = 2;

            validateDevice(this.cbxLPF10);
        }

        private void cbxLPF50_Click(object sender, EventArgs e)
        {
            txData[0] = 0x22;
            txData[1] = 0x04;
            txCount = 2;

            validateDevice(this.cbxLPF50);
        }

        private void cbxLPF100_Click(object sender, EventArgs e)
        {
            txData[0] = 0x22;
            txData[1] = 0x05;
            txCount = 2;

            validateDevice(this.cbxLPF100);
        }

        private void cbxLPF150_Click(object sender, EventArgs e)
        {
            txData[0] = 0x22;
            txData[1] = 0x06;
            txCount = 2;

            validateDevice(this.cbxLPF150);
        }

        private void cbxLPF200_Click(object sender, EventArgs e)
        {
            txData[0] = 0x22;
            txData[1] = 0x07;
            txCount = 2;

            validateDevice(this.cbxLPF200);
        }

        private void tbxSampleRate_KeyDown(object sender, KeyEventArgs e)
        {
            UInt16 temp;

            if (e.KeyCode == Keys.Enter)
            {
                temp = (UInt16)tbxSampleRate.Value;
                
                txData[0] = 0x03;
                txData[1] = (byte)(temp >> 8);
                txData[2] = (byte)temp;
                txCount = 3;

                validateDevice(this.tbxSampleRate);

                //Stop annoying chime sound after every enter key press.
                e.Handled = true;
                e.SuppressKeyPress = true;
            }
        }

        private void tbxSampleRate_ValueChanged(object sender, EventArgs e)
        {
            UInt16 temp;

            temp = (UInt16)tbxSampleRate.Value;
            
            txData[0] = 0x03;
            txData[1] = (byte)(temp >> 8);
            txData[2] = (byte)temp;
            txCount = 3;

            validateDevice(this.tbxSampleRate);
        }

        private void rbtDepEnableYes_Enter(object sender, EventArgs e)
        {
            if (!rbtDepEnableYes.Checked)//Make sure the button is not already selected.
            {
                rbtDepEnableYes.Checked = true;

                txData[0] = 0x0C;
                txData[1] = 0x01;
                txCount = 2;

                validateDevice(this.rbtDepEnableYes);
            }
        }

        private void rbtDepEnableNo_Enter(object sender, EventArgs e)
        {
            if (!rbtDepEnableNo.Checked)//Make sure the button is not already selected.
            {
                rbtDepEnableNo.Checked = true;

                txData[0] = 0x0C;
                txData[1] = 0x00;
                txCount = 2;

                validateDevice(this.rbtDepEnableNo);
            }
        }

        private void rbtDepRecordYes_Enter(object sender, EventArgs e)
        {
            if (!rbtDepRecordYes.Checked)//Make sure the button is not already selected.
            {
                rbtDepRecordYes.Checked = true;

                txData[0] = 0x10;
                txData[1] = 0x01;
                txCount = 2;

                validateDevice(this.rbtDepRecordYes);
            }
        }

        private void rbtDepRecordNo_Enter(object sender, EventArgs e)
        {
            if (!rbtDepRecordNo.Checked)//Make sure the button is not already selected.
            {
                rbtDepRecordNo.Checked = true;

                txData[0] = 0x10;
                txData[1] = 0x00;
                txCount = 2;

                validateDevice(this.rbtDepRecordNo);
            }
        }

        private void tbxDepTime_ValueChanged(object sender, EventArgs e)
        {
            UInt32 temp;

            temp = (UInt32)tbxDepTime.Value;

            txData[0] = 0x0D;
            txData[1] = (byte)(temp >> 24);
            txData[2] = (byte)(temp >> 16);
            txData[3] = (byte)(temp >> 8);
            txData[4] = (byte)temp;
            txCount = 5;

            validateDevice(this.tbxDepTime);
        }

        private void tbxDepTime_KeyDown(object sender, KeyEventArgs e)
        {
            UInt32 temp;

            if (e.KeyCode == Keys.Enter)
            {
                temp = (UInt32)tbxDepTime.Value;
                
                txData[0] = 0x0D;
                txData[1] = (byte)(temp >> 24);
                txData[2] = (byte)(temp >> 16);
                txData[3] = (byte)(temp >> 8);
                txData[4] = (byte)temp;
                txCount = 5;

                validateDevice(this.tbxDepTime);

                //Stop annoying chime sound after every enter key press.
                e.Handled = true;
                e.SuppressKeyPress = true;
            }
        }

        private void tbxDepVolt_ValueChanged(object sender, EventArgs e)
        {
            Int16 temp;

            temp = (Int16)tbxDepVolt.Value;
            
            txData[0] = 0x0E;
            txData[1] = (byte)(temp >> 8);
            txData[2] = (byte)temp;
            txCount = 3;

            validateDevice(this.tbxDepVolt);
        }

        private void tbxDepVolt_KeyDown(object sender, KeyEventArgs e)
        {
            Int16 temp;

            if (e.KeyCode == Keys.Enter)
            {
                temp = (Int16)tbxDepVolt.Value;
                
                txData[0] = 0x0E;
                txData[1] = (byte)(temp >> 8);
                txData[2] = (byte)temp;
                txCount = 3;

                validateDevice(this.tbxDepVolt);

                //Stop annoying chime sound after every enter key press.
                e.Handled = true;
                e.SuppressKeyPress = true;
            }
        }

        private void tbxQuietTime_ValueChanged(object sender, EventArgs e)
        {
            UInt32 temp;

            temp = (UInt32)tbxQuietTime.Value;
            
            txData[0] = 0x0F;
            txData[1] = (byte)(temp >> 24);
            txData[2] = (byte)(temp >> 16);
            txData[3] = (byte)(temp >> 8);
            txData[4] = (byte)temp;
            txCount = 5;

            validateDevice(this.tbxQuietTime);
        }

        private void tbxQuietTime_KeyDown(object sender, KeyEventArgs e)
        {
            UInt32 temp;

            if (e.KeyCode == Keys.Enter)
            {
                temp = (UInt32)tbxQuietTime.Value;
                
                txData[0] = 0x0F;
                txData[1] = (byte)(temp >> 24);
                txData[2] = (byte)(temp >> 16);
                txData[3] = (byte)(temp >> 8);
                txData[4] = (byte)temp;
                txCount = 5;

                validateDevice(this.tbxQuietTime);

                //Stop annoying chime sound after every enter key press.
                e.Handled = true;
                e.SuppressKeyPress = true;
            }
        }

        private void cmbTestTypes_SelectedIndexChanged(object sender, EventArgs e)
        {
            if (cmbTestTypes.SelectedIndex == SELECTION_DIF_PULSE)
            {
                tabTests.Controls.Remove(cPointer);
                cPointer = dTestPanel;
                tabTests.Controls.Add(cPointer);

                //Load waveform diagram.
                wfHelper.waveformLoader();
                
            }
            else if (cmbTestTypes.SelectedIndex == SELECTION_LIN_SWEEP)
            {
                tabTests.Controls.Remove(cPointer);
                cPointer = sTestPanel;
                tabTests.Controls.Add(cPointer);

                //Load waveform diagram.
                wfHelper.waveformLoader();
            }
        }

        private void btnMatlab_Click(object sender, EventArgs e)
        {
            txData[0] = 0x01;
            txData[1] = 0x4D;
            txCount = 2;

            validateDevice(this.btnMatlab);
        }

        private void btnAscii_Click(object sender, EventArgs e)
        {
            txData[0] = 0x01;
            txData[1] = 0x41;
            txCount = 2;

            validateDevice(this.btnAscii);
        }

        private void tabControl1_SelectedIndexChanged(object sender, EventArgs e)
        {
            wfHelper.waveformLoader();
        }

        /*************************************GUI Interaction Functions*************************************/
        public void tbxSampleRate_SetText(String updateString)
        {
            if (this.tbxSampleRate.InvokeRequired) this.tbxSampleRate.BeginInvoke(new Action(() => tbxSampleRate_SetText(updateString)));
            else tbxSampleRate.Text = updateString;
        }

        private void spcSub2_Panel1_Paint(object sender, PaintEventArgs e)
        {

        }
    }
}
