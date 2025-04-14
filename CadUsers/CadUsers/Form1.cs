using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Drawing;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Forms;

namespace CadUsers
{
    public partial class Form1 : Form
    {
        public Form1()
        {
            InitializeComponent();
        }

        private void users3BindingNavigatorSaveItem_Click(object sender, EventArgs e)
        {
            this.Validate();
            this.users3BindingSource.EndEdit();
            this.tableAdapterManager.UpdateAll(this.gabriel_BDDataSet);

        }

        private void Form1_Load(object sender, EventArgs e)
        {
            // TODO: esta linha de código carrega dados na tabela 'gabriel_BDDataSet.users3'. Você pode movê-la ou removê-la conforme necessário.
            this.users3TableAdapter.Fill(this.gabriel_BDDataSet.users3);

        }

        private void button1_Click(object sender, EventArgs e)
        {
             
        }
    }
}
