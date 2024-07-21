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
using System.Threading;
using System.IO;

namespace AquaSift_V_00_01
{
    public partial class DataTree : UserControl
    {
        AquaSift aq;//Pointer to main form.    
        List<DataSet> ds = new List<DataSet>();//List of TreeDataClasses.  
        public Boolean nonePopulated = true;//Used to determine if plots have data in them.
        private TreeNode clickedNode = new TreeNode();//Used to keep track of a clicked node.

        /**********************************Data Tree Context Menu Functions*********************************/

        //Check all the items in the data tree.
        private void checkAll(object sender, EventArgs e)
        {
            foreach (TreeNode node in treData.Nodes) node.Checked = true;
        }

        //Uncheck all the items in the data tree.
        private void uncheckAll(object sender, EventArgs e)
        {
            foreach (TreeNode node in treData.Nodes) node.Checked = false;
        }

        //Add all checked items to the graph.
        private void addCheckedToGraph(object sender, EventArgs e)
        {
            //First, make all checked items bold.
            setBoldFont(treData.Nodes);

            //Next, make parent bold if any one child is bold.
            checkBoldChildren(treData.Nodes);

            //Graph All Data!
            updateGraphs();
        }

        //Only continue if a parent node exists.
        private void checkBoldChildren(TreeNodeCollection nodes)
        {
            foreach (TreeNode node in nodes)
            {
                //First drill down to bottom and set those nodes.
                checkBoldChildren(node.Nodes);

                if (node.Checked == true && node.Parent != null)
                {
                    treData.BeginUpdate();//Make sure font does not get clipped.
                    node.Parent.NodeFont = new Font(treData.Font, FontStyle.Bold);
                    treData.EndUpdate();//End bold font update.
                }
            }
        }

        private void setBoldFont(TreeNodeCollection nodes)
        {
            foreach (TreeNode thisNode in nodes)
            {
                if (thisNode.Checked)
                {
                    treData.BeginUpdate();//Make sure font does not get clipped.
                    thisNode.NodeFont = new Font(treData.Font, FontStyle.Bold);
                    treData.EndUpdate();//End bold font update.
                }

                setBoldFont(thisNode.Nodes);
            }
        }

        //Save all data in the list.
        void saveAll(object sender, EventArgs e)
        {
            //Create save file dialog for console window.
            SaveFileDialog dataSetSave = new SaveFileDialog();
            dataSetSave.Filter = "AquaSift Data File|*.aqd|All Files|*.*";
            dataSetSave.Title = "Save AquaSift Data Set";
            dataSetSave.ShowDialog();

            if (dataSetSave.FileName != "")
            {
                //Begin writing the entire contents of data set list to the file.
                using (BinaryWriter writer = new BinaryWriter(File.Open(dataSetSave.FileName, FileMode.Create)))
                {
                    writer.Write("AQD");//Indicate this is a AquaSift data file.
                    writer.Write(AquaSift.FIRMWARE_MAJOR);//Major firmware revision.
                    writer.Write(AquaSift.FIRMWARE_MINOR);//Minor firmware revision.

                    writer.Write(ds.Count());//Number of data sets in the list.

                    //Write all data sets to the file.
                    for (int i = 0; i < ds.Count(); i++)
                    {
                        writeDataSetToFile(writer, ds[i]);
                    }
                }
            }
        }

        void writeDataSetToFile(BinaryWriter writer, DataSet ds)
        {
            //Write strings.
            writer.Write(ds.nameGet());
            writer.Write(ds.typeGet());
            writer.Write(ds.ex1Get());
            writer.Write(ds.ex2Get());
            writer.Write(ds.ex3Get());
            writer.Write(ds.ex4Get());
            
            //Write deposition data.
            writer.Write(ds.depCount());
            for (int i = 0; i < ds.depCount(); i++)
            {
                writer.Write(ds.depGet(i).XValue);
                writer.Write(ds.depGet(i).YValues[0]);
            }
            
            //Write quiet time data.
            writer.Write(ds.quietCount());
            for (int i = 0; i < ds.quietCount(); i++)
            {
                writer.Write(ds.quietGet(i).XValue);
                writer.Write(ds.quietGet(i).YValues[0]);
            }

            //Write raw data.
            writer.Write(ds.rawCount());
            for (int i = 0; i < ds.rawCount(); i++)
            {
                writer.Write(ds.rawGet(i).XValue);
                writer.Write(ds.rawGet(i).YValues[0]);
            }

            //Write IV data.
            writer.Write(ds.ivCount());
            for (int i = 0; i < ds.ivCount(); i++)
            {
                writer.Write(ds.ivCountSub(i));
                for (int j = 0; j < ds.ivCountSub(i); j++)
                {
                    writer.Write(ds.ivGetSub(i, j).XValue);
                    writer.Write(ds.ivGetSub(i, j).YValues[0]);
                }
            }
            
            //Write expansion 1 data.
            writer.Write(ds.ex1Count());
            for (int i = 0; i < ds.ex1Count(); i++)
            {
                writer.Write(ds.ex1Get(i).XValue);
                writer.Write(ds.ex1Get(i).YValues[0]);
            }

            //Write expansion 2 data.
            writer.Write(ds.ex2Count());
            for (int i = 0; i < ds.ex2Count(); i++)
            {
                writer.Write(ds.ex2Get(i).XValue);
                writer.Write(ds.ex2Get(i).YValues[0]);
            }

            //Write expansion 3 data.
            writer.Write(ds.ex3Count());
            for (int i = 0; i < ds.ex3Count(); i++)
            {
                writer.Write(ds.ex3Get(i).XValue);
                writer.Write(ds.ex3Get(i).YValues[0]);
            }

            //Write expansion 4 data.
            writer.Write(ds.ex4Count());
            for (int i = 0; i < ds.ex4Count(); i++)
            {
                writer.Write(ds.ex4Get(i).XValue);
                writer.Write(ds.ex4Get(i).YValues[0]);
            }

            //Write the settings data.
            byte[] bArray = ds.settings.arrayGet();

            //Write only the settings array.
            writer.Write(bArray.Count());
            writer.Write(ds.settings.arrayGet());

            //Write settings strings.
            writer.Write(ds.settings.ex1Get());
            writer.Write(ds.settings.ex2Get());
            writer.Write(ds.settings.ex3Get());
            writer.Write(ds.settings.ex4Get());
            
            //Write setting expansion 1 data.
            writer.Write(ds.settings.ex1Count());
            for (int i = 0; i < ds.settings.ex1Count(); i++)
            {
                writer.Write(ds.settings.ex1Get(i));
            }

            //Write setting expansion 2 data.
            writer.Write(ds.settings.ex2Count());
            for (int i = 0; i < ds.settings.ex2Count(); i++)
            {
                writer.Write(ds.settings.ex2Get(i));
            }

            //Write setting expansion 3 data.
            writer.Write(ds.settings.ex3Count());
            for (int i = 0; i < ds.settings.ex3Count(); i++)
            {
                writer.Write(ds.settings.ex3Get(i));
            }

            //Write setting expansion 4 data.
            writer.Write(ds.settings.ex4Count());
            for (int i = 0; i < ds.settings.ex4Count(); i++)
            {
                writer.Write(ds.settings.ex4Get(i));
            }
        }

        //Import data and append it to the list.
        void import(object sender, EventArgs e)
        {
            OpenFileDialog dataSetLoad = new OpenFileDialog();
            dataSetLoad.Filter = "AquaSift Data File|*.aqd|All Files|*.*";
            dataSetLoad.Title = "Looad Aquasift Data Set";
            dataSetLoad.ShowDialog();

            //Begin reading the entire contents of data set list to the file.
            if (dataSetLoad.FileName != "")
            {
                using (BinaryReader reader = new BinaryReader(File.Open(dataSetLoad.FileName, FileMode.Open)))
                {
                    if (reader.ReadString() != "AQD")
                    {
                        //Invalid data file.
                        MessageBox.Show("Invalid AquaSift Data Format", "Invalid Format", MessageBoxButtons.OK, MessageBoxIcon.Error);
                        return;
                    }

                    if (reader.ReadInt32() != AquaSift.FIRMWARE_MAJOR || reader.ReadInt32() != AquaSift.FIRMWARE_MINOR)
                    {
                        //Invalid firmware revision.
                        MessageBox.Show("Incompatible Firmware", "Incompatible Firmware", MessageBoxButtons.OK, MessageBoxIcon.Error);
                        return;
                    }

                    int recordCount = reader.ReadInt32();

                    for (int i = 0; i < recordCount; i++)
                    {
                        readDataSetFromFile(reader);
                    }
                }
            }
        }

        void readDataSetFromFile(BinaryReader reader)
        {
            DataSet ds = new DataSet();//Create new data set.

            //Set remaining strings.
            ds.nameSet(reader.ReadString());
            ds.typeSet(reader.ReadString());
            ds.ex1Set(reader.ReadString());
            ds.ex2Set(reader.ReadString());
            ds.ex3Set(reader.ReadString());
            ds.ex4Set(reader.ReadString());
            
            //Set deposition data.
            int depCount = reader.ReadInt32();
            for (int i = 0; i < depCount; i++)
            {
                double x = reader.ReadDouble();
                double y = reader.ReadDouble();                         
                ds.depAdd(new DataPoint(x, y));
            }

            //Set quiet time data.
            int quietCount = reader.ReadInt32();
            for (int i = 0; i < quietCount; i++)
            {
                double x = reader.ReadDouble();
                double y = reader.ReadDouble();
                ds.quietAdd(new DataPoint(x, y));
            }

            //Set raw data.
            int rawCount = reader.ReadInt32();
            for (int i = 0; i < rawCount; i++)
            {
                double x = reader.ReadDouble();
                double y = reader.ReadDouble();
                ds.rawAdd(new DataPoint(x, y));
            }

            //Set IV data.
            int ivCount = reader.ReadInt32();
            for (int i = 0; i < ivCount; i++)
            {
                ds.ivAdd();
                int ivCountSub = reader.ReadInt32();
                for (int j = 0; j < ivCountSub; j++)
                {
                    double x = reader.ReadDouble();
                    double y = reader.ReadDouble();
                    ds.ivAddSub(i, new DataPoint(x, y));
                }
            }

            //Set expansion 1 data.
            int ex1Count = reader.ReadInt32();
            for (int i = 0; i < ex1Count; i++)
            {
                double x = reader.ReadDouble();
                double y = reader.ReadDouble();
                ds.ex1Add(new DataPoint(x, y));
            }

            //Set expansion 2 data.
            int ex2Count = reader.ReadInt32();
            for (int i = 0; i < ex2Count; i++)
            {
                double x = reader.ReadDouble();
                double y = reader.ReadDouble();
                ds.ex2Add(new DataPoint(x, y));
            }

            //Set expansion 3 data.
            int ex3Count = reader.ReadInt32();
            for (int i = 0; i < ex3Count; i++)
            {
                double x = reader.ReadDouble();
                double y = reader.ReadDouble();
                ds.ex3Add(new DataPoint(x, y));
            }

            //Set expansion 4 data.
            int ex4Count = reader.ReadInt32();
            for (int i = 0; i < ex4Count; i++)
            {
                double x = reader.ReadDouble();
                double y = reader.ReadDouble();
                ds.ex4Add(new DataPoint(x, y));
            }

            //Get length of settings array.
            int arrayCount = reader.ReadInt32();

            byte[] bArray = new byte[arrayCount];

            //Set array.
            for(int i = 0; i < arrayCount; i++)
            {
                bArray[i] = reader.ReadByte();
            }

            ds.settings.setByArray(bArray);

            //Set settings strings.
            ds.settings.ex1Set(reader.ReadString());
            ds.settings.ex2Set(reader.ReadString());
            ds.settings.ex3Set(reader.ReadString());
            ds.settings.ex4Set(reader.ReadString());

            //Set settings expansion 1 data.
            ex1Count = reader.ReadInt32();
            for (int i = 0; i < ex1Count; i++)
            {
                ds.settings.ex1Add(reader.ReadByte());
            }

            //Set settings expansion 2 data.
            ex2Count = reader.ReadInt32();
            for (int i = 0; i < ex2Count; i++)
            {
                ds.settings.ex2Add(reader.ReadByte());
            }

            //Set settings expansion 3 data.
            ex3Count = reader.ReadInt32();
            for (int i = 0; i < ex3Count; i++)
            {
                ds.settings.ex3Add(reader.ReadByte());
            }

            //Set settings expansion 4 data.
            ex4Count = reader.ReadInt32();
            for (int i = 0; i < ex4Count; i++)
            {
                ds.settings.ex4Add(reader.ReadByte());
            }

            //Add new data set to the tree view.
            insertAtIndex(ds, treData.Nodes.Count);

            //Add font class to the new data set and clear it by default.
            clearAllBoldFont(treData.Nodes[treData.Nodes.Count - 1].Nodes);
        }

        //Rename the data set name.
        private void rename(object sender, EventArgs e)
        {
            treData.LabelEdit = true;
            if (!clickedNode.IsEditing)
            {
                clickedNode.BeginEdit();
            }
        }

        //Remove the entire list and load all new data.
        void load(object sender, EventArgs e)
        {
            DialogResult result = DialogResult.Yes;

            if (treData.GetNodeCount(false) > 0)
            {
                result = MessageBox.Show("Loading a File Will Remove Existing Data.  Proceed?",
                "Remove Existing Data", MessageBoxButtons.YesNo, MessageBoxIcon.Exclamation,
                MessageBoxDefaultButton.Button2);
            }

            //Bring up load window but don't clear existing data set yet.
            if(result == DialogResult.Yes)
            {
                OpenFileDialog dataSetLoad = new OpenFileDialog();
                dataSetLoad.Filter = "AquaSift Data File|*.aqd|All Files|*.*";
                dataSetLoad.Title = "Looad Aquasift Data Set";
                dataSetLoad.ShowDialog();

                //Begin reading the entire contents of data set list to the file.
                if (dataSetLoad.FileName != "")
                {
                    deleteAllData();

                    using (BinaryReader reader = new BinaryReader(File.Open(dataSetLoad.FileName, FileMode.Open)))
                    {
                        if (reader.ReadString() != "AQD")
                        {
                            //Invalid data file.
                            MessageBox.Show("Invalid AquaSift Data Format", "Invalid Format", MessageBoxButtons.OK, MessageBoxIcon.Error);
                            return;
                        }

                        if (reader.ReadInt32() != AquaSift.FIRMWARE_MAJOR || reader.ReadInt32() != AquaSift.FIRMWARE_MINOR)
                        {
                            //Invalid firmware revision.
                            MessageBox.Show("Incompatible Firmware", "Incompatible Firmware", MessageBoxButtons.OK, MessageBoxIcon.Error);
                            return;
                        }

                        int recordCount = reader.ReadInt32();

                        for (int i = 0; i < recordCount; i++)
                        {
                            readDataSetFromFile(reader);
                        }
                    }
                }
            }
        }

        //Delete all data from the tree, data set and plotter.
        void deleteAllData()
        {
            //Get rid of existing data.
            treData.Nodes.Clear();
            ds.Clear();

            //First, clear all the graphs.
            aq.aqPlotter.chtDeposition.Series.Clear();
            aq.aqPlotter.chtQuietTime.Series.Clear();
            aq.aqPlotter.chtRawData.Series.Clear();
            aq.aqPlotter.chtIVCurve.Series.Clear();

            //Remove all tabs.
            aq.aqPlotter.tbcPlotTabs.TabPages.Remove(aq.aqPlotter.tabDeposition);
            aq.aqPlotter.tbcPlotTabs.TabPages.Remove(aq.aqPlotter.tabQuietTime);
            aq.aqPlotter.tbcPlotTabs.TabPages.Remove(aq.aqPlotter.tabRawData);
            aq.aqPlotter.tbcPlotTabs.TabPages.Remove(aq.aqPlotter.tabIVCurve);

            //Indicate no graphs are active.
            nonePopulated = true;

            //Hide plotter.
            aq.aqPlotter.Visible = false;
            aq.wfHelper.Visible = true;
        }

        //Expand all the nodes in the tree view.
        void expandAll(object sender, EventArgs e)
        {
            treData.ExpandAll();
        }

        //Collapse all the nodes in the tree view.
        void collapseAll(object sender, EventArgs e)
        {
            treData.CollapseAll();
        }

        //Delete all data from the list.
        void deleteAll(object sender, EventArgs e)
        {
            DialogResult result = DialogResult.Yes;

            if (treData.GetNodeCount(false) > 0)
            {
                result = MessageBox.Show("All Unsaved Data Will Be Lost.  Proceed?",
                "Delete All Data", MessageBoxButtons.YesNo, MessageBoxIcon.Exclamation,
                MessageBoxDefaultButton.Button2);
            }

            //Clear out all data.
            if (result == DialogResult.Yes)
            {
                deleteAllData();
            }
        }

        //Remove all checked items from the graph.
        void removeCheckedFromGraph(object sender, EventArgs e)
        {
            //Parent nodes.
            foreach(TreeNode node in treData.Nodes)
            {
                //Test segment nodes.
                foreach(TreeNode subNode in node.Nodes)
                {
                    //Deposition node.
                    if(subNode.Text.Equals("Deposition") && subNode.Checked && subNode.NodeFont.Bold)
                    {
                        //Remove data from plotter.
                        aq.aqPlotter.chtDeposition.Series.Remove(aq.aqPlotter.chtDeposition.Series[node.Text]);
                        //Unbold selection in tree view.
                        subNode.NodeFont = new Font(treData.Font, FontStyle.Regular);
                        //Hide graph if empty.
                        if(aq.aqPlotter.chtDeposition.Series.Count == 0)
                        {
                            aq.aqPlotter.tbcPlotTabs.TabPages.Remove(aq.aqPlotter.tabDeposition);
                        }
                    }

                    //Quiet time node.
                    if (subNode.Text.Equals("Quiet Time") && subNode.Checked && subNode.NodeFont.Bold)
                    {
                        //Remove data from plotter.
                        aq.aqPlotter.chtQuietTime.Series.Remove(aq.aqPlotter.chtQuietTime.Series[node.Text]);
                        //Unbold selection in tree view.
                        subNode.NodeFont = new Font(treData.Font, FontStyle.Regular);
                        //Hide graph if empty.
                        if (aq.aqPlotter.chtQuietTime.Series.Count == 0)
                        {
                            aq.aqPlotter.tbcPlotTabs.TabPages.Remove(aq.aqPlotter.tabQuietTime);
                        }
                    }

                    //Raw data node.
                    if (subNode.Text.Equals("Raw Data") && subNode.Checked && subNode.NodeFont.Bold)
                    {
                        //Remove data from plotter.
                        aq.aqPlotter.chtRawData.Series.Remove(aq.aqPlotter.chtRawData.Series[node.Text]);
                        //Unbold selection in tree view.
                        subNode.NodeFont = new Font(treData.Font, FontStyle.Regular);
                        //Hide graph if empty.
                        if (aq.aqPlotter.chtRawData.Series.Count == 0)
                        {
                            aq.aqPlotter.tbcPlotTabs.TabPages.Remove(aq.aqPlotter.tabRawData);
                        }
                    }

                    //Series nodes.
                    foreach (TreeNode seriesNode in subNode.Nodes)
                    {
                        if (seriesNode.Checked && seriesNode.NodeFont.Bold)
                        {
                            //Remove data from plotter.
                            aq.aqPlotter.chtIVCurve.Series.Remove(aq.aqPlotter.chtIVCurve.Series[node.Text + ", " + seriesNode.Text]);
                            //Unbold selection in tree view.
                            seriesNode.NodeFont = new Font(treData.Font, FontStyle.Regular);
                            //Hide graph if empty.
                            if (aq.aqPlotter.chtIVCurve.Series.Count == 0)
                            {
                                aq.aqPlotter.tbcPlotTabs.TabPages.Remove(aq.aqPlotter.tabIVCurve);
                            }
                        }

                        //Check to see if all children are unbolded.  If so, unbold parent.
                        if (checkAllChildrenUnbolded(subNode))
                        {
                            subNode.NodeFont = new Font(treData.Font, FontStyle.Regular);
                        }
                    }
                }

                //Check to see if all children are unbolded.  If so, unbold parent.
                if (checkAllChildrenUnbolded(node))
                {
                    node.NodeFont = new Font(treData.Font, FontStyle.Regular);
                }
            }

            //Check to see if all graphs are empty.
            Boolean allUnbolded = true;

            foreach (TreeNode node in treData.Nodes)
            {
                if (node.NodeFont.Bold) allUnbolded = false;
            }

            //Remove plotter from display.
            if(allUnbolded)
            {
                //Indicate no graphs are active.
                nonePopulated = true;

                //Hide plotter.
                aq.aqPlotter.Visible = false;
                aq.wfHelper.Visible = true;
            }
        }

        //Unbold parent if all children nodes are unbolded.
        Boolean checkAllChildrenUnbolded(TreeNode node)
        {
            Boolean allUnbolded = true;

            foreach(TreeNode subNode in node.Nodes)
            {
                if(subNode.NodeFont.Bold) allUnbolded = false;
            }

            return allUnbolded;
        }

        //Delete checked data from the list.
        void deleteChecked(object sender, EventArgs e)
        {
            //Create a list of pointers to the items to delete.
            List<TreeNode> treeNodes = new List<TreeNode>();
            List<DataSet> dataSet = new List<DataSet>();

            DialogResult result = DialogResult.Yes;

            result = MessageBox.Show("All Unsaved Data Will Be Lost.  Proceed?",
            "Delete All Data", MessageBoxButtons.YesNo, MessageBoxIcon.Exclamation,
            MessageBoxDefaultButton.Button2);

            if (result == DialogResult.No) return;

            //Parent nodes.
            for (int i = 0; i < treData.GetNodeCount(false); i++)
            {
                //Prepare to erase the parent.
                if (treData.Nodes[i].Checked)
                {
                    dataSet.Add(ds[i]);
                    treeNodes.Add(treData.Nodes[i]);
                }

                //Test segment nodes.
                for (int j = 0; j < treData.Nodes[i].GetNodeCount(false); j++)
                {
                    if (treData.Nodes[i].Nodes[j].Checked)
                    {
                        if (treData.Nodes[i].Nodes[j].Text == "Deposition")
                        {
                            //Erase deleted item from graph if necessary.
                            if(treData.Nodes[i].Nodes[j].NodeFont.Bold)
                                aq.aqPlotter.chtDeposition.Series.Remove(aq.aqPlotter.chtDeposition.Series[treData.Nodes[i].Text]);

                            //Hide graph if empty.
                            if (aq.aqPlotter.chtDeposition.Series.Count == 0) aq.aqPlotter.tbcPlotTabs.TabPages.Remove(aq.aqPlotter.tabDeposition);

                            //Clear from data set.
                            ds[i].depClear();
                        }
                        else if (treData.Nodes[i].Nodes[j].Text == "Quiet Time")
                        {
                            //Erase deleted item from graph if necessary.
                            if (treData.Nodes[i].Nodes[j].NodeFont.Bold)
                                aq.aqPlotter.chtQuietTime.Series.Remove(aq.aqPlotter.chtQuietTime.Series[treData.Nodes[i].Text]);

                            //Hide graph if empty.
                            if (aq.aqPlotter.chtQuietTime.Series.Count == 0) aq.aqPlotter.tbcPlotTabs.TabPages.Remove(aq.aqPlotter.tabQuietTime);

                            ds[i].QuietClear();
                        }
                        else if (treData.Nodes[i].Nodes[j].Text == "Raw Data")
                        {
                            //Erase deleted item from graph if necessary.
                            if (treData.Nodes[i].Nodes[j].NodeFont.Bold)
                                aq.aqPlotter.chtRawData.Series.Remove(aq.aqPlotter.chtRawData.Series[treData.Nodes[i].Text]);

                            //Hide graph if empty.
                            if (aq.aqPlotter.chtRawData.Series.Count == 0) aq.aqPlotter.tbcPlotTabs.TabPages.Remove(aq.aqPlotter.tabRawData);
                            ds[i].rawClear();
                        }
                        else if (treData.Nodes[i].Nodes[j].Text == "IV Curves")
                        {
                            ds[i].ivClear();
                        }
                        treeNodes.Add(treData.Nodes[i].Nodes[j]);
                    }

                    //Series nodes.
                    for (int k = 0; k < treData.Nodes[i].Nodes[j].GetNodeCount(false); k++)
                    {
                        if (treData.Nodes[i].Nodes[j].Nodes[k].Checked)
                        {
                            //Erase deleted item from graph if necessary.
                            if (treData.Nodes[i].Nodes[j].Nodes[k].NodeFont.Bold)
                                aq.aqPlotter.chtIVCurve.Series.Remove(aq.aqPlotter.chtIVCurve.Series[treData.Nodes[i].Text + 
                                    ", " + treData.Nodes[i].Nodes[j].Nodes[k].Text]);

                            //Hide graph if empty.
                            if (aq.aqPlotter.chtIVCurve.Series.Count == 0) aq.aqPlotter.tbcPlotTabs.TabPages.Remove(aq.aqPlotter.tabIVCurve);

                            try { ds[i].ivClearSub(k); }
                            catch (Exception err) { }//Do nothing.  Was erased above.              
                            treeNodes.Add(treData.Nodes[i].Nodes[j].Nodes[k]);
                        }
                    }
                }
            }

            //Check to see if all graphs are empty.
            Boolean allUnbolded = true;

            if (aq.aqPlotter.chtDeposition.Series.Count > 0) allUnbolded = false;
            if (aq.aqPlotter.chtQuietTime.Series.Count > 0) allUnbolded = false;
            if (aq.aqPlotter.chtRawData.Series.Count > 0) allUnbolded = false;
            if (aq.aqPlotter.chtIVCurve.Series.Count > 0) allUnbolded = false;

            //Remove plotter from display.
            if (allUnbolded)
            {
                //Indicate no graphs are active.
                nonePopulated = true;

                //Hide plotter.
                aq.aqPlotter.Visible = false;
                aq.wfHelper.Visible = true;
            }

            //Delete all the selected tree nodes.
            foreach (TreeNode node in treeNodes) treData.Nodes.Remove(node);

            //Delete all the selected data sets.
            foreach (DataSet dats in dataSet) ds.Remove(dats);

            //Check if parents have any children still graphed and update accordingly.
            //Parent nodes.
            foreach (TreeNode node in treData.Nodes)
            {
                //Test segment nodes.
                foreach (TreeNode subNode in node.Nodes)
                {
                    if(subNode.Text.Equals("IV Curves") && checkAllChildrenUnbolded(node))
                    {
                        subNode.NodeFont = new Font(treData.Font, FontStyle.Regular);
                    }          
                }

                //Check to see if all children are unbolded.  If so, unbold parent.
                if (checkAllChildrenUnbolded(node))
                {
                    node.NodeFont = new Font(treData.Font, FontStyle.Regular);
                }
            }
        }

        //Show test settings for the given data set.
        void testSettings(object sender, EventArgs e)
        {











        }

        /**************************************Data Tree GUI Functions**************************************/

        public DataTree(AquaSift aqs)
        {
            aq = aqs;
            InitializeComponent();
        }

        private void treData_MouseDown(object sender, MouseEventArgs e)
        {
            treData.Focus();
            clickedNode = treData.GetNodeAt(e.X, e.Y);

            if (e.Button == MouseButtons.Right)
            {
                ContextMenu contextMenu = new ContextMenu();

                MenuItem menuItem = new MenuItem("Rename Data Set");
                menuItem.Click += new EventHandler(rename);
                contextMenu.MenuItems.Add(menuItem);

                contextMenu.MenuItems.Add("-");//add horizontal separator.

                menuItem = new MenuItem("View Test Settings");
                menuItem.Click += new EventHandler(testSettings);
                contextMenu.MenuItems.Add(menuItem);

                contextMenu.MenuItems.Add("-");//add horizontal separator.

                menuItem = new MenuItem("Check All");
                menuItem.Click += new EventHandler(checkAll);
                contextMenu.MenuItems.Add(menuItem);

                menuItem = new MenuItem("Uncheck All");
                menuItem.Click += new EventHandler(uncheckAll);
                contextMenu.MenuItems.Add(menuItem);

                contextMenu.MenuItems.Add("-");//add horizontal separator.

                menuItem = new MenuItem("Add Checked To Graph");
                menuItem.Click += new EventHandler(addCheckedToGraph);
                contextMenu.MenuItems.Add(menuItem);

                menuItem = new MenuItem("Remove Checked From Graph");
                menuItem.Click += new EventHandler(removeCheckedFromGraph);
                contextMenu.MenuItems.Add(menuItem);

                contextMenu.MenuItems.Add("-");//add horizontal separator.

                menuItem = new MenuItem("Expand All");
                menuItem.Click += new EventHandler(expandAll);
                contextMenu.MenuItems.Add(menuItem);

                menuItem = new MenuItem("Collapse All");
                menuItem.Click += new EventHandler(collapseAll);
                contextMenu.MenuItems.Add(menuItem);

                contextMenu.MenuItems.Add("-");//add horizontal separator.

                menuItem = new MenuItem("Save");
                menuItem.Click += new EventHandler(saveAll);
                contextMenu.MenuItems.Add(menuItem);

                menuItem = new MenuItem("Delete All");
                menuItem.Click += new EventHandler(deleteAll);
                contextMenu.MenuItems.Add(menuItem);

                menuItem = new MenuItem("Delete Checked");
                menuItem.Click += new EventHandler(deleteChecked);
                contextMenu.MenuItems.Add(menuItem);

                menuItem = new MenuItem("Load");
                menuItem.Click += new EventHandler(load);
                contextMenu.MenuItems.Add(menuItem);

                menuItem = new MenuItem("Import");
                menuItem.Click += new EventHandler(import);
                contextMenu.MenuItems.Add(menuItem);

                treData.ContextMenu = contextMenu;

                //Only allow editing of top node.
                if ((clickedNode != null && clickedNode.Parent != null) || clickedNode == null)
                {
                    contextMenu.MenuItems[0].Enabled = false;
                }

                //Only show test settings for valid node entries.
                if (clickedNode == null)
                {
                    contextMenu.MenuItems[2].Enabled = false;
                }

                //Only enable these menu items when data is present.
                if(treData.GetNodeCount(false) == 0)
                {
                    contextMenu.MenuItems[4].Enabled = false;
                    contextMenu.MenuItems[5].Enabled = false;
                    contextMenu.MenuItems[7].Enabled = false;
                    contextMenu.MenuItems[8].Enabled = false;
                    contextMenu.MenuItems[10].Enabled = false;
                    contextMenu.MenuItems[11].Enabled = false;
                    contextMenu.MenuItems[13].Enabled = false;
                    contextMenu.MenuItems[14].Enabled = false;
                    contextMenu.MenuItems[15].Enabled = false;
                }
            }
        }

        private void treData_AfterCheck(object sender, TreeViewEventArgs e)
        {
            //Remove action listener to avoid multiple afterCheck events.
            this.treData.AfterCheck -= this.treData_AfterCheck;

            //Get checked tree node.        
            TreeNode thisNode = e.Node;

            //Uncheck all parent nodes if child unchecked and uncheck all children nodes.
            if (thisNode.Checked == false)
            {
                uncheckParents(thisNode);
                uncheckChildren(thisNode);
            }
            //Check all child nodes if parent checked.
            else if (thisNode.Checked == true)
            {
                checkChildren(thisNode);
                checkParent(thisNode);
            }

            //Replace action listener when done.
            this.treData.AfterCheck += this.treData_AfterCheck;
        }

        //Check parent node if all children checked.
        private void checkParent(TreeNode node)
        {
            //Only continue if a parent node exists.
            if (node.Parent != null)
            {
                bool allChecked = true;
                TreeNode parentNode = node.Parent;

                //Only check parent if all children are checked.
                foreach (TreeNode childNode in parentNode.Nodes)
                {
                    if (childNode.Checked == false)
                    {
                        allChecked = false;
                    }
                }

                if(allChecked)
                {
                    parentNode.Checked = true;
                }

                //Check the next level up.
                checkParent(parentNode);
            }
        }

        //Check all children of the parent node.
        private void checkChildren(TreeNode node)
        {
            //Check this node.
            node.Checked = true;

            //Check all child nodes if parent checked.
            foreach (TreeNode subNode in node.Nodes)
            {
                checkChildren(subNode);
            }
        }

        //Uncheck all the children nodes of this one.
        private void uncheckChildren(TreeNode node)
        {
            //Uncheck this node.
            node.Checked = false;

            //Uncheck all child nodes if parent unchecked.
            foreach (TreeNode subNode in node.Nodes)
            {
                uncheckChildren(subNode);
            }
        }

        //Uncheck all the parent nodes of this node.
        private void uncheckParents(TreeNode node)
        {
            if(node.Parent != null)
            {
                node.Parent.Checked = false;
                uncheckParents(node.Parent);
            }
        }

        private void treData_AfterLabelEdit(object sender, NodeLabelEditEventArgs e)
        {
            bool isUnique = true;

            treData.BeginUpdate();//Make sure font does not get clipped.

            if (e.Label != null && e.Label.Length > 0)//Label is valid.
            {
                //Check for duplicate label names and change if not unique.
                for (int i = 0; i < treData.GetNodeCount(false); i++)
                {
                    if (treData.Nodes[i].Text == e.Label && !treData.Nodes[i].Equals(clickedNode))
                    {
                        isUnique = false;
                        e.CancelEdit = true;
                    }
                }
                if (isUnique)//Change label manually if unique so graphs will update properly.
                {
                    clickedNode.Text = e.Label;
                    clickedNode.Name = e.Label;
                    e.CancelEdit = true;
                }
            }
            else//Invalid label.  Cancel.
            {
                e.CancelEdit = true;
            }

            //Need to modify label.
            if (!isUnique) changeNodeName(e.Label);

            treData.LabelEdit = false;
            treData.EndUpdate();//Make sure font does not get clipped.

            //Update node name in data set.
            for (int i = 0; i < treData.GetNodeCount(false); i++)
            {
                ds[i].nameSet(treData.Nodes[i].Text);
            }

            updateGraphs();//Update graph with new names.
        }

        //Duplicate node name found.  Need to append a number.
        private void changeNodeName(String labelName)
        {
            int nodeAppend = 1;
            bool isUnique = false;

            while (!isUnique)
            {
                isUnique = true;

                //Check for duplicate label names and change if not unique.
                for (int i = 0; i < treData.GetNodeCount(false); i++)
                {
                    if ((treData.Nodes[i].Text == (labelName + nodeAppend)) && !treData.Nodes[i].Equals(clickedNode))
                    {
                        isUnique = false;
                        nodeAppend++;
                    }
                }
            }

            clickedNode.Text = labelName + nodeAppend;//Update name.
        }

        /************************************Data Manuipulation Functions***********************************/

        //Insert a new data set into the data set list and the tree view.
        public void insertAtIndex(DataSet dset, int index)
        {
            bool isUnique = true;
            ds.Insert(index, new DataSet());//Create new data set in list.
            ds[index].copyFrom(dset);//Copy data set from source.

            //Update tree view.
            treData.Nodes.Insert(index, new TreeNode());
            treData.Nodes[index].Text = ds[index].nameGet();

            clickedNode = treData.Nodes[index];
        
            //Add data nodes to tree only if they exist.
            if (ds[index].depCount() > 0) treData.Nodes[index].Nodes.Add("Deposition", "Deposition");                
            if(ds[index].quietCount() > 0) treData.Nodes[index].Nodes.Add("Quiet Time", "Quiet Time");
            if(ds[index].rawCount() > 0) treData.Nodes[index].Nodes.Add("Raw Data", "Raw Data");

            //Add IV curve data to the tree.
            if (ds[index].ivCount() > 0)
            {
                treData.Nodes[index].Nodes.Add("IV Curves", "IV Curves");

                //Add all series in the IV curve data to the data tree.
                for (int i = 0; i < ds[index].ivCount(); i++)
                    treData.Nodes[index].Nodes["IV Curves"].Nodes.Add("Series" + (i + 1), "Series" + (i + 1));
            }

            //Make sure new node has a unique name.
            clickedNode = treData.Nodes[index];

            //Check for duplicate label names and change if not unique.
            for (int i = 0; i < treData.GetNodeCount(false); i++)
            {
                if (treData.Nodes[i].Text == clickedNode.Text && !treData.Nodes[i].Equals(clickedNode))
                {
                    isUnique = false;
                }              
            }

            //Need to modify label.
            if (!isUnique) changeNodeName(clickedNode.Text);

            treData.LabelEdit = false;
            treData.EndUpdate();//Make sure font does not get clipped.

            //Update node name in data set.
            for (int i = 0; i < treData.GetNodeCount(false); i++)
            {
                ds[i].nameSet(treData.Nodes[i].Text);
            }
        }

        //Set the marker in the tree data to indicate the data set should not be graphed (undo bold font).
        public void treeUngraphAll() { clearAllBoldFont(treData.Nodes); }
        private void clearAllBoldFont(TreeNodeCollection nodes)
        {
            foreach (TreeNode child in nodes)
            {
                child.NodeFont = new Font(treData.Font, FontStyle.Regular);
                clearAllBoldFont(child.Nodes);
            }
        }

        //Set the marker in the first entry in the tree data for graphing.
        public void treeGraphFirstItem()
        {
            treData.BeginUpdate();//Make sure font does not get clipped.
            treData.Nodes[0].NodeFont = new Font(treData.Font, FontStyle.Bold);
            setFirstBoldFont(treData.Nodes[0]);
            treData.EndUpdate();//End bold font update.
        }
        public void setFirstBoldFont(TreeNode nodes)
        {            
            foreach (TreeNode child in nodes.Nodes)
            {
                child.NodeFont = new Font(treData.Font, FontStyle.Bold);
                setFirstBoldFont(child);
            }
        }

        //Take all updated markers in the tree view and use them to draw the selected graphs.
        public void updateGraphs()
        {
            //First, clear all the graphs.
            aq.aqPlotter.chtDeposition.Series.Clear();
            aq.aqPlotter.chtQuietTime.Series.Clear();
            aq.aqPlotter.chtRawData.Series.Clear();
            aq.aqPlotter.chtIVCurve.Series.Clear();

            //Remove all tabs.
            aq.aqPlotter.tbcPlotTabs.TabPages.Remove(aq.aqPlotter.tabDeposition);
            aq.aqPlotter.tbcPlotTabs.TabPages.Remove(aq.aqPlotter.tabQuietTime);
            aq.aqPlotter.tbcPlotTabs.TabPages.Remove(aq.aqPlotter.tabRawData);
            aq.aqPlotter.tbcPlotTabs.TabPages.Remove(aq.aqPlotter.tabIVCurve);

            //Next, look through all the nodes for bold text and graph them.
            for (int i = 0; i < treData.GetNodeCount(false); i++)
            {
                //Deposition.
                if (treData.Nodes[i].Nodes["Deposition"] != null && treData.Nodes[i].Nodes["Deposition"].NodeFont.Bold == true)
                {
                    var series = new Series
                    {
                        //Set series name based on data set name.
                        Name = ds[i].nameGet(),
                        ChartType = SeriesChartType.FastLine
                    };

                    //Create new series in chart.
                    aq.aqPlotter.chtDeposition.Series.Add(series);

                    //Copy data points to chart.
                    for (int j = 0; j < ds[i].depCount(); j++)
                    {
                        aq.aqPlotter.addDepositionDataPoint(ds[i].depGet(j), aq.aqPlotter.chtDeposition.Series.Count() - 1);
                    }
                }

                //Quiet time.
                if (treData.Nodes[i].Nodes["Quiet Time"] != null && treData.Nodes[i].Nodes["Quiet Time"].NodeFont.Bold == true)
                {
                    var series = new Series
                    {
                        //Set series name based on data set name.
                        Name = ds[i].nameGet(),
                        ChartType = SeriesChartType.FastLine
                    };

                    //Create new series in chart.
                    aq.aqPlotter.chtQuietTime.Series.Add(series);

                    //Copy data points to chart.
                    for (int j = 0; j < ds[i].quietCount(); j++)
                    {
                        aq.aqPlotter.addQuietDataPoint(ds[i].quietGet(j), aq.aqPlotter.chtQuietTime.Series.Count() - 1);
                    }
                }

                //Raw data.
                if (treData.Nodes[i].Nodes["Raw Data"] != null && treData.Nodes[i].Nodes["Raw Data"].NodeFont.Bold == true)
                {
                    var series = new Series
                    {
                        //Set series name based on data set name.
                        Name = ds[i].nameGet(),
                        ChartType = SeriesChartType.FastLine
                    };

                    //Create new series in chart.
                    aq.aqPlotter.chtRawData.Series.Add(series);

                    //Copy data points to chart.
                    for (int j = 0; j < ds[i].rawCount(); j++)
                    {
                        aq.aqPlotter.addRawDataPoint(ds[i].rawGet(j), aq.aqPlotter.chtRawData.Series.Count() - 1);
                    }
                }

                //IV curve data.
                if (treData.Nodes[i].Nodes["IV Curves"] != null)
                {
                    for (int k = 0; k < treData.Nodes[i].Nodes["IV Curves"].GetNodeCount(false); k++)
                    {
                        if (treData.Nodes[i].Nodes["IV Curves"].Nodes[k].NodeFont.Bold == true)
                        {
                            var series = new Series
                            {
                                //Set series name based on data set name.
                                Name = ds[i].nameGet() + ", " + treData.Nodes[i].Nodes["IV Curves"].Nodes[k].Text,
                                ChartType = SeriesChartType.Line
                            };

                            //Create new series in chart.
                            aq.aqPlotter.chtIVCurve.Series.Add(series);

                            //Copy data points to chart.
                            for (int j = 0; j < ds[i].ivCountSub(k); j++)
                            {
                                aq.aqPlotter.addIVCurveDataPoint(ds[i].ivGetSub(k, j), aq.aqPlotter.chtIVCurve.Series.Count() - 1);
                            }
                        }
                    }
                }
            }

            nonePopulated = true;

            //Add populated tabs.
            if (aq.aqPlotter.chtDeposition.Series.Count > 0)
            {
                aq.aqPlotter.tbcPlotTabs.TabPages.Add(aq.aqPlotter.tabDeposition);
                nonePopulated = false;
            }
                
            if(aq.aqPlotter.chtQuietTime.Series.Count > 0)
            {
                aq.aqPlotter.tbcPlotTabs.TabPages.Add(aq.aqPlotter.tabQuietTime);
                nonePopulated = false;
            }
                
            if(aq.aqPlotter.chtRawData.Series.Count > 0)
            {
                aq.aqPlotter.tbcPlotTabs.TabPages.Add(aq.aqPlotter.tabRawData);
                nonePopulated = false;
            }

            if (aq.aqPlotter.chtIVCurve.Series.Count > 0)
            {
                aq.aqPlotter.tbcPlotTabs.TabPages.Add(aq.aqPlotter.tabIVCurve);
                nonePopulated = false;
            }
        
            //Show waveform diagram if no plots to show.
            if(nonePopulated)
            {
                aq.wfHelper.Visible = true;
                aq.aqPlotter.Visible = false;
            }  
            else//Show plots.
            {
                aq.wfHelper.Visible = false;
                aq.aqPlotter.Visible = true;
            }  

            //Set the last tab as active.
            aq.aqPlotter.tbcPlotTabs.SelectedIndex = aq.aqPlotter.tbcPlotTabs.TabCount - 1;
        }

        /**********************************Data Tree Interaction Functions**********************************/

        public void treData_Width(int width)
        {
            if (this.treData.InvokeRequired) this.treData.BeginInvoke(new Action(() => treData_Width(width)));
            else treData.Width = width - 6;
        }

        public void treData_Height(int height)
        {
            if (this.treData.InvokeRequired) this.treData.BeginInvoke(new Action(() => treData_Height(height)));
            treData.Height = height - 6;
        }
    }
}
