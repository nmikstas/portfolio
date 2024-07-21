namespace AquaSift_V_00_01
{
    partial class SweepTest
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
            this.gbxSweepStartVolt = new System.Windows.Forms.GroupBox();
            this.tbxSweepStartVolt = new System.Windows.Forms.NumericUpDown();
            this.lblSweepStartVolt = new System.Windows.Forms.Label();
            this.gbxSweepEndVolt = new System.Windows.Forms.GroupBox();
            this.tbxSweepEndVolt = new System.Windows.Forms.NumericUpDown();
            this.lblSweepEndVolt = new System.Windows.Forms.Label();
            this.gbxSweepRate = new System.Windows.Forms.GroupBox();
            this.tbxSweepRate = new System.Windows.Forms.NumericUpDown();
            this.lblSweepRate = new System.Windows.Forms.Label();
            this.gbxSweepCyclic = new System.Windows.Forms.GroupBox();
            this.rbtSweepCyclicNo = new System.Windows.Forms.RadioButton();
            this.rbtSweepCyclicYes = new System.Windows.Forms.RadioButton();
            this.gbxSweepNumCycles = new System.Windows.Forms.GroupBox();
            this.tbxSweepNumCycles = new System.Windows.Forms.NumericUpDown();
            this.lblSweepNumCycles = new System.Windows.Forms.Label();
            this.btnSweepTest = new System.Windows.Forms.Button();
            this.gbxSweepStartVolt.SuspendLayout();
            ((System.ComponentModel.ISupportInitialize)(this.tbxSweepStartVolt)).BeginInit();
            this.gbxSweepEndVolt.SuspendLayout();
            ((System.ComponentModel.ISupportInitialize)(this.tbxSweepEndVolt)).BeginInit();
            this.gbxSweepRate.SuspendLayout();
            ((System.ComponentModel.ISupportInitialize)(this.tbxSweepRate)).BeginInit();
            this.gbxSweepCyclic.SuspendLayout();
            this.gbxSweepNumCycles.SuspendLayout();
            ((System.ComponentModel.ISupportInitialize)(this.tbxSweepNumCycles)).BeginInit();
            this.SuspendLayout();
            // 
            // gbxSweepStartVolt
            // 
            this.gbxSweepStartVolt.Controls.Add(this.tbxSweepStartVolt);
            this.gbxSweepStartVolt.Controls.Add(this.lblSweepStartVolt);
            this.gbxSweepStartVolt.Font = new System.Drawing.Font("Microsoft Sans Serif", 8.25F, System.Drawing.FontStyle.Regular, System.Drawing.GraphicsUnit.Point, ((byte)(0)));
            this.gbxSweepStartVolt.Location = new System.Drawing.Point(8, 8);
            this.gbxSweepStartVolt.Name = "gbxSweepStartVolt";
            this.gbxSweepStartVolt.Size = new System.Drawing.Size(220, 54);
            this.gbxSweepStartVolt.TabIndex = 4;
            this.gbxSweepStartVolt.TabStop = false;
            this.gbxSweepStartVolt.Text = "Start Voltage (mV)";
            // 
            // tbxSweepStartVolt
            // 
            this.tbxSweepStartVolt.Location = new System.Drawing.Point(117, 19);
            this.tbxSweepStartVolt.Maximum = new decimal(new int[] {
            1650,
            0,
            0,
            0});
            this.tbxSweepStartVolt.Minimum = new decimal(new int[] {
            1650,
            0,
            0,
            -2147483648});
            this.tbxSweepStartVolt.Name = "tbxSweepStartVolt";
            this.tbxSweepStartVolt.Size = new System.Drawing.Size(77, 20);
            this.tbxSweepStartVolt.TabIndex = 1;
            this.tbxSweepStartVolt.ValueChanged += new System.EventHandler(this.tbxSweepStartVolt_ValueChanged);
            this.tbxSweepStartVolt.KeyDown += new System.Windows.Forms.KeyEventHandler(this.tbxSweepStartVolt_KeyDown);
            // 
            // lblSweepStartVolt
            // 
            this.lblSweepStartVolt.AutoSize = true;
            this.lblSweepStartVolt.Location = new System.Drawing.Point(22, 21);
            this.lblSweepStartVolt.Name = "lblSweepStartVolt";
            this.lblSweepStartVolt.Size = new System.Drawing.Size(76, 13);
            this.lblSweepStartVolt.TabIndex = 0;
            this.lblSweepStartVolt.Text = "-1650 to 1650:";
            // 
            // gbxSweepEndVolt
            // 
            this.gbxSweepEndVolt.Controls.Add(this.tbxSweepEndVolt);
            this.gbxSweepEndVolt.Controls.Add(this.lblSweepEndVolt);
            this.gbxSweepEndVolt.Location = new System.Drawing.Point(8, 68);
            this.gbxSweepEndVolt.Name = "gbxSweepEndVolt";
            this.gbxSweepEndVolt.Size = new System.Drawing.Size(220, 54);
            this.gbxSweepEndVolt.TabIndex = 5;
            this.gbxSweepEndVolt.TabStop = false;
            this.gbxSweepEndVolt.Text = "End Voltage (mV)";
            // 
            // tbxSweepEndVolt
            // 
            this.tbxSweepEndVolt.Location = new System.Drawing.Point(117, 19);
            this.tbxSweepEndVolt.Maximum = new decimal(new int[] {
            1650,
            0,
            0,
            0});
            this.tbxSweepEndVolt.Minimum = new decimal(new int[] {
            1650,
            0,
            0,
            -2147483648});
            this.tbxSweepEndVolt.Name = "tbxSweepEndVolt";
            this.tbxSweepEndVolt.Size = new System.Drawing.Size(77, 20);
            this.tbxSweepEndVolt.TabIndex = 3;
            this.tbxSweepEndVolt.ValueChanged += new System.EventHandler(this.tbxSweepEndVolt_ValueChanged);
            this.tbxSweepEndVolt.KeyDown += new System.Windows.Forms.KeyEventHandler(this.tbxSweepEndVolt_KeyDown);
            // 
            // lblSweepEndVolt
            // 
            this.lblSweepEndVolt.AutoSize = true;
            this.lblSweepEndVolt.Location = new System.Drawing.Point(22, 21);
            this.lblSweepEndVolt.Name = "lblSweepEndVolt";
            this.lblSweepEndVolt.Size = new System.Drawing.Size(76, 13);
            this.lblSweepEndVolt.TabIndex = 2;
            this.lblSweepEndVolt.Text = "-1650 to 1650:";
            // 
            // gbxSweepRate
            // 
            this.gbxSweepRate.Controls.Add(this.tbxSweepRate);
            this.gbxSweepRate.Controls.Add(this.lblSweepRate);
            this.gbxSweepRate.Location = new System.Drawing.Point(8, 128);
            this.gbxSweepRate.Name = "gbxSweepRate";
            this.gbxSweepRate.Size = new System.Drawing.Size(220, 54);
            this.gbxSweepRate.TabIndex = 6;
            this.gbxSweepRate.TabStop = false;
            this.gbxSweepRate.Text = "Sweep Rate (mV/s)";
            // 
            // tbxSweepRate
            // 
            this.tbxSweepRate.Location = new System.Drawing.Point(117, 19);
            this.tbxSweepRate.Maximum = new decimal(new int[] {
            4000,
            0,
            0,
            0});
            this.tbxSweepRate.Minimum = new decimal(new int[] {
            1,
            0,
            0,
            0});
            this.tbxSweepRate.Name = "tbxSweepRate";
            this.tbxSweepRate.Size = new System.Drawing.Size(77, 20);
            this.tbxSweepRate.TabIndex = 5;
            this.tbxSweepRate.Value = new decimal(new int[] {
            1,
            0,
            0,
            0});
            this.tbxSweepRate.ValueChanged += new System.EventHandler(this.tbxSweepRate_ValueChanged);
            this.tbxSweepRate.KeyDown += new System.Windows.Forms.KeyEventHandler(this.tbxSweepRate_KeyDown);
            // 
            // lblSweepRate
            // 
            this.lblSweepRate.AutoSize = true;
            this.lblSweepRate.Location = new System.Drawing.Point(22, 21);
            this.lblSweepRate.Name = "lblSweepRate";
            this.lblSweepRate.Size = new System.Drawing.Size(55, 13);
            this.lblSweepRate.TabIndex = 4;
            this.lblSweepRate.Text = "1 to 4000:";
            // 
            // gbxSweepCyclic
            // 
            this.gbxSweepCyclic.Controls.Add(this.rbtSweepCyclicNo);
            this.gbxSweepCyclic.Controls.Add(this.rbtSweepCyclicYes);
            this.gbxSweepCyclic.Location = new System.Drawing.Point(8, 188);
            this.gbxSweepCyclic.Name = "gbxSweepCyclic";
            this.gbxSweepCyclic.Size = new System.Drawing.Size(220, 54);
            this.gbxSweepCyclic.TabIndex = 7;
            this.gbxSweepCyclic.TabStop = false;
            this.gbxSweepCyclic.Text = "Cyclic";
            // 
            // rbtSweepCyclicNo
            // 
            this.rbtSweepCyclicNo.Appearance = System.Windows.Forms.Appearance.Button;
            this.rbtSweepCyclicNo.Location = new System.Drawing.Point(126, 19);
            this.rbtSweepCyclicNo.Name = "rbtSweepCyclicNo";
            this.rbtSweepCyclicNo.Size = new System.Drawing.Size(68, 23);
            this.rbtSweepCyclicNo.TabIndex = 1;
            this.rbtSweepCyclicNo.TabStop = true;
            this.rbtSweepCyclicNo.Text = "No";
            this.rbtSweepCyclicNo.TextAlign = System.Drawing.ContentAlignment.MiddleCenter;
            this.rbtSweepCyclicNo.UseVisualStyleBackColor = true;
            this.rbtSweepCyclicNo.Enter += new System.EventHandler(this.rbtSweepCyclicNo_Enter);
            // 
            // rbtSweepCyclicYes
            // 
            this.rbtSweepCyclicYes.Appearance = System.Windows.Forms.Appearance.Button;
            this.rbtSweepCyclicYes.Location = new System.Drawing.Point(25, 19);
            this.rbtSweepCyclicYes.Name = "rbtSweepCyclicYes";
            this.rbtSweepCyclicYes.Size = new System.Drawing.Size(68, 23);
            this.rbtSweepCyclicYes.TabIndex = 0;
            this.rbtSweepCyclicYes.TabStop = true;
            this.rbtSweepCyclicYes.Text = "Yes";
            this.rbtSweepCyclicYes.TextAlign = System.Drawing.ContentAlignment.MiddleCenter;
            this.rbtSweepCyclicYes.UseVisualStyleBackColor = true;
            this.rbtSweepCyclicYes.Enter += new System.EventHandler(this.rbtSweepCyclicYes_Enter);
            // 
            // gbxSweepNumCycles
            // 
            this.gbxSweepNumCycles.Controls.Add(this.tbxSweepNumCycles);
            this.gbxSweepNumCycles.Controls.Add(this.lblSweepNumCycles);
            this.gbxSweepNumCycles.Location = new System.Drawing.Point(8, 248);
            this.gbxSweepNumCycles.Name = "gbxSweepNumCycles";
            this.gbxSweepNumCycles.Size = new System.Drawing.Size(220, 54);
            this.gbxSweepNumCycles.TabIndex = 8;
            this.gbxSweepNumCycles.TabStop = false;
            this.gbxSweepNumCycles.Text = "Number of Cycles";
            // 
            // tbxSweepNumCycles
            // 
            this.tbxSweepNumCycles.Location = new System.Drawing.Point(117, 19);
            this.tbxSweepNumCycles.Minimum = new decimal(new int[] {
            1,
            0,
            0,
            0});
            this.tbxSweepNumCycles.Name = "tbxSweepNumCycles";
            this.tbxSweepNumCycles.Size = new System.Drawing.Size(77, 20);
            this.tbxSweepNumCycles.TabIndex = 1;
            this.tbxSweepNumCycles.Value = new decimal(new int[] {
            1,
            0,
            0,
            0});
            this.tbxSweepNumCycles.ValueChanged += new System.EventHandler(this.tbxSweepNumCycles_ValueChanged);
            this.tbxSweepNumCycles.KeyDown += new System.Windows.Forms.KeyEventHandler(this.tbxSweepNumCycles_KeyDown);
            // 
            // lblSweepNumCycles
            // 
            this.lblSweepNumCycles.AutoSize = true;
            this.lblSweepNumCycles.Location = new System.Drawing.Point(22, 21);
            this.lblSweepNumCycles.Name = "lblSweepNumCycles";
            this.lblSweepNumCycles.Size = new System.Drawing.Size(49, 13);
            this.lblSweepNumCycles.TabIndex = 0;
            this.lblSweepNumCycles.Text = "1 to 100:";
            // 
            // btnSweepTest
            // 
            this.btnSweepTest.Location = new System.Drawing.Point(39, 308);
            this.btnSweepTest.Name = "btnSweepTest";
            this.btnSweepTest.Size = new System.Drawing.Size(155, 23);
            this.btnSweepTest.TabIndex = 9;
            this.btnSweepTest.Text = "Start Linear Sweep Test";
            this.btnSweepTest.UseVisualStyleBackColor = true;
            this.btnSweepTest.Click += new System.EventHandler(this.btnSweepTest_Click);
            // 
            // SweepTest
            // 
            this.AutoScaleDimensions = new System.Drawing.SizeF(6F, 13F);
            this.AutoScaleMode = System.Windows.Forms.AutoScaleMode.Font;
            this.Controls.Add(this.btnSweepTest);
            this.Controls.Add(this.gbxSweepNumCycles);
            this.Controls.Add(this.gbxSweepCyclic);
            this.Controls.Add(this.gbxSweepRate);
            this.Controls.Add(this.gbxSweepEndVolt);
            this.Controls.Add(this.gbxSweepStartVolt);
            this.Name = "SweepTest";
            this.Size = new System.Drawing.Size(240, 339);
            this.gbxSweepStartVolt.ResumeLayout(false);
            this.gbxSweepStartVolt.PerformLayout();
            ((System.ComponentModel.ISupportInitialize)(this.tbxSweepStartVolt)).EndInit();
            this.gbxSweepEndVolt.ResumeLayout(false);
            this.gbxSweepEndVolt.PerformLayout();
            ((System.ComponentModel.ISupportInitialize)(this.tbxSweepEndVolt)).EndInit();
            this.gbxSweepRate.ResumeLayout(false);
            this.gbxSweepRate.PerformLayout();
            ((System.ComponentModel.ISupportInitialize)(this.tbxSweepRate)).EndInit();
            this.gbxSweepCyclic.ResumeLayout(false);
            this.gbxSweepNumCycles.ResumeLayout(false);
            this.gbxSweepNumCycles.PerformLayout();
            ((System.ComponentModel.ISupportInitialize)(this.tbxSweepNumCycles)).EndInit();
            this.ResumeLayout(false);

        }

        #endregion

        private System.Windows.Forms.GroupBox gbxSweepStartVolt;
        public System.Windows.Forms.NumericUpDown tbxSweepStartVolt;
        private System.Windows.Forms.Label lblSweepStartVolt;
        private System.Windows.Forms.GroupBox gbxSweepEndVolt;
        public System.Windows.Forms.NumericUpDown tbxSweepEndVolt;
        private System.Windows.Forms.Label lblSweepEndVolt;
        private System.Windows.Forms.GroupBox gbxSweepRate;
        public System.Windows.Forms.NumericUpDown tbxSweepRate;
        private System.Windows.Forms.Label lblSweepRate;
        private System.Windows.Forms.GroupBox gbxSweepCyclic;
        private System.Windows.Forms.GroupBox gbxSweepNumCycles;
        public System.Windows.Forms.RadioButton rbtSweepCyclicNo;
        public System.Windows.Forms.RadioButton rbtSweepCyclicYes;
        public System.Windows.Forms.Button btnSweepTest;
        public System.Windows.Forms.NumericUpDown tbxSweepNumCycles;
        private System.Windows.Forms.Label lblSweepNumCycles;
    }
}
