package cf.ac.uk.btrouter.controller;

import cf.ac.uk.btrouter.model.Order;
import cf.ac.uk.btrouter.model.OrderTracking;
import cf.ac.uk.btrouter.service.NewsService;
import cf.ac.uk.btrouter.service.OrderService;
import cf.ac.uk.btrouter.service.OrderTrackingService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/orders")
@CrossOrigin(origins = "*")  // Adjust if needed for security
public class OrderHistoryController {

    private static final Logger logger = LoggerFactory.getLogger(OrderHistoryController.class);

    private final OrderService orderService;
    private final OrderTrackingService orderTrackingService;
    private final NewsService newsService;

    public OrderHistoryController(OrderService orderService, OrderTrackingService orderTrackingService, NewsService newsService) {
        this.orderService = orderService;
        this.orderTrackingService = orderTrackingService;
        this.newsService = newsService;
    }

    // Get users order history
    @GetMapping("/history")
    public ResponseEntity<List<Order>> getOrderHistory(Authentication authentication) {
        long start = System.currentTimeMillis();
        String userEmail = authentication.getName(); // Get the logged-in user's email
        logger.info("Fetching order history for user: {}", userEmail);

        try {
            List<Order> orders = orderService.getOrdersByEmail(userEmail);
            long end = System.currentTimeMillis();
            logger.debug("{} order(s) found for user: {} (took {} ms)", orders.size(), userEmail, end - start);
            return ResponseEntity.ok(orders);
        } catch (Exception e) {
            long end = System.currentTimeMillis();
            logger.error("Failed to retrieve order history for user {} after {} ms: {}", userEmail, end - start, e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    // Reorder an existing router
    @PostMapping("/reorder/{orderId}")
    public ResponseEntity<?> reorderRouter(@PathVariable Long orderId, Authentication authentication) {
        long start = System.currentTimeMillis();

        if (authentication == null) {
            logger.warn("Unauthorized reorder attempt. Authentication object is null.");
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Unauthorized access");
        }

        String userEmail = authentication.getName();
        logger.info("User '{}' is attempting to reorder router for order ID: {}", userEmail, orderId);

        try {
            Order newOrder = orderService.reorderRouter(orderId, userEmail);
            OrderTracking tracking = orderTrackingService.createOrderTracking(newOrder.getRouterOrderID());

            newsService.createPost(
                    "Router Request Received",
                    "Your reordered router request (" + tracking.getReferenceNumber() + ") has been successfully placed and is being processed.",
                    "System Notification"
            );

            Map<String, Object> response = new HashMap<>();
            response.put("message", "Reorder placed successfully");
            response.put("order", newOrder);
            response.put("trackingReference", tracking.getReferenceNumber());

            long end = System.currentTimeMillis();
            logger.info("Reorder placed for user '{}'. New order ID: {}, Tracking ref: {} (took {} ms)",
                    userEmail, newOrder.getRouterOrderID(), tracking.getReferenceNumber(), end - start);
            return ResponseEntity.ok(response);

        } catch (IllegalArgumentException e) {
            long end = System.currentTimeMillis();
            logger.warn("Reorder failed - order not found for ID {} after {} ms: {}", orderId, end - start, e.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Order not found: " + e.getMessage());
        } catch (Exception e) {
            long end = System.currentTimeMillis();
            logger.error("Unexpected error during reorder for user '{}', order ID {} after {} ms: {}",
                    userEmail, orderId, end - start, e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error reordering router: " + e.getMessage());
        }
    }


    // Fetch full order details by ID - View Details feature.
    @GetMapping("/{orderId}")
    public ResponseEntity<Order> getOrderDetails(@PathVariable Long orderId, Authentication authentication) {
        long start = System.currentTimeMillis();
        String userEmail = authentication.getName();
        logger.info("User '{}' is requesting details for order ID: {}", userEmail, orderId);

        try {
            Order order = orderService.getOrderById(orderId, userEmail)
                    .orElseThrow(() -> new ResponseStatusException(HttpStatus.FORBIDDEN, "Unauthorized access"));

            long end = System.currentTimeMillis();
            logger.debug("Order details fetched for order ID: {} (took {} ms)", orderId, end - start);
            return ResponseEntity.ok(order);
        } catch (ResponseStatusException ex) {
            long end = System.currentTimeMillis();
            logger.warn("Unauthorized access attempt by user '{}' for order ID: {} (after {} ms)", userEmail, orderId, end - start);
            throw ex;
        } catch (Exception e) {
            long end = System.currentTimeMillis();
            logger.error("Error retrieving order details for user '{}', order ID {} after {} ms: {}", userEmail, orderId, end - start, e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }


}
