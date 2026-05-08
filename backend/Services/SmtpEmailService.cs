using backend.Interfaces;
using backend.Options;
using MailKit.Net.Smtp;
using MailKit.Security;
using Microsoft.Extensions.Options;
using MimeKit;

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

    public async Task SendAsync(
        string toEmail,
        string subject,
        string htmlBody)
    {
        if (string.IsNullOrWhiteSpace(_smtp.Username)
            || string.IsNullOrWhiteSpace(_smtp.Password))
        {
            throw new InvalidOperationException(
                "SMTP credentials are missing.");
        }

        var fromEmail =
            string.IsNullOrWhiteSpace(_email.FromEmail)
                ? _smtp.Username
                : _email.FromEmail;

        var fromName = _email.FromName;

        var email = new MimeMessage();

        email.From.Add(
            new MailboxAddress(fromName, fromEmail));

        email.To.Add(
            MailboxAddress.Parse(toEmail));

        email.Subject = subject;

        email.Body = new TextPart(
            MimeKit.Text.TextFormat.Html)
        {
            Text = htmlBody
        };

        using var smtp = new SmtpClient();

        try
        {
            await smtp.ConnectAsync(
                _smtp.Host,
                _smtp.Port,
                SecureSocketOptions.StartTls);

            await smtp.AuthenticateAsync(
                _smtp.Username,
                _smtp.Password);

            await smtp.SendAsync(email);

            await smtp.DisconnectAsync(true);

            _logger.LogInformation(
                "Sent SMTP email to {To}",
                toEmail);
        }
        catch (Exception ex)
        {
            _logger.LogError(
                ex,
                "Failed to send SMTP email to {To}",
                toEmail);

            throw;
        }
    }
}