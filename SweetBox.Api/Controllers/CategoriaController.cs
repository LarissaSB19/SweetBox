using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SweetBox.Data;
using SweetBox.Api.Models;

[ApiController]
[Route("api/[controller]")]
public class CategoriaController : ControllerBase
{
    private readonly SweetBoxContext _context;

    public CategoriaController(SweetBoxContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<Categoria>>> GetCategoriasAsync()
    {
        try
        {
            var categorias = await _context.Categorias.ToListAsync();
            return Ok(categorias);
        }
        catch (Exception ex)
        {
            return StatusCode(500, $"Erro ao buscar categorias: {ex.Message}");
        }
    }

    [HttpGet("{idCategoria}")]
    public async Task<ActionResult<Categoria>> GetCategoriaAsync(int idCategoria)
    {
        try
        {
            var categoria = await _context.Categorias.FindAsync(idCategoria);

            if (categoria == null)
                return NotFound("Categoria não encontrada.");

            return Ok(categoria);
        }
        catch (Exception ex)
        {
            return StatusCode(500, $"Erro ao buscar categoria: {ex.Message}");
        }
    }

    [HttpPost]
    public async Task<ActionResult<Categoria>> CreateCategoriaAsync(Categoria categoria)
    {
        try
        {
            _context.Categorias.Add(categoria);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetCategoriaAsync),
                new { idCategoria = categoria.IdCategoria }, categoria);
        }
        catch (Exception ex)
        {
            return StatusCode(500, $"Erro ao criar categoria: {ex.Message}");
        }
    }

    [HttpPut("{idCategoria}")]
    public async Task<IActionResult> UpdateCategoriaAsync(int idCategoria, Categoria categoria)
    {
        if (idCategoria != categoria.IdCategoria)
            return BadRequest("O ID enviado não corresponde ao ID da categoria.");

        try
        {
            _context.Entry(categoria).State = EntityState.Modified;
            await _context.SaveChangesAsync();
            return Ok("Categoria atualizada com sucesso.");
        }
        catch (DbUpdateConcurrencyException)
        {
            if (!_context.Categorias.Any(c => c.IdCategoria == idCategoria))
                return NotFound("Categoria não encontrada.");

            throw;
        }
        catch (Exception ex)
        {
            return StatusCode(500, $"Erro ao atualizar categoria: {ex.Message}");
        }
    }

    [HttpDelete("{idCategoria}")]
    public async Task<IActionResult> DeleteCategoriaAsync(int idCategoria)
    {
        try
        {
            var categoria = await _context.Categorias.FindAsync(idCategoria);

            if (categoria == null)
                return NotFound("Categoria não encontrada.");

            _context.Categorias.Remove(categoria);
            await _context.SaveChangesAsync();

            return Ok("Categoria removida com sucesso.");
        }
        catch (Exception ex)
        {
            return StatusCode(500, $"Erro ao remover categoria: {ex.Message}");
        }
    }
}
