using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace SweetBox.Api.Migrations
{
    /// <inheritdoc />
    public partial class UpdateTablePedidoItem : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "Mutiplicador",
                table: "ProdutosParametrosBolos",
                newName: "Multiplicador");

            migrationBuilder.AddColumn<decimal>(
                name: "PrecoTotal",
                table: "PedidoItens",
                type: "decimal(65,30)",
                nullable: false,
                defaultValue: 0m);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "PrecoTotal",
                table: "PedidoItens");

            migrationBuilder.RenameColumn(
                name: "Multiplicador",
                table: "ProdutosParametrosBolos",
                newName: "Mutiplicador");
        }
    }
}
