using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace JegymesterApp.DataContext.Migrations
{
    /// <inheritdoc />
    public partial class PriceScreening : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "Price",
                table: "Screenings",
                type: "int",
                nullable: false,
                defaultValue: 0);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Price",
                table: "Screenings");
        }
    }
}
