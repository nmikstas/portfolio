namespace AquaSift_V_00_01
{
    partial class DataTree
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
            this.treData = new System.Windows.Forms.TreeView();
            this.SuspendLayout();
            // 
            // treData
            // 
            this.treData.CheckBoxes = true;
            this.treData.Location = new System.Drawing.Point(3, 3);
            this.treData.Name = "treData";
            this.treData.Size = new System.Drawing.Size(272, 592);
            this.treData.TabIndex = 0;
            this.treData.AfterLabelEdit += new System.Windows.Forms.NodeLabelEditEventHandler(this.treData_AfterLabelEdit);
            this.treData.AfterCheck += new System.Windows.Forms.TreeViewEventHandler(this.treData_AfterCheck);
            this.treData.MouseDown += new System.Windows.Forms.MouseEventHandler(this.treData_MouseDown);
            // 
            // DataTree
            // 
            this.AutoScaleDimensions = new System.Drawing.SizeF(6F, 13F);
            this.AutoScaleMode = System.Windows.Forms.AutoScaleMode.Font;
            this.Controls.Add(this.treData);
            this.Name = "DataTree";
            this.Size = new System.Drawing.Size(278, 598);
            this.ResumeLayout(false);

        }

        #endregion

        private System.Windows.Forms.TreeView treData;
    }
}
