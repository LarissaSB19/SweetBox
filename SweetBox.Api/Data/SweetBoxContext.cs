using Microsoft.EntityFrameworkCore;
using SweetBox.Api.Models;

namespace SweetBox.Data
{
    public class SweetBoxContext : DbContext
    {
        public SweetBoxContext(DbContextOptions<SweetBoxContext> options)
            : base(options) { }

        public DbSet<Estoque> Estoques { get; set; }
        public DbSet<Pagamento> Pagamentos { get; set; }
        public DbSet<Pedido> Pedidos { get; set; }
        public DbSet<PedidoItem> PedidoItens { get; set; }
        public DbSet<Perfil> Perfis { get; set; }
        public DbSet<Produto> Produtos { get; set; }
        public DbSet<Usuario> Usuarios { get; set; }
        public DbSet<Categoria> Categorias { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Pedido>()
                .HasOne(pd => pd.Pagamento)
                .WithOne(pg => pg.Pedido)
                .HasForeignKey<Pagamento>(p => p.IdPedido);

            modelBuilder.Entity<Estoque>()
                .HasOne(e => e.Produto)
                .WithOne(p => p.Estoque)
                .HasForeignKey<Estoque>(e => e.IdProduto);

            modelBuilder.Entity<Pedido>()
                .HasOne(p => p.Usuario)
                .WithMany(u => u.Pedidos)
                .HasForeignKey(p => p.IdUsuario);


            base.OnModelCreating(modelBuilder);
        }
    }
}
