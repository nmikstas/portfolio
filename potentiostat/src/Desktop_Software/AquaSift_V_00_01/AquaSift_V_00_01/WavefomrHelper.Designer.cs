namespace AquaSift_V_00_01
{
    partial class WavefomrHelper
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
            this.picWaveformHelper = new System.Windows.Forms.PictureBox();
            ((System.ComponentModel.ISupportInitialize)(this.picWaveformHelper)).BeginInit();
            this.SuspendLayout();
            // 
            // picWaveformHelper
            // 
            this.picWaveformHelper.Location = new System.Drawing.Point(0, 0);
            this.picWaveformHelper.Name = "picWaveformHelper";
            this.picWaveformHelper.Size = new System.Drawing.Size(329, 309);
            this.picWaveformHelper.TabIndex = 0;
            this.picWaveformHelper.TabStop = false;
            // 
            // WavefomrHelper
            // 
            this.AutoScaleDimensions = new System.Drawing.SizeF(6F, 13F);
            this.AutoScaleMode = System.Windows.Forms.AutoScaleMode.Font;
            this.Controls.Add(this.picWaveformHelper);
            this.Name = "WavefomrHelper";
            this.Size = new System.Drawing.Size(329, 309);
            ((System.ComponentModel.ISupportInitialize)(this.picWaveformHelper)).EndInit();
            this.ResumeLayout(false);

        }

        #endregion

        public System.Windows.Forms.PictureBox picWaveformHelper;
    }
}
