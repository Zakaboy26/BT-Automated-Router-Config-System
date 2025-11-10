package cf.ac.uk.btrouter.WebTests;

import cf.ac.uk.btrouter.config.SecurityConfig;
import cf.ac.uk.btrouter.controller.UserSettingsController;
import cf.ac.uk.btrouter.dto.ChangePasswordRequestDTO;
import cf.ac.uk.btrouter.model.User;
import cf.ac.uk.btrouter.repository.UserRepository;
import cf.ac.uk.btrouter.service.UserService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.http.MediaType;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import java.lang.reflect.Field;
import java.util.Map;

import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

public class UserSettingsControllerTest {

    private MockMvc mockMvc;
    private UserService userService;
    private UserRepository userRepository;
    private PasswordEncoder passwordEncoder;
    private SecurityConfig securityConfig;
    private ObjectMapper objectMapper;

    @BeforeEach
    public void setup() throws Exception {
        userService = mock(UserService.class);
        userRepository = mock(UserRepository.class);
        passwordEncoder = mock(PasswordEncoder.class);
        securityConfig = mock(SecurityConfig.class);
        objectMapper = new ObjectMapper();

        UserSettingsController controller = new UserSettingsController(userRepository, passwordEncoder, securityConfig);

        // 🔧 Inject mock userService using reflection
        Field userServiceField = UserSettingsController.class.getDeclaredField("userService");
        userServiceField.setAccessible(true);
        userServiceField.set(controller, userService);

        mockMvc = MockMvcBuilders.standaloneSetup(controller).build();
    }

    @Test
    public void testUpdateUserSettings_authenticatedFlow() throws Exception {
        String email = "test@example.com";
        User updatedUser = new User();
        updatedUser.setEmail(email);

        when(userService.updateUserSettings(eq(email), any(User.class))).thenReturn(updatedUser);

        Authentication mockAuth = mock(Authentication.class);
        when(mockAuth.getName()).thenReturn(email);

        SecurityContextHolder.getContext().setAuthentication(mockAuth);

        mockMvc.perform(put("/api/user/settings")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(updatedUser)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.email").value(email));
    }

    @Test
    public void testUpdateUserSettings() throws Exception {
        String email = "test@example.com";
        User updatedUser = new User();
        updatedUser.setEmail(email);

        when(userService.updateUserSettings(eq(email), any(User.class))).thenReturn(updatedUser);

        Authentication mockAuth = mock(Authentication.class);
        when(mockAuth.getName()).thenReturn(email);

        SecurityContextHolder.getContext().setAuthentication(mockAuth);

        mockMvc.perform(put("/api/user/settings")
                        .principal(mockAuth)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(updatedUser)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.email").value(email));
    }

    @Test
    public void testDeleteUserAccount() throws Exception {
        String email = "test@example.com";

        doNothing().when(userService).deleteUser(email);

        Authentication mockAuth = mock(Authentication.class);
        when(mockAuth.getName()).thenReturn(email);

        SecurityContextHolder.getContext().setAuthentication(mockAuth);

        mockMvc.perform(delete("/api/user/settings").principal(mockAuth))
                .andExpect(status().isOk())
                .andExpect(content().string("Account deleted successfully"));
    }

    @Test
    public void testChangePasswordSuccess() throws Exception {
        String email = "test@example.com";
        ChangePasswordRequestDTO request = new ChangePasswordRequestDTO();
        request.setCurrentPassword("oldPass");
        request.setNewPassword("newPass");
        request.setConfirmPassword("newPass");

        doNothing().when(userService).changePassword(eq(email), eq("oldPass"), eq("newPass"), eq("newPass"));

        Authentication mockAuth = mock(Authentication.class);
        when(mockAuth.getName()).thenReturn(email);

        SecurityContextHolder.getContext().setAuthentication(mockAuth);

        mockMvc.perform(post("/api/user/change-password")
                        .principal(mockAuth)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message").value("Password changed successfully."));
    }
}
