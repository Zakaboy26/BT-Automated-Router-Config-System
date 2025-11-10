package cf.ac.uk.btrouter.controller;

import cf.ac.uk.btrouter.dto.ChangePasswordRequestDTO;
import cf.ac.uk.btrouter.model.User;
import cf.ac.uk.btrouter.repository.UserRepository;
import cf.ac.uk.btrouter.service.UserService;
import jakarta.validation.Valid;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import cf.ac.uk.btrouter.config.SecurityConfig;
import org.springframework.http.HttpStatus;


import java.util.Map;

@RestController
@RequestMapping("/api/user")
public class UserSettingsController {
    private static final Logger logger = LoggerFactory.getLogger(UserSettingsController.class);

    @Autowired
    private UserService userService;

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final SecurityConfig securityConfig;

    @Autowired
    public UserSettingsController(UserRepository userRepository,
                                  PasswordEncoder passwordEncoder,
                                  SecurityConfig securityConfig) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.securityConfig = securityConfig;
    }
    @GetMapping("/settings")
    public ResponseEntity<?> getUserSettings() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName();
        logger.info("Fetching settings for user: {}", email);

        try {
            User user = userService.findByEmail(email);

            //optionally hide sensitive fields
            user.setPassword(null);
            user.setResetToken(null);
            user.setResetTokenExpiry(null);

            logger.debug("User settings successfully fetched for: {}", email);
            return ResponseEntity.ok(user);
        } catch (Exception e) {
            logger.error("Failed to fetch user settings for {}: {}", email, e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to fetch user settings.");
        }
    }

    @PutMapping("/settings")
    public ResponseEntity<?> updateUserSettings(@RequestBody User updatedUser) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName();
        logger.info("Updating settings for user: {}", email);

        try {
            User savedUser = userService.updateUserSettings(email, updatedUser);

            //optionally hide sensitive fields
            savedUser.setPassword(null);
            savedUser.setResetToken(null);
            savedUser.setResetTokenExpiry(null);

            logger.debug("User settings updated for {}", email);
            return ResponseEntity.ok(savedUser);
        } catch (Exception e) {
            logger.error("Failed to update user settings for {}: {}", email, e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to update user settings.");
        }
    }

    // delete the user
    @DeleteMapping("/settings")
    public ResponseEntity<?> deleteUserAccount() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName();
        logger.info("Attempting to delete user account for: {}", email);

        try {
            userService.deleteUser(email);
            logger.info("User account deleted successfully for: {}", email);
            return ResponseEntity.ok().body("Account deleted successfully");
        } catch (Exception e) {
            logger.error("Failed to delete user account for {}: {}", email, e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Failed to delete account: " + e.getMessage());
        }
    }

    @PostMapping("/change-password")
    public ResponseEntity<?> changePassword(@Valid @RequestBody ChangePasswordRequestDTO request) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName();
        logger.info("User '{}' is attempting to change their password", email);

        try {
            userService.changePassword(
                    email,
                    request.getCurrentPassword(),
                    request.getNewPassword(),
                    request.getConfirmPassword()
            );
            logger.info("Password changed successfully for user: {}", email);
            return ResponseEntity.ok(Map.of("message", "Password changed successfully."));
        } catch (RuntimeException e) {
            logger.warn("Password change failed for user {}: {}", email, e.getMessage());
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            logger.error("Unexpected error during password change for user {}: {}", email, e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "An error occurred while changing password."));
        }
    }
}
