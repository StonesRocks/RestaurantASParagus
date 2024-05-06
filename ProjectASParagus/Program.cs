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
            builder.Services.AddControllers().AddJsonOptions(options =>
            {
                options.JsonSerializerOptions.ReferenceHandler = ReferenceHandler.IgnoreCycles;
                options.JsonSerializerOptions.Converters.Add(new JsonStringEnumConverter());
            });
            builder.Services.AddTransient<UserService>();
            builder.Services.AddTransient<BookingService>();
            builder.Services.AddTransient<MenuService>();

            string connectionString = builder.Configuration.GetConnectionString("mySqlConnectionString");
            builder.Services.AddDbContext<DatabaseContext>(option => option.UseMySql(connectionString, ServerVersion.AutoDetect(connectionString)));

            // CORS policy
            builder.Services.AddCors(options =>
            {
                options.AddPolicy("AllowAll", policy =>
                {
                    policy.AllowAnyOrigin()
                          .AllowAnyMethod()
                          .AllowAnyHeader();
                });
            });


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

            // Apply CORS policy globally
            app.UseCors("AllowAll");

            app.UseAuthorization();

            app.MapRazorPages();
            app.MapControllers();

            app.Run();
        }
    }
}
