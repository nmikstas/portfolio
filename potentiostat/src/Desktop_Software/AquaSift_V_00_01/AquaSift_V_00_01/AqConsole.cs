using System;
using System.Drawing;
using System.IO;
using System.Text;
using System.Windows.Forms;

namespace AquaSift_V_00_01
{
    //Defines source of console update.
    public enum consoleSources
    {
        CONSOLE_RX, CONSOLE_TX, CONSOLE_MANUAL
    };

    //States used in the ASCII conversion state machine.
    public enum asciiStates
    {
        ASC_IDLE, ASC_PART1
    };

    public partial class AqConsole : UserControl
    {
        /***************************************Console Class Variables*************************************/

        AquaSift aq;//Pointer to main form.

        /*****************************************Console Functions*****************************************/

        //Save the console window.
        void consoleSave(object sender, EventArgs e)
        {
            //Create save file dialog for console window.
            SaveFileDialog consoleSave = new SaveFileDialog();
            consoleSave.Filter = "Text File|*.txt|MatLab File|*.m|All Files|*.*";
            consoleSave.Title = "Save Console Window Contents";
            consoleSave.ShowDialog();

            if (consoleSave.FileName != "")
            {
                File.WriteAllText(consoleSave.FileName, rtbConsoleWindow_GetText());
            }
        }

        //Clear the console window.
        void consoleClear(object sender, EventArgs e)
        {
            rtbConsoleWindow.Clear();
        }

        //Select all the text in the console window.
        void consoleSelectAll(object sender, EventArgs e)
        {
            rtbConsoleWindow.SelectionStart = 0;
            rtbConsoleWindow.SelectionLength = rtbConsoleWindow.Text.Length;
        }

        //Copy all highlighted text in the console window to the clipboard.
        void consoleCopy(object sender, EventArgs e)
        {
            if (rtbConsoleWindow.SelectedText.Length > 0)
                Clipboard.SetText(rtbConsoleWindow.SelectedText);
        }

        //Convert the contents of the console window from ascii to hexadecimal.
        public void consoleToBinary()
        {
            char b, t;
            StringBuilder tString = new StringBuilder();

            if (!rbtBinary.Checked)//Make sure the button is not already selected.
            {
                tbxSendData.Clear();
                string temp = rtbConsoleWindow.Text;
                rtbConsoleWindow.Clear();

                for (int i = 0; i < temp.Length; i++)
                {
                    t = temp[i];

                    //Take care of special characters.
                    if (t == (char)0x0380)
                    {
                        tString.Append('\r');
                        continue;
                    }

                    if (t == 0x0A)
                        t = (char)0x0D;

                    t &= (char)0x00FF;

                    if (t < 0x10)
                        tString.Append('0');
                    else
                    {
                        b = (char)((t >> 4) + 0x30);
                        if (b > '9')
                            b += (char)0x07;
                        tString.Append(b);
                    }

                    b = (char)((t & 0x0F) + '0');
                    if (b > '9')
                        b += (char)0x07;

                    tString.Append(b);
                    tString.Append(' ');
                }

                rtbConsoleWindow.Text = tString.ToString();
            }
        }

        //Convert the contents of the console window from hexadecimal to ascii.
        public void consoleToAscii()
        {
            string temp;
            int i = 0;
            char thisChar = '0', nextChar;
            asciiStates asciiState = asciiStates.ASC_IDLE;
            StringBuilder tString = new StringBuilder();

            if (!rbtAscii.Checked)//Make sure the button is not already selected.
            {
                tbxSendData.Clear();
                temp = rtbConsoleWindow.Text;
                rtbConsoleWindow.Clear();
                temp = temp.ToUpper();

                while (i < temp.Length)
                {
                    switch (asciiState)
                    {
                        case asciiStates.ASC_IDLE:
                            //Special case.  Newline in binary stream.
                            if (temp[i] == (char)0x0A)
                            {
                                tString.Append((char)0x0380);
                                i++;
                                break;
                            }

                            if (temp[i] < '0' || (temp[i] > '9' && temp[i] < 'A') || temp[i] > 'F')
                            {
                                i++;//Skip past invalid character.
                                break;
                            }

                            //Get character and move to next state.
                            thisChar = temp[i++];

                            //Convert character to binary number.
                            thisChar -= (char)0x30;
                            if (thisChar > 0x09)
                                thisChar -= (char)0x07;

                            asciiState = asciiStates.ASC_PART1;
                            break;

                        case asciiStates.ASC_PART1:
                            if (temp[i] < '0' || (temp[i] > '9' && temp[i] < 'A') || temp[i] > 'F')
                            {
                                i++;//End of this conversion.

                                //Avoid corrupting the data by converting special characters to something else.
                                if (thisChar == (char)0x00 || thisChar == (char)0x0A || thisChar == (char)0x0B)
                                    thisChar += (char)0x0100;

                                tString.Append(thisChar);
                                asciiState = asciiStates.ASC_IDLE;
                                break;
                            }

                            //Calculate character value.
                            thisChar <<= 4;
                            nextChar = temp[i++];

                            nextChar -= (char)0x30;
                            if (nextChar > 0x09)
                                nextChar -= (char)0x07;

                            thisChar |= nextChar;

                            //Avoid corrupting the data by converting special characters to something else.
                            if (thisChar == (char)0x00 || thisChar == (char)0x0A || thisChar == (char)0x0B)
                                thisChar += (char)0x0100;

                            tString.Append(thisChar);
                            asciiState = asciiStates.ASC_IDLE;
                            break;

                        default://Shouldn't get here. Quit.
                            i = temp.Length;
                            break;
                    }
                }

                rtbConsoleWindow.Text = tString.ToString();
            }
        }

        //Console updating routine.  
        public void consoleUpdater(int count, byte[] bArray, consoleSources source, Control control)
        {
            char b;
            StringBuilder tempString = new StringBuilder();

            if (rbtBinary.Checked)
            {
                //Send newlines if transmitted binary block.  Keeps things readable.
                //The idea is transmissions will be sent all at once so the beginning
                //and end of the blocks are known.
                if (source == consoleSources.CONSOLE_TX || source == consoleSources.CONSOLE_MANUAL)
                    if (rtbConsoleWindow.Text.Length != 0 && rtbConsoleWindow.Text[rtbConsoleWindow.Text.Length - 1] != 0x0A)
                        tempString.Append("\r");

                //Send binary data to console window.
                for (int i = 0; i < count; i++)
                {
                    if (bArray[i] < 0x10)
                        tempString.Append("0");
                    else
                    {
                        b = (char)((bArray[i] >> 4) + 0x30);
                        if (b > '9')
                            b += (char)0x07;
                        tempString.Append(b.ToString());
                    }

                    b = (char)((bArray[i] & 0x0F) + '0');
                    if (b > '9')
                        b += (char)0x07;

                    tempString.Append(b.ToString());
                    tempString.Append(" ");
                }

                //Send newlines if transmitted binary block.  Keeps things readable.
                if ((source == consoleSources.CONSOLE_TX || source == consoleSources.CONSOLE_MANUAL) && count > 0)
                    tempString.Append("\r");

                rtbConsoleWindow_AppendText(tempString.ToString());
            }
            else
            {
                //Send ASCII data to console window.
                for (int i = 0; i < count; i++)
                {
                    b = (char)bArray[i];

                    //Avoid corrupting the data by converting special characters to something else.
                    if (b == (char)0x00 || b == (char)0x0A || b == (char)0x0B)
                        b += (char)0x0100;

                    tempString.Append(b.ToString());
                }
                rtbConsoleWindow_AppendText(tempString.ToString());
            }

            //Position caret at end of text.
            rtbConsoleWindow_PlaceCaratAtEnd();
            rtbConsoleWindow_Focus();
            return_Focus(control);
        }

        /**************************************GUI Component Functions**************************************/

        public AqConsole(AquaSift aqs)
        {
            aq = aqs;//Get pointer to main form.
            InitializeComponent();
        }

        private void AqConsole_Load(object sender, EventArgs e)
        {
            //By default, the binary radio button is checked.
            rbtBinary.Checked = true;

            //Set a fixed font for the console window.
            rtbConsoleWindow.Font = new Font(FontFamily.GenericMonospace, rtbConsoleWindow.Font.Size);

            //Disable data text box for the console.
            tbxSendData.Enabled = false;
        }

        private void btnClearConsoleWindow_Click(object sender, EventArgs e)
        {
            rtbConsoleWindow.Clear();
        }

        //Convert the contents of the console window from ascii to hexadecimal.
        private void rbtBinary_Enter(object sender, EventArgs e)
        {
            consoleToBinary();
        }

        //Convert the contents of the console window from hexadecimal to ascii.
        private void rbtAscii_Enter(object sender, EventArgs e)
        {
            consoleToAscii();
        }

        private void rtbConsoleWindow_MouseDown(object sender, MouseEventArgs e)
        {
            rtbConsoleWindow.Focus();

            if (e.Button == MouseButtons.Right)
            {
                ContextMenu contextMenu = new ContextMenu();

                MenuItem menuItem = new MenuItem("Save Console");
                menuItem.Click += new EventHandler(consoleSave);
                contextMenu.MenuItems.Add(menuItem);

                menuItem = new MenuItem("Clear Console");
                menuItem.Click += new EventHandler(consoleClear);
                contextMenu.MenuItems.Add(menuItem);

                contextMenu.MenuItems.Add("-");//add horizontal separator.

                menuItem = new MenuItem("Select All");
                menuItem.Click += new EventHandler(consoleSelectAll);
                contextMenu.MenuItems.Add(menuItem);

                menuItem = new MenuItem("Copy");
                menuItem.Click += new EventHandler(consoleCopy);
                contextMenu.MenuItems.Add(menuItem);

                rtbConsoleWindow.ContextMenu = contextMenu;
            }
        }

        private void tbxSendData_TextChanged(object sender, EventArgs e)
        {
            string temp;
            char stringEnd;

            if (rbtBinary.Checked && tbxSendData.TextLength > 0)
            {
                //Check to see if last character entered is valid or not.
                temp = tbxSendData.Text;
                temp = temp.ToUpper();
                stringEnd = temp[temp.Length - 1];

                if (stringEnd < '0' || (stringEnd > '9' && stringEnd < 'A') || stringEnd > 'F')
                {
                    temp = temp.Remove(temp.Length - 1, 1);
                }

                tbxSendData.Text = temp;

                if (tbxSendData.TextLength > 0) //Put cursor at end of text.
                {
                    tbxSendData.SelectionStart = tbxSendData.Text.Length;
                    tbxSendData.SelectionLength = 0;
                }
            }
        }

        private void tbxSendData_KeyDown(object sender, KeyEventArgs e)
        {
            string temp;

            if (e.KeyCode == Keys.Enter)
            {
                temp = tbxSendData.Text.ToUpper();

                //Send ascii data.
                if (rbtAscii.Checked)
                {
                    //Check for special single character cases.
                    if (temp.Length == 1 && (temp[0] == 'A' || temp[0] == 'D' || temp[0] == 'L'))
                    {
                        //Clear console window for clean data.
                        rtbConsoleWindow.Text = "";
                    }
                    else if (temp.Length == 1 && (temp[0] == 'T' || temp[0] == 'X'))
                    {
                        //Do nothing.
                    }
                    else if (temp.Length == 0)
                    {
                        //Clear window when main menu is presented.
                        rtbConsoleWindow.Text = "";
                        temp += "\r";
                    }
                    else
                    {
                        temp += "\r";
                    }

                    byte[] txArray = new byte[temp.Length];

                    for (int i = 0; i < temp.Length; i++)
                    {
                        txArray[i] = (byte)temp[i];
                    }

                    try//Send data to device.
                    {
                        aq.sp.Write(txArray, 0, txArray.Length);
                    }
                    catch (Exception err)
                    {
                        aq.comCloser();
                        aq.comErrorHandler(err.ToString());
                    }
                }
                //Send binary data.
                else
                {
                    //Prepend 0 if even number of characters entered.
                    if (temp.Length % 2 > 0)
                    {
                        temp = "0" + temp;
                    }

                    byte[] bArray = new byte[temp.Length / 2];
                    byte bTemp1, bTemp2;

                    //Convert text string into byte array.
                    for (int i = 0; i < temp.Length; i += 2)
                    {
                        bTemp1 = (byte)temp[i];
                        bTemp1 -= 0x30;
                        if (bTemp1 > 9) bTemp1 -= 0x07;
                        bTemp1 <<= 4;

                        bTemp2 = (byte)temp[i + 1];
                        bTemp2 -= 0x30;
                        if (bTemp2 > 9) bTemp2 -= 0x07;

                        bTemp1 |= bTemp2;
                        bArray[i / 2] = bTemp1;
                    }

                    consoleUpdater(bArray.Length, bArray, consoleSources.CONSOLE_MANUAL, this.tbxSendData);
                    
                    try//Send data to device.
                    {
                        aq.sp.Write(bArray, 0, bArray.Length);
                    }
                    catch (Exception err)
                    {
                        aq.comCloser();
                        aq.comErrorHandler(err.ToString());
                    }
                }

                aq.control = tbxSendData;
                tbxSendData.Clear();

                //Stop annoying chime sound after every enter key press.
                e.Handled = true;
                e.SuppressKeyPress = true;
            }
        }

        /**************************************Console Interaction Functions**************************************/
        public void rtbConsoleWindow_AppendText(String updateString)
        {
            if (this.rtbConsoleWindow.InvokeRequired) this.rtbConsoleWindow.BeginInvoke(new Action(() => rtbConsoleWindow_AppendText(updateString)));
            else rtbConsoleWindow.AppendText(updateString);
        }

        public void rtbConsoleWindow_PlaceCaratAtEnd()
        {
            if(this.rtbConsoleWindow.InvokeRequired) this.rtbConsoleWindow.BeginInvoke(new Action(() => rtbConsoleWindow_PlaceCaratAtEnd()));
            else if (rtbConsoleWindow.Text.Length > 0) rtbConsoleWindow.SelectionStart = rtbConsoleWindow.Text.Length;
        }

        public void rtbConsoleWindow_Focus()
        {
            if (this.rtbConsoleWindow.InvokeRequired) this.rtbConsoleWindow.BeginInvoke(new Action(() => rtbConsoleWindow_Focus()));
            else rtbConsoleWindow.Focus();
        }

        public void rtbConsoleWindow_Clear()
        {
            if (this.rtbConsoleWindow.InvokeRequired) this.rtbConsoleWindow.BeginInvoke(new Action(() => rtbConsoleWindow_Clear()));
            else rtbConsoleWindow.Clear();
        }

        public void rtbConsoleWindow_Width(int width)
        {
            if (this.rtbConsoleWindow.InvokeRequired) this.rtbConsoleWindow.BeginInvoke(new Action(() => rtbConsoleWindow_Width(width)));
            else rtbConsoleWindow.Width = width;
        }

        public void rtbConsoleWindow_Height(int height)
        {
            if (this.rtbConsoleWindow.InvokeRequired) this.rtbConsoleWindow.BeginInvoke(new Action(() => rtbConsoleWindow_Height(height)));
            else rtbConsoleWindow.Height = height;
        }

        public String rtbConsoleWindow_GetText()
        {
            return rtbConsoleWindow.Text;
        }

        public void return_Focus(Control control)
        {
            if (control == null) return;
            if (control.InvokeRequired) control.BeginInvoke(new Action(() => return_Focus(control)));
            else control.Focus();
        }

        public void tbxSendData_Enable(Boolean en)
        {
            if (this.tbxSendData.InvokeRequired) this.tbxSendData.BeginInvoke(new Action(() => tbxSendData_Enable(en)));
            else tbxSendData.Enabled = en;
        }

        public void rbtAscii_Enable(Boolean en)
        {
            if (this.rbtAscii.InvokeRequired) this.rbtAscii.BeginInvoke(new Action(() => rbtAscii_Enable(en)));
            else rbtAscii.Enabled = en;
        }

        public void rbtAscii_Checked(Boolean check)
        {
            if (this.rbtAscii.InvokeRequired) this.rbtAscii.BeginInvoke(new Action(() => rbtAscii_Checked(check)));
            else rbtAscii.Checked = check;
        }

        public void rbtBinary_Enable(Boolean en)
        {
            if (this.rbtBinary.InvokeRequired) this.rbtBinary.BeginInvoke(new Action(() => rbtBinary_Enable(en)));
            else rbtBinary.Enabled = en;
        }

        public void rbtBinary_Checked(Boolean check)
        {
            if (this.rbtBinary.InvokeRequired) this.rbtBinary.BeginInvoke(new Action(() => rbtBinary_Checked(check)));
            else rbtBinary.Checked = check;
        }

        public void gbxAquaSiftConsole_Width(int width)
        {
            if (this.gbxAquaSiftConsole.InvokeRequired) this.gbxAquaSiftConsole.BeginInvoke(new Action(() => gbxAquaSiftConsole_Width(width)));
            else gbxAquaSiftConsole.Width = width;
        }

        public void gbxAquaSiftConsole_Height(int height)
        {
            if (this.gbxAquaSiftConsole.InvokeRequired) this.gbxAquaSiftConsole.BeginInvoke(new Action(() => gbxAquaSiftConsole_Height(height)));
            else gbxAquaSiftConsole.Height = height;
        }
    }
}
