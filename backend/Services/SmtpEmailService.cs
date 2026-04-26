using System.Net;
using System.Net.Mail;
using backend.Interfaces;
using backend.Options;
using Microsoft.Extensions.Options;

namespace backend.Services;

public class SmtpEmailService : IEmailService
{
    private readonly SmtpEmailOptions _smtp;
    private readonly EmailOptions _email;
    private readonly ILogger<SmtpEmailService> _logger;

    public SmtpEmailService(
        IOptions<SmtpEmailOptions> smtpOptions,
        IOptions<EmailOptions> emailOptions,
        ILogger<SmtpEmailService> logger)
    {
        _smtp = smtpOptions.Value;
        _email = emailOptions.Value;
        _logger = logger;
    }

    public async Task SendAsync(string toEmail, string subject, string htmlBody)
    {
        if (string.IsNullOrWhiteSpace(_smtp.Username) || string.IsNullOrWhiteSpace(_smtp.Password))
        {
            throw new InvalidOperationException(
                "SMTP credentials are missing. Configure Email:Smtp:Username and Email:Smtp:Password.");
        }

        var fromEmail = string.IsNullOrWhiteSpace(_email.FromEmail) ? _smtp.Username : _email.FromEmail;
        var fromName = _email.FromName;

        using var message = new MailMessage
        {
            From = string.IsNullOrWhiteSpace(fromName)
                ? new MailAddress(fromEmail)
                : new MailAddress(fromEmail, fromName),
            Subject = subject,
            Body = htmlBody,
            IsBodyHtml = true
        };

        message.To.Add(new MailAddress(toEmail));

        using var client = new SmtpClient(_smtp.Host, _smtp.Port)
        {
            EnableSsl = _smtp.EnableSsl,
            UseDefaultCredentials = false,
            Credentials = new NetworkCredential(_smtp.Username, _smtp.Password)
        };

        try
        {
            await client.SendMailAsync(message);
            _logger.LogInformation("Sent SMTP email to {To}", toEmail);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to send SMTP email to {To}", toEmail);
            throw;
        }
    }
}
