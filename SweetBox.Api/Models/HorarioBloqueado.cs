using System.ComponentModel.DataAnnotations;

namespace SweetBox.Api.Models
{
    public class HorarioBloqueado
    {
        [Key]
        public int IdHorarioBloqueado { get; set; }

        public DateTime Data { get; set; }

        public TimeSpan Hora { get; set; }
    }
}