namespace AquaSift_V_00_01
{
    partial class AqPlotter
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
            System.Windows.Forms.DataVisualization.Charting.ChartArea chartArea9 = new System.Windows.Forms.DataVisualization.Charting.ChartArea();
            System.Windows.Forms.DataVisualization.Charting.Legend legend9 = new System.Windows.Forms.DataVisualization.Charting.Legend();
            System.Windows.Forms.DataVisualization.Charting.Series series9 = new System.Windows.Forms.DataVisualization.Charting.Series();
            System.Windows.Forms.DataVisualization.Charting.Title title9 = new System.Windows.Forms.DataVisualization.Charting.Title();
            System.Windows.Forms.DataVisualization.Charting.ChartArea chartArea10 = new System.Windows.Forms.DataVisualization.Charting.ChartArea();
            System.Windows.Forms.DataVisualization.Charting.Legend legend10 = new System.Windows.Forms.DataVisualization.Charting.Legend();
            System.Windows.Forms.DataVisualization.Charting.Series series10 = new System.Windows.Forms.DataVisualization.Charting.Series();
            System.Windows.Forms.DataVisualization.Charting.Title title10 = new System.Windows.Forms.DataVisualization.Charting.Title();
            System.Windows.Forms.DataVisualization.Charting.ChartArea chartArea11 = new System.Windows.Forms.DataVisualization.Charting.ChartArea();
            System.Windows.Forms.DataVisualization.Charting.Legend legend11 = new System.Windows.Forms.DataVisualization.Charting.Legend();
            System.Windows.Forms.DataVisualization.Charting.Series series11 = new System.Windows.Forms.DataVisualization.Charting.Series();
            System.Windows.Forms.DataVisualization.Charting.Title title11 = new System.Windows.Forms.DataVisualization.Charting.Title();
            System.Windows.Forms.DataVisualization.Charting.ChartArea chartArea12 = new System.Windows.Forms.DataVisualization.Charting.ChartArea();
            System.Windows.Forms.DataVisualization.Charting.Legend legend12 = new System.Windows.Forms.DataVisualization.Charting.Legend();
            System.Windows.Forms.DataVisualization.Charting.Series series12 = new System.Windows.Forms.DataVisualization.Charting.Series();
            System.Windows.Forms.DataVisualization.Charting.Title title12 = new System.Windows.Forms.DataVisualization.Charting.Title();
            System.ComponentModel.ComponentResourceManager resources = new System.ComponentModel.ComponentResourceManager(typeof(AqPlotter));
            this.tbcPlotTabs = new System.Windows.Forms.TabControl();
            this.tabDeposition = new System.Windows.Forms.TabPage();
            this.chtDeposition = new System.Windows.Forms.DataVisualization.Charting.Chart();
            this.tabQuietTime = new System.Windows.Forms.TabPage();
            this.chtQuietTime = new System.Windows.Forms.DataVisualization.Charting.Chart();
            this.tabRawData = new System.Windows.Forms.TabPage();
            this.chtRawData = new System.Windows.Forms.DataVisualization.Charting.Chart();
            this.tabIVCurve = new System.Windows.Forms.TabPage();
            this.chtIVCurve = new System.Windows.Forms.DataVisualization.Charting.Chart();
            this.stpPlotting = new System.Windows.Forms.ToolStrip();
            this.btnPicToFile = new System.Windows.Forms.ToolStripButton();
            this.btnPicToClip = new System.Windows.Forms.ToolStripButton();
            this.toolStripSeparator1 = new System.Windows.Forms.ToolStripSeparator();
            this.btnDataToFile = new System.Windows.Forms.ToolStripButton();
            this.btnDataToClip = new System.Windows.Forms.ToolStripButton();
            this.toolStripSeparator2 = new System.Windows.Forms.ToolStripSeparator();
            this.btnSelectAll = new System.Windows.Forms.ToolStripButton();
            this.btnDeselectAll = new System.Windows.Forms.ToolStripButton();
            this.toolStripSeparator4 = new System.Windows.Forms.ToolStripSeparator();
            this.btnZoomXY = new System.Windows.Forms.ToolStripButton();
            this.btnZoomX = new System.Windows.Forms.ToolStripButton();
            this.btnZoomY = new System.Windows.Forms.ToolStripButton();
            this.toolStripSeparator3 = new System.Windows.Forms.ToolStripSeparator();
            this.btnPeakCalc = new System.Windows.Forms.ToolStripButton();
            this.btnClearCalcs = new System.Windows.Forms.ToolStripButton();
            this.toolStripSeparator5 = new System.Windows.Forms.ToolStripSeparator();
            this.btnClearSelectedCalcs = new System.Windows.Forms.ToolStripButton();
            this.tbcPlotTabs.SuspendLayout();
            this.tabDeposition.SuspendLayout();
            ((System.ComponentModel.ISupportInitialize)(this.chtDeposition)).BeginInit();
            this.tabQuietTime.SuspendLayout();
            ((System.ComponentModel.ISupportInitialize)(this.chtQuietTime)).BeginInit();
            this.tabRawData.SuspendLayout();
            ((System.ComponentModel.ISupportInitialize)(this.chtRawData)).BeginInit();
            this.tabIVCurve.SuspendLayout();
            ((System.ComponentModel.ISupportInitialize)(this.chtIVCurve)).BeginInit();
            this.stpPlotting.SuspendLayout();
            this.SuspendLayout();
            // 
            // tbcPlotTabs
            // 
            this.tbcPlotTabs.Controls.Add(this.tabDeposition);
            this.tbcPlotTabs.Controls.Add(this.tabQuietTime);
            this.tbcPlotTabs.Controls.Add(this.tabRawData);
            this.tbcPlotTabs.Controls.Add(this.tabIVCurve);
            this.tbcPlotTabs.Location = new System.Drawing.Point(3, 62);
            this.tbcPlotTabs.Name = "tbcPlotTabs";
            this.tbcPlotTabs.SelectedIndex = 0;
            this.tbcPlotTabs.Size = new System.Drawing.Size(836, 535);
            this.tbcPlotTabs.TabIndex = 0;
            // 
            // tabDeposition
            // 
            this.tabDeposition.Controls.Add(this.chtDeposition);
            this.tabDeposition.Location = new System.Drawing.Point(4, 22);
            this.tabDeposition.Name = "tabDeposition";
            this.tabDeposition.Padding = new System.Windows.Forms.Padding(3);
            this.tabDeposition.Size = new System.Drawing.Size(828, 509);
            this.tabDeposition.TabIndex = 0;
            this.tabDeposition.Text = "Deposition";
            this.tabDeposition.UseVisualStyleBackColor = true;
            // 
            // chtDeposition
            // 
            chartArea9.AxisX.IsMarginVisible = false;
            chartArea9.AxisX.LabelStyle.Format = "{0.####}";
            chartArea9.AxisX.Title = "Time (s)";
            chartArea9.AxisY.LabelStyle.Format = "{0.####}";
            chartArea9.AxisY.Title = "Current (uA)";
            chartArea9.CursorX.Interval = 0.01D;
            chartArea9.CursorX.IsUserSelectionEnabled = true;
            chartArea9.CursorY.Interval = 0.01D;
            chartArea9.CursorY.IsUserSelectionEnabled = true;
            chartArea9.Name = "ChartArea1";
            this.chtDeposition.ChartAreas.Add(chartArea9);
            legend9.Name = "Legend1";
            this.chtDeposition.Legends.Add(legend9);
            this.chtDeposition.Location = new System.Drawing.Point(-4, 0);
            this.chtDeposition.Name = "chtDeposition";
            series9.ChartArea = "ChartArea1";
            series9.ChartType = System.Windows.Forms.DataVisualization.Charting.SeriesChartType.FastLine;
            series9.Legend = "Legend1";
            series9.Name = "Series1";
            this.chtDeposition.Series.Add(series9);
            this.chtDeposition.Size = new System.Drawing.Size(836, 513);
            this.chtDeposition.TabIndex = 0;
            this.chtDeposition.Text = "Deposition";
            title9.Font = new System.Drawing.Font("Microsoft Sans Serif", 14.25F, System.Drawing.FontStyle.Bold, System.Drawing.GraphicsUnit.Point, ((byte)(0)));
            title9.Name = "Deposition";
            title9.Text = "Deposition";
            this.chtDeposition.Titles.Add(title9);
            this.chtDeposition.VisibleChanged += new System.EventHandler(this.cht_VisibleChanged);
            this.chtDeposition.Paint += new System.Windows.Forms.PaintEventHandler(this.cht_Paint);
            this.chtDeposition.MouseDown += new System.Windows.Forms.MouseEventHandler(this.cht_MouseDown);
            this.chtDeposition.MouseEnter += new System.EventHandler(this.cht_MouseEnter);
            this.chtDeposition.MouseLeave += new System.EventHandler(this.cht_MouseLeave);
            this.chtDeposition.MouseHover += new System.EventHandler(this.cht_MouseHover);
            this.chtDeposition.MouseMove += new System.Windows.Forms.MouseEventHandler(this.cht_MouseMove);
            // 
            // tabQuietTime
            // 
            this.tabQuietTime.Controls.Add(this.chtQuietTime);
            this.tabQuietTime.Location = new System.Drawing.Point(4, 22);
            this.tabQuietTime.Name = "tabQuietTime";
            this.tabQuietTime.Padding = new System.Windows.Forms.Padding(3);
            this.tabQuietTime.Size = new System.Drawing.Size(828, 509);
            this.tabQuietTime.TabIndex = 1;
            this.tabQuietTime.Text = "Quiet Time";
            this.tabQuietTime.UseVisualStyleBackColor = true;
            // 
            // chtQuietTime
            // 
            chartArea10.AxisX.IsMarginVisible = false;
            chartArea10.AxisX.LabelStyle.Format = "{0.####}";
            chartArea10.AxisX.Title = "Time (s)";
            chartArea10.AxisY.LabelStyle.Format = "{0.####}";
            chartArea10.AxisY.Title = "Current (uA)";
            chartArea10.CursorX.Interval = 0.01D;
            chartArea10.CursorX.IsUserSelectionEnabled = true;
            chartArea10.CursorY.Interval = 0.01D;
            chartArea10.CursorY.IsUserSelectionEnabled = true;
            chartArea10.Name = "ChartArea1";
            this.chtQuietTime.ChartAreas.Add(chartArea10);
            legend10.Name = "Legend1";
            this.chtQuietTime.Legends.Add(legend10);
            this.chtQuietTime.Location = new System.Drawing.Point(-4, 0);
            this.chtQuietTime.Name = "chtQuietTime";
            series10.ChartArea = "ChartArea1";
            series10.ChartType = System.Windows.Forms.DataVisualization.Charting.SeriesChartType.FastLine;
            series10.Legend = "Legend1";
            series10.Name = "Series1";
            this.chtQuietTime.Series.Add(series10);
            this.chtQuietTime.Size = new System.Drawing.Size(836, 513);
            this.chtQuietTime.TabIndex = 0;
            this.chtQuietTime.Text = "Quiet Time";
            title10.Font = new System.Drawing.Font("Microsoft Sans Serif", 14.25F, System.Drawing.FontStyle.Bold, System.Drawing.GraphicsUnit.Point, ((byte)(0)));
            title10.Name = "Title1";
            title10.Text = "Quiet Time";
            this.chtQuietTime.Titles.Add(title10);
            this.chtQuietTime.VisibleChanged += new System.EventHandler(this.cht_VisibleChanged);
            this.chtQuietTime.Paint += new System.Windows.Forms.PaintEventHandler(this.cht_Paint);
            this.chtQuietTime.MouseDown += new System.Windows.Forms.MouseEventHandler(this.cht_MouseDown);
            this.chtQuietTime.MouseEnter += new System.EventHandler(this.cht_MouseEnter);
            this.chtQuietTime.MouseLeave += new System.EventHandler(this.cht_MouseLeave);
            this.chtQuietTime.MouseHover += new System.EventHandler(this.cht_MouseHover);
            this.chtQuietTime.MouseMove += new System.Windows.Forms.MouseEventHandler(this.cht_MouseMove);
            // 
            // tabRawData
            // 
            this.tabRawData.Controls.Add(this.chtRawData);
            this.tabRawData.Location = new System.Drawing.Point(4, 22);
            this.tabRawData.Name = "tabRawData";
            this.tabRawData.Size = new System.Drawing.Size(828, 509);
            this.tabRawData.TabIndex = 2;
            this.tabRawData.Text = "Raw Data";
            this.tabRawData.UseVisualStyleBackColor = true;
            // 
            // chtRawData
            // 
            chartArea11.AxisX.IsMarginVisible = false;
            chartArea11.AxisX.LabelStyle.Format = "{0.}";
            chartArea11.AxisX.Title = "Sample Number";
            chartArea11.AxisY.LabelStyle.Format = "{0.}";
            chartArea11.AxisY.Title = "Data Value";
            chartArea11.CursorX.Interval = 0.01D;
            chartArea11.CursorX.IsUserSelectionEnabled = true;
            chartArea11.CursorX.LineDashStyle = System.Windows.Forms.DataVisualization.Charting.ChartDashStyle.Dash;
            chartArea11.CursorY.Interval = 0.01D;
            chartArea11.CursorY.IsUserSelectionEnabled = true;
            chartArea11.Name = "ChartArea1";
            this.chtRawData.ChartAreas.Add(chartArea11);
            legend11.Name = "Legend1";
            this.chtRawData.Legends.Add(legend11);
            this.chtRawData.Location = new System.Drawing.Point(-4, 0);
            this.chtRawData.Name = "chtRawData";
            series11.ChartArea = "ChartArea1";
            series11.ChartType = System.Windows.Forms.DataVisualization.Charting.SeriesChartType.FastLine;
            series11.Legend = "Legend1";
            series11.Name = "Series1";
            this.chtRawData.Series.Add(series11);
            this.chtRawData.Size = new System.Drawing.Size(836, 513);
            this.chtRawData.TabIndex = 0;
            this.chtRawData.Text = "Raw Data";
            title11.Font = new System.Drawing.Font("Microsoft Sans Serif", 14.25F, System.Drawing.FontStyle.Bold, System.Drawing.GraphicsUnit.Point, ((byte)(0)));
            title11.Name = "Title1";
            title11.Text = "Raw Data";
            this.chtRawData.Titles.Add(title11);
            this.chtRawData.VisibleChanged += new System.EventHandler(this.cht_VisibleChanged);
            this.chtRawData.Paint += new System.Windows.Forms.PaintEventHandler(this.cht_Paint);
            this.chtRawData.MouseDown += new System.Windows.Forms.MouseEventHandler(this.cht_MouseDown);
            this.chtRawData.MouseEnter += new System.EventHandler(this.cht_MouseEnter);
            this.chtRawData.MouseLeave += new System.EventHandler(this.cht_MouseLeave);
            this.chtRawData.MouseHover += new System.EventHandler(this.cht_MouseHover);
            this.chtRawData.MouseMove += new System.Windows.Forms.MouseEventHandler(this.cht_MouseMove);
            // 
            // tabIVCurve
            // 
            this.tabIVCurve.Controls.Add(this.chtIVCurve);
            this.tabIVCurve.Location = new System.Drawing.Point(4, 22);
            this.tabIVCurve.Name = "tabIVCurve";
            this.tabIVCurve.Size = new System.Drawing.Size(828, 509);
            this.tabIVCurve.TabIndex = 3;
            this.tabIVCurve.Text = "IV Curve";
            this.tabIVCurve.UseVisualStyleBackColor = true;
            // 
            // chtIVCurve
            // 
            chartArea12.AxisX.IsMarginVisible = false;
            chartArea12.AxisX.LabelStyle.Format = "{0.####}";
            chartArea12.AxisX.Title = "Voltage (mV)";
            chartArea12.AxisY.LabelStyle.Format = "{0.####}";
            chartArea12.AxisY.Title = "Current (uA)";
            chartArea12.CursorX.Interval = 0.01D;
            chartArea12.CursorX.IsUserSelectionEnabled = true;
            chartArea12.CursorY.Interval = 0.01D;
            chartArea12.CursorY.IsUserSelectionEnabled = true;
            chartArea12.Name = "ChartArea1";
            this.chtIVCurve.ChartAreas.Add(chartArea12);
            legend12.Name = "Legend1";
            this.chtIVCurve.Legends.Add(legend12);
            this.chtIVCurve.Location = new System.Drawing.Point(-4, 0);
            this.chtIVCurve.Name = "chtIVCurve";
            series12.ChartArea = "ChartArea1";
            series12.ChartType = System.Windows.Forms.DataVisualization.Charting.SeriesChartType.Line;
            series12.Legend = "Legend1";
            series12.Name = "Series1";
            this.chtIVCurve.Series.Add(series12);
            this.chtIVCurve.Size = new System.Drawing.Size(836, 513);
            this.chtIVCurve.TabIndex = 0;
            this.chtIVCurve.Text = "IV Curve";
            title12.Font = new System.Drawing.Font("Microsoft Sans Serif", 14.25F, System.Drawing.FontStyle.Bold, System.Drawing.GraphicsUnit.Point, ((byte)(0)));
            title12.Name = "Title1";
            title12.Text = "IV Curve";
            this.chtIVCurve.Titles.Add(title12);
            this.chtIVCurve.VisibleChanged += new System.EventHandler(this.cht_VisibleChanged);
            this.chtIVCurve.Paint += new System.Windows.Forms.PaintEventHandler(this.cht_Paint);
            this.chtIVCurve.MouseDown += new System.Windows.Forms.MouseEventHandler(this.cht_MouseDown);
            this.chtIVCurve.MouseEnter += new System.EventHandler(this.cht_MouseEnter);
            this.chtIVCurve.MouseLeave += new System.EventHandler(this.cht_MouseLeave);
            this.chtIVCurve.MouseHover += new System.EventHandler(this.cht_MouseHover);
            this.chtIVCurve.MouseMove += new System.Windows.Forms.MouseEventHandler(this.cht_MouseMove);
            // 
            // stpPlotting
            // 
            this.stpPlotting.AutoSize = false;
            this.stpPlotting.ImageScalingSize = new System.Drawing.Size(47, 40);
            this.stpPlotting.Items.AddRange(new System.Windows.Forms.ToolStripItem[] {
            this.btnPicToFile,
            this.btnPicToClip,
            this.toolStripSeparator1,
            this.btnDataToFile,
            this.btnDataToClip,
            this.toolStripSeparator2,
            this.btnSelectAll,
            this.btnDeselectAll,
            this.toolStripSeparator4,
            this.btnZoomXY,
            this.btnZoomX,
            this.btnZoomY,
            this.toolStripSeparator3,
            this.btnPeakCalc,
            this.btnClearSelectedCalcs,
            this.btnClearCalcs,
            this.toolStripSeparator5});
            this.stpPlotting.Location = new System.Drawing.Point(0, 0);
            this.stpPlotting.Name = "stpPlotting";
            this.stpPlotting.Size = new System.Drawing.Size(842, 50);
            this.stpPlotting.TabIndex = 1;
            this.stpPlotting.Text = "Plotting Toolstrip";
            // 
            // btnPicToFile
            // 
            this.btnPicToFile.DisplayStyle = System.Windows.Forms.ToolStripItemDisplayStyle.Image;
            this.btnPicToFile.Image = ((System.Drawing.Image)(resources.GetObject("btnPicToFile.Image")));
            this.btnPicToFile.ImageTransparentColor = System.Drawing.Color.White;
            this.btnPicToFile.Name = "btnPicToFile";
            this.btnPicToFile.Size = new System.Drawing.Size(51, 47);
            this.btnPicToFile.Text = "Save Image to File";
            this.btnPicToFile.Click += new System.EventHandler(this.btnPicToFile_Click);
            // 
            // btnPicToClip
            // 
            this.btnPicToClip.DisplayStyle = System.Windows.Forms.ToolStripItemDisplayStyle.Image;
            this.btnPicToClip.Image = ((System.Drawing.Image)(resources.GetObject("btnPicToClip.Image")));
            this.btnPicToClip.ImageTransparentColor = System.Drawing.Color.White;
            this.btnPicToClip.Name = "btnPicToClip";
            this.btnPicToClip.Size = new System.Drawing.Size(51, 47);
            this.btnPicToClip.Text = "Save Image to Clipboard";
            this.btnPicToClip.Click += new System.EventHandler(this.btnPicToClip_Click);
            // 
            // toolStripSeparator1
            // 
            this.toolStripSeparator1.Name = "toolStripSeparator1";
            this.toolStripSeparator1.Size = new System.Drawing.Size(6, 50);
            // 
            // btnDataToFile
            // 
            this.btnDataToFile.DisplayStyle = System.Windows.Forms.ToolStripItemDisplayStyle.Image;
            this.btnDataToFile.Image = ((System.Drawing.Image)(resources.GetObject("btnDataToFile.Image")));
            this.btnDataToFile.ImageTransparentColor = System.Drawing.Color.White;
            this.btnDataToFile.Name = "btnDataToFile";
            this.btnDataToFile.Size = new System.Drawing.Size(51, 47);
            this.btnDataToFile.Text = "Save Data to CSV File";
            this.btnDataToFile.Click += new System.EventHandler(this.btnDataToFile_Click);
            // 
            // btnDataToClip
            // 
            this.btnDataToClip.DisplayStyle = System.Windows.Forms.ToolStripItemDisplayStyle.Image;
            this.btnDataToClip.Image = ((System.Drawing.Image)(resources.GetObject("btnDataToClip.Image")));
            this.btnDataToClip.ImageTransparentColor = System.Drawing.Color.Magenta;
            this.btnDataToClip.Name = "btnDataToClip";
            this.btnDataToClip.Size = new System.Drawing.Size(51, 47);
            this.btnDataToClip.Text = "Save Data to Clipboard";
            this.btnDataToClip.Click += new System.EventHandler(this.btnDataToClip_Click);
            // 
            // toolStripSeparator2
            // 
            this.toolStripSeparator2.Name = "toolStripSeparator2";
            this.toolStripSeparator2.Size = new System.Drawing.Size(6, 50);
            // 
            // btnSelectAll
            // 
            this.btnSelectAll.DisplayStyle = System.Windows.Forms.ToolStripItemDisplayStyle.Image;
            this.btnSelectAll.Image = ((System.Drawing.Image)(resources.GetObject("btnSelectAll.Image")));
            this.btnSelectAll.ImageTransparentColor = System.Drawing.Color.White;
            this.btnSelectAll.Name = "btnSelectAll";
            this.btnSelectAll.Size = new System.Drawing.Size(51, 47);
            this.btnSelectAll.Text = "SelectAll";
            this.btnSelectAll.ToolTipText = "Select All";
            this.btnSelectAll.Click += new System.EventHandler(this.btnSelectAll_Click);
            // 
            // btnDeselectAll
            // 
            this.btnDeselectAll.DisplayStyle = System.Windows.Forms.ToolStripItemDisplayStyle.Image;
            this.btnDeselectAll.Image = ((System.Drawing.Image)(resources.GetObject("btnDeselectAll.Image")));
            this.btnDeselectAll.ImageTransparentColor = System.Drawing.Color.White;
            this.btnDeselectAll.Name = "btnDeselectAll";
            this.btnDeselectAll.Size = new System.Drawing.Size(51, 47);
            this.btnDeselectAll.Text = "DeselectAll";
            this.btnDeselectAll.ToolTipText = "Deselect All";
            this.btnDeselectAll.Click += new System.EventHandler(this.btnDeselectAll_Click);
            // 
            // toolStripSeparator4
            // 
            this.toolStripSeparator4.Name = "toolStripSeparator4";
            this.toolStripSeparator4.Size = new System.Drawing.Size(6, 50);
            // 
            // btnZoomXY
            // 
            this.btnZoomXY.Checked = true;
            this.btnZoomXY.CheckState = System.Windows.Forms.CheckState.Checked;
            this.btnZoomXY.DisplayStyle = System.Windows.Forms.ToolStripItemDisplayStyle.Image;
            this.btnZoomXY.Image = global::AquaSift_V_00_01.Properties.Resources.zoomxy;
            this.btnZoomXY.ImageTransparentColor = System.Drawing.Color.White;
            this.btnZoomXY.Name = "btnZoomXY";
            this.btnZoomXY.Size = new System.Drawing.Size(51, 47);
            this.btnZoomXY.Text = "Zoom XY";
            this.btnZoomXY.Click += new System.EventHandler(this.btnZoomXY_Click);
            // 
            // btnZoomX
            // 
            this.btnZoomX.DisplayStyle = System.Windows.Forms.ToolStripItemDisplayStyle.Image;
            this.btnZoomX.Image = ((System.Drawing.Image)(resources.GetObject("btnZoomX.Image")));
            this.btnZoomX.ImageTransparentColor = System.Drawing.Color.White;
            this.btnZoomX.Name = "btnZoomX";
            this.btnZoomX.Size = new System.Drawing.Size(51, 47);
            this.btnZoomX.Text = "Zoom X";
            this.btnZoomX.Click += new System.EventHandler(this.btnZoomX_Click);
            // 
            // btnZoomY
            // 
            this.btnZoomY.DisplayStyle = System.Windows.Forms.ToolStripItemDisplayStyle.Image;
            this.btnZoomY.Image = global::AquaSift_V_00_01.Properties.Resources.zoomy;
            this.btnZoomY.ImageTransparentColor = System.Drawing.Color.White;
            this.btnZoomY.Name = "btnZoomY";
            this.btnZoomY.Size = new System.Drawing.Size(51, 47);
            this.btnZoomY.Text = "Zoom Y";
            this.btnZoomY.Click += new System.EventHandler(this.btnZoomY_Click);
            // 
            // toolStripSeparator3
            // 
            this.toolStripSeparator3.Name = "toolStripSeparator3";
            this.toolStripSeparator3.Size = new System.Drawing.Size(6, 50);
            // 
            // btnPeakCalc
            // 
            this.btnPeakCalc.DisplayStyle = System.Windows.Forms.ToolStripItemDisplayStyle.Image;
            this.btnPeakCalc.Image = ((System.Drawing.Image)(resources.GetObject("btnPeakCalc.Image")));
            this.btnPeakCalc.ImageTransparentColor = System.Drawing.Color.White;
            this.btnPeakCalc.Name = "btnPeakCalc";
            this.btnPeakCalc.Size = new System.Drawing.Size(51, 47);
            this.btnPeakCalc.Text = "Peak Calculator";
            this.btnPeakCalc.Click += new System.EventHandler(this.btnPeakCalc_Click);
            // 
            // btnClearCalcs
            // 
            this.btnClearCalcs.DisplayStyle = System.Windows.Forms.ToolStripItemDisplayStyle.Image;
            this.btnClearCalcs.Image = ((System.Drawing.Image)(resources.GetObject("btnClearCalcs.Image")));
            this.btnClearCalcs.ImageTransparentColor = System.Drawing.Color.White;
            this.btnClearCalcs.Name = "btnClearCalcs";
            this.btnClearCalcs.Size = new System.Drawing.Size(51, 47);
            this.btnClearCalcs.Text = "Clear All Calculations";
            this.btnClearCalcs.Click += new System.EventHandler(this.btnClearCalcs_Click);
            // 
            // toolStripSeparator5
            // 
            this.toolStripSeparator5.Name = "toolStripSeparator5";
            this.toolStripSeparator5.Size = new System.Drawing.Size(6, 50);
            // 
            // btnClearSelectedCalcs
            // 
            this.btnClearSelectedCalcs.DisplayStyle = System.Windows.Forms.ToolStripItemDisplayStyle.Image;
            this.btnClearSelectedCalcs.Image = ((System.Drawing.Image)(resources.GetObject("btnClearSelectedCalcs.Image")));
            this.btnClearSelectedCalcs.ImageTransparentColor = System.Drawing.Color.White;
            this.btnClearSelectedCalcs.Name = "btnClearSelectedCalcs";
            this.btnClearSelectedCalcs.Size = new System.Drawing.Size(51, 47);
            this.btnClearSelectedCalcs.Text = "Clear Selected Calculations";
            this.btnClearSelectedCalcs.Click += new System.EventHandler(this.btnClearSelectedCalcs_Click);
            // 
            // AqPlotter
            // 
            this.AutoScaleDimensions = new System.Drawing.SizeF(6F, 13F);
            this.AutoScaleMode = System.Windows.Forms.AutoScaleMode.Font;
            this.Controls.Add(this.stpPlotting);
            this.Controls.Add(this.tbcPlotTabs);
            this.Name = "AqPlotter";
            this.Size = new System.Drawing.Size(842, 597);
            this.tbcPlotTabs.ResumeLayout(false);
            this.tabDeposition.ResumeLayout(false);
            ((System.ComponentModel.ISupportInitialize)(this.chtDeposition)).EndInit();
            this.tabQuietTime.ResumeLayout(false);
            ((System.ComponentModel.ISupportInitialize)(this.chtQuietTime)).EndInit();
            this.tabRawData.ResumeLayout(false);
            ((System.ComponentModel.ISupportInitialize)(this.chtRawData)).EndInit();
            this.tabIVCurve.ResumeLayout(false);
            ((System.ComponentModel.ISupportInitialize)(this.chtIVCurve)).EndInit();
            this.stpPlotting.ResumeLayout(false);
            this.stpPlotting.PerformLayout();
            this.ResumeLayout(false);

        }

        #endregion

        public System.Windows.Forms.TabControl tbcPlotTabs;
        public System.Windows.Forms.TabPage tabDeposition;
        public System.Windows.Forms.DataVisualization.Charting.Chart chtDeposition;
        public System.Windows.Forms.TabPage tabQuietTime;
        public System.Windows.Forms.TabPage tabRawData;
        public System.Windows.Forms.TabPage tabIVCurve;
        public System.Windows.Forms.ToolStrip stpPlotting;
        public System.Windows.Forms.DataVisualization.Charting.Chart chtQuietTime;
        public System.Windows.Forms.DataVisualization.Charting.Chart chtRawData;
        public System.Windows.Forms.DataVisualization.Charting.Chart chtIVCurve;
        private System.Windows.Forms.ToolStripButton btnPicToFile;
        private System.Windows.Forms.ToolStripButton btnPicToClip;
        private System.Windows.Forms.ToolStripSeparator toolStripSeparator1;
        private System.Windows.Forms.ToolStripButton btnDataToFile;
        private System.Windows.Forms.ToolStripButton btnDataToClip;
        private System.Windows.Forms.ToolStripSeparator toolStripSeparator2;
        private System.Windows.Forms.ToolStripButton btnZoomXY;
        private System.Windows.Forms.ToolStripButton btnZoomX;
        private System.Windows.Forms.ToolStripButton btnZoomY;
        private System.Windows.Forms.ToolStripSeparator toolStripSeparator3;
        private System.Windows.Forms.ToolStripButton btnSelectAll;
        private System.Windows.Forms.ToolStripButton btnDeselectAll;
        private System.Windows.Forms.ToolStripSeparator toolStripSeparator4;
        private System.Windows.Forms.ToolStripButton btnPeakCalc;
        private System.Windows.Forms.ToolStripButton btnClearCalcs;
        private System.Windows.Forms.ToolStripSeparator toolStripSeparator5;
        private System.Windows.Forms.ToolStripButton btnClearSelectedCalcs;
    }
}
