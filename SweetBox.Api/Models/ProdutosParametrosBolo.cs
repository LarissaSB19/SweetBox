using SweetBox.Api.Models;
using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;


namespace SweetBox.Api.Models
{
    public class ProdutosParametrosBolo
    {
        [Key]
        public int IdParametro { get; set; }
        public string TipoParametro { get; set; } = string.Empty;
        public string NomeParametro { get; set; } = string.Empty; 
        public string DescParametro { get; set; } = string.Empty;
        public float Mutiplicador { get; set; }

        public int IdProduto { get; set; }
        public Produto? Produto { get; set; }
    }
}
