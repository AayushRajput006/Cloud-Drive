package com.clouddrive.service;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    private final JavaMailSender mailSender;

    @Value("${spring.mail.username}")
    private String fromEmail;

    public EmailService(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    public void sendOtpEmail(String to, String name, String otp) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            helper.setFrom(fromEmail);
            helper.setTo(to);
            helper.setSubject("CloudDrive Verification Code");

            String htmlContent = "<html>" +
                    "<body style='font-family: Arial, sans-serif; color: #333; line-height: 1.6;'>" +
                    "<div style='max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px;'>" +
                    "<h2 style='color: #4A90E2; text-align: center;'>CloudDrive</h2>" +
                    "<p>Hello <b>" + name + "</b>,</p>" +
                    "<p>Your verification code is:</p>" +
                    "<div style='text-align: center; margin: 20px 0;'>" +
                    "<span style='display: inline-block; padding: 10px 20px; font-size: 24px; font-weight: bold; background-color: #f4f4f4; border-radius: 4px; letter-spacing: 2px;'>" + otp + "</span>" +
                    "</div>" +
                    "<p>This code will expire in <b>5 minutes</b>.</p>" +
                    "<p style='color: #777; font-size: 12px;'>If you did not request this, please ignore this email.</p>" +
                    "</div>" +
                    "</body>" +
                    "</html>";

            helper.setText(htmlContent, true);
            
            try {
                mailSender.send(message);
                System.out.println("OTP email sent successfully to " + to);
            } catch (Exception ex) {
                System.err.println("Failed to send OTP email via SMTP. Ensure MAIL_USERNAME and MAIL_PASSWORD are set.");
                System.out.println("=================================================");
                System.out.println("OTP for " + to + " is: " + otp);
                System.out.println("=================================================");
            }

        } catch (MessagingException e) {
            System.err.println("Failed to create OTP email message");
            System.out.println("=================================================");
            System.out.println("OTP for " + to + " is: " + otp);
            System.out.println("=================================================");
        }
    }
}
