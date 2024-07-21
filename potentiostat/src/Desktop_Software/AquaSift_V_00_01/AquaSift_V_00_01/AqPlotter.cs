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
using System.Diagnostics;
using System.IO;
using System.Collections.Specialized;
using System.Threading;

namespace AquaSift_V_00_01
{
    public enum clickStates
    {
        CLICK_IDLE, CLICK_1
    };

    public partial class AqPlotter : UserControl
    {

        /*******************************************PlotCalc Class******************************************/

        //Simple class to keep track of peak calculation graph data.
        private class PlotCalc
        {
            public DataPoint click1 = new DataPoint();
            public DataPoint click2 = new DataPoint();
            public DataPoint midSlope = new DataPoint();
            public DataPoint peak = new DataPoint();

            public String parentSeriesString;
            public String thisSeriesString;
            public Series parentSeriesPointer;
            public Series thisSeriesPointer;
            public Chart chartPointer;

            public PlotCalc() { }

            //Copy constructor.
            public PlotCalc(PlotCalc pc)
            {
                copyFrom(pc);
            }

            public void copyFrom(PlotCalc pc)
            {
                //Copy data points.
                click1.XValue = pc.click1.XValue;
                click1.YValues = pc.click1.YValues;
                click2.XValue = pc.click2.XValue;
                click2.YValues = pc.click2.YValues;
                midSlope.XValue = pc.midSlope.XValue;
                midSlope.YValues = pc.midSlope.YValues;
                peak.XValue = pc.peak.XValue;
                peak.YValues = pc.peak.YValues;

                //Copy pointers to identifiers.
                parentSeriesString = pc.parentSeriesString;
                thisSeriesString = pc.thisSeriesString;
                parentSeriesPointer = pc.parentSeriesPointer;
                thisSeriesPointer = pc.thisSeriesPointer;
                chartPointer = pc.chartPointer;
            }
        }

        /**************************************AqPlotter Class Variables************************************/

        AquaSift aq;//Pointer to main form.

        public const double ZOOM_FACTOR = .9;
        public const double SHRINK_FACTOR = 1.1;

        private ToolTip toolTip = new ToolTip();
        private Point? prevPosition = null;

        private bool depZoom = false;
        private bool quietZoom = false;
        private bool rawZoom = false;
        private bool ivZoom = false;

        private bool peakMode = false;//Used for peak calculation button.

        //Variables to keep track of series count changes.
        private int thisDepSeriesCount = 0;
        private int lastDepSeriesCount = 0;
        private int thisQuietSeriesCount = 0;
        private int lastQuietSeriesCount = 0;
        private int thisRawSeriesCount = 0;
        private int lastRawSeriesCount = 0;
        private int thisIVSeriesCount = 0;
        private int lastIVSeriesCount = 0;

        //State of the peak calculator.
        private clickStates clickState = clickStates.CLICK_IDLE;

        //Storage of all PlotCalc classes loaded intot he charts;
        List<PlotCalc> plotCalcs = new List<PlotCalc>();

        //Temp PlotCalc used for building current plot calculations.
        PlotCalc thisPlotCalc = new PlotCalc();

        //Temp list of tab pages to remove/add.
        public List<TabPage> tabPages = new List<TabPage>();
        public List<int> tabIndex = new List<int>();

        /******************************************Helper Functions*****************************************/

        public void chartZoomRestore(Chart c)
        {
            DataPoint xMax = new DataPoint();
            DataPoint xMin = new DataPoint();
            DataPoint yMax = new DataPoint();
            DataPoint yMin = new DataPoint();

            xMax.XValue = c.ChartAreas[0].AxisX.Maximum;
            xMin.XValue = c.ChartAreas[0].AxisX.Minimum;
            yMax.YValues[0] = c.ChartAreas[0].AxisY.Maximum;
            yMin.YValues[0] = c.ChartAreas[0].AxisY.Minimum;

            c.ChartAreas[0].AxisX.ScaleView.Position = xMin.XValue;
            c.ChartAreas[0].AxisX.ScaleView.Size = xMax.XValue - xMin.XValue;
            c.ChartAreas[0].AxisY.ScaleView.Position = yMin.YValues[0];
            c.ChartAreas[0].AxisY.ScaleView.Size = yMax.YValues[0] - yMin.YValues[0];
        }

        private void disableGUI()
        {
            aq.aqCon.Enabled = false;
            aq.tabControl1.Enabled = false;
            aq.dataTree.Enabled = false;
            stpPlotting.Enabled = false;
            aq.menMain.Enabled = false;

            //Get list of unselected tabs.
            for (int i = 0; i < tbcPlotTabs.TabCount; i++)
            {
                if (tbcPlotTabs.SelectedIndex != i)
                {
                    tabPages.Add(tbcPlotTabs.TabPages[i]);
                    tabIndex.Add(i);
                }
            }

            //Temporarily remove tabs.
            for (int i = 0; i < tabPages.Count; i++)
            {
                tbcPlotTabs.TabPages.Remove(tabPages[i]);
            }
        }

        private void enableGUI()
        {
            aq.aqCon.Enabled = true;
            aq.tabControl1.Enabled = true;
            aq.dataTree.Enabled = true;
            stpPlotting.Enabled = true;
            aq.menMain.Enabled = true;

            //Restore tabs.
            for (int i = 0; i < tabPages.Count; i++)
            {
                tbcPlotTabs.TabPages.Insert(tabIndex[i], tabPages[i]);
            }

            tabPages.Clear();
            tabIndex.Clear();
        }

        private void makeUniqueName(PlotCalc pc)
        {
            Boolean isUnique = false;
            int counter = 0;

            while (!isUnique)
            {
                isUnique = true;
                //Search series to make sure name is unique.
                for (int i = 0; i < pc.chartPointer.Series.Count(); i++)
                {
                    if (pc.chartPointer.Series[i].Name == pc.parentSeriesString + ", Calc" + counter)
                    {
                        //Increment counter and try again if duplicate found.
                        counter++;
                        isUnique = false;
                    }
                }
            }

            //Unique name found.  Set it in the calculation class.
            pc.thisSeriesString = pc.parentSeriesString + ", Calc" + counter;
        }

        /********************************************Constructor********************************************/

        public AqPlotter(AquaSift aqs)
        {
            aq = aqs;
            InitializeComponent();

            //Set the minumum size for everything.
            this.MinimumSize = new Size(500, 500);
            tbcPlotTabs.MinimumSize = new Size(500, 500);
            tabDeposition.MinimumSize = new Size(495, 436);
            tabQuietTime.MinimumSize = new Size(495, 436);
            tabRawData.MinimumSize = new Size(495, 436);
            tabIVCurve.MinimumSize = new Size(495, 436);
            chtDeposition.MinimumSize = new Size(495, 436);
            chtQuietTime.MinimumSize = new Size(495, 436);
            chtRawData.MinimumSize = new Size(495, 436);
            chtIVCurve.MinimumSize = new Size(495, 436);

            this.chtDeposition.MouseWheel += cht_MouseWheel;
            this.chtQuietTime.MouseWheel += cht_MouseWheel;
            this.chtRawData.MouseWheel += cht_MouseWheel;
            this.chtIVCurve.MouseWheel += cht_MouseWheel;
        }

        /***************************************Series Changed Handlers*************************************/

        private void cht_Paint(object sender, PaintEventArgs e)
        {
            //Get current counts.
            thisDepSeriesCount = chtDeposition.Series.Count;
            thisQuietSeriesCount = chtQuietTime.Series.Count;
            thisRawSeriesCount = chtRawData.Series.Count;
            thisIVSeriesCount = chtIVCurve.Series.Count;

            //Check if need to update graphs.
            if (thisDepSeriesCount < lastDepSeriesCount) seriesRemoved(sender);
            if (thisQuietSeriesCount < lastQuietSeriesCount) seriesRemoved(sender);
            if (thisRawSeriesCount < lastRawSeriesCount) seriesRemoved(sender);
            if (thisIVSeriesCount < lastIVSeriesCount) seriesRemoved(sender);

            //Update last counts.
            lastDepSeriesCount = thisDepSeriesCount;
            lastQuietSeriesCount = thisQuietSeriesCount;
            lastRawSeriesCount = thisRawSeriesCount;
            lastIVSeriesCount = thisIVSeriesCount;
        }

        private void cht_VisibleChanged(object sender, EventArgs e)
        {
            //Get current counts.
            thisDepSeriesCount = chtDeposition.Series.Count;
            thisQuietSeriesCount = chtQuietTime.Series.Count;
            thisRawSeriesCount = chtRawData.Series.Count;
            thisIVSeriesCount = chtIVCurve.Series.Count;

            //Check if need to update graphs.
            if (thisDepSeriesCount < lastDepSeriesCount) seriesRemoved(sender);
            if (thisQuietSeriesCount < lastQuietSeriesCount) seriesRemoved(sender);
            if (thisRawSeriesCount < lastRawSeriesCount) seriesRemoved(sender);
            if (thisIVSeriesCount < lastIVSeriesCount) seriesRemoved(sender);
            
            //Update last counts.
            lastDepSeriesCount = thisDepSeriesCount;
            lastQuietSeriesCount = thisQuietSeriesCount;
            lastRawSeriesCount = thisRawSeriesCount;
            lastIVSeriesCount = thisIVSeriesCount;
        }

        //Do stuff with the peak plots when a series is removed.
        private void seriesRemoved(object sender)
        {
            List<PlotCalc> deletePlotCalc = new List<PlotCalc>();

            foreach (PlotCalc pc in plotCalcs)
            {
                Chart c = pc.chartPointer;
                Boolean isFound = false;

                foreach (Series s in c.Series)
                {
                    if (s == pc.parentSeriesPointer)
                    {
                        System.Console.WriteLine("Found");
                        isFound = true;
                    }
                }

                //Remove series and PlotCalc entry.
                if (!isFound)
                {
                    c.Series.Remove(pc.thisSeriesPointer);
                    deletePlotCalc.Add(pc);
                }
            }

            //Now clear out the PlotCalc list.
            foreach (PlotCalc pc in deletePlotCalc) plotCalcs.Remove(pc);

            //If chart is empty, remove it from the graph.
            if (chtDeposition.Series.Count == 0) tbcPlotTabs.TabPages.Remove(tabDeposition);
            if (chtQuietTime.Series.Count == 0) tbcPlotTabs.TabPages.Remove(tabQuietTime);
            if (chtRawData.Series.Count == 0) tbcPlotTabs.TabPages.Remove(tabRawData);
            if (chtIVCurve.Series.Count == 0) tbcPlotTabs.TabPages.Remove(tabIVCurve);
        }

        /****************************************Mouse Event Handlers***************************************/

        public void cht_MouseWheel(object sender, MouseEventArgs e)
        {
            Chart c = (Chart)sender;
            c.ChartAreas[0].AxisX.ScaleView.Zoomable = true;
            c.ChartAreas[0].AxisY.ScaleView.Zoomable = true;

            double oldStartx = c.ChartAreas[0].AxisX.ScaleView.Position;
            double oldSizex = c.ChartAreas[0].AxisX.ScaleView.Size;
            double mousex = c.ChartAreas[0].AxisX.PixelPositionToValue(e.X);
            double percentx = (mousex - oldStartx) / oldSizex;

            double oldStarty = c.ChartAreas[0].AxisY.ScaleView.Position;
            double oldSizey = c.ChartAreas[0].AxisY.ScaleView.Size;
            double mousey = c.ChartAreas[0].AxisY.PixelPositionToValue(e.Y);
            double percenty = (mousey - oldStarty) / oldSizey;

            double newSizex, newStartx, newSizey, newStarty;

            if (e.Delta > 0)
            {
                if (btnZoomXY.Checked || btnZoomX.Checked)
                    newSizex = ZOOM_FACTOR * oldSizex;
                else
                    newSizex = oldSizex;

                if (btnZoomXY.Checked || btnZoomY.Checked)
                    newSizey = ZOOM_FACTOR * oldSizey;
                else
                    newSizey = oldSizey;
            }
            else if (e.Delta < 0)
            {
                if (btnZoomXY.Checked || btnZoomX.Checked)
                    newSizex = SHRINK_FACTOR * oldSizex;
                else
                    newSizex = oldSizex;

                if (btnZoomXY.Checked || btnZoomY.Checked)
                    newSizey = SHRINK_FACTOR * oldSizey;
                else
                    newSizey = oldSizey;
            }
            else
            {
                newSizex = oldSizex;
                newSizey = oldSizey;
            }

            newStartx = mousex - percentx * newSizex;
            newStarty = mousey - percenty * newSizey;

            c.ChartAreas[0].AxisX.ScaleView.Position = newStartx;
            c.ChartAreas[0].AxisX.ScaleView.Size = newSizex;
            c.ChartAreas[0].AxisY.ScaleView.Position = newStarty;
            c.ChartAreas[0].AxisY.ScaleView.Size = newSizey;
        }

        public void cht_MouseDown(object sender, MouseEventArgs e)
        {
            var pos = e.Location;
            thisPlotCalc.chartPointer = (Chart)sender;

            if (e.Button == MouseButtons.Left && e.Clicks == 1)
            {
                //Do peak calculation stuff.
                if (btnPeakCalc.Checked && clickState == clickStates.CLICK_IDLE)
                {
                    //Check if on a data series.
                    var results = thisPlotCalc.chartPointer.HitTest(pos.X, pos.Y, false, ChartElementType.DataPoint);

                    //Get first hit in the results array.
                    var result = results[0];

                    if (result.ChartElementType == ChartElementType.DataPoint)
                    {
                        //Disable other GUI components.
                        disableGUI();

                        //Save parent series info.
                        thisPlotCalc.parentSeriesString = result.Series.Name;
                        thisPlotCalc.parentSeriesPointer = result.Series;

                        //Create unique name for this series based on parent.
                        makeUniqueName(thisPlotCalc);

                        //Create new series for the plot calculations.
                        Series s = new Series();
                        s.ChartType = SeriesChartType.Line;
                        s.Name = thisPlotCalc.thisSeriesString;

                        //Place new series in the chart series.
                        thisPlotCalc.chartPointer.Series.Add(s);

                        //Update series pointer in working PlotCalc object.
                        thisPlotCalc.thisSeriesPointer = thisPlotCalc.chartPointer.Series[thisPlotCalc.chartPointer.Series.Count - 1];

                        var xVal = result.ChartArea.AxisX.PixelPositionToValue(pos.X);
                        var yVal = result.ChartArea.AxisY.PixelPositionToValue(pos.Y);

                        //Place first data point in the PlotCalc object.
                        thisPlotCalc.click1 = new DataPoint(xVal, yVal);
                        thisPlotCalc.click2 = new DataPoint(xVal, yVal);

                        //Add the first data point to the chart twice.
                        thisPlotCalc.thisSeriesPointer.Points.Add(thisPlotCalc.click1);
                        thisPlotCalc.thisSeriesPointer.Points.Add(thisPlotCalc.click2);

                        //Add label to first click point.
                        thisPlotCalc.thisSeriesPointer.Points[0].Label = "X=" + String.Format("{0:0.##}", thisPlotCalc.click1.XValue) +
                                                                         ",Y=" + String.Format("{0:0.##}", thisPlotCalc.click1.YValues[0]);

                        //Update the plot calculation state machine.
                        clickState = clickStates.CLICK_1;
                    }
                }

                //Finish peak calculations.
                else if (btnPeakCalc.Checked && clickState == clickStates.CLICK_1)
                {
                    var xVal1 = thisPlotCalc.chartPointer.ChartAreas[0].AxisX.PixelPositionToValue(pos.X);
                    var yVal1 = thisPlotCalc.chartPointer.ChartAreas[0].AxisY.PixelPositionToValue(pos.Y);

                    DataPoint dp = new DataPoint(xVal1, yVal1);

                    //Update data series while moving.
                    thisPlotCalc.thisSeriesPointer.Points.RemoveAt(thisPlotCalc.thisSeriesPointer.Points.Count - 1);
                    thisPlotCalc.thisSeriesPointer.Points.Add(dp);

                    var results = ((Chart)sender).HitTest(pos.X, pos.Y, false, ChartElementType.DataPoint);
                    HitTestResult result = results[0];
                    Boolean sameSeries = false;

                    //Check to see if a data point from the same series is under the mouse cursor.
                    for (int i = 0; i < results.Count(); i++)
                    {
                        if (results[i].Series == thisPlotCalc.parentSeriesPointer)
                        {
                            sameSeries = true;
                            result = results[i];
                        }
                    }

                    //Add dataPoint to the series if same series af first click.
                    if (sameSeries)
                    {
                        double biggestDifference = 0;
                        double parentY = 0, parentX = 0;
                        DataPoint difPoint = new DataPoint();

                        //Place second click point on the graph.
                        thisPlotCalc.click2.XValue = xVal1;
                        thisPlotCalc.click2.YValues[0] = yVal1;

                        //Add label to second click point.
                        thisPlotCalc.thisSeriesPointer.Points[1].Label = "X=" + String.Format("{0:0.##}", thisPlotCalc.click2.XValue) +
                                                                         ",Y=" + String.Format("{0:0.##}", thisPlotCalc.click2.YValues[0]);

                        //Loop through all the parent datapoints and see if the data points are in the same interval as the calc series.
                        for (int i = 0; i < thisPlotCalc.parentSeriesPointer.Points.Count(); i++)
                        {
                            //Get parent data points.
                            parentX = thisPlotCalc.parentSeriesPointer.Points[i].XValue;
                            parentY = thisPlotCalc.parentSeriesPointer.Points[i].YValues[0];

                            //Check if it falls between the calc points.
                            if ((parentX >= thisPlotCalc.click1.XValue && parentX <= thisPlotCalc.click2.XValue) ||
                               (parentX <= thisPlotCalc.click1.XValue && parentX >= thisPlotCalc.click2.XValue))
                            {
                                //Calculate slope of calc line.
                                double slope = (thisPlotCalc.click1.YValues[0] - thisPlotCalc.click2.YValues[0]) /
                                               (thisPlotCalc.click1.XValue - thisPlotCalc.click2.XValue);

                                //Calculate total rise from start of plot calc to current parent x value.
                                double totalRise = slope * (parentX - thisPlotCalc.click1.XValue);

                                //Calculate dy from parent data point to plot calc data point.
                                double dy = parentY - (thisPlotCalc.click1.YValues[0] + totalRise);

                                //See if this is the biggest difference so far.
                                if (Math.Abs(dy) > Math.Abs(biggestDifference))
                                {
                                    biggestDifference = dy;
                                    difPoint.XValue = parentX;
                                    difPoint.YValues[0] = thisPlotCalc.click1.YValues[0] + totalRise;
                                }
                            }
                        }

                        //Add point of greatest difference to the graph.
                        thisPlotCalc.thisSeriesPointer.Points.Add(difPoint);

                        //Add point to PlotCalc object.
                        thisPlotCalc.midSlope = new DataPoint(difPoint.XValue, difPoint.YValues[0]);

                        //Add label to mid slope point.
                        thisPlotCalc.thisSeriesPointer.Points[2].Label = "X=" + String.Format("{0:0.##}", thisPlotCalc.midSlope.XValue) +
                                                                         ",Y=" + String.Format("{0:0.##}", thisPlotCalc.midSlope.YValues[0]) +
                                                                         ",dx=" + String.Format("{0:0.##}", Math.Abs(thisPlotCalc.click2.XValue -
                                                                         thisPlotCalc.click1.XValue));

                        //Add final data point graph.
                        thisPlotCalc.thisSeriesPointer.Points.Add(new DataPoint(difPoint.XValue, difPoint.YValues[0] + biggestDifference));

                        //Add peak point to PlotCalc object.
                        thisPlotCalc.peak = new DataPoint(difPoint.XValue, difPoint.YValues[0] + biggestDifference);

                        //Add label to peak point.
                        thisPlotCalc.thisSeriesPointer.Points[3].Label = "X=" + String.Format("{0:0.##}", thisPlotCalc.peak.XValue) +
                                                                         ",Y=" + String.Format("{0:0.##}", thisPlotCalc.peak.YValues[0]) +
                                                                         ",dy=" + String.Format("{0:0.##}", Math.Abs(thisPlotCalc.peak.YValues[0] -
                                                                         thisPlotCalc.midSlope.YValues[0]));

                        thisPlotCalc.thisSeriesPointer.Points[0].MarkerStyle = MarkerStyle.Circle;
                        thisPlotCalc.thisSeriesPointer.Points[1].MarkerStyle = MarkerStyle.Circle;
                        thisPlotCalc.thisSeriesPointer.Points[2].MarkerStyle = MarkerStyle.Circle;
                        thisPlotCalc.thisSeriesPointer.Points[3].MarkerStyle = MarkerStyle.Circle;

                        //Add plot calculation to list of PlotCalcs.
                        plotCalcs.Add(new PlotCalc(thisPlotCalc));

                        //Reset state machine.
                        clickState = clickStates.CLICK_IDLE;

                        //Enable GUI.
                        enableGUI();
                    }
                }

                else
                {
                    var results = ((Chart)sender).HitTest(pos.X, pos.Y, false, ChartElementType.DataPoint);

                    foreach (var result in results)
                    {
                        if (result.ChartElementType == ChartElementType.DataPoint)
                        {
                            if (result.Series.BorderWidth == 1)
                            {
                                result.Series.BorderWidth = 5;
                            }
                            else
                            {
                                result.Series.BorderWidth = 1;
                            }
                        }
                    }
                }
            }

            //Cancel plot calculation if active.
            if (e.Button == MouseButtons.Right && e.Clicks == 1 && clickState == clickStates.CLICK_1)
            {
                enableGUI();
                clickState = clickStates.CLICK_IDLE;
                thisPlotCalc.chartPointer.Series.Remove(thisPlotCalc.thisSeriesPointer);
            }
            //Cancel plotting if right-click while idle.
            else if (e.Button == MouseButtons.Right && e.Clicks == 1 && clickState == clickStates.CLICK_IDLE)
            {
                btnPeakCalc.Checked = false;
                ((Chart)sender).Cursor = Cursors.Default;
                peakMode = false;
            }

            if (e.Button == MouseButtons.Left && e.Clicks == 2)
            {
                chartZoomRestore((Chart)sender);
            }
        }

        public void cht_MouseHover(object sender, EventArgs e)
        {
            //Stupid hack to get mousewheel zoom working.            
            if (sender == chtDeposition && !depZoom)
            {
                depZoom = true;
                chartZoomRestore(chtDeposition);
            }
            else if (sender == chtQuietTime && !quietZoom)
            {
                quietZoom = true;
                chartZoomRestore(chtQuietTime);
            }
            else if (sender == chtRawData && !rawZoom)
            {
                rawZoom = true;
                chartZoomRestore(chtRawData);
            }
            else if (sender == chtIVCurve && !ivZoom)
            {
                ivZoom = true;
                chartZoomRestore(chtIVCurve);
            }

            ((Chart)sender).Focus();
        }

        public void cht_MouseLeave(object sender, EventArgs e)
        {
            //Unfocus the chart when mouse leaves to keep from throwing
            //an exception when the mouse wheel is moved.
            ((Chart)sender).Parent.Focus();
        }

        public void cht_MouseMove(object sender, MouseEventArgs e)
        {
            var pos = e.Location;

            if (prevPosition.HasValue && pos == prevPosition.Value) return;
            toolTip.RemoveAll();
            prevPosition = pos;

            if (clickState == clickStates.CLICK_1)//Update peak calculator.
            {
                var xVal1 = thisPlotCalc.chartPointer.ChartAreas[0].AxisX.PixelPositionToValue(pos.X);
                var yVal1 = thisPlotCalc.chartPointer.ChartAreas[0].AxisY.PixelPositionToValue(pos.Y);

                DataPoint dp = new DataPoint(xVal1, yVal1);

                //Update data series while moving.
                thisPlotCalc.thisSeriesPointer.Points.RemoveAt(thisPlotCalc.thisSeriesPointer.Points.Count - 1);
                thisPlotCalc.thisSeriesPointer.Points.Add(dp);

                var results = ((Chart)sender).HitTest(pos.X, pos.Y, false, ChartElementType.DataPoint);
                HitTestResult result = results[0];
                Boolean sameSeries = false;

                //Check to see if a data point from the same series is under the mouse cursor.
                for (int i = 0; i < results.Count(); i++)
                {
                    if (results[i].Series == thisPlotCalc.parentSeriesPointer)
                    {
                        sameSeries = true;
                        result = results[i];
                    }
                }

                //Place a tool tip on the chart if mouse over a valid data point from same series.
                if (sameSeries)
                {
                    var xVal = result.ChartArea.AxisX.PixelPositionToValue(pos.X);
                    var yVal = result.ChartArea.AxisY.PixelPositionToValue(pos.Y);
                    String.Format("{0:0.####}", xVal);
                    String.Format("{0:0.####}", yVal);

                    var seriesName = result.Series.Name;
                    toolTip.Show("X=" + String.Format("{0:0.####}", xVal) + ",Y=" + String.Format("{0:0.####}", yVal) +
                                 "," + seriesName, (Chart)sender, pos.X + 10, pos.Y - 15);
                }
            }

            //Do normal plotter stuff.
            else
            {
                var results = ((Chart)sender).HitTest(pos.X, pos.Y, false, ChartElementType.DataPoint);

                foreach (var result in results)
                {
                    if (result.ChartElementType == ChartElementType.DataPoint)
                    {
                        var xVal = result.ChartArea.AxisX.PixelPositionToValue(pos.X);
                        var yVal = result.ChartArea.AxisY.PixelPositionToValue(pos.Y);
                        String.Format("{0:0.####}", xVal);
                        String.Format("{0:0.####}", yVal);

                        var seriesName = result.Series.Name;
                        toolTip.Show("X=" + String.Format("{0:0.####}", xVal) + ",Y=" + String.Format("{0:0.####}", yVal) +
                                     "," + seriesName, (Chart)sender, pos.X + 10, pos.Y - 15);
                    }
                }
            }
        }

        private void cht_MouseEnter(object sender, EventArgs e)
        {
            //Change cursor if doing peak calculations.
            if (btnPeakCalc.Checked) ((Chart)sender).Cursor = Cursors.Cross;
            else ((Chart)sender).Cursor = Cursors.Default;
        }

        /***************************************Chart Interaction Functions***************************************/
        public void addDepositionDataPoint(DataPoint xy, int seriesIndex)
        {
            if (this.chtDeposition.InvokeRequired)
            {
                this.chtDeposition.BeginInvoke(new Action(() => addDepositionDataPoint(xy, seriesIndex)));
            }
            else if (chtDeposition.Series.Count > seriesIndex)
            {
                chtDeposition.Series[seriesIndex].Points.AddXY(xy.XValue, xy.YValues[0]);
            }
        }

        public void addQuietDataPoint(DataPoint xy, int seriesIndex)
        {
            if (this.chtQuietTime.InvokeRequired)
            {
                this.chtQuietTime.BeginInvoke(new Action(() => addQuietDataPoint(xy, seriesIndex)));
            }
            else if (chtQuietTime.Series.Count > seriesIndex)
            {
                chtQuietTime.Series[seriesIndex].Points.AddXY(xy.XValue, xy.YValues[0]);
            }
        }

        public void addRawDataPoint(DataPoint xy, int seriesIndex)
        {
            if (this.chtRawData.InvokeRequired)
            {
                this.chtRawData.BeginInvoke(new Action(() => addRawDataPoint(xy, seriesIndex)));
            }
            else if (chtRawData.Series.Count > seriesIndex)
            {
                chtRawData.Series[seriesIndex].Points.AddXY(xy.XValue, xy.YValues[0]);
            }
        }

        public void addIVCurveDataPoint(DataPoint xy, int seriesIndex)
        {
            if (this.chtIVCurve.InvokeRequired)
            {
                this.chtIVCurve.BeginInvoke(new Action(() => addIVCurveDataPoint(xy, seriesIndex)));
            }
            else if (chtIVCurve.Series.Count > seriesIndex)
            {
                chtIVCurve.Series[seriesIndex].Points.AddXY(xy.XValue, xy.YValues[0]);
            }
        }

        private void btnPicToFile_Click(object sender, EventArgs e)
        {
            //Create save file dialog for console window.
            SaveFileDialog consoleSave = new SaveFileDialog();
            MemoryStream ms = new MemoryStream();
            consoleSave.Filter = "Bitmap File|*.bmp|JPEG File|*.jpg|PNG File|*.png";
            consoleSave.Title = "Save Graph Image";
            consoleSave.ShowDialog();

            //Create pointer to current graph.
            Chart chartPointer;

            if (consoleSave.FileName != "")//Get chart to save.
            {
                if (tbcPlotTabs.SelectedTab == tbcPlotTabs.TabPages["tabDeposition"])
                    chartPointer = chtDeposition;
                else if (tbcPlotTabs.SelectedTab == tbcPlotTabs.TabPages["tabQuietTime"])
                    chartPointer = chtQuietTime;
                else if (tbcPlotTabs.SelectedTab == tbcPlotTabs.TabPages["tabRawData"])
                    chartPointer = chtRawData;
                else
                    chartPointer = chtIVCurve;

                //Get picture format type.
                if (consoleSave.FilterIndex == 0)
                    chartPointer.SaveImage(ms, ChartImageFormat.Bmp);
                else if (consoleSave.FilterIndex == 1)
                    chartPointer.SaveImage(ms, ChartImageFormat.Jpeg);
                else
                    chartPointer.SaveImage(ms, ChartImageFormat.Png);

                File.WriteAllBytes(consoleSave.FileName, ms.ToArray());
            }
        }

        private void btnPicToClip_Click(object sender, EventArgs e)
        {
            MemoryStream ms = new MemoryStream();

            if (tbcPlotTabs.SelectedTab == tbcPlotTabs.TabPages["tabDeposition"])
            {
                chtDeposition.SaveImage(ms, ChartImageFormat.Bmp);
            }
            else if (tbcPlotTabs.SelectedTab == tbcPlotTabs.TabPages["tabQuietTime"])
            {
                chtQuietTime.SaveImage(ms, ChartImageFormat.Bmp);
            }
            else if (tbcPlotTabs.SelectedTab == tbcPlotTabs.TabPages["tabRawData"])
            {
                chtRawData.SaveImage(ms, ChartImageFormat.Bmp);
            }
            else
            {
                chtIVCurve.SaveImage(ms, ChartImageFormat.Bmp);
            }

            Bitmap bm = new Bitmap(ms);
            Clipboard.SetImage(bm);
        }

        private void btnDataToClip_Click(object sender, EventArgs e)
        {
            List<int> seriesIndex = new List<int>();//Keep track of which series are selected.
            Chart chartPointer;//Create pointer to current graph.
            int maxSeriesLength = 0;//Find series with the greatest length.

            if (tbcPlotTabs.SelectedTab == tbcPlotTabs.TabPages["tabDeposition"])
                chartPointer = chtDeposition;
            else if (tbcPlotTabs.SelectedTab == tbcPlotTabs.TabPages["tabQuietTime"])
                chartPointer = chtQuietTime;
            else if (tbcPlotTabs.SelectedTab == tbcPlotTabs.TabPages["tabRawData"])
                chartPointer = chtRawData;
            else
                chartPointer = chtIVCurve;

            for (int i = 0; i < chartPointer.Series.Count; i++)
            {
                if (chartPointer.Series[i].BorderWidth > 1)
                {
                    //First, figure out how many series are selected.
                    seriesIndex.Add(i);

                    //Next, figure out what the length of the longesst series is.
                    if (chartPointer.Series[i].Points.Count > maxSeriesLength)
                        maxSeriesLength = chartPointer.Series[i].Points.Count;
                }
            }

            if (seriesIndex.Count == 0)//Error.  No series selected.
            {
                MessageBox.Show("Please Select One or More Series to Copy", "No Data Series Selected", MessageBoxButtons.OK, MessageBoxIcon.Error);
            }
            else//Copy string to clipboard.
            {
                StringBuilder copiedData = new StringBuilder();

                //Print header info.
                for (int i = 0; i < seriesIndex.Count; i++)
                    copiedData.Append("mV\tuA\t");
                copiedData.Remove(copiedData.Length - 1, 1);//Remove last tab.
                copiedData.Append("\n");

                //Copy data to string builder.
                for (int i = 0; i < maxSeriesLength; i++)
                {
                    for (int j = 0; j < seriesIndex.Count; j++)
                    {
                        if (chartPointer.Series[seriesIndex[j]].Points.Count > i)
                        {
                            copiedData.Append(chartPointer.Series[seriesIndex[j]].Points[i].XValue);
                            copiedData.Append("\t");
                            copiedData.Append(chartPointer.Series[seriesIndex[j]].Points[i].YValues[0]);
                            copiedData.Append("\t");
                        }
                        else
                        {
                            copiedData.Append("\t");
                            copiedData.Append("\t");
                        }
                    }
                    copiedData.Remove(copiedData.Length - 1, 1);//Remove last tab.
                    copiedData.Append("\n");
                }
                copiedData.Remove(copiedData.Length - 1, 1);//Remove last newline.

                Clipboard.SetText(copiedData.ToString());
            }
        }

        private void btnDataToFile_Click(object sender, EventArgs e)
        {
            List<int> seriesIndex = new List<int>();//Keep track of which series are selected.
            Chart chartPointer;//Create pointer to current graph.
            int maxSeriesLength = 0;//Find series with the greatest length.

            if (tbcPlotTabs.SelectedTab == tbcPlotTabs.TabPages["tabDeposition"])
                chartPointer = chtDeposition;
            else if (tbcPlotTabs.SelectedTab == tbcPlotTabs.TabPages["tabQuietTime"])
                chartPointer = chtQuietTime;
            else if (tbcPlotTabs.SelectedTab == tbcPlotTabs.TabPages["tabRawData"])
                chartPointer = chtRawData;
            else
                chartPointer = chtIVCurve;

            for (int i = 0; i < chartPointer.Series.Count; i++)
            {
                if (chartPointer.Series[i].BorderWidth > 1)
                {
                    //First, figure out how many series are selected.
                    seriesIndex.Add(i);

                    //Next, figure out what the length of the longesst series is.
                    if (chartPointer.Series[i].Points.Count > maxSeriesLength)
                        maxSeriesLength = chartPointer.Series[i].Points.Count;
                }
            }

            if (seriesIndex.Count == 0)//Error.  No series selected.
            {
                MessageBox.Show("Please Select One or More Series to Copy", "No Data Series Selected", MessageBoxButtons.OK, MessageBoxIcon.Error);
            }
            else//Copy string to clipboard.
            {
                StringBuilder copiedData = new StringBuilder();

                //Print header info.
                for (int i = 0; i < seriesIndex.Count; i++)
                    copiedData.Append("mV,uA,");
                copiedData.Remove(copiedData.Length - 1, 1);//Remove last tab.
                copiedData.Append("\n");

                //Copy data to string builder.
                for (int i = 0; i < maxSeriesLength; i++)
                {
                    for (int j = 0; j < seriesIndex.Count; j++)
                    {
                        if (chartPointer.Series[seriesIndex[j]].Points.Count > i)
                        {
                            copiedData.Append(chartPointer.Series[seriesIndex[j]].Points[i].XValue);
                            copiedData.Append(",");
                            copiedData.Append(chartPointer.Series[seriesIndex[j]].Points[i].YValues[0]);
                            copiedData.Append(",");
                        }
                        else
                        {
                            copiedData.Append(",");
                            copiedData.Append(",");
                        }
                    }
                    copiedData.Remove(copiedData.Length - 1, 1);//Remove last tab.
                    copiedData.Append("\n");
                }
                copiedData.Remove(copiedData.Length - 1, 1);//Remove last newline.

                //Create save file dialog for console window.
                SaveFileDialog consoleSave = new SaveFileDialog();
                consoleSave.Filter = "CSV File|*.csv|Text File|*.txt|All File|*.*";
                consoleSave.Title = "Save Graph Data Points";
                consoleSave.ShowDialog();

                if (consoleSave.FileName != "")//Get chart to save.
                {
                    File.WriteAllText(consoleSave.FileName, copiedData.ToString());
                }
            }
        }

        private void btnZoomXY_Click(object sender, EventArgs e)
        {
            btnZoomX.Checked = false;
            btnZoomY.Checked = false;
            btnZoomXY.Checked = true;
            chtDeposition.ChartAreas[0].CursorX.IsUserSelectionEnabled = true;
            chtDeposition.ChartAreas[0].CursorY.IsUserSelectionEnabled = true;
            chtQuietTime.ChartAreas[0].CursorX.IsUserSelectionEnabled = true;
            chtQuietTime.ChartAreas[0].CursorY.IsUserSelectionEnabled = true;
            chtRawData.ChartAreas[0].CursorX.IsUserSelectionEnabled = true;
            chtRawData.ChartAreas[0].CursorY.IsUserSelectionEnabled = true;
            chtIVCurve.ChartAreas[0].CursorX.IsUserSelectionEnabled = true;
            chtIVCurve.ChartAreas[0].CursorY.IsUserSelectionEnabled = true;
        }

        private void btnZoomX_Click(object sender, EventArgs e)
        {
            btnZoomX.Checked = true;
            btnZoomY.Checked = false;
            btnZoomXY.Checked = false;
            chtDeposition.ChartAreas[0].CursorX.IsUserSelectionEnabled = true;
            chtDeposition.ChartAreas[0].CursorY.IsUserSelectionEnabled = false;
            chtQuietTime.ChartAreas[0].CursorX.IsUserSelectionEnabled = true;
            chtQuietTime.ChartAreas[0].CursorY.IsUserSelectionEnabled = false;
            chtRawData.ChartAreas[0].CursorX.IsUserSelectionEnabled = true;
            chtRawData.ChartAreas[0].CursorY.IsUserSelectionEnabled = false;
            chtIVCurve.ChartAreas[0].CursorX.IsUserSelectionEnabled = true;
            chtIVCurve.ChartAreas[0].CursorY.IsUserSelectionEnabled = false;
        }

        private void btnZoomY_Click(object sender, EventArgs e)
        {
            btnZoomX.Checked = false;
            btnZoomY.Checked = true;
            btnZoomXY.Checked = false;
            chtDeposition.ChartAreas[0].CursorX.IsUserSelectionEnabled = false;
            chtDeposition.ChartAreas[0].CursorY.IsUserSelectionEnabled = true;
            chtQuietTime.ChartAreas[0].CursorX.IsUserSelectionEnabled = false;
            chtQuietTime.ChartAreas[0].CursorY.IsUserSelectionEnabled = true;
            chtRawData.ChartAreas[0].CursorX.IsUserSelectionEnabled = false;
            chtRawData.ChartAreas[0].CursorY.IsUserSelectionEnabled = true;
            chtIVCurve.ChartAreas[0].CursorX.IsUserSelectionEnabled = false;
            chtIVCurve.ChartAreas[0].CursorY.IsUserSelectionEnabled = true;
        }

        private void btnSelectAll_Click(object sender, EventArgs e)
        {
            Chart chartPointer;//Create pointer to current graph.

            if (tbcPlotTabs.SelectedTab == tbcPlotTabs.TabPages["tabDeposition"])
                chartPointer = chtDeposition;
            else if (tbcPlotTabs.SelectedTab == tbcPlotTabs.TabPages["tabQuietTime"])
                chartPointer = chtQuietTime;
            else if (tbcPlotTabs.SelectedTab == tbcPlotTabs.TabPages["tabRawData"])
                chartPointer = chtRawData;
            else
                chartPointer = chtIVCurve;

            for (int i = 0; i < chartPointer.Series.Count; i++)
            {
                chartPointer.Series[i].BorderWidth = 5;
            }
        }

        private void btnDeselectAll_Click(object sender, EventArgs e)
        {
            Chart chartPointer;//Create pointer to current graph.

            if (tbcPlotTabs.SelectedTab == tbcPlotTabs.TabPages["tabDeposition"])
                chartPointer = chtDeposition;
            else if (tbcPlotTabs.SelectedTab == tbcPlotTabs.TabPages["tabQuietTime"])
                chartPointer = chtQuietTime;
            else if (tbcPlotTabs.SelectedTab == tbcPlotTabs.TabPages["tabRawData"])
                chartPointer = chtRawData;
            else
                chartPointer = chtIVCurve;

            for (int i = 0; i < chartPointer.Series.Count; i++)
            {
                chartPointer.Series[i].BorderWidth = 1;
            }
        }

        private void btnPeakCalc_Click(object sender, EventArgs e)
        {
            if (peakMode)
            {
                peakMode = false;
                btnPeakCalc.Checked = false;
            }
            else
            {
                peakMode = true;
                btnPeakCalc.Checked = true;
            }
        }

        private void btnClearCalcs_Click(object sender, EventArgs e)
        {
            List<PlotCalc> deletePlotCalc = new List<PlotCalc>();
            Chart activeChart;

            //Get a pointer to the currently displayed chart.
            if (tbcPlotTabs.SelectedTab == tbcPlotTabs.TabPages["tabDeposition"])
                activeChart = chtDeposition;
            else if (tbcPlotTabs.SelectedTab == tbcPlotTabs.TabPages["tabQuietTime"])
                activeChart = chtQuietTime;
            else if (tbcPlotTabs.SelectedTab == tbcPlotTabs.TabPages["tabRawData"])
                activeChart = chtRawData;
            else
                activeChart = chtIVCurve;

            //Iterate through the list and remove all the series from the chart.
            foreach (PlotCalc pc in plotCalcs)
            {
                if (pc.chartPointer == activeChart)
                {
                    deletePlotCalc.Add(pc);
                    activeChart.Series.Remove(pc.thisSeriesPointer);
                }
            }

            //Now clear out the PlotCalc list.
            foreach (PlotCalc pc in deletePlotCalc)
            {
                plotCalcs.Remove(pc);
            }
        }

        private void btnClearSelectedCalcs_Click(object sender, EventArgs e)
        {
            List<PlotCalc> deletePlotCalc = new List<PlotCalc>();
            Chart activeChart;

            //Get a pointer to the currently displayed chart.
            if (tbcPlotTabs.SelectedTab == tbcPlotTabs.TabPages["tabDeposition"])
                activeChart = chtDeposition;
            else if (tbcPlotTabs.SelectedTab == tbcPlotTabs.TabPages["tabQuietTime"])
                activeChart = chtQuietTime;
            else if (tbcPlotTabs.SelectedTab == tbcPlotTabs.TabPages["tabRawData"])
                activeChart = chtRawData;
            else
                activeChart = chtIVCurve;

            //Iterate through the list and remove all the selected series from the chart.
            foreach (PlotCalc pc in plotCalcs)
            {
                if (pc.chartPointer == activeChart && pc.thisSeriesPointer.BorderWidth > 1)
                {
                    deletePlotCalc.Add(pc);
                    activeChart.Series.Remove(pc.thisSeriesPointer);
                }
            }

            //Now clear out the PlotCalc list.
            foreach (PlotCalc pc in deletePlotCalc)
            {
                plotCalcs.Remove(pc);
            }
        }
    }
}

