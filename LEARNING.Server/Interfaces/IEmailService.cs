namespace LEARNING.Server.Interfaces
{
    public interface ICustomEmailService
    {
        Task SendHtmlTemplateEmail(string toEmail, string subject, string templatePath, Dictionary<string, string> placeholders);
    }
}
