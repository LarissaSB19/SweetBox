using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SweetBox.Data;
using SweetBox.Api.Models;

[Route("api/[controller]")]
[ApiController]
public class UsuarioController : ControllerBase
{
    private readonly SweetBoxContext _context;

    public UsuarioController(SweetBoxContext context)
    {
        _context = context;
    }

    [HttpPost("login")]
    public async Task<ActionResult<Usuario>> Login(LoginRequest request)
    {
        var usuario = await _context.Usuarios

            .FirstOrDefaultAsync(u =>
                u.Email == request.Email &&
                u.Senha == request.Senha);

        if (usuario == null)
            return Unauthorized(new { mensagem = "Email ou senha inválidos." });

        return Ok(usuario);
    }

    [HttpGet("perfil/{id}")]
    public async Task<IActionResult> GetPerfil(int id)
    {
        var usuario = await _context.Usuarios
            .Where(u => u.IdUsuario == id)
            .Select(u => new {
                u.IdUsuario,
                u.Nome,
                u.Email,
                u.Telefone,
                u.Endereco,
                u.CPF,
                u.Senha,
                u.IdPerfil
            })
            .FirstOrDefaultAsync();

        if (usuario == null)
            return NotFound();

            var pedidos = await _context.Pedidos
                .Where(p => p.IdUsuario == id)
                .Include(p => p.PedidoItens)
                    .ThenInclude(pi => pi.Produto)
                .Include(p => p.PedidoItens)
                    .ThenInclude(pi => pi.PedidoItemParametroBolo)
                .Select(p => new {
                    p.IdPedido,
                    p.DataPedido,
                    p.ValorTotal,
                    p.StatusPedido,
                    p.FormaPagamento,

                    pedidoItens = p.PedidoItens.Select(i => new {
                        produto = new
                        {
                            nomeProduto = i.Produto.NomeProduto
                        },
                        quantidade = i.Quantidade,
                        precoUnitario = i.PrecoUnitario,

                        pedidoItemParametroBolo = i.PedidoItemParametroBolo.Select(param => new {
                            valorEscolhido = param.ValorEscolhido,
                            quantidade = param.Quantidade
                        })
                    })
                })
                .OrderByDescending(p => p.DataPedido)
                .ToListAsync();

        return Ok(new
        {
            usuario,
            pedidos
        });
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<Usuario>>> GetUsuariosAsync()
    {
        return Ok(await _context.Usuarios.ToListAsync());
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<Usuario>> GetUsuarioAsync(int id)
    {
        var usuario = await _context.Usuarios.FindAsync(id);
        if (usuario == null) return NotFound();
        return Ok(usuario);
    }

    [HttpPost]

    public async Task<ActionResult<Usuario>> CreateUsuarioAsync([FromBody] Usuario usuario)
    {
        usuario.IdPerfil = 3;

        _context.Usuarios.Add(usuario);
        await _context.SaveChangesAsync();

        return Created($"api/Usuario/{usuario.IdUsuario}", usuario);
    }

    [HttpPut("{idUsuario}")]
    public async Task<IActionResult> UpdateUsuarioAsync(int idUsuario, Usuario usuario)
    {
        if (idUsuario != usuario.IdUsuario) return BadRequest();
        _context.Entry(usuario).State = EntityState.Modified;
        await _context.SaveChangesAsync();
        return NoContent();
    }

    [HttpDelete("{idUsuario}")]
    public async Task<IActionResult> DeleteUsuarioAsync(int idUsuario)
    {
        var usuario = await _context.Usuarios.FindAsync(idUsuario);
        if (usuario == null) return NotFound();
        _context.Usuarios.Remove(usuario);
        await _context.SaveChangesAsync();
        return NoContent();
    }
}