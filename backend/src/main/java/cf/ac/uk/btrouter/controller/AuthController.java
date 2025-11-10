package cf.ac.uk.btrouter.controller;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.AuthenticationException;
import cf.ac.uk.btrouter.model.User;
import cf.ac.uk.btrouter.service.UserService;
import cf.ac.uk.btrouter.config.SecurityConfig;
import cf.ac.uk.btrouter.dto.LoginDTO;
import java.util.HashMap;
import java.util.Map;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import io.github.bucket4j.Bucket;
import io.github.bucket4j.ConsumptionProbe;
import io.github.bucket4j.Bandwidth;
import io.github.bucket4j.Refill;
import java.time.Duration;
import java.util.concurrent.ConcurrentHashMap;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")  // Allows requests from any origin
public class AuthController {
    // Required dependencies for authentication
    private final AuthenticationManager authenticationManager;
    private final UserService userService;
    private final SecurityConfig securityConfig;

    private static final Logger logger = LoggerFactory.getLogger(UserSettingsController.class);

    // Rate limiting configuration
    private final Map<String, Bucket> buckets = new ConcurrentHashMap<>();
    private static final int MAX_ATTEMPTS = 5;
    private static final int REFILL_TIME_MINUTES = 15;

    // Constructor injection of required services
    public AuthController(AuthenticationManager authenticationManager,
                          UserService userService,
                          SecurityConfig securityConfig) {
        this.authenticationManager = authenticationManager;
        this.userService = userService;
        this.securityConfig = securityConfig;
    }

    private Bucket getBucket(String key) {
        return buckets.computeIfAbsent(key, k -> {
            Bandwidth limit = Bandwidth.classic(MAX_ATTEMPTS, 
                Refill.intervally(MAX_ATTEMPTS, Duration.ofMinutes(REFILL_TIME_MINUTES)));
            return Bucket.builder().addLimit(limit).build();
        });
    }

    // Handle user login and return JWT token with user details
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginDTO loginRequest) {
        String ipAddress = loginRequest.getEmail(); // Using email as key for simplicity
        Bucket bucket = getBucket(ipAddress);
        ConsumptionProbe probe = bucket.tryConsumeAndReturnRemaining(1);
        
        if (!probe.isConsumed()) {
            long waitForRefill = probe.getNanosToWaitForRefill() / 1_000_000_000;
            logger.warn("Rate limit exceeded for user: {}. Try again in {} seconds", loginRequest.getEmail(), waitForRefill);
            return ResponseEntity.status(HttpStatus.TOO_MANY_REQUESTS)
                .body(Map.of(
                    "message", "Too many login attempts. Please try again in " + waitForRefill + " seconds",
                    "retryAfter", waitForRefill
                ));
        }

        try {
            logger.info("Login attempt for user: {}", loginRequest.getEmail());

            // Authenticate user credentials
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            loginRequest.getEmail(),
                            loginRequest.getPassword()
                    )
            );

            User user = userService.findByEmail(loginRequest.getEmail());

            // If 2FA is enabled, send code and return flag
            if (user.isTwoFactorAuth()) {
                userService.generateAndSendTwoFACode(user);
                logger.info("2FA required. Code sent to user: {}", loginRequest.getEmail());
                return ResponseEntity.ok(Map.of(
                        "twoFARequired", true,
                        "message", "2FA code sent to your email"
                ));
            }

            // If 2FA is disabled, generate and return JWT
            String jwt = securityConfig.generateToken(user.getEmail(), user.getRole().name());

            Map<String, Object> response = new HashMap<>();
            response.put("token", jwt);
            response.put("role", user.getRole().name());
            response.put("email", user.getEmail());
            response.put("firstName", user.getFirstName());
            response.put("lastName", user.getLastName());

            logger.info("Login successful for user: {}", loginRequest.getEmail());
            return ResponseEntity.ok(response);
        } catch (AuthenticationException e) {
            logger.warn("Invalid login credentials for user: {}", loginRequest.getEmail());
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("message", "Invalid credentials"));
        }
    }

    // Handle 2FA code verification
    @PostMapping("/verify-twofa")
    public ResponseEntity<?> verify2FA(@RequestBody Map<String, String> payload) {
        String email = payload.get("email");
        String code = payload.get("code");

        logger.info("2FA verification attempt for user: {}", email);

        if (userService.validateTwoFACode(email, code)) {
            User user = userService.findByEmail(email);
            userService.clearTwoFACode(user);

            String jwt = securityConfig.generateToken(user.getEmail(), user.getRole().name());

            logger.info("2FA verification successful for user: {}", email);
            return ResponseEntity.ok(Map.of(
                    "token", jwt,
                    "role", user.getRole().name(),
                    "email", user.getEmail(),
                    "firstName", user.getFirstName(),
                    "lastName", user.getLastName()
            ));
        }

        logger.warn("2FA verification failed for user: {}", email);
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("message", "Invalid or expired 2FA code"));
    }

    // Handle new user registration and return JWT token
    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody User user) {
        try {
            // Save new user and generate their JWT token
            User savedUser = userService.registerUser(user);
            String jwt = securityConfig.generateToken(savedUser.getEmail(), savedUser.getRole().name());

            Map<String, Object> response = new HashMap<>();
            response.put("token", jwt);
            response.put("role", savedUser.getRole().name());
            response.put("message", "Registration successful");

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity
                    .badRequest()
                    .body(Map.of("message", e.getMessage()));
        }
    }

    // Handle password reset request
    @PostMapping("/forgot-password")
    public ResponseEntity<?> forgotPassword(@RequestBody Map<String, String> request) {
        try {
            // Validate email presence
            String email = request.get("email");
            if (email == null || email.trim().isEmpty()) {
                return ResponseEntity.badRequest().body("Email is required");
            }

            // Process password reset request
            userService.createPasswordResetTokenForUser(email);
            return ResponseEntity.ok().body("Password reset email sent");
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // Validate password reset token
    @GetMapping("/reset-password/validate")
    public ResponseEntity<?> validateResetToken(@RequestParam String token) {
        String result = userService.validatePasswordResetToken(token);
        if (result.equals("valid")) {
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.badRequest().body(result);
    }

    // Handle password reset with token
    @PostMapping("/reset-password")
    public ResponseEntity<?> resetPassword(@RequestBody Map<String, String> request) {
        try {
            // Validate request parameters
            String token = request.get("token");
            String newPassword = request.get("newPassword");

            if (token == null || newPassword == null) {
                return ResponseEntity.badRequest().body("Token and new password are required");
            }

            // Process password reset
            userService.resetPassword(token, newPassword);
            return ResponseEntity.ok().body("Password has been reset successfully");
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}