using System.ComponentModel.DataAnnotations;

namespace SweetBox.Api.Models
{
    public class Estoque
    {
        [Key]
        public int IdEstoque { get; set; }
        public int Quantidade { get; set; }

        public int IdProduto { get; set; }
        public Produto? Produto { get; set; }
    }
}
