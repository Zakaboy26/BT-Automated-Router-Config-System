package cf.ac.uk.btrouter.controller;

import cf.ac.uk.btrouter.dto.ContactFormDTO;
import cf.ac.uk.btrouter.service.EmailService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/contact")
@CrossOrigin(origins = "*") // Allows frontend to connect
public class ContactController {

    @Autowired
    private EmailService emailService;

    // Handle contact form submission
    @PostMapping
    public ResponseEntity<?> submitContactForm(@RequestBody ContactFormDTO contactForm) {
        try {
            // Send email using the email service
            emailService.sendContactFormEmail(contactForm);

            // Return success response
            return ResponseEntity.ok(Map.of("message", "Message sent successfully"));
        } catch (Exception e) {
            // Return error response if email sending fails
            return ResponseEntity.status(500)
                    .body(Map.of("error", "Failed to send message"));
        }
    }
}