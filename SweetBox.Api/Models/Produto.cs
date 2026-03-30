using SweetBox.Api.Models;
using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace SweetBox.Api.Models
{
    public class Produto
    {
        [Key]
        public int IdProduto { get; set; }
        public string NomeProduto { get; set; } = string.Empty;
        public string Descricao { get; set; } = string.Empty;
        public string Imagem { get; set; } = string.Empty;
        public int IdEstoque { get; set; }
        public decimal Preco { get; set; }

        public int IdCategoria { get; set; }
        public Categoria? Categoria { get; set; }

        [JsonIgnore]
        public Estoque? Estoque { get; set; }
        public List<ProdutosParametrosBolo>? ProdutosParametrosBolo { get; set; }
    };
};
