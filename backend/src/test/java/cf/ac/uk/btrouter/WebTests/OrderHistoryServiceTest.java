package cf.ac.uk.btrouter.WebTests;

import cf.ac.uk.btrouter.model.Order;
import cf.ac.uk.btrouter.repository.OrderRepository;
import cf.ac.uk.btrouter.service.OrderService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class OrderHistoryServiceTest {

    @Mock
    private OrderRepository orderRepository;

    @InjectMocks
    private OrderService orderService;

    private Order mockOrder;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);

        mockOrder = new Order();
        mockOrder.setRouterOrderID(1L);
        mockOrder.setReferenceNumber("REF123");
        mockOrder.setSitePrimaryEmail("test@example.com");
        mockOrder.setStatus("Pending");
    }

    @Test
    void testFindOrdersByEmail() {
        when(orderRepository.findOrdersByEmail("test@example.com"))
                .thenReturn(List.of(mockOrder));

        List<Order> result = orderService.getOrdersByEmail("test@example.com");
        assertThat(result).hasSize(1);
        assertThat(result.get(0).getReferenceNumber()).isEqualTo("REF123");
    }

    @Test
    void testFindOrderByIdAndEmail() {
        when(orderRepository.findOrderByIdAndEmail(1L, "test@example.com"))
                .thenReturn(mockOrder);

        Optional<Order> result = orderService.getOrderById(1L, "test@example.com");
        assertTrue(result.isPresent());
        assertEquals("REF123", result.get().getReferenceNumber());
    }

    @Test
    void testFindByStatus() {
        when(orderRepository.findByStatus("Pending"))
                .thenReturn(List.of(mockOrder));

        List<Order> result = orderService.getPendingRequests();
        assertThat(result).isNotEmpty();
        assertEquals("Pending", result.get(0).getStatus());
    }

    @Test
    void testFindByReferenceNumber() {
        when(orderRepository.findByReferenceNumber("REF123"))
                .thenReturn(mockOrder);

        Order result = orderRepository.findByReferenceNumber("REF123");
        assertNotNull(result);
        assertEquals("REF123", result.getReferenceNumber());
    }

    @Test
    void testFindDistinctEmails() {
        when(orderRepository.findDistinctBySitePrimaryEmail())
                .thenReturn(Arrays.asList("test@example.com", "other@example.com"));

        List<String> emails = orderRepository.findDistinctBySitePrimaryEmail();
        assertEquals(2, emails.size());
        assertTrue(emails.contains("test@example.com"));
    }
}
