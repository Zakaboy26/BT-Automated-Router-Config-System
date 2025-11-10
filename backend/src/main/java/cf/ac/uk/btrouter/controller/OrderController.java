package cf.ac.uk.btrouter.controller;

import cf.ac.uk.btrouter.dto.OrderRequest;
import cf.ac.uk.btrouter.model.Order;
import cf.ac.uk.btrouter.model.OrderTracking;
import cf.ac.uk.btrouter.repository.OrderTrackingRepository;
import cf.ac.uk.btrouter.service.OrderService;
import cf.ac.uk.btrouter.service.NewsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;


import java.util.*;

@RestController
@RequestMapping("/api/orders")
@CrossOrigin(origins = "*")
public class OrderController {

    @Autowired
    private OrderService orderService;

    @Autowired
    private NewsService newsService;

    @Autowired
    private OrderTrackingRepository orderTrackingRepository;

    private static final Logger logger = LoggerFactory.getLogger(OrderController.class);

    @PostMapping
    public ResponseEntity<?> createOrder(@RequestBody OrderRequest orderRequest, Authentication authentication) {
        String email = authentication.getName();
        orderRequest.setSitePrimaryEmail(email);

        // Logging
        logger.info("Received order creation request from user: {}", email);
        logger.debug("Request details - " +
                        "Customer ID: {}, Router ID: {}, Router Preset ID: {}, Inside Connections: {}, Outside Connections (Primary): {}, " +
                        "Num Routers: {}, Priority: {}, VLANs: {}, Site Name: {}, Postcode: {}, Additional Info: {}",
                orderRequest.getCustomerId(),
                orderRequest.getRouterId(),
                orderRequest.getRouterPresetId(),
                orderRequest.getInsideConnections(),
                orderRequest.getPrimaryOutsideConnections(),
                orderRequest.getNumRouters(),
                orderRequest.getPriorityLevel(),
                orderRequest.getVlans(),
                orderRequest.getSiteName(),
                orderRequest.getSitePostcode(),
                orderRequest.getAdditionalInformation());
        long startTime = System.currentTimeMillis();

//        // ✅ Add debug logs
//        System.out.println("Received order request:");
//        System.out.println("Customer ID: " + orderRequest.getCustomerId());
//        System.out.println("Router ID: " + orderRequest.getRouterId());
//        System.out.println("Inside Connections: " + orderRequest.getInsideConnections());

        try {
            Order savedOrder = orderService.saveOrder(orderRequest);
            long duration = System.currentTimeMillis() - startTime;
            logger.info("Order successfully saved for user: {}. Reference: {}. Execution time: {} ms",
                    email, savedOrder.getReferenceNumber(), duration);
            return ResponseEntity.ok(savedOrder);
        } catch (Exception e) {
            logger.error("Error while creating order for user {}: {}", email, e.getMessage(), e);
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
    }

    // 🔵 Get all orders with tracking info (admin)
    @GetMapping
    public ResponseEntity<List<Map<String, Object>>> getAllRequests() {
        logger.info("Admin requested all router orders.");
        long startTime = System.currentTimeMillis();
        List<Order> orders = orderService.getAllRequests();
        long duration = System.currentTimeMillis() - startTime;
        logger.debug("Retrieved {} total orders. Execution time: {} ms", orders.size(), duration);

        if (orders.isEmpty()) {
            logger.warn("No router orders found in the system");
        }

        return ResponseEntity.ok(mapOrdersWithTracking(orders));
    }

    // 🟡 Get only pending requests (admin)
    @GetMapping("/pending")
    public ResponseEntity<List<Map<String, Object>>> getPendingRequests() {
        logger.info("Admin requested pending orders only.");
        long startTime = System.currentTimeMillis();
        List<Order> orders = orderService.getPendingRequests();
        long duration = System.currentTimeMillis() - startTime;
        logger.debug("Retrieved {} pending orders. Execution time: {} ms", orders.size(), duration);

        if (orders.isEmpty()) {
            logger.warn("No pending router orders available");
        }

        return ResponseEntity.ok(mapOrdersWithTracking(orders));
    }

    // 🔴 Update order status and push news announcement (admin)
    @PutMapping("/{id}/status")
    public ResponseEntity<?> updateRequestStatus(@PathVariable Long id, @RequestBody Map<String, String> request) {
        String newStatus = request.get("status");
        logger.info("Status update request received for Order ID: {} with new status: {}", id, newStatus);

        long startTime = System.currentTimeMillis();

        try {
            Order updatedOrder = orderService.updateOrderStatus(id, newStatus);
            if (updatedOrder != null) {
                String ref = updatedOrder.getReferenceNumber();
                logger.info("Order status updated. Reference: {}, New Status: {}", ref, newStatus);

                newsService.createPost(
                        "Router Request Status Updated",
                        "Your router request (" + ref + ") has been updated to **" + newStatus + "**.",
                        "System Notification"
                );
            } else {
                logger.warn("Attempted to update non-existent order ID: {}", id);
            }
            long duration = System.currentTimeMillis() - startTime;
            logger.debug("Status update operation completed in {} ms", duration);

            return ResponseEntity.ok("Status updated successfully");
        } catch (Exception e) {
            logger.error("Failed to update status for Order ID {}: {}", id, e.getMessage(), e);
            return ResponseEntity.status(500).body("Error updating status");
        }
    }

    // 🔹 Get user’s own router requests
    @GetMapping("/user")
    public ResponseEntity<List<Order>> getUserOrders(Authentication authentication) {
        String email = authentication.getName();
        logger.info("Fetching orders for user: {}", email);

        long startTime = System.currentTimeMillis();
        List<Order> orders = orderService.getOrdersByEmail(email);
        long duration = System.currentTimeMillis() - startTime;

        if (orders.isEmpty()) {
            logger.warn("No orders found for user: {}", email);
        } else {
            logger.debug("User {} has {} order(s). Execution time: {} ms", email, orders.size(), duration);
        }

        return ResponseEntity.ok(orders);
    }

    // 🔸 Helper to map tracking info
    private List<Map<String, Object>> mapOrdersWithTracking(List<Order> orders) {
        List<Map<String, Object>> result = new ArrayList<>();
        for (Order order : orders) {
            Map<String, Object> map = new HashMap<>();
            map.put("id", order.getRouterOrderID());
            map.put("referenceNumber", order.getReferenceNumber());
            map.put("sitePrimaryEmail", order.getSitePrimaryEmail());
            map.put("orderDate", order.getOrderDate());
            map.put("priorityLevel", order.getPriorityLevel());
            map.put("status", order.getStatus());

            OrderTracking tracking = orderTrackingRepository.findByOrderRouterOrderID(order.getRouterOrderID()).orElse(null);
            map.put("trackingReference", tracking != null ? tracking.getReferenceNumber() : "N/A");

            if (tracking == null) {
                logger.warn("No tracking data found for Order ID: {}", order.getRouterOrderID());
            }

            result.add(map);
        }
        return result;
    }
}
