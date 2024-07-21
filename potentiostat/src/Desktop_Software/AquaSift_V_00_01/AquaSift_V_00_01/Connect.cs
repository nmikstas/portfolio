using System;
using System.IO.Ports;
using System.Windows.Forms;

namespace AquaSift_V_00_01
{
    public partial class Connect : Form
    {
        public AquaSift aq;     //Pointer to main form.
        public AqTimer aqTim;   //Pointer to AquaSift timer class.

        public Connect(AquaSift aqsft)
        {
            InitializeComponent();
            aq = aqsft;
        }

        private void Connect_Load(object sender, EventArgs e)
        {
            cmbBaudRate.SelectedIndex = 7;
            cmbDataBits.SelectedIndex = 3;
            cmbParity.SelectedIndex = 0;
            cmbStopBits.SelectedIndex = 0;
            cmbFlowControl.SelectedIndex = 0;

            //Enumerate com ports.
            foreach (string s in SerialPort.GetPortNames())
                cmbComPort.Items.Add(s);
            
            if (cmbComPort.Items.Count > 0)
                cmbComPort.SelectedIndex = 0;

            //Set connect button as default button.
            btnConnect.Select();
        }

        private void btnConnect_Click(object sender, EventArgs e)
        {
            try
            {
                aq.comInitializer(this);
            }
            catch (Exception err)
            {
                MessageBox.Show(err.ToString(), "Error Opening COM Port", MessageBoxButtons.OK, MessageBoxIcon.Error);
            }
        }

        private void btnRefresh_Click(object sender, EventArgs e)
        {
            cmbComPort.Items.Clear();
            cmbComPort.Text = "";

            //Re-enumerate com ports.
            foreach (string s in SerialPort.GetPortNames())
                cmbComPort.Items.Add(s);

            if (cmbComPort.Items.Count > 0)
                cmbComPort.SelectedIndex = 0;
        }
    }
}
