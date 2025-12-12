using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace SweetBox.Api.Models
{
    public class Categoria
    {
        [Key]
        public int IdCategoria { get; set; }
        public string NomeCategoria { get; set; } = string.Empty;

        [JsonIgnore]

        public ICollection<Produto>? Produtos { get; set; }
    }
}
