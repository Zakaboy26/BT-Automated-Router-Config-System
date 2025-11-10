package cf.ac.uk.btrouter.EmailTests;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import cf.ac.uk.btrouter.service.EmailService;
import cf.ac.uk.btrouter.model.Order;
import cf.ac.uk.btrouter.model.Router;
import cf.ac.uk.btrouter.dto.ContactFormDTO;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.times;
import java.util.List;

@ExtendWith(MockitoExtension.class)
public class EmailServiceTests {

    @Mock
    private JavaMailSender javaMailSender;

    @InjectMocks
    private EmailService emailService;

    @Test
    public void testPasswordResetEmail() {
        // Given
        String email = "test@example.com";
        String token = "test-reset-token";

        // When
        emailService.sendPasswordResetEmail(email, token);

        // Then
        ArgumentCaptor<SimpleMailMessage> emailCaptor = ArgumentCaptor.forClass(SimpleMailMessage.class);
        verify(javaMailSender, times(1)).send(emailCaptor.capture());
        
        SimpleMailMessage sentEmail = emailCaptor.getValue();
        assertEquals("Password Reset Request", sentEmail.getSubject());
        assertEquals(email, sentEmail.getTo()[0]);
        assertEquals("To reset your password, click the link below:\n\nhttp://localhost:3000/reset-password?token=" + token + "\n\nThis link will expire in 5 minutes.\n\nIf you did not request a password reset, please ignore this email.",
                    sentEmail.getText());
    }

    @Test
    public void testOrderConfirmationEmail() {
        // Given
        Order order = new Order();
        order.setSiteName("Test Site");
        Router router = new Router();
        router.setRouterName("Virtual Access - GW1042M");
        order.setRouter(router);
        order.setNumRouters(2);
        order.setSiteAddress("123 Test Street");
        order.setSitePostcode("T1 1TT");
        order.setSitePrimaryEmail("test@example.com");
        order.setPhoneNumber("01234567890");

        // When
        emailService.sendOrderConfirmationEmail("test@example.com", "TEST-123", order);

        // Then
        ArgumentCaptor<SimpleMailMessage> emailCaptor = ArgumentCaptor.forClass(SimpleMailMessage.class);
        verify(javaMailSender, times(1)).send(emailCaptor.capture());
        
        SimpleMailMessage sentEmail = emailCaptor.getValue();
        assertEquals("BT Router Order Confirmation - Ref: TEST-123", sentEmail.getSubject());
        assertEquals("test@example.com", sentEmail.getTo()[0]);
        assertEquals("Thank you for your router order!\n\nOrder Reference: TEST-123\nOrder Status: Pending\n\nOrder Details:\n- Router Type: Virtual Access - GW1042M\n- Quantity: 2\n- Site Name: Test Site\n- Delivery Address: 123 Test Street\n- Postcode: T1 1TT\n\nImportant Timeframes:\n- Order modifications and cancellations allowed until order is approved/confirmed\n- Estimated production time: 3-5 business days\n- Estimated delivery time: 5-7 business days\n\nTrack your order here: null/order-tracking/TEST-123\n\nIf you need any assistance, please contact our support team.\n\nBest regards,\nBT IoT Router Services Team\n",
                    sentEmail.getText());
    }

    @Test
    public void testOrderModificationEmail() {
        // Given
        Order order = new Order();
        order.setSiteName("Modified Site");
        Router router = new Router();
        router.setRouterName("Virtual Access - GW1042M");
        order.setRouter(router);
        order.setNumRouters(3);
        order.setSitePrimaryEmail("test@example.com");
        order.setPhoneNumber("01234567890");

        // When
        emailService.sendOrderModificationEmail("test@example.com", "TEST-123", order);

        // Then
        ArgumentCaptor<SimpleMailMessage> emailCaptor = ArgumentCaptor.forClass(SimpleMailMessage.class);
        verify(javaMailSender, times(1)).send(emailCaptor.capture());
        
        SimpleMailMessage sentEmail = emailCaptor.getValue();
        assertEquals("BT Router Order Modified - Ref: TEST-123", sentEmail.getSubject());
        assertEquals("test@example.com", sentEmail.getTo()[0]);
        assertEquals("Your order has been successfully modified.\n\nOrder Reference: TEST-123\n\nUpdated Order Details:\n- Router Type: Virtual Access - GW1042M\n- Quantity: 3\n- Site Name: Modified Site\n\nTrack your order here: null/order-tracking/TEST-123\n\nIf you did not make these changes, please contact our support team immediately.\n\nBest regards,\nBT IoT Router Services Team\n",
                    sentEmail.getText());
    }

    @Test
    public void testOrderCancellationEmail() {
        // Given: Order reference number
        String referenceNumber = "TEST-123";

        // When: Sending order cancellation email
        emailService.sendOrderCancellationEmail("test@example.com", referenceNumber);
    }

    @Test
    public void testOrderStatusUpdateEmail() {
        // Given: Order status update details
        String[] statuses = {
            "PENDING",
            "CONFIRMED",
            "IN_PRODUCTION",
            "QUALITY_CHECK",
            "READY_FOR_SHIPPING",
            "IN_TRANSIT",
            "DELIVERED",
            "CANCELLED"
        };

        // When: Sending status update emails for each status
        for (String status : statuses) {
            emailService.sendOrderStatusUpdateEmail("test@example.com", "TEST-123", status);
        }
    }

    @Test
    public void testTwoFactorCodeEmail() {
        // Given: 2FA code
        String code = "123456";

        // When: Sending 2FA code email
        emailService.sendTwoFactorCode("test@example.com", code);
    }

    @Test
    public void testSimpleEmail() {
        // Given: Email details
        String subject = "Test Subject";
        String text = "Test email content";

        // When: Sending simple email
        emailService.sendSimpleEmail("test@example.com", subject, text);
    }

    @Test
    public void testContactFormEmail() {
        // Given
        ContactFormDTO contactForm = new ContactFormDTO();
        contactForm.setCompanyName("Test Company");
        contactForm.setName("Test User");
        contactForm.setEmail("test@example.com");
        contactForm.setPhone("01234567890");
        contactForm.setOrderReference("TEST-123");
        contactForm.setEnquiryType("General");
        contactForm.setMessage("Test message");

        // When
        emailService.sendContactFormEmail(contactForm);

        // Then
        ArgumentCaptor<SimpleMailMessage> emailCaptor = ArgumentCaptor.forClass(SimpleMailMessage.class);
        verify(javaMailSender, times(2)).send(emailCaptor.capture());
        
        List<SimpleMailMessage> sentEmails = emailCaptor.getAllValues();
        
        // Verify support team email
        SimpleMailMessage supportEmail = sentEmails.get(0);
        assertEquals("New Contact Form Submission - General", supportEmail.getSubject());
        assertEquals("bt.router.config.project@gmail.com", supportEmail.getTo()[0]);
        assertEquals("New Contact Form Submission\n\nCompany: Test Company\nName: Test User\nEmail: test@example.com\nPhone: 01234567890\nOrder Reference: TEST-123\nEnquiry Type: General\n\nMessage:\nTest message\n",
                    supportEmail.getText());
        
        // Verify user acknowledgment email
        SimpleMailMessage userEmail = sentEmails.get(1);
        assertEquals("Thank you for contacting BT Router Services", userEmail.getSubject());
        assertEquals("test@example.com", userEmail.getTo()[0]);
        assertEquals("Dear Test User,\n\nThank you for contacting BT Router Services. We have received your enquiry and will respond to you within 24 hours during business days.\n\nFor your reference, here are the details of your enquiry:\n- Company: Test Company\n- Enquiry Type: General\n- Order Reference: TEST-123\n\nIf you need immediate assistance, please don't hesitate to contact our support team at:\nEmail: admin@bt.com\nPhone: +44 2920 870000\n\nBest regards,\nBT Router Services Team\n",
                    userEmail.getText());
    }

    @Test
    public void testEmailWithSpecialCharacters() {
        // Given: Email with special characters
        String subject = "Test Subject with special chars: !@#$%^&*()";
        String text = "Test email content with special chars: !@#$%^&*()\nNew line\nAnother line";

        // When: Sending email with special characters
        emailService.sendSimpleEmail("test@example.com", subject, text);
    }

    @Test
    public void testEmailWithLongContent() {
        // Given: Long email content
        StringBuilder longText = new StringBuilder();
        for (int i = 0; i < 1000; i++) {
            longText.append("This is a test line. ");
        }

        // When: Sending email with long content
        emailService.sendSimpleEmail("test@example.com", "Long Content Test", longText.toString());
    }
} 