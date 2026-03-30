using System.ComponentModel.DataAnnotations;

namespace SweetBox.Api.Models
{
    public class Pagamento
    {
        [Key]
        public int IdPagamento { get; set; }

        public string Metodo { get; set; } = string.Empty;
        public decimal Valor { get; set; }
        public string StatusPagamento { get; set; } = "Pendente";
        public DateTime DataPagamento { get; set; } = DateTime.Now;

        public int IdPedido { get; set; }
        public Pedido? Pedido { get; set; }
    }
}
