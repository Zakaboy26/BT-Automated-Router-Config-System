package cf.ac.uk.btrouter.WebTests;

import cf.ac.uk.btrouter.controller.OrderHistoryController;
import cf.ac.uk.btrouter.model.Order;
import cf.ac.uk.btrouter.model.OrderTracking;
import cf.ac.uk.btrouter.model.Router;
import cf.ac.uk.btrouter.service.NewsService;
import cf.ac.uk.btrouter.service.OrderService;
import cf.ac.uk.btrouter.service.OrderTrackingService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.http.MediaType;
import org.springframework.security.core.Authentication;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

public class OrderHistoryControllerTest {

    private MockMvc mockMvc;
    private OrderService orderService;
    private OrderTrackingService orderTrackingService;
    private NewsService newsService;

    @BeforeEach
    public void setup() {
        orderService = mock(OrderService.class);
        orderTrackingService = mock(OrderTrackingService.class);
        newsService = mock(NewsService.class);

        OrderHistoryController controller = new OrderHistoryController(orderService, orderTrackingService, newsService);
        mockMvc = MockMvcBuilders.standaloneSetup(controller).build();
    }

    @Test
    public void testGetOrderHistory() throws Exception {
        String userEmail = "test@example.com";

        Router router = new Router();
        router.setRouterName("Test Router");

        Order order = new Order();
        order.setRouterOrderID(1L);
        order.setEmail(userEmail);
        order.setOrderDate(LocalDateTime.now());
        order.setNumberOfRouters(1);
        order.setRouter(router);

        when(orderService.getOrdersByEmail(userEmail)).thenReturn(List.of(order));

        Authentication mockAuth = mock(Authentication.class);
        when(mockAuth.getName()).thenReturn(userEmail);

        mockMvc.perform(get("/api/orders/history")
                        .principal(mockAuth))
                .andExpect(status().isOk());
    }

    @Test
    public void testGetOrderDetailsSuccess() throws Exception {
        String userEmail = "test@example.com";

        Order order = new Order();
        order.setRouterOrderID(1L);
        order.setEmail(userEmail);
        order.setOrderDate(LocalDateTime.now());
        order.setNumberOfRouters(2);

        Router router = new Router();
        router.setRouterName("Test Router");
        order.setRouter(router);

        when(orderService.getOrderById(1L, userEmail)).thenReturn(Optional.of(order));

        Authentication mockAuth = mock(Authentication.class);
        when(mockAuth.getName()).thenReturn(userEmail);

        mockMvc.perform(get("/api/orders/1")
                        .principal(mockAuth))
                .andExpect(status().isOk());
    }

    @Test
    public void testGetOrderDetailsForbidden() throws Exception {
        String userEmail = "test@example.com";

        when(orderService.getOrderById(999L, userEmail)).thenReturn(Optional.empty());

        Authentication mockAuth = mock(Authentication.class);
        when(mockAuth.getName()).thenReturn(userEmail);

        mockMvc.perform(get("/api/orders/999")
                        .principal(mockAuth))
                .andExpect(status().isForbidden());
    }

    @Test
    public void testReorderRouterSuccess() throws Exception {
        String userEmail = "test@example.com";

        Router router = new Router();
        router.setRouterName("BT Super Hub"); // any non-null string

        // Mock the new reordered Order with router set
        Order newOrder = new Order();
        newOrder.setRouterOrderID(1L);
        newOrder.setEmail(userEmail);
        newOrder.setNumberOfRouters(1);
        newOrder.setRouter(router);

        OrderTracking tracking = new OrderTracking();
        tracking.setReferenceNumber("TRACK123");

        when(orderService.reorderRouter(1L, userEmail)).thenReturn(newOrder);
        when(orderTrackingService.createOrderTracking(1L)).thenReturn(tracking);

        Authentication mockAuth = mock(Authentication.class);
        when(mockAuth.getName()).thenReturn(userEmail);

        mockMvc.perform(post("/api/orders/reorder/1")
                        .principal(mockAuth)
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk());
    }

    @Test
    public void testReorderRouterNotFound() throws Exception {
        String userEmail = "test@example.com";

        when(orderService.reorderRouter(1L, userEmail)).thenThrow(new IllegalArgumentException("Order not found"));

        Authentication mockAuth = mock(Authentication.class);
        when(mockAuth.getName()).thenReturn(userEmail);

        mockMvc.perform(post("/api/orders/reorder/1")
                        .principal(mockAuth)
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isNotFound());
    }
}
