using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Drawing;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Forms;
using System.Data.SqlClient;

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

        private void btnPesquisa_Click(object sender, EventArgs e)
        {
            {
                string termoPesquisa = txtPesquisa.Text.Trim();

                if (string.IsNullOrEmpty(termoPesquisa))
                {
                    MessageBox.Show("Digite um nome para pesquisar.");
                    return;
                }

                string conexaoString = "Data Source=EDUCADORES;Initial Catalog=Gabriel_BD;Integrated Security=True";
                string query = "SELECT Nome, Telefone, CPF, Email FROM users3 WHERE Nome LIKE @Nome";

                using (SqlConnection conexao = new SqlConnection(conexaoString))
                {
                    try
                    {
                        SqlCommand comando = new SqlCommand(query, conexao);
                        comando.Parameters.AddWithValue("@Nome", "%" + termoPesquisa + "%");

                        SqlDataAdapter adaptador = new SqlDataAdapter(comando);
                        DataTable tabela = new DataTable();

                        adaptador.Fill(tabela);
                        dataGridView1.DataSource = tabela;
                    }
                    catch (Exception ex)
                    {
                        MessageBox.Show("Erro: " + ex.Message);
                    }
                }

            }
        }
    }
}

