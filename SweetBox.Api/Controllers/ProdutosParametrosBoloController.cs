using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SweetBox.Data;
using SweetBox.Api.Models;

[Route("api/[controller]")]
[ApiController]
public class ProdutosParametrosBoloController : ControllerBase
{
    private readonly SweetBoxContext _context;

    public ProdutosParametrosBoloController(SweetBoxContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<ProdutosParametrosBolo>>> GetProdutosParametrosBolosAsync()
    {
        return Ok(await _context.ProdutosParametrosBolos.ToListAsync());
    }

    [HttpGet("{idParametro}", Name = "GetProdutoParametrosBolo")]
    public async Task<ActionResult<ProdutosParametrosBolo>> GetProdutoParametrosBoloAsync(int idParametro)
    {
        var produtosParametrosBolo = await _context.ProdutosParametrosBolos.FindAsync(idParametro);
        if (produtosParametrosBolo == null) return NotFound();
        return Ok(produtosParametrosBolo);
    }

    [HttpGet("{idproduto}/opcoes")]
    public IActionResult GetOpcoes(int produtoId)
    {
        var parametros = _context.ProdutosParametrosBolos.ToList();

        var resultado = parametros
            .GroupBy(p => p.TipoParametro)
            .Select(g => new
            {
                nome = g.Key,
                tipo = g.Key == "Recheio" ? "multi" : "select",
                maxSelecao = g.Key == "Recheio" ? 2 : 1,
                opcoes = g.Select(p => new
                {
                    id = p.IdParametro,
                    nome = p.NomeParametro
                }).ToList()
            })
            .ToList();

        return Ok(resultado);
    }

    [HttpPost]
    public async Task<ActionResult<ProdutosParametrosBolo>> CreateProdutosParametrosBoloAsync(ProdutosParametrosBolo produtosParametrosBolo)
    {
        _context.ProdutosParametrosBolos.Add(produtosParametrosBolo);
        await _context.SaveChangesAsync();

        return Created($"/api/Produto/{produtosParametrosBolo.IdParametro}", produtosParametrosBolo);
    }

    [HttpPut("{idProdutosParametrosBolo}")]
    public async Task<IActionResult> UpdateProdutosParametrosBoloAsync(int idProdutosParametrosBolo, ProdutosParametrosBolo produtosParametrosBolo)
    {
        if (idProdutosParametrosBolo != produtosParametrosBolo.IdParametro) return BadRequest();
        _context.Entry(produtosParametrosBolo).State = EntityState.Modified;
        await _context.SaveChangesAsync();
        return NoContent();
    }

    [HttpDelete("{idParametro}")]
    public async Task<IActionResult> DeleteProdutosParametrosBoloAsync(int idParametro)
    {
        var produtosParametrosBolo = await _context.ProdutosParametrosBolos.FindAsync(idParametro);
        if (produtosParametrosBolo == null) return NotFound();
        _context.ProdutosParametrosBolos.Remove(produtosParametrosBolo);
        await _context.SaveChangesAsync();
        return NoContent();
    }

}