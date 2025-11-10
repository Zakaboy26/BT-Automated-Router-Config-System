package cf.ac.uk.btrouter.service;

import cf.ac.uk.btrouter.model.User;
import cf.ac.uk.btrouter.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Random;
import java.util.List;
import java.util.UUID;

@Service
public class UserService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final EmailService emailService;

    @Autowired
    public UserService(UserRepository userRepository,
                       PasswordEncoder passwordEncoder,
                       EmailService emailService) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.emailService = emailService;
    }

    // Find user by email
    public User findByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    // Register user
    public List<User> findAll() {
        return userRepository.findAll();
    }

    public User saveUser(User user) {
        return userRepository.save(user);
    }

    public void delete(User user) {
        userRepository.delete(user);
    }

    public User findById(int id){
        return userRepository.findById((long) id)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    // Register a new user with encrypted password
    public User registerUser(User user) {
        if (userRepository.findByEmail(user.getEmail()).isPresent()) {
            throw new RuntimeException("Email already registered");
        }

        user.setRole(User.Role.USER);
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        return userRepository.save(user);
    }

    // Password reset token generation
    public void createPasswordResetTokenForUser(String email) {
        User user = findByEmail(email);
        String token = UUID.randomUUID().toString();

        user.setResetToken(token);
        user.setResetTokenExpiry(LocalDateTime.now().plusMinutes(5));
        userRepository.save(user);

        emailService.sendPasswordResetEmail(email, token);
    }

    // Token validation
    public String validatePasswordResetToken(String token) {
        User user = userRepository.findByResetToken(token)
                .orElseThrow(() -> new RuntimeException("Invalid token"));

        if (user.getResetTokenExpiry().isBefore(LocalDateTime.now())) {
            user.setResetToken(null);
            user.setResetTokenExpiry(null);
            userRepository.save(user);
            return "expired";
        }

        return "valid";
    }

    // Password reset
    public void resetPassword(String token, String newPassword) {
        User user = userRepository.findByResetToken(token)
                .orElseThrow(() -> new RuntimeException("Invalid token"));

        if (user.getResetTokenExpiry().isBefore(LocalDateTime.now())) {
            throw new RuntimeException("Token has expired");
        }

        user.setPassword(passwordEncoder.encode(newPassword));
        user.setResetToken(null);
        user.setResetTokenExpiry(null);
        userRepository.save(user);
    }

    // Update user settings
    public User updateUserSettings(String email, User updatedUser) {
        User user = findByEmail(email);

        user.setFirstName(updatedUser.getFirstName());
        user.setLastName(updatedUser.getLastName());
        user.setPhoneNumber(updatedUser.getPhoneNumber());
        user.setBusinessType(updatedUser.getBusinessType());
        user.setVatNumber(updatedUser.getVatNumber());
        user.setBillingAddress(updatedUser.getBillingAddress());

        user.setTwoFactorAuth(updatedUser.isTwoFactorAuth());
        user.setOrderUpdates(updatedUser.isOrderUpdates());
        user.setBillingNotifications(updatedUser.isBillingNotifications());
        user.setMarketingEmails(updatedUser.isMarketingEmails());

        return userRepository.save(user);
    }

    private void emailAdminOnDelete(User user) {
        String subject = "User Account Deleted";
        String body = String.format("""
        A user has deleted their account.

        Email: %s
        Name: %s %s
        Time: %s
        """,
                user.getEmail(),
                user.getFirstName(),
                user.getLastName(),
                java.time.LocalDateTime.now()
        );

        emailService.sendSimpleEmail("admin@bt.com", subject, body);
    }

    // Delete user
    public void deleteUser(String email) {
        User user = findByEmail(email);
        emailAdminOnDelete(user); // notify the admin enit
        userRepository.delete(user);
    }

    // Change password
    public void changePassword(String email, String currentPassword, String newPassword, String confirmPassword) {
        User user = findByEmail(email);

        if (!passwordEncoder.matches(currentPassword, user.getPassword())) {
            throw new RuntimeException("Current password is incorrect.");
        }

        if (!newPassword.equals(confirmPassword)) {
            throw new RuntimeException("New passwords do not match.");
        }

        if (newPassword.length() < 8) {
            throw new RuntimeException("Password must be at least 8 characters.");
        }

        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);
    }

    // Generate & send 2FA code
    public void generateAndSendTwoFACode(User user) {
        String code = String.format("%06d", new Random().nextInt(999999));
        user.setTwoFactorCode(code);
        user.setTwoFactorExpiry(LocalDateTime.now().plusMinutes(10));
        userRepository.save(user);

        emailService.sendTwoFactorCode(user.getEmail(), code);
    }

    // Validate 2FA code
    public boolean validateTwoFACode(String email, String code) {
        User user = findByEmail(email);
        return user.getTwoFactorCode() != null &&
                user.getTwoFactorCode().equals(code) &&
                user.getTwoFactorExpiry().isAfter(LocalDateTime.now());
    }

    // Clear 2FA code
    public void clearTwoFACode(User user) {
        user.setTwoFactorCode(null);
        user.setTwoFactorExpiry(null);
        userRepository.save(user);
    }
}
