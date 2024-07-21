namespace AquaSift_V_00_01
{
    partial class AqConsole
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
            this.btnClearConsoleWindow = new System.Windows.Forms.Button();
            this.rtbConsoleWindow = new System.Windows.Forms.RichTextBox();
            this.lblSendData = new System.Windows.Forms.Label();
            this.tbxSendData = new System.Windows.Forms.TextBox();
            this.rbtAscii = new System.Windows.Forms.RadioButton();
            this.rbtBinary = new System.Windows.Forms.RadioButton();
            this.gbxAquaSiftConsole = new System.Windows.Forms.GroupBox();
            this.gbxAquaSiftConsole.SuspendLayout();
            this.SuspendLayout();
            // 
            // btnClearConsoleWindow
            // 
            this.btnClearConsoleWindow.FlatStyle = System.Windows.Forms.FlatStyle.Popup;
            this.btnClearConsoleWindow.Location = new System.Drawing.Point(6, 19);
            this.btnClearConsoleWindow.Name = "btnClearConsoleWindow";
            this.btnClearConsoleWindow.Size = new System.Drawing.Size(63, 23);
            this.btnClearConsoleWindow.TabIndex = 9;
            this.btnClearConsoleWindow.Text = "Clear";
            this.btnClearConsoleWindow.UseVisualStyleBackColor = true;
            this.btnClearConsoleWindow.Click += new System.EventHandler(this.btnClearConsoleWindow_Click);
            // 
            // rtbConsoleWindow
            // 
            this.rtbConsoleWindow.Font = new System.Drawing.Font("Microsoft Sans Serif", 10F);
            this.rtbConsoleWindow.Location = new System.Drawing.Point(6, 48);
            this.rtbConsoleWindow.Name = "rtbConsoleWindow";
            this.rtbConsoleWindow.ReadOnly = true;
            this.rtbConsoleWindow.Size = new System.Drawing.Size(1108, 144);
            this.rtbConsoleWindow.TabIndex = 8;
            this.rtbConsoleWindow.Text = "";
            this.rtbConsoleWindow.MouseDown += new System.Windows.Forms.MouseEventHandler(this.rtbConsoleWindow_MouseDown);
            // 
            // lblSendData
            // 
            this.lblSendData.AutoSize = true;
            this.lblSendData.Location = new System.Drawing.Point(75, 24);
            this.lblSendData.Name = "lblSendData";
            this.lblSendData.Size = new System.Drawing.Size(61, 13);
            this.lblSendData.TabIndex = 10;
            this.lblSendData.Text = "Send Data:";
            // 
            // tbxSendData
            // 
            this.tbxSendData.Location = new System.Drawing.Point(142, 19);
            this.tbxSendData.Name = "tbxSendData";
            this.tbxSendData.Size = new System.Drawing.Size(180, 20);
            this.tbxSendData.TabIndex = 11;
            this.tbxSendData.TextChanged += new System.EventHandler(this.tbxSendData_TextChanged);
            this.tbxSendData.KeyDown += new System.Windows.Forms.KeyEventHandler(this.tbxSendData_KeyDown);
            // 
            // rbtAscii
            // 
            this.rbtAscii.AutoSize = true;
            this.rbtAscii.Location = new System.Drawing.Point(328, 19);
            this.rbtAscii.Name = "rbtAscii";
            this.rbtAscii.Size = new System.Drawing.Size(52, 17);
            this.rbtAscii.TabIndex = 12;
            this.rbtAscii.TabStop = true;
            this.rbtAscii.Text = "ASCII";
            this.rbtAscii.UseVisualStyleBackColor = true;
            this.rbtAscii.Enter += new System.EventHandler(this.rbtAscii_Enter);
            // 
            // rbtBinary
            // 
            this.rbtBinary.AutoSize = true;
            this.rbtBinary.Location = new System.Drawing.Point(386, 19);
            this.rbtBinary.Name = "rbtBinary";
            this.rbtBinary.Size = new System.Drawing.Size(54, 17);
            this.rbtBinary.TabIndex = 13;
            this.rbtBinary.TabStop = true;
            this.rbtBinary.Text = "Binary";
            this.rbtBinary.UseVisualStyleBackColor = true;
            this.rbtBinary.Enter += new System.EventHandler(this.rbtBinary_Enter);
            // 
            // gbxAquaSiftConsole
            // 
            this.gbxAquaSiftConsole.Controls.Add(this.btnClearConsoleWindow);
            this.gbxAquaSiftConsole.Controls.Add(this.rbtBinary);
            this.gbxAquaSiftConsole.Controls.Add(this.rbtAscii);
            this.gbxAquaSiftConsole.Controls.Add(this.tbxSendData);
            this.gbxAquaSiftConsole.Controls.Add(this.lblSendData);
            this.gbxAquaSiftConsole.Controls.Add(this.rtbConsoleWindow);
            this.gbxAquaSiftConsole.Location = new System.Drawing.Point(3, 0);
            this.gbxAquaSiftConsole.Name = "gbxAquaSiftConsole";
            this.gbxAquaSiftConsole.Size = new System.Drawing.Size(1120, 198);
            this.gbxAquaSiftConsole.TabIndex = 15;
            this.gbxAquaSiftConsole.TabStop = false;
            this.gbxAquaSiftConsole.Text = "AquaSift Console";
            // 
            // AqConsole
            // 
            this.AutoScaleDimensions = new System.Drawing.SizeF(6F, 13F);
            this.AutoScaleMode = System.Windows.Forms.AutoScaleMode.Font;
            this.Controls.Add(this.gbxAquaSiftConsole);
            this.Name = "AqConsole";
            this.Size = new System.Drawing.Size(1123, 198);
            this.Load += new System.EventHandler(this.AqConsole_Load);
            this.gbxAquaSiftConsole.ResumeLayout(false);
            this.gbxAquaSiftConsole.PerformLayout();
            this.ResumeLayout(false);

        }

        #endregion

        private System.Windows.Forms.Button btnClearConsoleWindow;
        private System.Windows.Forms.RichTextBox rtbConsoleWindow;
        private System.Windows.Forms.Label lblSendData;
        private System.Windows.Forms.TextBox tbxSendData;
        private System.Windows.Forms.RadioButton rbtAscii;
        private System.Windows.Forms.RadioButton rbtBinary;
        private System.Windows.Forms.GroupBox gbxAquaSiftConsole;
    }
}
