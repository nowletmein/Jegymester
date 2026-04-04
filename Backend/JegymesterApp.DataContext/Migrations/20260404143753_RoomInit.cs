using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace JegymesterApp.DataContext.Migrations
{
    /// <inheritdoc />
    public partial class RoomInit : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Tickets_Users_CreatorId",
                table: "Tickets");

            migrationBuilder.DropForeignKey(
                name: "FK_Tickets_Users_UserId",
                table: "Tickets");

            migrationBuilder.DropIndex(
                name: "IX_Tickets_CreatorId",
                table: "Tickets");

            migrationBuilder.DropColumn(
                name: "CreatorId",
                table: "Tickets");

            migrationBuilder.DropColumn(
                name: "Room",
                table: "Screenings");

            migrationBuilder.AddColumn<int>(
                name: "RoomId",
                table: "Screenings",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateTable(
                name: "Rooms",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Name = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    available = table.Column<bool>(type: "bit", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Rooms", x => x.Id);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Screenings_RoomId",
                table: "Screenings",
                column: "RoomId");

            migrationBuilder.AddForeignKey(
                name: "FK_Screenings_Rooms_RoomId",
                table: "Screenings",
                column: "RoomId",
                principalTable: "Rooms",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Tickets_Users_UserId",
                table: "Tickets",
                column: "UserId",
                principalTable: "Users",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Screenings_Rooms_RoomId",
                table: "Screenings");

            migrationBuilder.DropForeignKey(
                name: "FK_Tickets_Users_UserId",
                table: "Tickets");

            migrationBuilder.DropTable(
                name: "Rooms");

            migrationBuilder.DropIndex(
                name: "IX_Screenings_RoomId",
                table: "Screenings");

            migrationBuilder.DropColumn(
                name: "RoomId",
                table: "Screenings");

            migrationBuilder.AddColumn<int>(
                name: "CreatorId",
                table: "Tickets",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Room",
                table: "Screenings",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.CreateIndex(
                name: "IX_Tickets_CreatorId",
                table: "Tickets",
                column: "CreatorId");

            migrationBuilder.AddForeignKey(
                name: "FK_Tickets_Users_CreatorId",
                table: "Tickets",
                column: "CreatorId",
                principalTable: "Users",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_Tickets_Users_UserId",
                table: "Tickets",
                column: "UserId",
                principalTable: "Users",
                principalColumn: "Id");
        }
    }
}
