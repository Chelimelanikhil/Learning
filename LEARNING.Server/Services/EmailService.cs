using LEARNING.Server.Interfaces;
using MailKit.Net.Smtp;
using Microsoft.Extensions.Configuration;
using MimeKit;
using NETCore.MailKit.Core;

public class EmailService : ICustomEmailService
{
    private readonly IConfiguration _config;

    public EmailService(IConfiguration config)
    {
        _config = config;
    }

    public async Task SendHtmlTemplateEmail(string toEmail, string subject, string templatePath, Dictionary<string, string> placeholders)
    {
        var email = new MimeMessage();
        email.From.Add(new MailboxAddress(
            _config["EmailSettings:SenderName"],
            _config["EmailSettings:SenderEmail"]
        ));
        email.To.Add(MailboxAddress.Parse(toEmail));
        email.Subject = subject;

        var html = await File.ReadAllTextAsync(templatePath);

        foreach (var item in placeholders)
        {
            html = html.Replace("{{" + item.Key + "}}", item.Value);
        }

        var builder = new BodyBuilder
        {
            HtmlBody = html
        };

        email.Body = builder.ToMessageBody();
        try
        {
            using var smtp = new SmtpClient();
            await smtp.ConnectAsync(
                _config["EmailSettings:SmtpServer"],
                int.Parse(_config["EmailSettings:SmtpPort"]),
                MailKit.Security.SecureSocketOptions.StartTls
            );

            await smtp.AuthenticateAsync(
                _config["EmailSettings:SenderEmail"],
                _config["EmailSettings:Password"]
            );

            await smtp.SendAsync(email);
            await smtp.DisconnectAsync(true);
        }
        catch (Exception ex)
        {
            // Consider logging to Azure Application Insights
            Console.WriteLine("SMTP Error: " + ex.Message);
            throw; // Or handle as needed
        }
    }
    }
