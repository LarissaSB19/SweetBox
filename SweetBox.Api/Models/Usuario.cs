using SweetBox.Api.Models;
using System.ComponentModel.DataAnnotations;

namespace SweetBox.Api.Models
{
    public class Usuario
    {
        [Key]
        public int IdUsuario { get; set; }
        public string CPF { get; set; } = string.Empty;
        public string Nome { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string Telefone { get; set; } = string.Empty;
        public string Endereco { get; set; } = string.Empty;
        public string Senha { get; set; } = string.Empty;
        public int IdPerfil { get; set; }

        public List<Pedido> Pedidos { get; set; } = new();
    }
}