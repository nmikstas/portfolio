namespace AquaSift_V_00_01
{
    partial class Connect
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
            this.lblComPort = new System.Windows.Forms.Label();
            this.cmbComPort = new System.Windows.Forms.ComboBox();
            this.btnRefresh = new System.Windows.Forms.Button();
            this.lblBaudRate = new System.Windows.Forms.Label();
            this.lblDataBits = new System.Windows.Forms.Label();
            this.lblParity = new System.Windows.Forms.Label();
            this.lblStopBits = new System.Windows.Forms.Label();
            this.lblFlowControl = new System.Windows.Forms.Label();
            this.cmbBaudRate = new System.Windows.Forms.ComboBox();
            this.cmbDataBits = new System.Windows.Forms.ComboBox();
            this.cmbParity = new System.Windows.Forms.ComboBox();
            this.cmbStopBits = new System.Windows.Forms.ComboBox();
            this.cmbFlowControl = new System.Windows.Forms.ComboBox();
            this.btnConnect = new System.Windows.Forms.Button();
            this.SuspendLayout();
            // 
            // lblComPort
            // 
            this.lblComPort.AutoSize = true;
            this.lblComPort.Location = new System.Drawing.Point(17, 15);
            this.lblComPort.Name = "lblComPort";
            this.lblComPort.Size = new System.Drawing.Size(56, 13);
            this.lblComPort.TabIndex = 0;
            this.lblComPort.Text = "COM Port:";
            // 
            // cmbComPort
            // 
            this.cmbComPort.FormattingEnabled = true;
            this.cmbComPort.Location = new System.Drawing.Point(79, 12);
            this.cmbComPort.Name = "cmbComPort";
            this.cmbComPort.Size = new System.Drawing.Size(119, 21);
            this.cmbComPort.TabIndex = 1;
            // 
            // btnRefresh
            // 
            this.btnRefresh.Location = new System.Drawing.Point(86, 174);
            this.btnRefresh.Name = "btnRefresh";
            this.btnRefresh.Size = new System.Drawing.Size(112, 30);
            this.btnRefresh.TabIndex = 7;
            this.btnRefresh.Text = "Refresh COM Ports";
            this.btnRefresh.UseVisualStyleBackColor = true;
            this.btnRefresh.Click += new System.EventHandler(this.btnRefresh_Click);
            // 
            // lblBaudRate
            // 
            this.lblBaudRate.AutoSize = true;
            this.lblBaudRate.Location = new System.Drawing.Point(12, 42);
            this.lblBaudRate.Name = "lblBaudRate";
            this.lblBaudRate.Size = new System.Drawing.Size(61, 13);
            this.lblBaudRate.TabIndex = 3;
            this.lblBaudRate.Text = "Baud Rate:";
            // 
            // lblDataBits
            // 
            this.lblDataBits.AutoSize = true;
            this.lblDataBits.Location = new System.Drawing.Point(20, 69);
            this.lblDataBits.Name = "lblDataBits";
            this.lblDataBits.Size = new System.Drawing.Size(53, 13);
            this.lblDataBits.TabIndex = 4;
            this.lblDataBits.Text = "Data Bits:";
            // 
            // lblParity
            // 
            this.lblParity.AutoSize = true;
            this.lblParity.Location = new System.Drawing.Point(37, 96);
            this.lblParity.Name = "lblParity";
            this.lblParity.Size = new System.Drawing.Size(36, 13);
            this.lblParity.TabIndex = 5;
            this.lblParity.Text = "Parity:";
            // 
            // lblStopBits
            // 
            this.lblStopBits.AutoSize = true;
            this.lblStopBits.Location = new System.Drawing.Point(21, 123);
            this.lblStopBits.Name = "lblStopBits";
            this.lblStopBits.Size = new System.Drawing.Size(52, 13);
            this.lblStopBits.TabIndex = 6;
            this.lblStopBits.Text = "Stop Bits:";
            // 
            // lblFlowControl
            // 
            this.lblFlowControl.AutoSize = true;
            this.lblFlowControl.Location = new System.Drawing.Point(5, 150);
            this.lblFlowControl.Name = "lblFlowControl";
            this.lblFlowControl.Size = new System.Drawing.Size(68, 13);
            this.lblFlowControl.TabIndex = 7;
            this.lblFlowControl.Text = "Flow Control:";
            // 
            // cmbBaudRate
            // 
            this.cmbBaudRate.FormattingEnabled = true;
            this.cmbBaudRate.Items.AddRange(new object[] {
            "2400",
            "4800",
            "9600",
            "19200",
            "38400",
            "57600",
            "115200",
            "230400",
            "460800"});
            this.cmbBaudRate.Location = new System.Drawing.Point(79, 39);
            this.cmbBaudRate.Name = "cmbBaudRate";
            this.cmbBaudRate.Size = new System.Drawing.Size(119, 21);
            this.cmbBaudRate.TabIndex = 2;
            // 
            // cmbDataBits
            // 
            this.cmbDataBits.FormattingEnabled = true;
            this.cmbDataBits.Items.AddRange(new object[] {
            "5",
            "6",
            "7",
            "8"});
            this.cmbDataBits.Location = new System.Drawing.Point(79, 66);
            this.cmbDataBits.Name = "cmbDataBits";
            this.cmbDataBits.Size = new System.Drawing.Size(119, 21);
            this.cmbDataBits.TabIndex = 3;
            // 
            // cmbParity
            // 
            this.cmbParity.FormattingEnabled = true;
            this.cmbParity.Items.AddRange(new object[] {
            "NONE",
            "ODD",
            "EVEN",
            "MARK",
            "SPACE"});
            this.cmbParity.Location = new System.Drawing.Point(79, 93);
            this.cmbParity.Name = "cmbParity";
            this.cmbParity.Size = new System.Drawing.Size(119, 21);
            this.cmbParity.TabIndex = 4;
            // 
            // cmbStopBits
            // 
            this.cmbStopBits.FormattingEnabled = true;
            this.cmbStopBits.Items.AddRange(new object[] {
            "1",
            "1.5",
            "2"});
            this.cmbStopBits.Location = new System.Drawing.Point(79, 120);
            this.cmbStopBits.Name = "cmbStopBits";
            this.cmbStopBits.Size = new System.Drawing.Size(119, 21);
            this.cmbStopBits.TabIndex = 5;
            // 
            // cmbFlowControl
            // 
            this.cmbFlowControl.FormattingEnabled = true;
            this.cmbFlowControl.Items.AddRange(new object[] {
            "NONE",
            "HARDWARE",
            "SOFTWARE"});
            this.cmbFlowControl.Location = new System.Drawing.Point(79, 147);
            this.cmbFlowControl.Name = "cmbFlowControl";
            this.cmbFlowControl.Size = new System.Drawing.Size(119, 21);
            this.cmbFlowControl.TabIndex = 6;
            // 
            // btnConnect
            // 
            this.btnConnect.Location = new System.Drawing.Point(86, 210);
            this.btnConnect.Name = "btnConnect";
            this.btnConnect.Size = new System.Drawing.Size(112, 30);
            this.btnConnect.TabIndex = 8;
            this.btnConnect.Text = "Connect";
            this.btnConnect.UseVisualStyleBackColor = true;
            this.btnConnect.Click += new System.EventHandler(this.btnConnect_Click);
            // 
            // Connect
            // 
            this.AutoScaleDimensions = new System.Drawing.SizeF(6F, 13F);
            this.AutoScaleMode = System.Windows.Forms.AutoScaleMode.Font;
            this.ClientSize = new System.Drawing.Size(216, 257);
            this.Controls.Add(this.btnConnect);
            this.Controls.Add(this.cmbFlowControl);
            this.Controls.Add(this.cmbStopBits);
            this.Controls.Add(this.cmbParity);
            this.Controls.Add(this.cmbDataBits);
            this.Controls.Add(this.cmbBaudRate);
            this.Controls.Add(this.lblFlowControl);
            this.Controls.Add(this.lblStopBits);
            this.Controls.Add(this.lblParity);
            this.Controls.Add(this.lblDataBits);
            this.Controls.Add(this.lblBaudRate);
            this.Controls.Add(this.btnRefresh);
            this.Controls.Add(this.cmbComPort);
            this.Controls.Add(this.lblComPort);
            this.FormBorderStyle = System.Windows.Forms.FormBorderStyle.FixedSingle;
            this.MaximizeBox = false;
            this.MinimizeBox = false;
            this.Name = "Connect";
            this.Text = "Connect";
            this.Load += new System.EventHandler(this.Connect_Load);
            this.ResumeLayout(false);
            this.PerformLayout();

        }

        #endregion

        private System.Windows.Forms.Label lblComPort;
        public System.Windows.Forms.ComboBox cmbComPort;
        private System.Windows.Forms.Button btnRefresh;
        private System.Windows.Forms.Label lblBaudRate;
        private System.Windows.Forms.Label lblDataBits;
        private System.Windows.Forms.Label lblParity;
        private System.Windows.Forms.Label lblStopBits;
        private System.Windows.Forms.Label lblFlowControl;
        public System.Windows.Forms.ComboBox cmbBaudRate;
        public System.Windows.Forms.ComboBox cmbDataBits;
        public System.Windows.Forms.ComboBox cmbParity;
        public System.Windows.Forms.ComboBox cmbStopBits;
        public System.Windows.Forms.ComboBox cmbFlowControl;
        private System.Windows.Forms.Button btnConnect;
    }
}