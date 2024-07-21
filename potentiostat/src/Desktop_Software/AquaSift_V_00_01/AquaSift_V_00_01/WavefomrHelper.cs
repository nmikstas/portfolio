using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Drawing;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Forms;

namespace AquaSift_V_00_01
{
    public partial class WavefomrHelper : UserControl
    {
        AquaSift aq;//Pointer to AquaSift object.
        public Boolean dataLoaded = false;//Indicates test data is loaded and waveform picture should not be displayed.

        //Load the proper waveform picture into the waveform viewer.
        public void waveformLoader()
        {
            //Load waveform diagram if the funcionality is enabled.
            if (aq.waveformEnable && aq.tabControl1.SelectedIndex == AquaSift.TAB_CONTROL_TEST_INDEX && !dataLoaded && aq.dataTree.nonePopulated)
            {
                if (aq.cmbTestTypes.SelectedIndex == AquaSift.SELECTION_DIF_PULSE)
                {
                    picWaveformHelper.Image = Properties.Resources.AqDifPulse;
                    picWaveformHelper.MinimumSize =
                        new Size(Properties.Resources.AqDifPulse.Width, Properties.Resources.AqDifPulse.Height);
                    MinimumSize =
                        new Size(Properties.Resources.AqDifPulse.Width, Properties.Resources.AqDifPulse.Height);
                }
                else if(aq.cmbTestTypes.SelectedIndex == AquaSift.SELECTION_LIN_SWEEP && !dataLoaded)
                {
                    picWaveformHelper.Image = Properties.Resources.AqSweep;
                    picWaveformHelper.MinimumSize =
                        new Size(Properties.Resources.AqSweep.Width, Properties.Resources.AqSweep.Height);
                    MinimumSize =
                        new Size(Properties.Resources.AqSweep.Width, Properties.Resources.AqSweep.Height);
                }

                Visible = true;
            }
            else
            {
                Visible = false;//Hide waveform vierwer if not enabled.
            }
        }

        public WavefomrHelper(AquaSift aqs)
        {
            aq = aqs;
            InitializeComponent();
        }
    }
}
