using Microsoft.EntityFrameworkCore;
using ProjectASParagus.Objects;
using ProjectASParagus.Services;
using System.Text.Json.Serialization;

namespace ProjectASParagus
{
    public class Program
    {
        public static void Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);

            // Add services to the container.
            builder.Services.AddRazorPages();
            builder.Services.AddControllers().AddJsonOptions(option => option.JsonSerializerOptions.ReferenceHandler = ReferenceHandler.IgnoreCycles);
            builder.Services.AddTransient<UserService>();
            builder.Services.AddTransient<BookingService>();
            builder.Services.AddTransient<MenuService>();

            string connectionString = builder.Configuration.GetConnectionString("mySqlConnectionString");
            builder.Services.AddDbContext<DatabaseContext>(option => option.UseMySql(connectionString, ServerVersion.AutoDetect(connectionString)));

            var app = builder.Build();

            // Configure the HTTP request pipeline.
            if (!app.Environment.IsDevelopment())
            {
                app.UseExceptionHandler("/Error");
                // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
                app.UseHsts();
            }

            app.UseHttpsRedirection();
            app.UseStaticFiles();

            app.UseRouting();

            app.UseAuthorization();

            app.MapRazorPages();
            app.MapControllers();

            app.Run();
        }
    }
}
