namespace AquaSift_V_00_01
{
    partial class AquaSift
    {
        /// <summary>
        /// Required designer variable.
        /// </summary>
        private System.ComponentModel.IContainer components = null;

        /// <summary>
        /// Clean up any resources being used.
        /// </summary>
        /// <param name="disposing">true if managed resources should be disposed; otherwise, false.</param>
        protected override void Dispose(bool disposing)
        {
            if (disposing && (components != null))
            {
                components.Dispose();
            }
            base.Dispose(disposing);
        }

        #region Windows Form Designer generated code

        /// <summary>
        /// Required method for Designer support - do not modify
        /// the contents of this method with the code editor.
        /// </summary>
        private void InitializeComponent()
        {
            this.spcMain = new System.Windows.Forms.SplitContainer();
            this.spcSub1 = new System.Windows.Forms.SplitContainer();
            this.tabControl1 = new System.Windows.Forms.TabControl();
            this.tabDevice = new System.Windows.Forms.TabPage();
            this.gbxSampOutput = new System.Windows.Forms.GroupBox();
            this.tbxSampleRate = new System.Windows.Forms.NumericUpDown();
            this.lblSampOutput = new System.Windows.Forms.Label();
            this.gbxLPF = new System.Windows.Forms.GroupBox();
            this.cbxLPF200 = new System.Windows.Forms.CheckBox();
            this.cbxLPF150 = new System.Windows.Forms.CheckBox();
            this.cbxLPF100 = new System.Windows.Forms.CheckBox();
            this.cbxLPF50 = new System.Windows.Forms.CheckBox();
            this.cbxLPF10 = new System.Windows.Forms.CheckBox();
            this.cbxLPF5 = new System.Windows.Forms.CheckBox();
            this.cbxLPF1 = new System.Windows.Forms.CheckBox();
            this.cbxLPFDis = new System.Windows.Forms.CheckBox();
            this.gbxCurrentRange = new System.Windows.Forms.GroupBox();
            this.cbx16ua = new System.Windows.Forms.CheckBox();
            this.cbx32ua = new System.Windows.Forms.CheckBox();
            this.cbx160ua = new System.Windows.Forms.CheckBox();
            this.cbx320ua = new System.Windows.Forms.CheckBox();
            this.cbx1_6ma = new System.Windows.Forms.CheckBox();
            this.cbx16ma = new System.Windows.Forms.CheckBox();
            this.gbxElectrodeConfig = new System.Windows.Forms.GroupBox();
            this.cbx3Electrodes = new System.Windows.Forms.CheckBox();
            this.cbx2Electrodes = new System.Windows.Forms.CheckBox();
            this.tabDeposition = new System.Windows.Forms.TabPage();
            this.gbxDepEnable = new System.Windows.Forms.GroupBox();
            this.rbtDepEnableNo = new System.Windows.Forms.RadioButton();
            this.rbtDepEnableYes = new System.Windows.Forms.RadioButton();
            this.gbxDepRecord = new System.Windows.Forms.GroupBox();
            this.rbtDepRecordNo = new System.Windows.Forms.RadioButton();
            this.rbtDepRecordYes = new System.Windows.Forms.RadioButton();
            this.gbxDepTime = new System.Windows.Forms.GroupBox();
            this.tbxDepTime = new System.Windows.Forms.NumericUpDown();
            this.lblDepTime = new System.Windows.Forms.Label();
            this.gbxDepVolt = new System.Windows.Forms.GroupBox();
            this.tbxDepVolt = new System.Windows.Forms.NumericUpDown();
            this.lblDepVolt = new System.Windows.Forms.Label();
            this.gbxQuietTime = new System.Windows.Forms.GroupBox();
            this.tbxQuietTime = new System.Windows.Forms.NumericUpDown();
            this.lblQuietTime = new System.Windows.Forms.Label();
            this.tabTests = new System.Windows.Forms.TabPage();
            this.gbxTestType = new System.Windows.Forms.GroupBox();
            this.cmbTestTypes = new System.Windows.Forms.ComboBox();
            this.tabAdvanced = new System.Windows.Forms.TabPage();
            this.gbxDeviceMode = new System.Windows.Forms.GroupBox();
            this.btnAscii = new System.Windows.Forms.Button();
            this.btnMatlab = new System.Windows.Forms.Button();
            this.spcSub2 = new System.Windows.Forms.SplitContainer();
            this.strMain = new System.Windows.Forms.StatusStrip();
            this.lblCommunicationStatus = new System.Windows.Forms.ToolStripStatusLabel();
            this.lblDisconnected = new System.Windows.Forms.ToolStripStatusLabel();
            this.lblDeviceID = new System.Windows.Forms.ToolStripStatusLabel();
            this.lblDevice = new System.Windows.Forms.ToolStripStatusLabel();
            this.lblFirmwareRevision = new System.Windows.Forms.ToolStripStatusLabel();
            this.lblFirmware = new System.Windows.Forms.ToolStripStatusLabel();
            this.lblTestType = new System.Windows.Forms.ToolStripStatusLabel();
            this.lblTestTime = new System.Windows.Forms.ToolStripStatusLabel();
            this.menMain = new System.Windows.Forms.MenuStrip();
            this.fileToolStripMenuItem = new System.Windows.Forms.ToolStripMenuItem();
            this.menSaveConsole = new System.Windows.Forms.ToolStripMenuItem();
            this.menDevice = new System.Windows.Forms.ToolStripMenuItem();
            this.menConnect = new System.Windows.Forms.ToolStripMenuItem();
            this.menDisconnect = new System.Windows.Forms.ToolStripMenuItem();
            this.menOptions = new System.Windows.Forms.ToolStripMenuItem();
            this.waveformDiagramToolStripMenuItem = new System.Windows.Forms.ToolStripMenuItem();
            ((System.ComponentModel.ISupportInitialize)(this.spcMain)).BeginInit();
            this.spcMain.Panel1.SuspendLayout();
            this.spcMain.SuspendLayout();
            ((System.ComponentModel.ISupportInitialize)(this.spcSub1)).BeginInit();
            this.spcSub1.Panel1.SuspendLayout();
            this.spcSub1.Panel2.SuspendLayout();
            this.spcSub1.SuspendLayout();
            this.tabControl1.SuspendLayout();
            this.tabDevice.SuspendLayout();
            this.gbxSampOutput.SuspendLayout();
            ((System.ComponentModel.ISupportInitialize)(this.tbxSampleRate)).BeginInit();
            this.gbxLPF.SuspendLayout();
            this.gbxCurrentRange.SuspendLayout();
            this.gbxElectrodeConfig.SuspendLayout();
            this.tabDeposition.SuspendLayout();
            this.gbxDepEnable.SuspendLayout();
            this.gbxDepRecord.SuspendLayout();
            this.gbxDepTime.SuspendLayout();
            ((System.ComponentModel.ISupportInitialize)(this.tbxDepTime)).BeginInit();
            this.gbxDepVolt.SuspendLayout();
            ((System.ComponentModel.ISupportInitialize)(this.tbxDepVolt)).BeginInit();
            this.gbxQuietTime.SuspendLayout();
            ((System.ComponentModel.ISupportInitialize)(this.tbxQuietTime)).BeginInit();
            this.tabTests.SuspendLayout();
            this.gbxTestType.SuspendLayout();
            this.tabAdvanced.SuspendLayout();
            this.gbxDeviceMode.SuspendLayout();
            ((System.ComponentModel.ISupportInitialize)(this.spcSub2)).BeginInit();
            this.spcSub2.SuspendLayout();
            this.strMain.SuspendLayout();
            this.menMain.SuspendLayout();
            this.SuspendLayout();
            // 
            // spcMain
            // 
            this.spcMain.Location = new System.Drawing.Point(12, 28);
            this.spcMain.Name = "spcMain";
            this.spcMain.Orientation = System.Windows.Forms.Orientation.Horizontal;
            // 
            // spcMain.Panel1
            // 
            this.spcMain.Panel1.Controls.Add(this.spcSub1);
            // 
            // spcMain.Panel2
            // 
            this.spcMain.Panel2.AutoScroll = true;
            this.spcMain.Panel2.BackColor = System.Drawing.SystemColors.Control;
            this.spcMain.Size = new System.Drawing.Size(1123, 562);
            this.spcMain.SplitterDistance = 445;
            this.spcMain.TabIndex = 1;
            this.spcMain.SplitterMoved += new System.Windows.Forms.SplitterEventHandler(this.spcMain_SplitterMoved);
            // 
            // spcSub1
            // 
            this.spcSub1.Dock = System.Windows.Forms.DockStyle.Fill;
            this.spcSub1.Location = new System.Drawing.Point(0, 0);
            this.spcSub1.Name = "spcSub1";
            // 
            // spcSub1.Panel1
            // 
            this.spcSub1.Panel1.AutoScroll = true;
            this.spcSub1.Panel1.BackColor = System.Drawing.Color.White;
            this.spcSub1.Panel1.Controls.Add(this.tabControl1);
            // 
            // spcSub1.Panel2
            // 
            this.spcSub1.Panel2.Controls.Add(this.spcSub2);
            this.spcSub1.Size = new System.Drawing.Size(1123, 445);
            this.spcSub1.SplitterDistance = 244;
            this.spcSub1.TabIndex = 0;
            this.spcSub1.SplitterMoved += new System.Windows.Forms.SplitterEventHandler(this.spcSub1_SplitterMoved);
            // 
            // tabControl1
            // 
            this.tabControl1.Controls.Add(this.tabDevice);
            this.tabControl1.Controls.Add(this.tabDeposition);
            this.tabControl1.Controls.Add(this.tabTests);
            this.tabControl1.Controls.Add(this.tabAdvanced);
            this.tabControl1.Location = new System.Drawing.Point(3, 3);
            this.tabControl1.MinimumSize = new System.Drawing.Size(0, 550);
            this.tabControl1.Name = "tabControl1";
            this.tabControl1.SelectedIndex = 0;
            this.tabControl1.Size = new System.Drawing.Size(240, 650);
            this.tabControl1.TabIndex = 0;
            this.tabControl1.SelectedIndexChanged += new System.EventHandler(this.tabControl1_SelectedIndexChanged);
            // 
            // tabDevice
            // 
            this.tabDevice.BackColor = System.Drawing.SystemColors.Control;
            this.tabDevice.Controls.Add(this.gbxSampOutput);
            this.tabDevice.Controls.Add(this.gbxLPF);
            this.tabDevice.Controls.Add(this.gbxCurrentRange);
            this.tabDevice.Controls.Add(this.gbxElectrodeConfig);
            this.tabDevice.ForeColor = System.Drawing.SystemColors.ControlText;
            this.tabDevice.Location = new System.Drawing.Point(4, 22);
            this.tabDevice.Name = "tabDevice";
            this.tabDevice.Padding = new System.Windows.Forms.Padding(3);
            this.tabDevice.Size = new System.Drawing.Size(232, 624);
            this.tabDevice.TabIndex = 0;
            this.tabDevice.Text = "Device";
            // 
            // gbxSampOutput
            // 
            this.gbxSampOutput.Controls.Add(this.tbxSampleRate);
            this.gbxSampOutput.Controls.Add(this.lblSampOutput);
            this.gbxSampOutput.Location = new System.Drawing.Point(6, 325);
            this.gbxSampOutput.Name = "gbxSampOutput";
            this.gbxSampOutput.Size = new System.Drawing.Size(220, 49);
            this.gbxSampOutput.TabIndex = 15;
            this.gbxSampOutput.TabStop = false;
            this.gbxSampOutput.Text = "Sample Output Rate (ms)";
            // 
            // tbxSampleRate
            // 
            this.tbxSampleRate.Location = new System.Drawing.Point(126, 19);
            this.tbxSampleRate.Maximum = new decimal(new int[] {
            1000,
            0,
            0,
            0});
            this.tbxSampleRate.Minimum = new decimal(new int[] {
            1,
            0,
            0,
            0});
            this.tbxSampleRate.Name = "tbxSampleRate";
            this.tbxSampleRate.Size = new System.Drawing.Size(58, 20);
            this.tbxSampleRate.TabIndex = 5;
            this.tbxSampleRate.Value = new decimal(new int[] {
            1,
            0,
            0,
            0});
            this.tbxSampleRate.ValueChanged += new System.EventHandler(this.tbxSampleRate_ValueChanged);
            this.tbxSampleRate.KeyDown += new System.Windows.Forms.KeyEventHandler(this.tbxSampleRate_KeyDown);
            // 
            // lblSampOutput
            // 
            this.lblSampOutput.AutoSize = true;
            this.lblSampOutput.Location = new System.Drawing.Point(38, 21);
            this.lblSampOutput.Name = "lblSampOutput";
            this.lblSampOutput.Size = new System.Drawing.Size(55, 13);
            this.lblSampOutput.TabIndex = 4;
            this.lblSampOutput.Text = "1 to 1000:";
            // 
            // gbxLPF
            // 
            this.gbxLPF.Controls.Add(this.cbxLPF200);
            this.gbxLPF.Controls.Add(this.cbxLPF150);
            this.gbxLPF.Controls.Add(this.cbxLPF100);
            this.gbxLPF.Controls.Add(this.cbxLPF50);
            this.gbxLPF.Controls.Add(this.cbxLPF10);
            this.gbxLPF.Controls.Add(this.cbxLPF5);
            this.gbxLPF.Controls.Add(this.cbxLPF1);
            this.gbxLPF.Controls.Add(this.cbxLPFDis);
            this.gbxLPF.Location = new System.Drawing.Point(6, 182);
            this.gbxLPF.Name = "gbxLPF";
            this.gbxLPF.Size = new System.Drawing.Size(220, 137);
            this.gbxLPF.TabIndex = 14;
            this.gbxLPF.TabStop = false;
            this.gbxLPF.Text = "Digital Low Pass Filter Cutoff";
            // 
            // cbxLPF200
            // 
            this.cbxLPF200.Appearance = System.Windows.Forms.Appearance.Button;
            this.cbxLPF200.Location = new System.Drawing.Point(126, 106);
            this.cbxLPF200.Name = "cbxLPF200";
            this.cbxLPF200.Size = new System.Drawing.Size(68, 23);
            this.cbxLPF200.TabIndex = 7;
            this.cbxLPF200.Text = "200 Hz";
            this.cbxLPF200.TextAlign = System.Drawing.ContentAlignment.MiddleCenter;
            this.cbxLPF200.UseVisualStyleBackColor = true;
            this.cbxLPF200.Click += new System.EventHandler(this.cbxLPF200_Click);
            // 
            // cbxLPF150
            // 
            this.cbxLPF150.Appearance = System.Windows.Forms.Appearance.Button;
            this.cbxLPF150.Location = new System.Drawing.Point(25, 106);
            this.cbxLPF150.Name = "cbxLPF150";
            this.cbxLPF150.Size = new System.Drawing.Size(68, 23);
            this.cbxLPF150.TabIndex = 6;
            this.cbxLPF150.Text = "150 Hz";
            this.cbxLPF150.TextAlign = System.Drawing.ContentAlignment.MiddleCenter;
            this.cbxLPF150.UseVisualStyleBackColor = true;
            this.cbxLPF150.Click += new System.EventHandler(this.cbxLPF150_Click);
            // 
            // cbxLPF100
            // 
            this.cbxLPF100.Appearance = System.Windows.Forms.Appearance.Button;
            this.cbxLPF100.Location = new System.Drawing.Point(126, 77);
            this.cbxLPF100.Name = "cbxLPF100";
            this.cbxLPF100.Size = new System.Drawing.Size(68, 23);
            this.cbxLPF100.TabIndex = 5;
            this.cbxLPF100.Text = "100 Hz";
            this.cbxLPF100.TextAlign = System.Drawing.ContentAlignment.MiddleCenter;
            this.cbxLPF100.UseVisualStyleBackColor = true;
            this.cbxLPF100.Click += new System.EventHandler(this.cbxLPF100_Click);
            // 
            // cbxLPF50
            // 
            this.cbxLPF50.Appearance = System.Windows.Forms.Appearance.Button;
            this.cbxLPF50.Location = new System.Drawing.Point(25, 77);
            this.cbxLPF50.Name = "cbxLPF50";
            this.cbxLPF50.Size = new System.Drawing.Size(68, 23);
            this.cbxLPF50.TabIndex = 4;
            this.cbxLPF50.Text = "50Hz";
            this.cbxLPF50.TextAlign = System.Drawing.ContentAlignment.MiddleCenter;
            this.cbxLPF50.UseVisualStyleBackColor = true;
            this.cbxLPF50.Click += new System.EventHandler(this.cbxLPF50_Click);
            // 
            // cbxLPF10
            // 
            this.cbxLPF10.Appearance = System.Windows.Forms.Appearance.Button;
            this.cbxLPF10.Location = new System.Drawing.Point(126, 48);
            this.cbxLPF10.Name = "cbxLPF10";
            this.cbxLPF10.Size = new System.Drawing.Size(68, 23);
            this.cbxLPF10.TabIndex = 3;
            this.cbxLPF10.Text = "10 Hz";
            this.cbxLPF10.TextAlign = System.Drawing.ContentAlignment.MiddleCenter;
            this.cbxLPF10.UseVisualStyleBackColor = true;
            this.cbxLPF10.Click += new System.EventHandler(this.cbxLPF10_Click);
            // 
            // cbxLPF5
            // 
            this.cbxLPF5.Appearance = System.Windows.Forms.Appearance.Button;
            this.cbxLPF5.Location = new System.Drawing.Point(25, 48);
            this.cbxLPF5.Name = "cbxLPF5";
            this.cbxLPF5.Size = new System.Drawing.Size(68, 23);
            this.cbxLPF5.TabIndex = 2;
            this.cbxLPF5.Text = "5 Hz";
            this.cbxLPF5.TextAlign = System.Drawing.ContentAlignment.MiddleCenter;
            this.cbxLPF5.UseVisualStyleBackColor = true;
            this.cbxLPF5.Click += new System.EventHandler(this.cbxLPF5_Click);
            // 
            // cbxLPF1
            // 
            this.cbxLPF1.Appearance = System.Windows.Forms.Appearance.Button;
            this.cbxLPF1.Location = new System.Drawing.Point(126, 19);
            this.cbxLPF1.Name = "cbxLPF1";
            this.cbxLPF1.Size = new System.Drawing.Size(68, 23);
            this.cbxLPF1.TabIndex = 1;
            this.cbxLPF1.Text = "1 Hz";
            this.cbxLPF1.TextAlign = System.Drawing.ContentAlignment.MiddleCenter;
            this.cbxLPF1.UseVisualStyleBackColor = true;
            this.cbxLPF1.Click += new System.EventHandler(this.cbxLPF1_Click);
            // 
            // cbxLPFDis
            // 
            this.cbxLPFDis.Appearance = System.Windows.Forms.Appearance.Button;
            this.cbxLPFDis.Location = new System.Drawing.Point(25, 19);
            this.cbxLPFDis.Name = "cbxLPFDis";
            this.cbxLPFDis.Size = new System.Drawing.Size(68, 23);
            this.cbxLPFDis.TabIndex = 0;
            this.cbxLPFDis.Text = "Disabled";
            this.cbxLPFDis.TextAlign = System.Drawing.ContentAlignment.MiddleCenter;
            this.cbxLPFDis.UseVisualStyleBackColor = true;
            this.cbxLPFDis.Click += new System.EventHandler(this.cbxLPFDis_Click);
            // 
            // gbxCurrentRange
            // 
            this.gbxCurrentRange.Controls.Add(this.cbx16ua);
            this.gbxCurrentRange.Controls.Add(this.cbx32ua);
            this.gbxCurrentRange.Controls.Add(this.cbx160ua);
            this.gbxCurrentRange.Controls.Add(this.cbx320ua);
            this.gbxCurrentRange.Controls.Add(this.cbx1_6ma);
            this.gbxCurrentRange.Controls.Add(this.cbx16ma);
            this.gbxCurrentRange.Location = new System.Drawing.Point(6, 66);
            this.gbxCurrentRange.Name = "gbxCurrentRange";
            this.gbxCurrentRange.Size = new System.Drawing.Size(220, 110);
            this.gbxCurrentRange.TabIndex = 13;
            this.gbxCurrentRange.TabStop = false;
            this.gbxCurrentRange.Text = "Current Range";
            // 
            // cbx16ua
            // 
            this.cbx16ua.Appearance = System.Windows.Forms.Appearance.Button;
            this.cbx16ua.Location = new System.Drawing.Point(126, 77);
            this.cbx16ua.Name = "cbx16ua";
            this.cbx16ua.Size = new System.Drawing.Size(68, 23);
            this.cbx16ua.TabIndex = 5;
            this.cbx16ua.Text = "+/- 16 uA";
            this.cbx16ua.TextAlign = System.Drawing.ContentAlignment.MiddleCenter;
            this.cbx16ua.UseVisualStyleBackColor = true;
            this.cbx16ua.Click += new System.EventHandler(this.cbx16ua_Click);
            // 
            // cbx32ua
            // 
            this.cbx32ua.Appearance = System.Windows.Forms.Appearance.Button;
            this.cbx32ua.Location = new System.Drawing.Point(25, 77);
            this.cbx32ua.Name = "cbx32ua";
            this.cbx32ua.Size = new System.Drawing.Size(68, 23);
            this.cbx32ua.TabIndex = 4;
            this.cbx32ua.Text = "+/- 32 uA";
            this.cbx32ua.TextAlign = System.Drawing.ContentAlignment.MiddleCenter;
            this.cbx32ua.UseVisualStyleBackColor = true;
            this.cbx32ua.Click += new System.EventHandler(this.cbx32ua_Click);
            // 
            // cbx160ua
            // 
            this.cbx160ua.Appearance = System.Windows.Forms.Appearance.Button;
            this.cbx160ua.Location = new System.Drawing.Point(126, 48);
            this.cbx160ua.Name = "cbx160ua";
            this.cbx160ua.Size = new System.Drawing.Size(68, 23);
            this.cbx160ua.TabIndex = 3;
            this.cbx160ua.Text = "+/- 160 uA";
            this.cbx160ua.TextAlign = System.Drawing.ContentAlignment.MiddleCenter;
            this.cbx160ua.UseVisualStyleBackColor = true;
            this.cbx160ua.Click += new System.EventHandler(this.cbx160ua_Click);
            // 
            // cbx320ua
            // 
            this.cbx320ua.Appearance = System.Windows.Forms.Appearance.Button;
            this.cbx320ua.AutoSize = true;
            this.cbx320ua.Location = new System.Drawing.Point(25, 48);
            this.cbx320ua.Name = "cbx320ua";
            this.cbx320ua.Size = new System.Drawing.Size(68, 23);
            this.cbx320ua.TabIndex = 2;
            this.cbx320ua.Text = "+/- 320 uA";
            this.cbx320ua.TextAlign = System.Drawing.ContentAlignment.MiddleCenter;
            this.cbx320ua.UseVisualStyleBackColor = true;
            this.cbx320ua.Click += new System.EventHandler(this.cbx320ua_Click);
            // 
            // cbx1_6ma
            // 
            this.cbx1_6ma.Appearance = System.Windows.Forms.Appearance.Button;
            this.cbx1_6ma.Location = new System.Drawing.Point(126, 19);
            this.cbx1_6ma.Name = "cbx1_6ma";
            this.cbx1_6ma.Size = new System.Drawing.Size(68, 23);
            this.cbx1_6ma.TabIndex = 1;
            this.cbx1_6ma.Text = "+/- 1.6 mA";
            this.cbx1_6ma.TextAlign = System.Drawing.ContentAlignment.MiddleCenter;
            this.cbx1_6ma.UseVisualStyleBackColor = true;
            this.cbx1_6ma.Click += new System.EventHandler(this.cbx1_6ma_Click);
            // 
            // cbx16ma
            // 
            this.cbx16ma.Appearance = System.Windows.Forms.Appearance.Button;
            this.cbx16ma.Location = new System.Drawing.Point(25, 19);
            this.cbx16ma.Name = "cbx16ma";
            this.cbx16ma.Size = new System.Drawing.Size(68, 23);
            this.cbx16ma.TabIndex = 0;
            this.cbx16ma.Text = "+/- 16 mA";
            this.cbx16ma.TextAlign = System.Drawing.ContentAlignment.MiddleCenter;
            this.cbx16ma.UseVisualStyleBackColor = true;
            this.cbx16ma.Click += new System.EventHandler(this.cbx16ma_Click);
            // 
            // gbxElectrodeConfig
            // 
            this.gbxElectrodeConfig.Controls.Add(this.cbx3Electrodes);
            this.gbxElectrodeConfig.Controls.Add(this.cbx2Electrodes);
            this.gbxElectrodeConfig.Location = new System.Drawing.Point(6, 6);
            this.gbxElectrodeConfig.Name = "gbxElectrodeConfig";
            this.gbxElectrodeConfig.Size = new System.Drawing.Size(220, 54);
            this.gbxElectrodeConfig.TabIndex = 12;
            this.gbxElectrodeConfig.TabStop = false;
            this.gbxElectrodeConfig.Text = "Electrode Configuration";
            // 
            // cbx3Electrodes
            // 
            this.cbx3Electrodes.Appearance = System.Windows.Forms.Appearance.Button;
            this.cbx3Electrodes.Location = new System.Drawing.Point(126, 19);
            this.cbx3Electrodes.Name = "cbx3Electrodes";
            this.cbx3Electrodes.Size = new System.Drawing.Size(68, 23);
            this.cbx3Electrodes.TabIndex = 11;
            this.cbx3Electrodes.Text = "3";
            this.cbx3Electrodes.TextAlign = System.Drawing.ContentAlignment.MiddleCenter;
            this.cbx3Electrodes.UseVisualStyleBackColor = true;
            this.cbx3Electrodes.Click += new System.EventHandler(this.cbx3Electrodes_Click);
            // 
            // cbx2Electrodes
            // 
            this.cbx2Electrodes.Appearance = System.Windows.Forms.Appearance.Button;
            this.cbx2Electrodes.CheckAlign = System.Drawing.ContentAlignment.MiddleRight;
            this.cbx2Electrodes.Cursor = System.Windows.Forms.Cursors.Arrow;
            this.cbx2Electrodes.Location = new System.Drawing.Point(25, 19);
            this.cbx2Electrodes.Name = "cbx2Electrodes";
            this.cbx2Electrodes.Size = new System.Drawing.Size(68, 23);
            this.cbx2Electrodes.TabIndex = 10;
            this.cbx2Electrodes.Text = "2";
            this.cbx2Electrodes.TextAlign = System.Drawing.ContentAlignment.MiddleCenter;
            this.cbx2Electrodes.UseVisualStyleBackColor = true;
            this.cbx2Electrodes.Click += new System.EventHandler(this.cbx2Electrodes_Click);
            // 
            // tabDeposition
            // 
            this.tabDeposition.BackColor = System.Drawing.SystemColors.Control;
            this.tabDeposition.Controls.Add(this.gbxDepEnable);
            this.tabDeposition.Controls.Add(this.gbxDepRecord);
            this.tabDeposition.Controls.Add(this.gbxDepTime);
            this.tabDeposition.Controls.Add(this.gbxDepVolt);
            this.tabDeposition.Controls.Add(this.gbxQuietTime);
            this.tabDeposition.Location = new System.Drawing.Point(4, 22);
            this.tabDeposition.Name = "tabDeposition";
            this.tabDeposition.Padding = new System.Windows.Forms.Padding(3);
            this.tabDeposition.Size = new System.Drawing.Size(232, 624);
            this.tabDeposition.TabIndex = 1;
            this.tabDeposition.Text = "Deposition";
            // 
            // gbxDepEnable
            // 
            this.gbxDepEnable.Controls.Add(this.rbtDepEnableNo);
            this.gbxDepEnable.Controls.Add(this.rbtDepEnableYes);
            this.gbxDepEnable.Font = new System.Drawing.Font("Microsoft Sans Serif", 8.25F, System.Drawing.FontStyle.Regular, System.Drawing.GraphicsUnit.Point, ((byte)(0)));
            this.gbxDepEnable.Location = new System.Drawing.Point(6, 6);
            this.gbxDepEnable.Name = "gbxDepEnable";
            this.gbxDepEnable.RightToLeft = System.Windows.Forms.RightToLeft.No;
            this.gbxDepEnable.Size = new System.Drawing.Size(220, 54);
            this.gbxDepEnable.TabIndex = 0;
            this.gbxDepEnable.TabStop = false;
            this.gbxDepEnable.Text = "Enable Deposition";
            // 
            // rbtDepEnableNo
            // 
            this.rbtDepEnableNo.Appearance = System.Windows.Forms.Appearance.Button;
            this.rbtDepEnableNo.Location = new System.Drawing.Point(126, 19);
            this.rbtDepEnableNo.Name = "rbtDepEnableNo";
            this.rbtDepEnableNo.Size = new System.Drawing.Size(68, 23);
            this.rbtDepEnableNo.TabIndex = 1;
            this.rbtDepEnableNo.TabStop = true;
            this.rbtDepEnableNo.Text = "No";
            this.rbtDepEnableNo.TextAlign = System.Drawing.ContentAlignment.MiddleCenter;
            this.rbtDepEnableNo.UseVisualStyleBackColor = true;
            this.rbtDepEnableNo.Enter += new System.EventHandler(this.rbtDepEnableNo_Enter);
            // 
            // rbtDepEnableYes
            // 
            this.rbtDepEnableYes.Appearance = System.Windows.Forms.Appearance.Button;
            this.rbtDepEnableYes.Location = new System.Drawing.Point(25, 19);
            this.rbtDepEnableYes.Name = "rbtDepEnableYes";
            this.rbtDepEnableYes.Size = new System.Drawing.Size(68, 23);
            this.rbtDepEnableYes.TabIndex = 0;
            this.rbtDepEnableYes.TabStop = true;
            this.rbtDepEnableYes.Text = "Yes";
            this.rbtDepEnableYes.TextAlign = System.Drawing.ContentAlignment.MiddleCenter;
            this.rbtDepEnableYes.UseVisualStyleBackColor = true;
            this.rbtDepEnableYes.Enter += new System.EventHandler(this.rbtDepEnableYes_Enter);
            // 
            // gbxDepRecord
            // 
            this.gbxDepRecord.Controls.Add(this.rbtDepRecordNo);
            this.gbxDepRecord.Controls.Add(this.rbtDepRecordYes);
            this.gbxDepRecord.Font = new System.Drawing.Font("Microsoft Sans Serif", 8.25F, System.Drawing.FontStyle.Regular, System.Drawing.GraphicsUnit.Point, ((byte)(0)));
            this.gbxDepRecord.Location = new System.Drawing.Point(6, 66);
            this.gbxDepRecord.Name = "gbxDepRecord";
            this.gbxDepRecord.Size = new System.Drawing.Size(220, 54);
            this.gbxDepRecord.TabIndex = 1;
            this.gbxDepRecord.TabStop = false;
            this.gbxDepRecord.Text = "Record Deposition";
            // 
            // rbtDepRecordNo
            // 
            this.rbtDepRecordNo.Appearance = System.Windows.Forms.Appearance.Button;
            this.rbtDepRecordNo.Location = new System.Drawing.Point(126, 19);
            this.rbtDepRecordNo.Name = "rbtDepRecordNo";
            this.rbtDepRecordNo.Size = new System.Drawing.Size(68, 23);
            this.rbtDepRecordNo.TabIndex = 1;
            this.rbtDepRecordNo.TabStop = true;
            this.rbtDepRecordNo.Text = "No";
            this.rbtDepRecordNo.TextAlign = System.Drawing.ContentAlignment.MiddleCenter;
            this.rbtDepRecordNo.UseVisualStyleBackColor = true;
            this.rbtDepRecordNo.Enter += new System.EventHandler(this.rbtDepRecordNo_Enter);
            // 
            // rbtDepRecordYes
            // 
            this.rbtDepRecordYes.Appearance = System.Windows.Forms.Appearance.Button;
            this.rbtDepRecordYes.Location = new System.Drawing.Point(25, 19);
            this.rbtDepRecordYes.Name = "rbtDepRecordYes";
            this.rbtDepRecordYes.Size = new System.Drawing.Size(68, 23);
            this.rbtDepRecordYes.TabIndex = 0;
            this.rbtDepRecordYes.TabStop = true;
            this.rbtDepRecordYes.Text = "Yes";
            this.rbtDepRecordYes.TextAlign = System.Drawing.ContentAlignment.MiddleCenter;
            this.rbtDepRecordYes.UseVisualStyleBackColor = true;
            this.rbtDepRecordYes.Enter += new System.EventHandler(this.rbtDepRecordYes_Enter);
            // 
            // gbxDepTime
            // 
            this.gbxDepTime.Controls.Add(this.tbxDepTime);
            this.gbxDepTime.Controls.Add(this.lblDepTime);
            this.gbxDepTime.Font = new System.Drawing.Font("Microsoft Sans Serif", 8.25F, System.Drawing.FontStyle.Regular, System.Drawing.GraphicsUnit.Point, ((byte)(0)));
            this.gbxDepTime.Location = new System.Drawing.Point(6, 126);
            this.gbxDepTime.Name = "gbxDepTime";
            this.gbxDepTime.Size = new System.Drawing.Size(220, 54);
            this.gbxDepTime.TabIndex = 2;
            this.gbxDepTime.TabStop = false;
            this.gbxDepTime.Text = "Deposition Time (ms)";
            // 
            // tbxDepTime
            // 
            this.tbxDepTime.Location = new System.Drawing.Point(117, 21);
            this.tbxDepTime.Maximum = new decimal(new int[] {
            800000,
            0,
            0,
            0});
            this.tbxDepTime.Minimum = new decimal(new int[] {
            1,
            0,
            0,
            0});
            this.tbxDepTime.Name = "tbxDepTime";
            this.tbxDepTime.Size = new System.Drawing.Size(77, 20);
            this.tbxDepTime.TabIndex = 1;
            this.tbxDepTime.Value = new decimal(new int[] {
            1,
            0,
            0,
            0});
            this.tbxDepTime.ValueChanged += new System.EventHandler(this.tbxDepTime_ValueChanged);
            this.tbxDepTime.KeyDown += new System.Windows.Forms.KeyEventHandler(this.tbxDepTime_KeyDown);
            // 
            // lblDepTime
            // 
            this.lblDepTime.AutoSize = true;
            this.lblDepTime.Location = new System.Drawing.Point(22, 23);
            this.lblDepTime.Name = "lblDepTime";
            this.lblDepTime.Size = new System.Drawing.Size(67, 13);
            this.lblDepTime.TabIndex = 0;
            this.lblDepTime.Text = "1 to 800000:";
            // 
            // gbxDepVolt
            // 
            this.gbxDepVolt.Controls.Add(this.tbxDepVolt);
            this.gbxDepVolt.Controls.Add(this.lblDepVolt);
            this.gbxDepVolt.Font = new System.Drawing.Font("Microsoft Sans Serif", 8.25F, System.Drawing.FontStyle.Regular, System.Drawing.GraphicsUnit.Point, ((byte)(0)));
            this.gbxDepVolt.Location = new System.Drawing.Point(6, 186);
            this.gbxDepVolt.Name = "gbxDepVolt";
            this.gbxDepVolt.Size = new System.Drawing.Size(220, 54);
            this.gbxDepVolt.TabIndex = 3;
            this.gbxDepVolt.TabStop = false;
            this.gbxDepVolt.Text = "Deposition Voltage (mV)";
            // 
            // tbxDepVolt
            // 
            this.tbxDepVolt.Location = new System.Drawing.Point(117, 19);
            this.tbxDepVolt.Maximum = new decimal(new int[] {
            1650,
            0,
            0,
            0});
            this.tbxDepVolt.Minimum = new decimal(new int[] {
            1650,
            0,
            0,
            -2147483648});
            this.tbxDepVolt.Name = "tbxDepVolt";
            this.tbxDepVolt.Size = new System.Drawing.Size(77, 20);
            this.tbxDepVolt.TabIndex = 1;
            this.tbxDepVolt.ValueChanged += new System.EventHandler(this.tbxDepVolt_ValueChanged);
            this.tbxDepVolt.KeyDown += new System.Windows.Forms.KeyEventHandler(this.tbxDepVolt_KeyDown);
            // 
            // lblDepVolt
            // 
            this.lblDepVolt.AutoSize = true;
            this.lblDepVolt.Location = new System.Drawing.Point(22, 21);
            this.lblDepVolt.Name = "lblDepVolt";
            this.lblDepVolt.Size = new System.Drawing.Size(76, 13);
            this.lblDepVolt.TabIndex = 0;
            this.lblDepVolt.Text = "-1650 to 1650:";
            // 
            // gbxQuietTime
            // 
            this.gbxQuietTime.Controls.Add(this.tbxQuietTime);
            this.gbxQuietTime.Controls.Add(this.lblQuietTime);
            this.gbxQuietTime.Font = new System.Drawing.Font("Microsoft Sans Serif", 8.25F, System.Drawing.FontStyle.Regular, System.Drawing.GraphicsUnit.Point, ((byte)(0)));
            this.gbxQuietTime.Location = new System.Drawing.Point(6, 246);
            this.gbxQuietTime.Name = "gbxQuietTime";
            this.gbxQuietTime.Size = new System.Drawing.Size(220, 54);
            this.gbxQuietTime.TabIndex = 4;
            this.gbxQuietTime.TabStop = false;
            this.gbxQuietTime.Text = "Quiet Time (ms)";
            // 
            // tbxQuietTime
            // 
            this.tbxQuietTime.Location = new System.Drawing.Point(117, 19);
            this.tbxQuietTime.Maximum = new decimal(new int[] {
            800000,
            0,
            0,
            0});
            this.tbxQuietTime.Name = "tbxQuietTime";
            this.tbxQuietTime.Size = new System.Drawing.Size(77, 20);
            this.tbxQuietTime.TabIndex = 1;
            this.tbxQuietTime.ValueChanged += new System.EventHandler(this.tbxQuietTime_ValueChanged);
            this.tbxQuietTime.KeyDown += new System.Windows.Forms.KeyEventHandler(this.tbxQuietTime_KeyDown);
            // 
            // lblQuietTime
            // 
            this.lblQuietTime.AutoSize = true;
            this.lblQuietTime.Location = new System.Drawing.Point(22, 21);
            this.lblQuietTime.Name = "lblQuietTime";
            this.lblQuietTime.Size = new System.Drawing.Size(67, 13);
            this.lblQuietTime.TabIndex = 0;
            this.lblQuietTime.Text = "0 to 800000:";
            // 
            // tabTests
            // 
            this.tabTests.BackColor = System.Drawing.SystemColors.Control;
            this.tabTests.Controls.Add(this.gbxTestType);
            this.tabTests.Location = new System.Drawing.Point(4, 22);
            this.tabTests.Name = "tabTests";
            this.tabTests.Size = new System.Drawing.Size(232, 624);
            this.tabTests.TabIndex = 2;
            this.tabTests.Text = "Tests";
            // 
            // gbxTestType
            // 
            this.gbxTestType.Controls.Add(this.cmbTestTypes);
            this.gbxTestType.Location = new System.Drawing.Point(6, 6);
            this.gbxTestType.Name = "gbxTestType";
            this.gbxTestType.Size = new System.Drawing.Size(220, 54);
            this.gbxTestType.TabIndex = 13;
            this.gbxTestType.TabStop = false;
            this.gbxTestType.Text = "Test Type";
            // 
            // cmbTestTypes
            // 
            this.cmbTestTypes.DropDownStyle = System.Windows.Forms.ComboBoxStyle.DropDownList;
            this.cmbTestTypes.Font = new System.Drawing.Font("Microsoft Sans Serif", 8.25F, System.Drawing.FontStyle.Regular, System.Drawing.GraphicsUnit.Point, ((byte)(0)));
            this.cmbTestTypes.FormattingEnabled = true;
            this.cmbTestTypes.Items.AddRange(new object[] {
            "Differential Pulse",
            "Linear Sweep"});
            this.cmbTestTypes.Location = new System.Drawing.Point(6, 19);
            this.cmbTestTypes.Name = "cmbTestTypes";
            this.cmbTestTypes.Size = new System.Drawing.Size(208, 21);
            this.cmbTestTypes.TabIndex = 12;
            this.cmbTestTypes.SelectedIndexChanged += new System.EventHandler(this.cmbTestTypes_SelectedIndexChanged);
            // 
            // tabAdvanced
            // 
            this.tabAdvanced.BackColor = System.Drawing.SystemColors.Control;
            this.tabAdvanced.Controls.Add(this.gbxDeviceMode);
            this.tabAdvanced.Location = new System.Drawing.Point(4, 22);
            this.tabAdvanced.Name = "tabAdvanced";
            this.tabAdvanced.Size = new System.Drawing.Size(232, 624);
            this.tabAdvanced.TabIndex = 3;
            this.tabAdvanced.Text = "Advanced";
            // 
            // gbxDeviceMode
            // 
            this.gbxDeviceMode.Controls.Add(this.btnAscii);
            this.gbxDeviceMode.Controls.Add(this.btnMatlab);
            this.gbxDeviceMode.Location = new System.Drawing.Point(6, 6);
            this.gbxDeviceMode.Name = "gbxDeviceMode";
            this.gbxDeviceMode.Size = new System.Drawing.Size(220, 54);
            this.gbxDeviceMode.TabIndex = 0;
            this.gbxDeviceMode.TabStop = false;
            this.gbxDeviceMode.Text = "Device Transmission Mode";
            // 
            // btnAscii
            // 
            this.btnAscii.Location = new System.Drawing.Point(126, 19);
            this.btnAscii.Name = "btnAscii";
            this.btnAscii.Size = new System.Drawing.Size(68, 23);
            this.btnAscii.TabIndex = 1;
            this.btnAscii.Text = "ASCII";
            this.btnAscii.UseVisualStyleBackColor = true;
            this.btnAscii.Click += new System.EventHandler(this.btnAscii_Click);
            // 
            // btnMatlab
            // 
            this.btnMatlab.Location = new System.Drawing.Point(25, 19);
            this.btnMatlab.Name = "btnMatlab";
            this.btnMatlab.Size = new System.Drawing.Size(68, 23);
            this.btnMatlab.TabIndex = 0;
            this.btnMatlab.Text = "MatLab";
            this.btnMatlab.UseVisualStyleBackColor = true;
            this.btnMatlab.Click += new System.EventHandler(this.btnMatlab_Click);
            // 
            // spcSub2
            // 
            this.spcSub2.Dock = System.Windows.Forms.DockStyle.Fill;
            this.spcSub2.Location = new System.Drawing.Point(0, 0);
            this.spcSub2.Name = "spcSub2";
            // 
            // spcSub2.Panel1
            // 
            this.spcSub2.Panel1.AutoScroll = true;
            this.spcSub2.Panel1.BackColor = System.Drawing.Color.White;
            this.spcSub2.Panel1.BackgroundImageLayout = System.Windows.Forms.ImageLayout.None;
            this.spcSub2.Panel1.Paint += new System.Windows.Forms.PaintEventHandler(this.spcSub2_Panel1_Paint);
            // 
            // spcSub2.Panel2
            // 
            this.spcSub2.Panel2.AutoScroll = true;
            this.spcSub2.Panel2.BackColor = System.Drawing.Color.White;
            this.spcSub2.Size = new System.Drawing.Size(875, 445);
            this.spcSub2.SplitterDistance = 721;
            this.spcSub2.TabIndex = 0;
            this.spcSub2.SplitterMoved += new System.Windows.Forms.SplitterEventHandler(this.spcSub2_SplitterMoved);
            // 
            // strMain
            // 
            this.strMain.Items.AddRange(new System.Windows.Forms.ToolStripItem[] {
            this.lblCommunicationStatus,
            this.lblDisconnected,
            this.lblDeviceID,
            this.lblDevice,
            this.lblFirmwareRevision,
            this.lblFirmware,
            this.lblTestType,
            this.lblTestTime});
            this.strMain.Location = new System.Drawing.Point(0, 591);
            this.strMain.Name = "strMain";
            this.strMain.Size = new System.Drawing.Size(1135, 24);
            this.strMain.TabIndex = 2;
            this.strMain.Text = "statusStrip1";
            // 
            // lblCommunicationStatus
            // 
            this.lblCommunicationStatus.Name = "lblCommunicationStatus";
            this.lblCommunicationStatus.Size = new System.Drawing.Size(132, 19);
            this.lblCommunicationStatus.Text = "Communication Status:";
            // 
            // lblDisconnected
            // 
            this.lblDisconnected.BorderSides = ((System.Windows.Forms.ToolStripStatusLabelBorderSides)((((System.Windows.Forms.ToolStripStatusLabelBorderSides.Left | System.Windows.Forms.ToolStripStatusLabelBorderSides.Top) 
            | System.Windows.Forms.ToolStripStatusLabelBorderSides.Right) 
            | System.Windows.Forms.ToolStripStatusLabelBorderSides.Bottom)));
            this.lblDisconnected.BorderStyle = System.Windows.Forms.Border3DStyle.Sunken;
            this.lblDisconnected.ForeColor = System.Drawing.Color.Red;
            this.lblDisconnected.Name = "lblDisconnected";
            this.lblDisconnected.Size = new System.Drawing.Size(83, 19);
            this.lblDisconnected.Text = "Disconnected";
            // 
            // lblDeviceID
            // 
            this.lblDeviceID.Name = "lblDeviceID";
            this.lblDeviceID.Size = new System.Drawing.Size(59, 19);
            this.lblDeviceID.Text = "Device ID:";
            // 
            // lblDevice
            // 
            this.lblDevice.BorderSides = ((System.Windows.Forms.ToolStripStatusLabelBorderSides)((((System.Windows.Forms.ToolStripStatusLabelBorderSides.Left | System.Windows.Forms.ToolStripStatusLabelBorderSides.Top) 
            | System.Windows.Forms.ToolStripStatusLabelBorderSides.Right) 
            | System.Windows.Forms.ToolStripStatusLabelBorderSides.Bottom)));
            this.lblDevice.BorderStyle = System.Windows.Forms.Border3DStyle.Sunken;
            this.lblDevice.Name = "lblDevice";
            this.lblDevice.Size = new System.Drawing.Size(44, 19);
            this.lblDevice.Text = "NONE";
            // 
            // lblFirmwareRevision
            // 
            this.lblFirmwareRevision.Name = "lblFirmwareRevision";
            this.lblFirmwareRevision.Size = new System.Drawing.Size(106, 19);
            this.lblFirmwareRevision.Text = "Firmware Revision:";
            // 
            // lblFirmware
            // 
            this.lblFirmware.BorderSides = ((System.Windows.Forms.ToolStripStatusLabelBorderSides)((((System.Windows.Forms.ToolStripStatusLabelBorderSides.Left | System.Windows.Forms.ToolStripStatusLabelBorderSides.Top) 
            | System.Windows.Forms.ToolStripStatusLabelBorderSides.Right) 
            | System.Windows.Forms.ToolStripStatusLabelBorderSides.Bottom)));
            this.lblFirmware.BorderStyle = System.Windows.Forms.Border3DStyle.Sunken;
            this.lblFirmware.Name = "lblFirmware";
            this.lblFirmware.Size = new System.Drawing.Size(44, 19);
            this.lblFirmware.Text = "NONE";
            // 
            // lblTestType
            // 
            this.lblTestType.Name = "lblTestType";
            this.lblTestType.Size = new System.Drawing.Size(58, 19);
            this.lblTestType.Text = "Test Type";
            this.lblTestType.Visible = false;
            // 
            // lblTestTime
            // 
            this.lblTestTime.BorderSides = ((System.Windows.Forms.ToolStripStatusLabelBorderSides)((((System.Windows.Forms.ToolStripStatusLabelBorderSides.Left | System.Windows.Forms.ToolStripStatusLabelBorderSides.Top) 
            | System.Windows.Forms.ToolStripStatusLabelBorderSides.Right) 
            | System.Windows.Forms.ToolStripStatusLabelBorderSides.Bottom)));
            this.lblTestTime.BorderStyle = System.Windows.Forms.Border3DStyle.Sunken;
            this.lblTestTime.Name = "lblTestTime";
            this.lblTestTime.Size = new System.Drawing.Size(41, 19);
            this.lblTestTime.Text = "          ";
            this.lblTestTime.Visible = false;
            // 
            // menMain
            // 
            this.menMain.Items.AddRange(new System.Windows.Forms.ToolStripItem[] {
            this.fileToolStripMenuItem,
            this.menDevice,
            this.menOptions});
            this.menMain.Location = new System.Drawing.Point(0, 0);
            this.menMain.Name = "menMain";
            this.menMain.Size = new System.Drawing.Size(1135, 24);
            this.menMain.TabIndex = 3;
            this.menMain.Text = "menuStrip1";
            // 
            // fileToolStripMenuItem
            // 
            this.fileToolStripMenuItem.DropDownItems.AddRange(new System.Windows.Forms.ToolStripItem[] {
            this.menSaveConsole});
            this.fileToolStripMenuItem.Name = "fileToolStripMenuItem";
            this.fileToolStripMenuItem.Size = new System.Drawing.Size(37, 20);
            this.fileToolStripMenuItem.Text = "File";
            // 
            // menSaveConsole
            // 
            this.menSaveConsole.Name = "menSaveConsole";
            this.menSaveConsole.Size = new System.Drawing.Size(144, 22);
            this.menSaveConsole.Text = "Save Console";
            this.menSaveConsole.Click += new System.EventHandler(this.menSaveConsole_Click);
            // 
            // menDevice
            // 
            this.menDevice.DropDownItems.AddRange(new System.Windows.Forms.ToolStripItem[] {
            this.menConnect,
            this.menDisconnect});
            this.menDevice.Name = "menDevice";
            this.menDevice.Size = new System.Drawing.Size(54, 20);
            this.menDevice.Text = "Device";
            // 
            // menConnect
            // 
            this.menConnect.Name = "menConnect";
            this.menConnect.Size = new System.Drawing.Size(133, 22);
            this.menConnect.Text = "Connect";
            this.menConnect.Click += new System.EventHandler(this.menConnect_Click);
            // 
            // menDisconnect
            // 
            this.menDisconnect.Enabled = false;
            this.menDisconnect.Name = "menDisconnect";
            this.menDisconnect.Size = new System.Drawing.Size(133, 22);
            this.menDisconnect.Text = "Disconnect";
            this.menDisconnect.Click += new System.EventHandler(this.menDisconnect_Click);
            // 
            // menOptions
            // 
            this.menOptions.DropDownItems.AddRange(new System.Windows.Forms.ToolStripItem[] {
            this.waveformDiagramToolStripMenuItem});
            this.menOptions.Name = "menOptions";
            this.menOptions.Size = new System.Drawing.Size(44, 20);
            this.menOptions.Text = "View";
            // 
            // waveformDiagramToolStripMenuItem
            // 
            this.waveformDiagramToolStripMenuItem.Image = global::AquaSift_V_00_01.Properties.Resources.CheckMark2;
            this.waveformDiagramToolStripMenuItem.ImageTransparentColor = System.Drawing.Color.White;
            this.waveformDiagramToolStripMenuItem.Name = "waveformDiagramToolStripMenuItem";
            this.waveformDiagramToolStripMenuItem.Size = new System.Drawing.Size(177, 22);
            this.waveformDiagramToolStripMenuItem.Text = "Waveform Diagram";
            this.waveformDiagramToolStripMenuItem.Click += new System.EventHandler(this.waveformDiagramToolStripMenuItem_Click);
            // 
            // AquaSift
            // 
            this.AutoScaleDimensions = new System.Drawing.SizeF(6F, 13F);
            this.AutoScaleMode = System.Windows.Forms.AutoScaleMode.Font;
            this.ClientSize = new System.Drawing.Size(1135, 615);
            this.Controls.Add(this.strMain);
            this.Controls.Add(this.menMain);
            this.Controls.Add(this.spcMain);
            this.MainMenuStrip = this.menMain;
            this.Name = "AquaSift";
            this.Text = "AquaSift Interface V 00.01";
            this.WindowState = System.Windows.Forms.FormWindowState.Maximized;
            this.FormClosed += new System.Windows.Forms.FormClosedEventHandler(this.AquaSift_FormClosed);
            this.Resize += new System.EventHandler(this.AquaSift_Resize);
            this.spcMain.Panel1.ResumeLayout(false);
            ((System.ComponentModel.ISupportInitialize)(this.spcMain)).EndInit();
            this.spcMain.ResumeLayout(false);
            this.spcSub1.Panel1.ResumeLayout(false);
            this.spcSub1.Panel2.ResumeLayout(false);
            ((System.ComponentModel.ISupportInitialize)(this.spcSub1)).EndInit();
            this.spcSub1.ResumeLayout(false);
            this.tabControl1.ResumeLayout(false);
            this.tabDevice.ResumeLayout(false);
            this.gbxSampOutput.ResumeLayout(false);
            this.gbxSampOutput.PerformLayout();
            ((System.ComponentModel.ISupportInitialize)(this.tbxSampleRate)).EndInit();
            this.gbxLPF.ResumeLayout(false);
            this.gbxCurrentRange.ResumeLayout(false);
            this.gbxCurrentRange.PerformLayout();
            this.gbxElectrodeConfig.ResumeLayout(false);
            this.tabDeposition.ResumeLayout(false);
            this.gbxDepEnable.ResumeLayout(false);
            this.gbxDepRecord.ResumeLayout(false);
            this.gbxDepTime.ResumeLayout(false);
            this.gbxDepTime.PerformLayout();
            ((System.ComponentModel.ISupportInitialize)(this.tbxDepTime)).EndInit();
            this.gbxDepVolt.ResumeLayout(false);
            this.gbxDepVolt.PerformLayout();
            ((System.ComponentModel.ISupportInitialize)(this.tbxDepVolt)).EndInit();
            this.gbxQuietTime.ResumeLayout(false);
            this.gbxQuietTime.PerformLayout();
            ((System.ComponentModel.ISupportInitialize)(this.tbxQuietTime)).EndInit();
            this.tabTests.ResumeLayout(false);
            this.gbxTestType.ResumeLayout(false);
            this.tabAdvanced.ResumeLayout(false);
            this.gbxDeviceMode.ResumeLayout(false);
            ((System.ComponentModel.ISupportInitialize)(this.spcSub2)).EndInit();
            this.spcSub2.ResumeLayout(false);
            this.strMain.ResumeLayout(false);
            this.strMain.PerformLayout();
            this.menMain.ResumeLayout(false);
            this.menMain.PerformLayout();
            this.ResumeLayout(false);
            this.PerformLayout();

        }

        #endregion
        private System.Windows.Forms.SplitContainer spcMain;
        private System.Windows.Forms.SplitContainer spcSub1;
        public System.Windows.Forms.SplitContainer spcSub2;
        private System.Windows.Forms.StatusStrip strMain;
        private System.Windows.Forms.ToolStripStatusLabel lblCommunicationStatus;
        public System.Windows.Forms.MenuStrip menMain;
        private System.Windows.Forms.ToolStripMenuItem fileToolStripMenuItem;
        private System.Windows.Forms.ToolStripMenuItem menDevice;
        public System.Windows.Forms.ToolStripMenuItem menConnect;
        private System.Windows.Forms.ToolStripMenuItem menOptions;
        public System.Windows.Forms.ToolStripStatusLabel lblDisconnected;
        private System.Windows.Forms.ToolStripStatusLabel lblDeviceID;
        public System.Windows.Forms.ToolStripStatusLabel lblDevice;
        private System.Windows.Forms.ToolStripStatusLabel lblFirmwareRevision;
        public System.Windows.Forms.ToolStripStatusLabel lblFirmware;
        public System.Windows.Forms.ToolStripMenuItem menDisconnect;
        private System.Windows.Forms.ToolStripMenuItem menSaveConsole;
        public System.Windows.Forms.TabControl tabControl1;
        public System.Windows.Forms.TabPage tabDevice;
        public System.Windows.Forms.TabPage tabDeposition;
        public System.Windows.Forms.CheckBox cbx2Electrodes;
        public System.Windows.Forms.CheckBox cbx3Electrodes;
        private System.Windows.Forms.GroupBox gbxElectrodeConfig;
        private System.Windows.Forms.GroupBox gbxCurrentRange;
        public System.Windows.Forms.CheckBox cbx16ua;
        public System.Windows.Forms.CheckBox cbx32ua;
        public System.Windows.Forms.CheckBox cbx160ua;
        public System.Windows.Forms.CheckBox cbx320ua;
        public System.Windows.Forms.CheckBox cbx1_6ma;
        public System.Windows.Forms.CheckBox cbx16ma;
        private System.Windows.Forms.GroupBox gbxLPF;
        public System.Windows.Forms.CheckBox cbxLPF50;
        public System.Windows.Forms.CheckBox cbxLPF10;
        public System.Windows.Forms.CheckBox cbxLPF5;
        public System.Windows.Forms.CheckBox cbxLPF1;
        public System.Windows.Forms.CheckBox cbxLPFDis;
        public System.Windows.Forms.CheckBox cbxLPF200;
        public System.Windows.Forms.CheckBox cbxLPF150;
        public System.Windows.Forms.CheckBox cbxLPF100;
        private System.Windows.Forms.GroupBox gbxSampOutput;
        private System.Windows.Forms.Label lblSampOutput;
        private System.Windows.Forms.NumericUpDown tbxSampleRate;
        private System.Windows.Forms.GroupBox gbxDepEnable;
        private System.Windows.Forms.GroupBox gbxDepRecord;
        public System.Windows.Forms.RadioButton rbtDepEnableNo;
        public System.Windows.Forms.RadioButton rbtDepEnableYes;
        public System.Windows.Forms.RadioButton rbtDepRecordNo;
        public System.Windows.Forms.RadioButton rbtDepRecordYes;
        private System.Windows.Forms.GroupBox gbxQuietTime;
        private System.Windows.Forms.GroupBox gbxDepVolt;
        private System.Windows.Forms.GroupBox gbxDepTime;
        public System.Windows.Forms.NumericUpDown tbxDepTime;
        private System.Windows.Forms.Label lblDepTime;
        public System.Windows.Forms.NumericUpDown tbxQuietTime;
        private System.Windows.Forms.Label lblQuietTime;
        public System.Windows.Forms.NumericUpDown tbxDepVolt;
        private System.Windows.Forms.Label lblDepVolt;
        public System.Windows.Forms.TabPage tabTests;
        public System.Windows.Forms.TabPage tabAdvanced;
        public System.Windows.Forms.ComboBox cmbTestTypes;
        public System.Windows.Forms.GroupBox gbxTestType;
        private System.Windows.Forms.ToolStripMenuItem waveformDiagramToolStripMenuItem;
        private System.Windows.Forms.GroupBox gbxDeviceMode;
        public System.Windows.Forms.Button btnAscii;
        public System.Windows.Forms.Button btnMatlab;
        public System.Windows.Forms.ToolStripStatusLabel lblTestType;
        public System.Windows.Forms.ToolStripStatusLabel lblTestTime;
    }
}

