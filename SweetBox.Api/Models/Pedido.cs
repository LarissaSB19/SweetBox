using System.ComponentModel.DataAnnotations;

namespace SweetBox.Api.Models
{
    public class Pedido
    {
        [Key]
        public int IdPedido { get; set; }
        public DateTime DataPedido { get; set; } = DateTime.Now;
        public decimal ValorTotal { get; set; }
        public string StatusPedido { get; set; } = "Em Preparo";
        public string FormaPagamento { get; set; } = string.Empty;

        public int IdUsuario {  get; set; }
        public Usuario? Usuario { get; set; } = new Usuario();

        public int IdPagamento { get; set; }
        public Pagamento? Pagamento { get; set; } = new Pagamento();
    }
}
