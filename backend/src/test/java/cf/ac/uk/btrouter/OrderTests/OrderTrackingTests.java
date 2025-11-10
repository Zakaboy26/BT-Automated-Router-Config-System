package cf.ac.uk.btrouter.OrderTests;

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
import cf.ac.uk.btrouter.model.Order;
import cf.ac.uk.btrouter.dto.OrderRequest;
import cf.ac.uk.btrouter.model.RouterPreset;
import cf.ac.uk.btrouter.repository.OrderRepository;

import java.util.HashMap;
import java.util.Map;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;

@SpringBootTest
@AutoConfigureMockMvc
@DirtiesContext(classMode = DirtiesContext.ClassMode.BEFORE_EACH_TEST_METHOD)
public class OrderTrackingTests {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private OrderRepository orderRepository;

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
    public void testCreateOrderTracking() throws Exception {
        // Given: Admin user and create a new order first
        String adminToken = getAuthToken("admin@bt.com", "Admin123!");

        // Create a new order using OrderService
        OrderRequest orderRequest = new OrderRequest();
        orderRequest.setSiteName("Test Site");
        orderRequest.setSiteAddress("123 Test Street");
        orderRequest.setSitePostcode("T1 1TT");
        orderRequest.setSitePrimaryEmail("test@example.com");
        orderRequest.setSitePhoneNumber("01234567890");
        orderRequest.setSiteContactName("Test Contact");
        orderRequest.setNumRouters(1);
        orderRequest.setCustomerId(1L);
        orderRequest.setRouterId(1L);
        orderRequest.setVlans("UNSPECIFIED");
        orderRequest.setInsideConnections("ETHERNET");
        orderRequest.setPrimaryOutsideConnections("Mobile Radio - UK SIM");

        MvcResult orderResult = mockMvc.perform(post("/api/orders")
                        .header("Authorization", "Bearer " + adminToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(orderRequest)))
                .andExpect(status().isOk())
                .andReturn();

        Long orderId = objectMapper.readTree(orderResult.getResponse().getContentAsString())
                .get("routerOrderID").asLong();

        // When: Creating order tracking
        Map<String, Long> request = new HashMap<>();
        request.put("orderId", orderId);

        mockMvc.perform(post("/api/order-tracking/create")
                        .header("Authorization", "Bearer " + adminToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.referenceNumber").exists())
                .andExpect(jsonPath("$.status").value("PENDING"))
                .andExpect(jsonPath("$.canModify").value(true))
                .andExpect(jsonPath("$.canCancel").value(true));
    }

    @Test
    public void testGetOrderStatus() throws Exception {
        // Given: Admin user and create a new order first
        String adminToken = getAuthToken("admin@bt.com", "Admin123!");

        // Create a new order using OrderService
        OrderRequest orderRequest = new OrderRequest();
        orderRequest.setSiteName("Test Site");
        orderRequest.setSiteAddress("123 Test Street");
        orderRequest.setSitePostcode("T1 1TT");
        orderRequest.setSitePrimaryEmail("test@example.com");
        orderRequest.setSitePhoneNumber("01234567890");
        orderRequest.setSiteContactName("Test Contact");
        orderRequest.setNumRouters(1);
        orderRequest.setCustomerId(1L);
        orderRequest.setRouterId(1L);
        orderRequest.setVlans("UNSPECIFIED");
        orderRequest.setInsideConnections("ETHERNET");
        orderRequest.setPrimaryOutsideConnections("Mobile Radio - UK SIM");

        MvcResult orderResult = mockMvc.perform(post("/api/orders")
                        .header("Authorization", "Bearer " + adminToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(orderRequest)))
                .andExpect(status().isOk())
                .andReturn();

        Long orderId = objectMapper.readTree(orderResult.getResponse().getContentAsString())
                .get("routerOrderID").asLong();

        // Create order tracking
        Map<String, Long> request = new HashMap<>();
        request.put("orderId", orderId);
        MvcResult createResult = mockMvc.perform(post("/api/order-tracking/create")
                        .header("Authorization", "Bearer " + adminToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andReturn();

        String referenceNumber = objectMapper.readTree(createResult.getResponse().getContentAsString())
                .get("referenceNumber").asText();

        // When: Getting order status
        mockMvc.perform(get("/api/order-tracking/" + referenceNumber)
                        .header("Authorization", "Bearer " + adminToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.referenceNumber").value(referenceNumber))
                .andExpect(jsonPath("$.status").value("PENDING"))
                .andExpect(jsonPath("$.routerName").exists())
                .andExpect(jsonPath("$.customerName").exists())
                .andExpect(jsonPath("$.numRouters").exists());
    }

    @Test
    public void testCancelOrder() throws Exception {
        // Given: Admin user and create a new order first
        String adminToken = getAuthToken("admin@bt.com", "Admin123!");

        // Create a new order using OrderService
        OrderRequest orderRequest = new OrderRequest();
        orderRequest.setSiteName("Test Site");
        orderRequest.setSiteAddress("123 Test Street");
        orderRequest.setSitePostcode("T1 1TT");
        orderRequest.setSitePrimaryEmail("test@example.com");
        orderRequest.setSitePhoneNumber("01234567890");
        orderRequest.setSiteContactName("Test Contact");
        orderRequest.setNumRouters(1);
        orderRequest.setCustomerId(1L);
        orderRequest.setRouterId(1L);
        orderRequest.setVlans("UNSPECIFIED");
        orderRequest.setInsideConnections("ETHERNET");
        orderRequest.setPrimaryOutsideConnections("Mobile Radio - UK SIM");

        MvcResult orderResult = mockMvc.perform(post("/api/orders")
                        .header("Authorization", "Bearer " + adminToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(orderRequest)))
                .andExpect(status().isOk())
                .andReturn();

        Long orderId = objectMapper.readTree(orderResult.getResponse().getContentAsString())
                .get("routerOrderID").asLong();

        // Create order tracking
        Map<String, Long> request = new HashMap<>();
        request.put("orderId", orderId);
        MvcResult createResult = mockMvc.perform(post("/api/order-tracking/create")
                        .header("Authorization", "Bearer " + adminToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andReturn();

        String referenceNumber = objectMapper.readTree(createResult.getResponse().getContentAsString())
                .get("referenceNumber").asText();

        // When: Cancelling the order
        mockMvc.perform(post("/api/order-tracking/" + referenceNumber + "/cancel")
                        .header("Authorization", "Bearer " + adminToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value("CANCELLED"))
                .andExpect(jsonPath("$.canModify").value(false))
                .andExpect(jsonPath("$.canCancel").value(false));
    }

    @Test
    public void testOrderStatusUpdateEmails() throws Exception {
        // Given: Admin user and create a new order first
        String adminToken = getAuthToken("admin@bt.com", "Admin123!");

        //Create a new order using OrderService
        OrderRequest orderRequest = new OrderRequest();
        orderRequest.setSiteName("Test Site");
        orderRequest.setSiteAddress("123 Test Street");
        orderRequest.setSitePostcode("T1 1TT");
        orderRequest.setSitePrimaryEmail("test@example.com");
        orderRequest.setSitePhoneNumber("01234567890");
        orderRequest.setSiteContactName("Test Contact");
        orderRequest.setNumRouters(1);
        orderRequest.setCustomerId(1L);
        orderRequest.setRouterId(1L);
        orderRequest.setVlans("UNSPECIFIED");
        orderRequest.setInsideConnections("ETHERNET");
        orderRequest.setPrimaryOutsideConnections("Mobile Radio - UK SIM");

        MvcResult orderResult = mockMvc.perform(post("/api/orders")
                        .header("Authorization", "Bearer " + adminToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(orderRequest)))
                .andExpect(status().isOk())
                .andReturn();

        Long orderId = objectMapper.readTree(orderResult.getResponse().getContentAsString())
                .get("routerOrderID").asLong();

        // Create order tracking
        Map<String, Long> request = new HashMap<>();
        request.put("orderId", orderId);

        MvcResult trackingResult = mockMvc.perform(post("/api/order-tracking/create")
                        .header("Authorization", "Bearer " + adminToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andReturn();

        String referenceNumber = objectMapper.readTree(trackingResult.getResponse().getContentAsString())
                .get("referenceNumber").asText();

        // When: Updating order status to different stages
        String[] statuses = {"CONFIRMED", "IN_PRODUCTION", "QUALITY_CHECK", "READY_FOR_SHIPPING", "IN_TRANSIT", "DELIVERED"};

        for (String status : statuses) {
            Map<String, String> statusUpdate = new HashMap<>();
            statusUpdate.put("status", status);

            mockMvc.perform(put("/api/orders/" + orderId + "/status")
                            .header("Authorization", "Bearer " + adminToken)
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(objectMapper.writeValueAsString(statusUpdate)))
                    .andExpect(status().isOk())
                    .andExpect(content().string("Status updated successfully"));
        }
    }

} 