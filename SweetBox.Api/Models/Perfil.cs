using System.ComponentModel.DataAnnotations;

public class Perfil
{
    [Key]
    public int IdPerfil { get; set; }
    public string NomePerfil { get; set; } = string.Empty;
}
