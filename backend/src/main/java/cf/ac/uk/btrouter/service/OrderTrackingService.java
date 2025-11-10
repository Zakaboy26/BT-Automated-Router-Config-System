package cf.ac.uk.btrouter.service;

import cf.ac.uk.btrouter.model.OrderTracking;
import cf.ac.uk.btrouter.model.Order;
import cf.ac.uk.btrouter.repository.OrderTrackingRepository;
import cf.ac.uk.btrouter.repository.OrderRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import java.util.concurrent.CompletableFuture;

@Service
public class OrderTrackingService {

    private static final Logger logger = LoggerFactory.getLogger(OrderTrackingService.class);

    private final OrderTrackingRepository orderTrackingRepository;
    private final OrderRepository orderRepository;
    private final EmailService emailService;

    @Autowired
    public OrderTrackingService(
            OrderTrackingRepository orderTrackingRepository,
            OrderRepository orderRepository,
            EmailService emailService) {
        this.orderTrackingRepository = orderTrackingRepository;
        this.orderRepository = orderRepository;
        this.emailService = emailService;
        logger.info("OrderTrackingService initialized with repositories and email service");
    }

    // Create new tracking entry for an order
    @Transactional
    public OrderTracking createOrderTracking(Long orderId) {
        logger.info("Creating tracking for order ID: {}", orderId);

        // Get the order
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> {
                    logger.error("Order not found with ID: {}", orderId);
                    return new RuntimeException("Order not found with ID: " + orderId);
                });

        // Create tracking entity
        OrderTracking tracking = new OrderTracking();
        tracking.setRouterOrderID(orderId);
        tracking.setReferenceNumber(order.getReferenceNumber());
        tracking.setStatus("PENDING");
        tracking.setCanModify(true);
        tracking.setCanCancel(true);

        // Save tracking information
        OrderTracking savedTracking = orderTrackingRepository.save(tracking);
        logger.info("Created tracking with reference number: {}", savedTracking.getReferenceNumber());

        // Send confirmation email
        try {
            emailService.sendOrderConfirmationEmail(
                    order.getSitePrimaryEmail(),
                    savedTracking.getReferenceNumber(),
                    order
            );
            logger.info("Sent confirmation email to: {}", order.getSitePrimaryEmail());
        } catch (Exception e) {
            logger.error("Failed to send confirmation email for order ID: {}", orderId, e);
        }

        return savedTracking;
    }

    // Retrieve tracking information by reference number
    public OrderTracking getOrderTracking(String referenceNumber) {
        logger.info("Fetching tracking for reference number: {}", referenceNumber);
        return orderTrackingRepository.findByReferenceNumber(referenceNumber)
                .orElseThrow(() -> {
                    logger.error("Order not found with reference: {}", referenceNumber);
                    return new RuntimeException("Order not found with reference: " + referenceNumber);
                });
    }

    // Update order status and permissions based on reference number
    @Transactional
    public OrderTracking updateOrderStatus(String referenceNumber, String newStatus) {
        logger.info("Updating status for reference {} to: {}", referenceNumber, newStatus);
        
        OrderTracking tracking = getOrderTracking(referenceNumber);
        tracking.setStatus(newStatus);
        updateModificationPermissions(tracking, newStatus);

        OrderTracking updatedTracking = orderTrackingRepository.save(tracking);
        logger.info("Updated status for reference {} to: {}", referenceNumber, newStatus);

        // Get the associated order
        Order order = orderRepository.findById(tracking.getRouterOrderID())
                .orElseThrow(() -> {
                    logger.error("Order not found for tracking reference: {}", referenceNumber);
                    return new RuntimeException("Order not found");
                });

        // Send status update email
        try {
            emailService.sendOrderStatusUpdateEmail(
                    order.getSitePrimaryEmail(),
                    referenceNumber,
                    newStatus
            );
            logger.info("Sent status update email to: {}", order.getSitePrimaryEmail());
        } catch (Exception e) {
            logger.error("Failed to send status update email for reference: {}", referenceNumber, e);
        }

        return updatedTracking;
    }

    // Update order status and permissions based on order ID
    @Transactional
    public OrderTracking updateOrderStatusByOrderId(Long orderId, String newStatus) {
        logger.info("Updating status for order ID {} to: {}", orderId, newStatus);
        
        OrderTracking tracking = orderTrackingRepository.findByOrderRouterOrderID(orderId)
                .orElseThrow(() -> {
                    logger.error("OrderTracking not found for order ID: {}", orderId);
                    return new RuntimeException("OrderTracking not found for order ID: " + orderId);
                });

        // Update status and modification permissions
        tracking.setStatus(newStatus);
        updateModificationPermissions(tracking, newStatus);

        OrderTracking updatedTracking = orderTrackingRepository.save(tracking);
        logger.info("Updated status for order ID {} to: {}", orderId, newStatus);

        // Get the associated order
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> {
                    logger.error("Order not found for ID: {}", orderId);
                    return new RuntimeException("Order not found");
                });

        // Send status update email asynchronously
        CompletableFuture.runAsync(() -> {
            try {
                emailService.sendOrderStatusUpdateEmail(
                    order.getSitePrimaryEmail(),
                    tracking.getReferenceNumber(),
                    newStatus
                );
                logger.info("Sent status update email to: {}", order.getSitePrimaryEmail());
            } catch (Exception e) {
                logger.error("Failed to send status update email for order ID: {}", orderId, e);
            }
        });

        return updatedTracking;
    }

    // Handle order cancellation
    @Transactional
    public void cancelOrder(String referenceNumber) {
        logger.info("Processing cancellation for reference: {}", referenceNumber);
        
        OrderTracking tracking = getOrderTracking(referenceNumber);

        // Check if cancellation is allowed
        if (!tracking.isCanCancel()) {
            logger.warn("Cancellation attempted for non-cancellable order: {}", referenceNumber);
            throw new RuntimeException("Order cannot be cancelled at this stage");
        }

        // Update order status and permissions
        tracking.setStatus("CANCELLED");
        tracking.setCanModify(false);
        tracking.setCanCancel(false);
        orderTrackingRepository.save(tracking);
        logger.info("Order cancelled successfully for reference: {}", referenceNumber);

        // Get the associated order
        Order order = orderRepository.findById(tracking.getRouterOrderID())
                .orElseThrow(() -> {
                    logger.error("Order not found for tracking reference: {}", referenceNumber);
                    return new RuntimeException("Order not found");
                });

        // update the status to CANCELLED
        order.setStatus("CANCELLED");
        orderRepository.save(order);

        // Send cancellation confirmation
        try {
            emailService.sendOrderCancellationEmail(
                    order.getSitePrimaryEmail(),
                    referenceNumber
            );
            logger.info("Sent cancellation email to: {}", order.getSitePrimaryEmail());
        } catch (Exception e) {
            logger.error("Failed to send cancellation email for reference: {}", referenceNumber, e);
        }
    }

    // Handle order modification
    @Transactional
    public void modifyOrder(String referenceNumber, Order modifiedOrder) {
        logger.info("Processing modification for reference: {}", referenceNumber);
        
        OrderTracking tracking = getOrderTracking(referenceNumber);

        // Check if modification is allowed
        if (!tracking.isCanModify()) {
            logger.warn("Modification attempted for non-modifiable order: {}", referenceNumber);
            throw new RuntimeException("Order cannot be modified at this stage");
        }

        // Get the original order
        Order originalOrder = orderRepository.findById(tracking.getRouterOrderID())
                .orElseThrow(() -> {
                    logger.error("Order not found for tracking reference: {}", referenceNumber);
                    return new RuntimeException("Order not found");
                });

        // Update order details
        originalOrder.setNumRouters(modifiedOrder.getNumRouters());
        Order savedOrder = orderRepository.save(originalOrder);
        logger.info("Order modified successfully for reference: {}", referenceNumber);

        // Send modification confirmation
        try {
            emailService.sendOrderModificationEmail(
                    savedOrder.getSitePrimaryEmail(),
                    referenceNumber,
                    savedOrder
            );
            logger.info("Sent modification email to: {}", savedOrder.getSitePrimaryEmail());
        } catch (Exception e) {
            logger.error("Failed to send modification email for reference: {}", referenceNumber, e);
        }
    }

    // Update modification permissions based on status
    private void updateModificationPermissions(OrderTracking tracking, String newStatus) {
        logger.debug("Updating permissions for status: {}", newStatus);
        switch (newStatus) {
        case "PENDING" -> {
            tracking.setCanModify(true);
            tracking.setCanCancel(true);
        }
        case "CONFIRMED", "IN_PRODUCTION", "QUALITY_CHECK", "READY_FOR_SHIPPING", "IN_TRANSIT", "DELIVERED", "CANCELLED" -> {
            tracking.setCanModify(false);
            tracking.setCanCancel(false);
        }
        }
        logger.debug("Updated permissions - canModify: {}, canCancel: {}", 
                    tracking.isCanModify(), tracking.isCanCancel());
    }
}
