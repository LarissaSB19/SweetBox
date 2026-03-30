using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SweetBox.Data;
using SweetBox.Api.Models;

[Route("api/[controller]")]
[ApiController]
public class ProdutoController : ControllerBase
{
    private readonly SweetBoxContext _context;

    public ProdutoController(SweetBoxContext context)
    {
        _context = context;
    }


    [HttpGet]
    public async Task<ActionResult<IEnumerable<Produto>>> GetProdutos()
    {
        return await _context.Produtos
            .Include(p => p.Categoria)
            .Include(p => p.ProdutosParametrosBolo)
            .ToListAsync();
    }

    [HttpGet("{idProduto}", Name = "GetProduto")]
    public async Task<ActionResult<Produto>> GetProdutoAsync(int idProduto)
    {
        var produto = await _context.Produtos.FindAsync(idProduto);
        if (produto == null) return NotFound();
        return Ok(produto);
    }


    [HttpPost]
    public async Task<ActionResult<Produto>> CreateProdutoAsync(Produto produto)
    {
        _context.Produtos.Add(produto);
        await _context.SaveChangesAsync();

        return Created($"/api/Produto/{produto.IdProduto}", produto);
    }

    [HttpPut("{idProduto}")]
    public async Task<IActionResult> UpdateProdutoAsync(int idProduto, Produto produto)
    {
        if (idProduto != produto.IdProduto) return BadRequest();
        _context.Entry(produto).State = EntityState.Modified;
        await _context.SaveChangesAsync();
        return NoContent();
    }

    [HttpDelete("{idProduto}")]
    public async Task<IActionResult> DeleteProdutoAsync(int idProduto)
    {
        var produto = await _context.Produtos.FindAsync(idProduto);
        if (produto == null) return NotFound();
        _context.Produtos.Remove(produto);
        await _context.SaveChangesAsync();
        return NoContent();
    }

}