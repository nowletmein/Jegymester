using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace JegymesterApp.DataContext.Migrations
{
    /// <inheritdoc />
    public partial class MovieUpdate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "PicturePath",
                table: "Movies",
                type: "nvarchar(max)",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "PicturePath",
                table: "Movies");
        }
    }
}
