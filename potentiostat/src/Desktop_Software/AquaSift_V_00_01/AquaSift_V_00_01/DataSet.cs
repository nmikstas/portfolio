using System;
using System.Collections.Generic;
using System.Linq;
using System.Windows.Forms.DataVisualization.Charting;

namespace AquaSift_V_00_01
{
    public class DataSet
    {
        //A simple class an array of data points.  Used for 2-dimensional data.
        public class DataSetArray
        {
            private List<DataPoint> data;

            //Constructor.
            public DataSetArray() { data = new List<DataPoint>(); }

            //Clear list.
            public void clear() { data.Clear(); }

            //Append data point to list.
            public void add(DataPoint dp) { data.Add(dp); }

            //Get list length.
            public int count() { return data.Count; }

            //Get data point at given index.
            public DataPoint getDataPoint(int index) { return data[index]; }

            //Copy another list into this one.
            public void copyFrom(DataSetArray from)
            {
                data.Clear();               //Get rid of old data.
                int count = from.count();   //Get number of elements in array.

                //Elementwise copy from given list to this list.
                for(int i = 0; i < count; i++)
                {
                    data.Add(from.getDataPoint(i));
                }
            }

            //Copy this list into another one.
            public void copyTo(DataSetArray to)
            {
                to.clear();                 //Get rid of old data.
                int count = data.Count;     //Get number of elements in array.

                //Elementwise copy from this list to given list.
                for (int i = 0; i < count; i++)
                {
                    to.add(data[i]);
                }
            }
        }

        private String dataName;                //Name of the data.
        private String dataType;                //Test type represented by the data.

        private String ex1String;               //Extra string storage.
        private String ex2String;               //
        private String ex3String;               //
        private String ex4String;               //

        public Settings settings;               //AquaSift settings data.

        private List<DataPoint> depData;        //Deposition data.
        private List<DataPoint> quietData;      //Quiet time data.
        private List<DataPoint> rawData;        //Raw data collected.
        private List<DataSetArray> ivData;      //Array of IV curve data.

        private List<DataPoint> ex1Data;        //Extra storage for any additional data.
        private List<DataPoint> ex2Data;        //
        private List<DataPoint> ex3Data;        //
        private List<DataPoint> ex4Data;        //

        public DataSet()
        {
            char[] temp = { '0' };
            dataName = new String(temp);
            dataType = new String(temp);
            ex1String = new String(temp);
            ex2String = new String(temp);
            ex3String = new String(temp);
            ex4String = new String(temp);

            settings = new Settings();          //AquaSift settings data.

            depData = new List<DataPoint>();    //Deposition data.
            quietData = new List<DataPoint>();  //Quiet time data.
            rawData = new List<DataPoint>();    //Raw data collected.
            ivData = new List<DataSetArray>();  //Array of IV curve data.

            ex1Data = new List<DataPoint>();    //Extra storage for any additional data.
            ex2Data = new List<DataPoint>();    //
            ex3Data = new List<DataPoint>();    //
            ex4Data = new List<DataPoint>();    //
        }

        /******************************************String Functions*****************************************/

        public void nameSet(String s) { dataName = s; }
        public String nameGet() { return dataName; }
        public void typeSet(String s) { dataType = s; }
        public String typeGet() { return dataType; }
        public void ex1Set(String s) { ex1String = s; }
        public String ex1Get() { return ex1String; }
        public void ex2Set(String s) { ex2String = s; }
        public String ex2Get() { return ex2String; }
        public void ex3Set(String s) { ex3String = s; }
        public String ex3Get() { return ex3String; }
        public void ex4Set(String s) { ex4String = s; }
        public String ex4Get() { return ex4String; }

        /*******************************************Clear Functions******************************************/

        public void depClear() { depData.Clear(); }
        public void QuietClear() { quietData.Clear(); }
        public void rawClear() { rawData.Clear(); }
        public void ivClear() { ivData.Clear(); }
        public void ivClearSub(int index) { ivData[index].clear(); }
        public void ex1Clear() { ex1Data.Clear(); }
        public void ex2Clear() { ex2Data.Clear(); }
        public void ex3Clear() { ex3Data.Clear(); }
        public void ex4Clear() { ex4Data.Clear(); }

        /********************************************Add Functions******************************************/

        public void depAdd(DataPoint dp) { depData.Add(dp); }
        public void quietAdd(DataPoint dp) { quietData.Add(dp); }
        public void rawAdd(DataPoint dp) { rawData.Add(dp); }
        public void ivAdd() { ivData.Add(new DataSetArray()); }
        public void ivAddSub(int index, DataPoint dp) { ivData[index].add(dp); }
        public void ex1Add(DataPoint dp) { ex1Data.Add(dp); }
        public void ex2Add(DataPoint dp) { ex2Data.Add(dp); }
        public void ex3Add(DataPoint dp) { ex3Data.Add(dp); }
        public void ex4Add(DataPoint dp) { ex4Data.Add(dp); }

        /*******************************************Length Functions****************************************/

        public int depCount() { return depData.Count(); }
        public int quietCount() { return quietData.Count(); }
        public int rawCount() { return rawData.Count(); }
        public int ivCount() { return ivData.Count(); }
        public int ivCountSub(int index) { return ivData[index].count(); }
        public int ex1Count() { return ex1Data.Count(); }
        public int ex2Count() { return ex2Data.Count(); }
        public int ex3Count() { return ex3Data.Count(); }
        public int ex4Count() { return ex4Data.Count(); }

        /******************************************Get Data Functions***************************************/

        public DataPoint depGet(int index) { return depData[index]; }
        public DataPoint quietGet(int index) { return quietData[index]; }
        public DataPoint rawGet(int index) { return rawData[index]; }
        public DataPoint ivGetSub(int mainIndex, int subIndex) { return ivData[mainIndex].getDataPoint(subIndex); }
        public DataPoint ex1Get(int index) { return ex1Data[index]; }
        public DataPoint ex2Get(int index) { return ex2Data[index]; }
        public DataPoint ex3Get(int index) { return ex3Data[index]; }
        public DataPoint ex4Get(int index) { return ex4Data[index]; }

        /*****************************************Class Copy Functions**************************************/

        //Copy another class data set to this class.
        public void copyFrom(DataSet from)
        {
            //Clear out this object's data.
            depData.Clear();
            quietData.Clear();
            rawData.Clear();
            ivData.Clear();
            ex1Data.Clear();
            ex2Data.Clear();
            ex3Data.Clear();
            ex4Data.Clear();
                   
            //Copy strings.     
            dataName = from.nameGet();
            dataType = from.typeGet();   
            ex1String = from.ex1Get();  
            ex2String = from.ex2Get();   
            ex3String = from.ex3Get();
            ex4String = from.ex3Get();

            //Copy settings.
            settings.copyFrom(from.settings);

            int count = from.depCount();//Get number of elements in deposition array.
            for (int i = 0; i < count; i++)//Elementwise copy from given list to this list.
            {
                depAdd(from.depGet(i));
            }

            count = from.quietCount();//Get number of elements in quiet array.
            for (int i = 0; i < count; i++)//Elementwise copy from given list to this list.
            {
                quietAdd(from.quietGet(i));
            }

            count = from.rawCount();//Get number of elements in raw array.
            for (int i = 0; i < count; i++)//Elementwise copy from given list to this list.
            {
                rawAdd(from.rawGet(i));
            }

            count = from.ivCount();
            for (int i = 0; i < count; i++)//Create new entries in IV list.
            {
                ivData.Add(new DataSetArray());
                int subCount = from.ivCountSub(i);
                for (int j = 0; j < subCount; j++)//Elementwise copy from given list to this list.
                {
                    ivData[i].add(from.ivGetSub(i, j));
                }
            }

            count = from.ex1Count();//Get number of elements in raw array.
            for (int i = 0; i < count; i++)//Elementwise copy from given list to this list.
            {
                ex1Add(from.ex1Get(i));
            }

            count = from.ex2Count();//Get number of elements in raw array.
            for (int i = 0; i < count; i++)//Elementwise copy from given list to this list.
            {
                ex2Add(from.ex2Get(i));
            }

            count = from.ex3Count();//Get number of elements in raw array.
            for (int i = 0; i < count; i++)//Elementwise copy from given list to this list.
            {
                ex3Add(from.ex3Get(i));
            }

            count = from.ex4Count();//Get number of elements in raw array.
            for (int i = 0; i < count; i++)//Elementwise copy from given list to this list.
            {
                ex4Add(from.ex4Get(i));
            }
        }
    }
}
