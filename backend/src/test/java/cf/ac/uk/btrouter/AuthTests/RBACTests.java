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
import cf.ac.uk.btrouter.dto.LoginDTO;
import cf.ac.uk.btrouter.model.User;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;

@SpringBootTest
@AutoConfigureMockMvc
@DirtiesContext(classMode = DirtiesContext.ClassMode.BEFORE_EACH_TEST_METHOD)
public class RBACTests {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    private String getAuthToken(String email, String password) throws Exception {
        LoginDTO loginDTO = new LoginDTO();
        loginDTO.setEmail(email);
        loginDTO.setPassword(password);

        MvcResult result = mockMvc.perform(post("/api/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(loginDTO)))
                .andExpect(status().isOk())
                .andReturn();

        return objectMapper.readTree(result.getResponse().getContentAsString())
                .get("token").asText();
    }

    @Test
    public void testAdminDashboardAccess() throws Exception {
        // Given: Using existing admin user
        String adminToken = getAuthToken("admin@bt.com", "Admin123!");

        // When: Accessing admin dashboard
        mockMvc.perform(get("/api/admin/dashboard")
                .header("Authorization", "Bearer " + adminToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message").value("Admin Dashboard"))
                .andExpect(jsonPath("$.access").value("full"));
    }

    @Test
    public void testSupportDashboardAccess() throws Exception {
        // Given: Using existing support agent
        String supportToken = getAuthToken("support@bt.com", "Support123!");

        // When: Accessing support dashboard
        mockMvc.perform(get("/api/support/dashboard")
                .header("Authorization", "Bearer " + supportToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message").value("Support Dashboard"))
                .andExpect(jsonPath("$.access").value("limited"));
    }

    @Test
    public void testUserDashboardAccess() throws Exception {
        // Given: Create a new user
        User newUser = new User();
        newUser.setEmail("testuser3@example.com");
        newUser.setPassword("Test123!");
        newUser.setFirstName("Test");
        newUser.setLastName("User");
        newUser.setRole(User.Role.USER);

        // Register the new user
        mockMvc.perform(post("/api/auth/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(newUser)))
                .andExpect(status().isOk());

        // Get token for the new user
        String userToken = getAuthToken("testuser3@example.com", "Test123!");

        // When: Accessing user dashboard
        mockMvc.perform(get("/api/user/dashboard")
                .header("Authorization", "Bearer " + userToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message").value("User Dashboard"))
                .andExpect(jsonPath("$.access").value("basic"));
    }

    @Test
    public void testUnauthorizedAccess() throws Exception {
        // Given: Create a new user
        User newUser = new User();
        newUser.setEmail("testuser2@example.com");
        newUser.setPassword("Test123!");
        newUser.setFirstName("Test");
        newUser.setLastName("User");
        newUser.setRole(User.Role.USER);

        // Register the new user
        mockMvc.perform(post("/api/auth/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(newUser)))
                .andExpect(status().isOk());  // Expect successful registration

        // Get token for the new user
        String userToken = getAuthToken("testuser2@example.com", "Test123!");

        // When: Regular user tries to access admin dashboard
        mockMvc.perform(get("/api/admin/dashboard")
                .header("Authorization", "Bearer " + userToken))
                .andExpect(status().isForbidden());

        // When: Regular user tries to access support dashboard
        mockMvc.perform(get("/api/support/dashboard")
                .header("Authorization", "Bearer " + userToken))
                .andExpect(status().isForbidden());
    }

    @Test
    public void testRouterManagementAccess() throws Exception {
        // Given: Using existing admin user
        String adminToken = getAuthToken("admin@bt.com", "Admin123!");

        // When: Admin accesses router management
        mockMvc.perform(get("/api/admin/routers")
                .header("Authorization", "Bearer " + adminToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message").value("Router Management"));
    }

    @Test
    public void testCustomerManagementAccess() throws Exception {
        // Given: Using existing admin user
        String adminToken = getAuthToken("admin@bt.com", "Admin123!");

        // When: Admin accesses customer management
        mockMvc.perform(get("/api/admin/customers")
                .header("Authorization", "Bearer " + adminToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message").value("Customer Management"));
    }
} 