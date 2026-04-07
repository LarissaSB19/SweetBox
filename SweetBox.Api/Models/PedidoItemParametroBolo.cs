using System.ComponentModel.DataAnnotations;

namespace SweetBox.Api.Models
{
    public class PedidoItemParametroBolo
    {
        [Key]
        public int IdItemParametro { get; set; }

        public int IdPedidoItem { get; set; }   
        public PedidoItem? PedidoItem { get; set; }

        public int IdParametro { get; set; }    
        public ProdutosParametrosBolo? Parametro { get; set; }

        public string ValorEscolhido { get; set; } = string.Empty;

        public int Quantidade { get; set; } 
    }
}