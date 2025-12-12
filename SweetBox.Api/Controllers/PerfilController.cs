using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SweetBox.Data;
using SweetBox.Api.Models;

[ApiController]
[Route("api/[controller]")]
public class PerfilController : ControllerBase
{
    private readonly SweetBoxContext _context;

    public PerfilController(SweetBoxContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<Perfil>>> GetPerfisAsync()
    {
        return Ok(await _context.Perfis.ToListAsync());
    }

    [HttpGet("{idPerfil}")]
    public async Task<ActionResult<Perfil>> GetPerfilAsync(int idPerfil)
    {
        var perfil = await _context.Perfis.FindAsync(idPerfil);
        if (perfil == null) return NotFound();
        return Ok(perfil);
    }

    [HttpPost]
    public async Task<ActionResult<Perfil>> CreatePerfilAsync(Perfil perfil)
    {
        _context.Perfis.Add(perfil);
        await _context.SaveChangesAsync();
        return CreatedAtAction(nameof(GetPerfilAsync), new { idPerfil = perfil.IdPerfil }, perfil);
    }

    [HttpPut("{idPerfil}")]
    public async Task<IActionResult> UpdatePerfilAsync(int idPerfil, Perfil perfil)
    {
        if (idPerfil != perfil.IdPerfil) return BadRequest();
        _context.Entry(perfil).State = EntityState.Modified;
        await _context.SaveChangesAsync();
        return NoContent();
    }

    [HttpDelete("{idPerfil}")]
    public async Task<IActionResult> DeletePerfilAsync(int idPerfil)
    {
        var perfil = await _context.Perfis.FindAsync(idPerfil);
        if (perfil == null) return NotFound();
        _context.Perfis.Remove(perfil);
        await _context.SaveChangesAsync();
        return NoContent();
    }
}