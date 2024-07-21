namespace AquaSift_V_00_01
{
    partial class DifTest
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

        #region Component Designer generated code

        /// <summary> 
        /// Required method for Designer support - do not modify 
        /// the contents of this method with the code editor.
        /// </summary>
        private void InitializeComponent()
        {
            this.gbxDifStartVolt = new System.Windows.Forms.GroupBox();
            this.tbxDifStartVolt = new System.Windows.Forms.NumericUpDown();
            this.lblDifStartVolt = new System.Windows.Forms.Label();
            this.gbxDifSampWin = new System.Windows.Forms.GroupBox();
            this.lblSampWinWidth = new System.Windows.Forms.Label();
            this.tbxDifSampWinWidth = new System.Windows.Forms.NumericUpDown();
            this.gbxDifPulseTime = new System.Windows.Forms.GroupBox();
            this.lblPulseTime = new System.Windows.Forms.Label();
            this.tbxDifPulseTime = new System.Windows.Forms.NumericUpDown();
            this.gbxDifPrepulseTime = new System.Windows.Forms.GroupBox();
            this.lblPrepulseTime = new System.Windows.Forms.Label();
            this.tbxDifPrepulseTime = new System.Windows.Forms.NumericUpDown();
            this.gbxDifPulseVolt = new System.Windows.Forms.GroupBox();
            this.lblDifPulseVolt = new System.Windows.Forms.Label();
            this.tbxDifPulseVolt = new System.Windows.Forms.NumericUpDown();
            this.gbxDifIncVolt = new System.Windows.Forms.GroupBox();
            this.lblDifIncVolt = new System.Windows.Forms.Label();
            this.tbxDifIncVolt = new System.Windows.Forms.NumericUpDown();
            this.gbxDifEndVolt = new System.Windows.Forms.GroupBox();
            this.lblDifEndVolt = new System.Windows.Forms.Label();
            this.tbxDifEndVolt = new System.Windows.Forms.NumericUpDown();
            this.btnDifTest = new System.Windows.Forms.Button();
            this.gbxDifStartVolt.SuspendLayout();
            ((System.ComponentModel.ISupportInitialize)(this.tbxDifStartVolt)).BeginInit();
            this.gbxDifSampWin.SuspendLayout();
            ((System.ComponentModel.ISupportInitialize)(this.tbxDifSampWinWidth)).BeginInit();
            this.gbxDifPulseTime.SuspendLayout();
            ((System.ComponentModel.ISupportInitialize)(this.tbxDifPulseTime)).BeginInit();
            this.gbxDifPrepulseTime.SuspendLayout();
            ((System.ComponentModel.ISupportInitialize)(this.tbxDifPrepulseTime)).BeginInit();
            this.gbxDifPulseVolt.SuspendLayout();
            ((System.ComponentModel.ISupportInitialize)(this.tbxDifPulseVolt)).BeginInit();
            this.gbxDifIncVolt.SuspendLayout();
            ((System.ComponentModel.ISupportInitialize)(this.tbxDifIncVolt)).BeginInit();
            this.gbxDifEndVolt.SuspendLayout();
            ((System.ComponentModel.ISupportInitialize)(this.tbxDifEndVolt)).BeginInit();
            this.SuspendLayout();
            // 
            // gbxDifStartVolt
            // 
            this.gbxDifStartVolt.Controls.Add(this.tbxDifStartVolt);
            this.gbxDifStartVolt.Controls.Add(this.lblDifStartVolt);
            this.gbxDifStartVolt.Font = new System.Drawing.Font("Microsoft Sans Serif", 8.25F, System.Drawing.FontStyle.Regular, System.Drawing.GraphicsUnit.Point, ((byte)(0)));
            this.gbxDifStartVolt.Location = new System.Drawing.Point(8, 8);
            this.gbxDifStartVolt.Name = "gbxDifStartVolt";
            this.gbxDifStartVolt.Size = new System.Drawing.Size(220, 54);
            this.gbxDifStartVolt.TabIndex = 3;
            this.gbxDifStartVolt.TabStop = false;
            this.gbxDifStartVolt.Text = "Start Voltage (mV)";
            // 
            // tbxDifStartVolt
            // 
            this.tbxDifStartVolt.Location = new System.Drawing.Point(117, 19);
            this.tbxDifStartVolt.Maximum = new decimal(new int[] {
            1650,
            0,
            0,
            0});
            this.tbxDifStartVolt.Minimum = new decimal(new int[] {
            1650,
            0,
            0,
            -2147483648});
            this.tbxDifStartVolt.Name = "tbxDifStartVolt";
            this.tbxDifStartVolt.Size = new System.Drawing.Size(77, 20);
            this.tbxDifStartVolt.TabIndex = 1;
            this.tbxDifStartVolt.ValueChanged += new System.EventHandler(this.tbxDifStartVolt_ValueChanged);
            this.tbxDifStartVolt.KeyDown += new System.Windows.Forms.KeyEventHandler(this.tbxDifStartVolt_KeyDown);
            // 
            // lblDifStartVolt
            // 
            this.lblDifStartVolt.AutoSize = true;
            this.lblDifStartVolt.Location = new System.Drawing.Point(22, 21);
            this.lblDifStartVolt.Name = "lblDifStartVolt";
            this.lblDifStartVolt.Size = new System.Drawing.Size(76, 13);
            this.lblDifStartVolt.TabIndex = 0;
            this.lblDifStartVolt.Text = "-1650 to 1650:";
            // 
            // gbxDifSampWin
            // 
            this.gbxDifSampWin.Controls.Add(this.lblSampWinWidth);
            this.gbxDifSampWin.Controls.Add(this.tbxDifSampWinWidth);
            this.gbxDifSampWin.Font = new System.Drawing.Font("Microsoft Sans Serif", 8.25F, System.Drawing.FontStyle.Regular, System.Drawing.GraphicsUnit.Point, ((byte)(0)));
            this.gbxDifSampWin.Location = new System.Drawing.Point(8, 368);
            this.gbxDifSampWin.Name = "gbxDifSampWin";
            this.gbxDifSampWin.Size = new System.Drawing.Size(220, 54);
            this.gbxDifSampWin.TabIndex = 9;
            this.gbxDifSampWin.TabStop = false;
            this.gbxDifSampWin.Text = "Sampling Window Width (ms)";
            // 
            // lblSampWinWidth
            // 
            this.lblSampWinWidth.AutoSize = true;
            this.lblSampWinWidth.Location = new System.Drawing.Point(22, 21);
            this.lblSampWinWidth.Name = "lblSampWinWidth";
            this.lblSampWinWidth.Size = new System.Drawing.Size(61, 13);
            this.lblSampWinWidth.TabIndex = 1;
            this.lblSampWinWidth.Text = "1 to 10000:";
            // 
            // tbxDifSampWinWidth
            // 
            this.tbxDifSampWinWidth.Location = new System.Drawing.Point(117, 19);
            this.tbxDifSampWinWidth.Maximum = new decimal(new int[] {
            10000,
            0,
            0,
            0});
            this.tbxDifSampWinWidth.Minimum = new decimal(new int[] {
            1,
            0,
            0,
            0});
            this.tbxDifSampWinWidth.Name = "tbxDifSampWinWidth";
            this.tbxDifSampWinWidth.Size = new System.Drawing.Size(77, 20);
            this.tbxDifSampWinWidth.TabIndex = 0;
            this.tbxDifSampWinWidth.Value = new decimal(new int[] {
            1,
            0,
            0,
            0});
            this.tbxDifSampWinWidth.ValueChanged += new System.EventHandler(this.tbxDifSampWinWidth_ValueChanged);
            this.tbxDifSampWinWidth.KeyDown += new System.Windows.Forms.KeyEventHandler(this.tbxDifSampWinWidth_KeyDown);
            // 
            // gbxDifPulseTime
            // 
            this.gbxDifPulseTime.Controls.Add(this.lblPulseTime);
            this.gbxDifPulseTime.Controls.Add(this.tbxDifPulseTime);
            this.gbxDifPulseTime.Font = new System.Drawing.Font("Microsoft Sans Serif", 8.25F, System.Drawing.FontStyle.Regular, System.Drawing.GraphicsUnit.Point, ((byte)(0)));
            this.gbxDifPulseTime.Location = new System.Drawing.Point(8, 308);
            this.gbxDifPulseTime.Name = "gbxDifPulseTime";
            this.gbxDifPulseTime.Size = new System.Drawing.Size(220, 54);
            this.gbxDifPulseTime.TabIndex = 8;
            this.gbxDifPulseTime.TabStop = false;
            this.gbxDifPulseTime.Text = "Pulse Time (ms)";
            // 
            // lblPulseTime
            // 
            this.lblPulseTime.AutoSize = true;
            this.lblPulseTime.Location = new System.Drawing.Point(22, 21);
            this.lblPulseTime.Name = "lblPulseTime";
            this.lblPulseTime.Size = new System.Drawing.Size(61, 13);
            this.lblPulseTime.TabIndex = 1;
            this.lblPulseTime.Text = "1 to 10000:";
            // 
            // tbxDifPulseTime
            // 
            this.tbxDifPulseTime.Location = new System.Drawing.Point(117, 19);
            this.tbxDifPulseTime.Maximum = new decimal(new int[] {
            10000,
            0,
            0,
            0});
            this.tbxDifPulseTime.Minimum = new decimal(new int[] {
            1,
            0,
            0,
            0});
            this.tbxDifPulseTime.Name = "tbxDifPulseTime";
            this.tbxDifPulseTime.Size = new System.Drawing.Size(77, 20);
            this.tbxDifPulseTime.TabIndex = 0;
            this.tbxDifPulseTime.Value = new decimal(new int[] {
            1,
            0,
            0,
            0});
            this.tbxDifPulseTime.ValueChanged += new System.EventHandler(this.tbxDifPulseTime_ValueChanged);
            this.tbxDifPulseTime.KeyDown += new System.Windows.Forms.KeyEventHandler(this.tbxDifPulseTime_KeyDown);
            // 
            // gbxDifPrepulseTime
            // 
            this.gbxDifPrepulseTime.Controls.Add(this.lblPrepulseTime);
            this.gbxDifPrepulseTime.Controls.Add(this.tbxDifPrepulseTime);
            this.gbxDifPrepulseTime.Font = new System.Drawing.Font("Microsoft Sans Serif", 8.25F, System.Drawing.FontStyle.Regular, System.Drawing.GraphicsUnit.Point, ((byte)(0)));
            this.gbxDifPrepulseTime.Location = new System.Drawing.Point(8, 248);
            this.gbxDifPrepulseTime.Name = "gbxDifPrepulseTime";
            this.gbxDifPrepulseTime.Size = new System.Drawing.Size(220, 54);
            this.gbxDifPrepulseTime.TabIndex = 7;
            this.gbxDifPrepulseTime.TabStop = false;
            this.gbxDifPrepulseTime.Text = "Pre-pulse Time (ms)";
            // 
            // lblPrepulseTime
            // 
            this.lblPrepulseTime.AutoSize = true;
            this.lblPrepulseTime.Location = new System.Drawing.Point(22, 21);
            this.lblPrepulseTime.Name = "lblPrepulseTime";
            this.lblPrepulseTime.Size = new System.Drawing.Size(61, 13);
            this.lblPrepulseTime.TabIndex = 1;
            this.lblPrepulseTime.Text = "1 to 10000:";
            // 
            // tbxDifPrepulseTime
            // 
            this.tbxDifPrepulseTime.Location = new System.Drawing.Point(117, 19);
            this.tbxDifPrepulseTime.Maximum = new decimal(new int[] {
            10000,
            0,
            0,
            0});
            this.tbxDifPrepulseTime.Minimum = new decimal(new int[] {
            1,
            0,
            0,
            0});
            this.tbxDifPrepulseTime.Name = "tbxDifPrepulseTime";
            this.tbxDifPrepulseTime.Size = new System.Drawing.Size(77, 20);
            this.tbxDifPrepulseTime.TabIndex = 0;
            this.tbxDifPrepulseTime.Value = new decimal(new int[] {
            1,
            0,
            0,
            0});
            this.tbxDifPrepulseTime.ValueChanged += new System.EventHandler(this.tbxDifPrepulseTime_ValueChanged);
            this.tbxDifPrepulseTime.KeyDown += new System.Windows.Forms.KeyEventHandler(this.tbxDifPrepulseTime_KeyDown);
            // 
            // gbxDifPulseVolt
            // 
            this.gbxDifPulseVolt.Controls.Add(this.lblDifPulseVolt);
            this.gbxDifPulseVolt.Controls.Add(this.tbxDifPulseVolt);
            this.gbxDifPulseVolt.Font = new System.Drawing.Font("Microsoft Sans Serif", 8.25F, System.Drawing.FontStyle.Regular, System.Drawing.GraphicsUnit.Point, ((byte)(0)));
            this.gbxDifPulseVolt.Location = new System.Drawing.Point(8, 188);
            this.gbxDifPulseVolt.Name = "gbxDifPulseVolt";
            this.gbxDifPulseVolt.Size = new System.Drawing.Size(220, 54);
            this.gbxDifPulseVolt.TabIndex = 6;
            this.gbxDifPulseVolt.TabStop = false;
            this.gbxDifPulseVolt.Text = "Pulse Voltage (mV)";
            // 
            // lblDifPulseVolt
            // 
            this.lblDifPulseVolt.AutoSize = true;
            this.lblDifPulseVolt.Location = new System.Drawing.Point(22, 21);
            this.lblDifPulseVolt.Name = "lblDifPulseVolt";
            this.lblDifPulseVolt.Size = new System.Drawing.Size(76, 13);
            this.lblDifPulseVolt.TabIndex = 1;
            this.lblDifPulseVolt.Text = "-1650 to 1650:";
            // 
            // tbxDifPulseVolt
            // 
            this.tbxDifPulseVolt.Location = new System.Drawing.Point(117, 19);
            this.tbxDifPulseVolt.Maximum = new decimal(new int[] {
            1650,
            0,
            0,
            0});
            this.tbxDifPulseVolt.Minimum = new decimal(new int[] {
            1650,
            0,
            0,
            -2147483648});
            this.tbxDifPulseVolt.Name = "tbxDifPulseVolt";
            this.tbxDifPulseVolt.Size = new System.Drawing.Size(77, 20);
            this.tbxDifPulseVolt.TabIndex = 0;
            this.tbxDifPulseVolt.ValueChanged += new System.EventHandler(this.tbxDifPulseVolt_ValueChanged);
            this.tbxDifPulseVolt.KeyDown += new System.Windows.Forms.KeyEventHandler(this.tbxDifPulseVolt_KeyDown);
            // 
            // gbxDifIncVolt
            // 
            this.gbxDifIncVolt.Controls.Add(this.lblDifIncVolt);
            this.gbxDifIncVolt.Controls.Add(this.tbxDifIncVolt);
            this.gbxDifIncVolt.Font = new System.Drawing.Font("Microsoft Sans Serif", 8.25F, System.Drawing.FontStyle.Regular, System.Drawing.GraphicsUnit.Point, ((byte)(0)));
            this.gbxDifIncVolt.Location = new System.Drawing.Point(8, 128);
            this.gbxDifIncVolt.Name = "gbxDifIncVolt";
            this.gbxDifIncVolt.Size = new System.Drawing.Size(220, 54);
            this.gbxDifIncVolt.TabIndex = 5;
            this.gbxDifIncVolt.TabStop = false;
            this.gbxDifIncVolt.Text = "Increment Voltage (mV)";
            // 
            // lblDifIncVolt
            // 
            this.lblDifIncVolt.AutoSize = true;
            this.lblDifIncVolt.Location = new System.Drawing.Point(22, 21);
            this.lblDifIncVolt.Name = "lblDifIncVolt";
            this.lblDifIncVolt.Size = new System.Drawing.Size(55, 13);
            this.lblDifIncVolt.TabIndex = 1;
            this.lblDifIncVolt.Text = "1 to 1650:";
            // 
            // tbxDifIncVolt
            // 
            this.tbxDifIncVolt.Location = new System.Drawing.Point(117, 19);
            this.tbxDifIncVolt.Maximum = new decimal(new int[] {
            1650,
            0,
            0,
            0});
            this.tbxDifIncVolt.Minimum = new decimal(new int[] {
            1,
            0,
            0,
            0});
            this.tbxDifIncVolt.Name = "tbxDifIncVolt";
            this.tbxDifIncVolt.Size = new System.Drawing.Size(77, 20);
            this.tbxDifIncVolt.TabIndex = 0;
            this.tbxDifIncVolt.Value = new decimal(new int[] {
            1,
            0,
            0,
            0});
            this.tbxDifIncVolt.ValueChanged += new System.EventHandler(this.tbxDifIncVolt_ValueChanged);
            this.tbxDifIncVolt.KeyDown += new System.Windows.Forms.KeyEventHandler(this.tbxDifIncVolt_KeyDown);
            // 
            // gbxDifEndVolt
            // 
            this.gbxDifEndVolt.Controls.Add(this.lblDifEndVolt);
            this.gbxDifEndVolt.Controls.Add(this.tbxDifEndVolt);
            this.gbxDifEndVolt.Font = new System.Drawing.Font("Microsoft Sans Serif", 8.25F, System.Drawing.FontStyle.Regular, System.Drawing.GraphicsUnit.Point, ((byte)(0)));
            this.gbxDifEndVolt.Location = new System.Drawing.Point(8, 68);
            this.gbxDifEndVolt.Name = "gbxDifEndVolt";
            this.gbxDifEndVolt.Size = new System.Drawing.Size(220, 54);
            this.gbxDifEndVolt.TabIndex = 4;
            this.gbxDifEndVolt.TabStop = false;
            this.gbxDifEndVolt.Text = "End Voltage (mV)";
            // 
            // lblDifEndVolt
            // 
            this.lblDifEndVolt.AutoSize = true;
            this.lblDifEndVolt.Location = new System.Drawing.Point(22, 21);
            this.lblDifEndVolt.Name = "lblDifEndVolt";
            this.lblDifEndVolt.Size = new System.Drawing.Size(76, 13);
            this.lblDifEndVolt.TabIndex = 1;
            this.lblDifEndVolt.Text = "-1650 to 1650:";
            // 
            // tbxDifEndVolt
            // 
            this.tbxDifEndVolt.Location = new System.Drawing.Point(117, 19);
            this.tbxDifEndVolt.Maximum = new decimal(new int[] {
            1650,
            0,
            0,
            0});
            this.tbxDifEndVolt.Minimum = new decimal(new int[] {
            1650,
            0,
            0,
            -2147483648});
            this.tbxDifEndVolt.Name = "tbxDifEndVolt";
            this.tbxDifEndVolt.Size = new System.Drawing.Size(77, 20);
            this.tbxDifEndVolt.TabIndex = 0;
            this.tbxDifEndVolt.ValueChanged += new System.EventHandler(this.tbxDifEndVolt_ValueChanged);
            this.tbxDifEndVolt.KeyDown += new System.Windows.Forms.KeyEventHandler(this.tbxDifEndVolt_KeyDown);
            // 
            // btnDifTest
            // 
            this.btnDifTest.Location = new System.Drawing.Point(39, 428);
            this.btnDifTest.Name = "btnDifTest";
            this.btnDifTest.Size = new System.Drawing.Size(155, 23);
            this.btnDifTest.TabIndex = 10;
            this.btnDifTest.Text = "Start Differential Pulse Test";
            this.btnDifTest.UseVisualStyleBackColor = true;
            this.btnDifTest.Click += new System.EventHandler(this.btnDifTest_Click);
            // 
            // DifTest
            // 
            this.AutoScaleMode = System.Windows.Forms.AutoScaleMode.None;
            this.Controls.Add(this.btnDifTest);
            this.Controls.Add(this.gbxDifStartVolt);
            this.Controls.Add(this.gbxDifEndVolt);
            this.Controls.Add(this.gbxDifIncVolt);
            this.Controls.Add(this.gbxDifPulseVolt);
            this.Controls.Add(this.gbxDifPrepulseTime);
            this.Controls.Add(this.gbxDifPulseTime);
            this.Controls.Add(this.gbxDifSampWin);
            this.Name = "DifTest";
            this.Size = new System.Drawing.Size(240, 463);
            this.gbxDifStartVolt.ResumeLayout(false);
            this.gbxDifStartVolt.PerformLayout();
            ((System.ComponentModel.ISupportInitialize)(this.tbxDifStartVolt)).EndInit();
            this.gbxDifSampWin.ResumeLayout(false);
            this.gbxDifSampWin.PerformLayout();
            ((System.ComponentModel.ISupportInitialize)(this.tbxDifSampWinWidth)).EndInit();
            this.gbxDifPulseTime.ResumeLayout(false);
            this.gbxDifPulseTime.PerformLayout();
            ((System.ComponentModel.ISupportInitialize)(this.tbxDifPulseTime)).EndInit();
            this.gbxDifPrepulseTime.ResumeLayout(false);
            this.gbxDifPrepulseTime.PerformLayout();
            ((System.ComponentModel.ISupportInitialize)(this.tbxDifPrepulseTime)).EndInit();
            this.gbxDifPulseVolt.ResumeLayout(false);
            this.gbxDifPulseVolt.PerformLayout();
            ((System.ComponentModel.ISupportInitialize)(this.tbxDifPulseVolt)).EndInit();
            this.gbxDifIncVolt.ResumeLayout(false);
            this.gbxDifIncVolt.PerformLayout();
            ((System.ComponentModel.ISupportInitialize)(this.tbxDifIncVolt)).EndInit();
            this.gbxDifEndVolt.ResumeLayout(false);
            this.gbxDifEndVolt.PerformLayout();
            ((System.ComponentModel.ISupportInitialize)(this.tbxDifEndVolt)).EndInit();
            this.ResumeLayout(false);

        }

        #endregion

        private System.Windows.Forms.GroupBox gbxDifStartVolt;
        public System.Windows.Forms.NumericUpDown tbxDifStartVolt;
        private System.Windows.Forms.Label lblDifStartVolt;
        private System.Windows.Forms.GroupBox gbxDifEndVolt;
        private System.Windows.Forms.Label lblDifEndVolt;
        public System.Windows.Forms.NumericUpDown tbxDifEndVolt;
        private System.Windows.Forms.GroupBox gbxDifIncVolt;
        private System.Windows.Forms.Label lblDifIncVolt;
        public System.Windows.Forms.NumericUpDown tbxDifIncVolt;
        private System.Windows.Forms.GroupBox gbxDifPulseVolt;
        private System.Windows.Forms.Label lblDifPulseVolt;
        public System.Windows.Forms.NumericUpDown tbxDifPulseVolt;
        private System.Windows.Forms.GroupBox gbxDifPrepulseTime;
        private System.Windows.Forms.Label lblPrepulseTime;
        public System.Windows.Forms.NumericUpDown tbxDifPrepulseTime;
        private System.Windows.Forms.GroupBox gbxDifPulseTime;
        private System.Windows.Forms.Label lblPulseTime;
        public System.Windows.Forms.NumericUpDown tbxDifPulseTime;
        private System.Windows.Forms.GroupBox gbxDifSampWin;
        private System.Windows.Forms.Label lblSampWinWidth;
        public System.Windows.Forms.NumericUpDown tbxDifSampWinWidth;
        public System.Windows.Forms.Button btnDifTest;
    }
}
