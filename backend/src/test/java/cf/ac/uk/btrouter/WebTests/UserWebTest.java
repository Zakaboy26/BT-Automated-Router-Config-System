package cf.ac.uk.btrouter.WebTests;

import cf.ac.uk.btrouter.controller.UserController;
import cf.ac.uk.btrouter.model.User;
import cf.ac.uk.btrouter.repository.UserRepository;
import cf.ac.uk.btrouter.service.UserService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.test.context.junit.jupiter.SpringExtension;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;

import java.util.Arrays;
import java.util.List;

import static org.hamcrest.Matchers.hasSize;
import static org.hamcrest.Matchers.is;
import static org.mockito.Mockito.when;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.user;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@ExtendWith(SpringExtension.class)
@WebMvcTest(UserController.class)
class UserWebTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private UserService userService;

    @MockBean
    private UserRepository userRepository;

    @Autowired
    private ObjectMapper objectMapper;

    private User setMockUser(long id, String fName, String lName, String email, User.Role role) {
        User user = new User();
        user.setId(id);
        user.setFirstName(fName);
        user.setLastName(lName);
        user.setEmail(email);
        user.setRole(role);
        return user;
    }

    @Test
    @WithMockUser(username = "admin", roles = {"ADMIN"})
    void shouldReturnUsersWhenUsersExist() throws Exception {
        // Mock data
        User user1 = setMockUser(1, "John", "Doe", "john@example.com", User.Role.USER);
        User user2 = setMockUser(2, "Jane", "Smith", "jane@example.com", User.Role.USER);
        List<User> users = Arrays.asList(user1, user2);

        // Mock service response
        when(userService.findAll()).thenReturn(users);

        // Perform GET request as ADMIN
        mockMvc.perform(MockMvcRequestBuilders.get("/api/admin/users")
                        .with(user("admin").roles("ADMIN"))
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(2)))
                .andExpect(jsonPath("$[0].firstName", is("John")))
                .andExpect(jsonPath("$[1].firstName", is("Jane")));
    }
}
