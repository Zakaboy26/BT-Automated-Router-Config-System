package cf.ac.uk.btrouter.AuthTests;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.annotation.DirtiesContext;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.JsonNode;
import cf.ac.uk.btrouter.dto.LoginDTO;
import cf.ac.uk.btrouter.dto.RegisterDTO;
import cf.ac.uk.btrouter.model.User;
import cf.ac.uk.btrouter.repository.UserRepository;
import static org.junit.jupiter.api.Assertions.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import java.util.HashMap;
import java.util.Map;

@SpringBootTest
@AutoConfigureMockMvc
@DirtiesContext(classMode = DirtiesContext.ClassMode.BEFORE_EACH_TEST_METHOD)
public class AuthTests {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ObjectMapper objectMapper;

    // Registration Tests

    @Test
    public void testSuccessfulUserRegistration() throws Exception {
        // Given: Valid registration data
        RegisterDTO registerDTO = new RegisterDTO();
        registerDTO.setEmail("test@example.com");
        registerDTO.setPassword("Test123!@#");
        registerDTO.setFirstName("Zakariya");
        registerDTO.setLastName("Aden");

        // When: Registering a new user
        MvcResult result = mockMvc.perform(post("/api/auth/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(registerDTO)))
                .andExpect(status().isOk())
                .andReturn();

        // Then: User should be registered successfully
        String response = result.getResponse().getContentAsString();
        assertTrue(response.contains("token"));
        assertTrue(response.contains("role"));
        assertTrue(response.contains("message"));
        
        User savedUser = userRepository.findByEmail("test@example.com").orElse(null);
        assertNotNull(savedUser);
        assertEquals("Zakariya", savedUser.getFirstName());
        assertEquals("Aden", savedUser.getLastName());
        assertEquals(User.Role.USER, savedUser.getRole());
    }

    @Test
    public void testRegistrationWithInvalidEmail() throws Exception {
        // Given: Registration data with invalid email
        RegisterDTO registerDTO = new RegisterDTO();
        registerDTO.setEmail("invalid-email");
        registerDTO.setPassword("Test123!@#");
        registerDTO.setFirstName("Zakariya");
        registerDTO.setLastName("Aden");

        // When: Attempting to register
        MvcResult result = mockMvc.perform(post("/api/auth/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(registerDTO)))
                .andExpect(status().isBadRequest())
                .andReturn();

        // Then: Registration should fail with email validation error
        String response = result.getResponse().getContentAsString();
        assertTrue(response.contains("Please provide a valid email address"));
    }

    @Test
    public void testRegistrationWithInvalidName() throws Exception {
        // Given: Registration data with invalid name containing numbers
        RegisterDTO registerDTO = new RegisterDTO();
        registerDTO.setEmail("test@example.com");
        registerDTO.setPassword("Test123!@#");
        registerDTO.setFirstName("Zakariya123");
        registerDTO.setLastName("Aden456");

        // When: Attempting to register
        MvcResult result = mockMvc.perform(post("/api/auth/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(registerDTO)))
                .andExpect(status().isBadRequest())
                .andReturn();

        // Then: Registration should fail with name validation error
        String response = result.getResponse().getContentAsString();
        assertTrue(response.contains("can only contain letters"));
    }

    @Test
    public void testRegistrationWithExistingEmail() throws Exception {
        // Given: An existing user
        RegisterDTO firstUser = new RegisterDTO();
        firstUser.setEmail("existing@example.com");
        firstUser.setPassword("Test123!@#");
        firstUser.setFirstName("Zakariya");
        firstUser.setLastName("Aden");

        mockMvc.perform(post("/api/auth/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(firstUser)));

        // When: Attempting to register with same email
        MvcResult result = mockMvc.perform(post("/api/auth/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(firstUser)))
                .andExpect(status().isBadRequest())
                .andReturn();

        // Then: Registration should fail with duplicate email error
        String response = result.getResponse().getContentAsString();
        assertTrue(response.contains("Email already registered"));
    }

    @Test
    public void testRegistrationWithEmptyFields() throws Exception {
        // Given: Registration data with empty required fields
        RegisterDTO registerDTO = new RegisterDTO();
        // Don't set any fields

        // When: Attempting to register
        MvcResult result = mockMvc.perform(post("/api/auth/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(registerDTO)))
                .andExpect(status().isBadRequest())
                .andReturn();

        // Then: Should get validation errors for all required fields
        String response = result.getResponse().getContentAsString();
        assertTrue(response.contains("rawPassword cannot be null"));
    }

    // Login Tests

    @Test
    public void testSuccessfulLogin() throws Exception {
        // Given: A registered user
        RegisterDTO registerDTO = new RegisterDTO();
        registerDTO.setEmail("login@example.com");
        registerDTO.setPassword("Test123!@#");
        registerDTO.setFirstName("Zakariya");
        registerDTO.setLastName("Aden");
        mockMvc.perform(post("/api/auth/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(registerDTO)));

        LoginDTO loginDTO = new LoginDTO();
        loginDTO.setEmail("login@example.com");
        loginDTO.setPassword("Test123!@#");

        // When: Logging in with correct credentials
        MvcResult result = mockMvc.perform(post("/api/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(loginDTO)))
                .andExpect(status().isOk())
                .andReturn();

        // Then: Login should be successful
        String response = result.getResponse().getContentAsString();
        assertTrue(response.contains("token"));
        assertTrue(response.contains("role"));
        assertTrue(response.contains("email"));
        assertTrue(response.contains("firstName"));
    }

    @Test
    public void testLoginWithInvalidCredentials() throws Exception {
        // Given: Invalid login credentials
        LoginDTO loginDTO = new LoginDTO();
        loginDTO.setEmail("nonexistent@example.com");
        loginDTO.setPassword("wrongpassword");

        // When: Attempting to login
        MvcResult result = mockMvc.perform(post("/api/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(loginDTO)))
                .andExpect(status().isUnauthorized())
                .andReturn();

        // Then: Login should fail
        String response = result.getResponse().getContentAsString();
        assertTrue(response.contains("Invalid credentials"));
    }

    @Test
    public void testLoginWithIncorrectPassword() throws Exception {
        // Given: A registered user but wrong password
        RegisterDTO registerDTO = new RegisterDTO();
        registerDTO.setEmail("wrongpass@example.com");
        registerDTO.setPassword("Test123!@#");
        registerDTO.setFirstName("Zakariya");
        registerDTO.setLastName("Aden");
        mockMvc.perform(post("/api/auth/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(registerDTO)));

        LoginDTO loginDTO = new LoginDTO();
        loginDTO.setEmail("wrongpass@example.com");
        loginDTO.setPassword("WrongPass123!@#");

        // When: Attempting to login with wrong password
        MvcResult result = mockMvc.perform(post("/api/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(loginDTO)))
                .andExpect(status().isUnauthorized())
                .andReturn();

        // Then: Login should fail
        String response = result.getResponse().getContentAsString();
        assertTrue(response.contains("Invalid credentials"));
    }

   /* @Test
    public void testLoginWithEmptyFields() throws Exception {
        // When: Attempting to login with empty credentials
        LoginDTO loginDTO = new LoginDTO();
        mockMvc.perform(post("/api/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(loginDTO)))
                .andExpect(status().isUnauthorized())  // Expect 401 Unauthorized
                .andExpect(jsonPath("$.message").value("Invalid credentials"));
    }*/

    @Test
    public void testLoginResponseStructure() throws Exception {
        // Given: A registered user
        RegisterDTO registerDTO = new RegisterDTO();
        registerDTO.setEmail("test@example.com");
        registerDTO.setPassword("Test123!@#");
        registerDTO.setFirstName("Zakariya");
        registerDTO.setLastName("Aden");
        mockMvc.perform(post("/api/auth/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(registerDTO)));

        LoginDTO loginDTO = new LoginDTO();
        loginDTO.setEmail("test@example.com");
        loginDTO.setPassword("Test123!@#");

        // When: Logging in
        MvcResult result = mockMvc.perform(post("/api/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(loginDTO)))
                .andExpect(status().isOk())
                .andReturn();

        // Then: Verify complete response structure
        String response = result.getResponse().getContentAsString();
        JsonNode jsonResponse = objectMapper.readTree(response);
        
        assertTrue(jsonResponse.has("token"));
        assertTrue(jsonResponse.has("role"));
        assertTrue(jsonResponse.has("email"));
        assertTrue(jsonResponse.has("firstName"));
        assertTrue(jsonResponse.has("lastName"));
        
        // Verify token format (should be JWT format)
        String token = jsonResponse.get("token").asText();
        assertTrue(token.split("\\.").length == 3); // JWT has 3 parts
    }

    // Password Reset Tests

    @Test
    public void testPasswordResetRequestForExistingUser() throws Exception {
        // Given: A registered user
        RegisterDTO registerDTO = new RegisterDTO();
        registerDTO.setEmail("reset@example.com");
        registerDTO.setPassword("Test123!@#");
        registerDTO.setFirstName("Zakariya");
        registerDTO.setLastName("Aden");
        mockMvc.perform(post("/api/auth/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(registerDTO)));

        // When: Requesting password reset
        MvcResult result = mockMvc.perform(post("/api/auth/forgot-password")
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"email\":\"reset@example.com\"}"))
                .andExpect(status().isOk())
                .andReturn();

        // Then: Reset token should be generated
        String response = result.getResponse().getContentAsString();
        assertTrue(response.contains("Password reset email sent"));
        
        User user = userRepository.findByEmail("reset@example.com").orElse(null);
        assertNotNull(user);
        assertNotNull(user.getResetToken());
        assertNotNull(user.getResetTokenExpiry());
    }

    @Test
    public void testPasswordResetRequestForNonExistentUser() throws Exception {
        // Given: A non-existent email
        // When: Requesting password reset
        MvcResult result = mockMvc.perform(post("/api/auth/forgot-password")
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"email\":\"nonexistent@example.com\"}"))
                .andExpect(status().isBadRequest())
                .andReturn();

        // Then: Request should fail
        String response = result.getResponse().getContentAsString();
        assertTrue(response.contains("User not found"));
    }

    @Test
    public void testPasswordResetWithValidToken() throws Exception {
        // Given: A user with reset token
        RegisterDTO registerDTO = new RegisterDTO();
        registerDTO.setEmail("reset2@example.com");
        registerDTO.setPassword("Test123!@#");
        registerDTO.setFirstName("Zakariya");
        registerDTO.setLastName("Aden");
        mockMvc.perform(post("/api/auth/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(registerDTO)));

        mockMvc.perform(post("/api/auth/forgot-password")
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"email\":\"reset2@example.com\"}"));

        User user = userRepository.findByEmail("reset2@example.com").orElse(null);
        String resetToken = user.getResetToken();

        // When: Resetting password with valid token
        MvcResult result = mockMvc.perform(post("/api/auth/reset-password")
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"token\":\"" + resetToken + "\",\"newPassword\":\"NewTest123!@#\"}"))
                .andExpect(status().isOk())
                .andReturn();

        // Then: Password should be reset
        String response = result.getResponse().getContentAsString();
        assertTrue(response.contains("Password has been reset successfully"));
        
        user = userRepository.findByEmail("reset2@example.com").orElse(null);
        assertNull(user.getResetToken());
        assertNull(user.getResetTokenExpiry());

        // Verify can login with new password
        LoginDTO loginDTO = new LoginDTO();
        loginDTO.setEmail("reset2@example.com");
        loginDTO.setPassword("NewTest123!@#");
        mockMvc.perform(post("/api/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(loginDTO)))
                .andExpect(status().isOk());
    }

    @Test
    public void testPasswordResetWithInvalidToken() throws Exception {
        // Given: An invalid reset token
        // When: Attempting to reset password
        MvcResult result = mockMvc.perform(post("/api/auth/reset-password")
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"token\":\"invalid-token\",\"newPassword\":\"NewTest123!@#\"}"))
                .andExpect(status().isBadRequest())
                .andReturn();

        // Then: Reset should fail
        String response = result.getResponse().getContentAsString();
        assertTrue(response.contains("Invalid token"));
    }

    @Test
    public void testPasswordResetTokenValidation() throws Exception {
        // Given: A registered user
        RegisterDTO registerDTO = new RegisterDTO();
        registerDTO.setEmail("validate@example.com");
        registerDTO.setPassword("Test123!@#");
        registerDTO.setFirstName("Zakariya");
        registerDTO.setLastName("Aden");

        mockMvc.perform(post("/api/auth/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(registerDTO)))
                .andExpect(status().isOk());

        // When: Requesting password reset
        Map<String, String> resetRequest = new HashMap<>();
        resetRequest.put("email", "validate@example.com");

        // Request password reset
        mockMvc.perform(post("/api/auth/forgot-password")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(resetRequest)))
                .andExpect(status().isOk());

        // Get the user and their reset token
        User savedUser = userRepository.findByEmail("validate@example.com").orElse(null);
        assertNotNull(savedUser, "User should exist after registration");
        assertNotNull(savedUser.getResetToken(), "Reset token should be generated");

        // Then: Validate the token
        mockMvc.perform(get("/api/auth/reset-password/validate")
                .param("token", savedUser.getResetToken()))
                .andExpect(status().isOk());
    }

    @Test
    public void testLoginWithValidTokenAccess() throws Exception {
        // Given: A registered and logged in user
        RegisterDTO registerDTO = new RegisterDTO();
        registerDTO.setEmail("token@example.com");
        registerDTO.setPassword("Test123!@#");
        registerDTO.setFirstName("Zakariya");
        registerDTO.setLastName("Aden");
        mockMvc.perform(post("/api/auth/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(registerDTO)));

        LoginDTO loginDTO = new LoginDTO();
        loginDTO.setEmail("token@example.com");
        loginDTO.setPassword("Test123!@#");

        MvcResult loginResult = mockMvc.perform(post("/api/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(loginDTO)))
                .andExpect(status().isOk())
                .andReturn();

        String token = objectMapper.readTree(loginResult.getResponse().getContentAsString())
                .get("token").asText();

        // When: Accessing protected endpoint with token
        mockMvc.perform(get("/api/user/me")
                .header("Authorization", "Bearer " + token))
                .andExpect(status().isOk());

        // Then: Should be able to access protected routes
    }

    /*@Test
    public void testJWTTokenValidation() throws Exception {
        // Given: A registered user
        RegisterDTO registerDTO = new RegisterDTO();
        registerDTO.setEmail("jwt-test@example.com");
        registerDTO.setPassword("Test123!@#");
        registerDTO.setFirstName("Zakariya");
        registerDTO.setLastName("Aden");
        mockMvc.perform(post("/api/auth/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(registerDTO)));

        // When: User logs in
        LoginDTO loginDTO = new LoginDTO();
        loginDTO.setEmail("jwt-test@example.com");
        loginDTO.setPassword("Test123!@#");

        MvcResult loginResult = mockMvc.perform(post("/api/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(loginDTO)))
                .andExpect(status().isOk())
                .andReturn();

        // Then: Response should contain valid JWT token and user info
        String response = loginResult.getResponse().getContentAsString();
        JsonNode jsonResponse = objectMapper.readTree(response);
        
        assertTrue(jsonResponse.has("token"));
        assertTrue(jsonResponse.has("role"));
        assertTrue(jsonResponse.has("email"));
        assertTrue(jsonResponse.has("firstName"));
        assertTrue(jsonResponse.has("lastName"));
        
        String token = jsonResponse.get("token").asText();
        
        // Verify token works for accessing protected endpoints
        mockMvc.perform(get("/api/user/me")
                .header("Authorization", "Bearer " + token))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.email").value("jwt-test@example.com"))
                .andExpect(jsonPath("$.firstName").value("Zakariya"));

        // Test invalid token
        mockMvc.perform(get("/api/user/me")
                .header("Authorization", "Bearer " + token + "invalid"))
                .andExpect(status().isUnauthorized());

        // Test missing token
        mockMvc.perform(get("/api/user/me"))
                .andExpect(status().isUnauthorized());

        // Test malformed token
        mockMvc.perform(get("/api/user/me")
                .header("Authorization", "Bearer malformed.token.here"))
                .andExpect(status().isUnauthorized());
    }*/
} 