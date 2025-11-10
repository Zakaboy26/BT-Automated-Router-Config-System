package cf.ac.uk.btrouter.service;

import cf.ac.uk.btrouter.dto.OrderRequest;
import cf.ac.uk.btrouter.model.Customer;
import cf.ac.uk.btrouter.model.Order;
import cf.ac.uk.btrouter.model.Router;
import cf.ac.uk.btrouter.model.RouterPreset;
import cf.ac.uk.btrouter.repository.CustomerRepository;
import cf.ac.uk.btrouter.repository.OrderRepository;
import cf.ac.uk.btrouter.repository.RouterPresetRepository;
import cf.ac.uk.btrouter.repository.RouterRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class OrderService {

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private OrderTrackingService orderTrackingService;

    @Autowired
    private RouterRepository routerRepository;

    @Autowired
    private CustomerRepository customerRepository;

    @Autowired
    private RouterPresetRepository routerPresetRepository;

    public OrderService(OrderRepository orderRepository) {
        this.orderRepository = orderRepository;
    }

    public Order saveOrder(OrderRequest orderRequest) {
        Order order = new Order();

        // Generate unique reference number
        order.setReferenceNumber("BT-" + UUID.randomUUID().toString().replaceAll("-", "").substring(0, 8).toUpperCase());

        // Set customer from ID
        Customer customer = customerRepository.findById(orderRequest.getCustomerId())
            .orElseThrow(() -> new IllegalArgumentException("Customer not found"));
        order.setCustomer(customer);

        // Set router from ID
        Router router = routerRepository.findById(orderRequest.getRouterId())
            .orElseThrow(() -> new IllegalArgumentException("Router not found"));
        order.setRouter(router);

        // Set optional router preset
        if (orderRequest.getRouterPresetId() != null) {
            RouterPreset preset = routerPresetRepository.findById(orderRequest.getRouterPresetId())
                .orElse(null);
            order.setRouterPreset(preset);
        }

        // Outside connections
        order.setPrimaryOutsideConnections(orderRequest.getPrimaryOutsideConnections());
        order.setSecondaryOutsideConnections(orderRequest.getSecondaryOutsideConnections());

        // Inside connections as comma-separated string (e.g., "ETHERNET,SERIAL")
        order.setInsideConnections(orderRequest.getInsideConnections());

        // VLAN config as enum
        order.setVlans(RouterPreset.VlanType.valueOf(orderRequest.getVlans()));

        // DHCP
        order.setDhcp(orderRequest.getDhcpConfiguration() != null && orderRequest.getDhcpConfiguration());

        // Site info
        order.setSiteName(orderRequest.getSiteName());
        order.setSiteAddress(orderRequest.getSiteAddress());
        order.setSitePostcode(orderRequest.getSitePostcode());
        order.setSitePrimaryEmail(orderRequest.getSitePrimaryEmail());
        order.setSiteSecondaryEmail(orderRequest.getSiteSecondaryEmail());
        order.setSitePhoneNumber(orderRequest.getSitePhoneNumber());
        order.setSiteContactName(orderRequest.getSiteContactName());

        // Other fields
        order.setPriorityLevel(orderRequest.getPriorityLevel());
        order.setAdditionalInformation(orderRequest.getAdditionalInformation());
        order.setStatus("Pending");
        order.setOrderDate(LocalDateTime.now());

        // Number of routers
        order.setNumRouters((orderRequest.getNumRouters() != null && orderRequest.getNumRouters() > 0)
            ? orderRequest.getNumRouters() : 1);

        // Optional flag
        order.setAddAnotherRouter(orderRequest.getAddAnotherRouter() != null && orderRequest.getAddAnotherRouter());

        return orderRepository.save(order);
    }

    public List<Order> getOrdersByEmail(String email) {
        return orderRepository.findOrdersByEmail(email);
    }

    public Optional<Order> getOrderById(Long orderId, String userEmail) {
        return Optional.ofNullable(orderRepository.findOrderByIdAndEmail(orderId, userEmail));
    }

    public Order updateOrderStatus(Long orderId, String newStatus) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found"));
        order.setStatus(newStatus);
        orderRepository.save(order);
        orderTrackingService.updateOrderStatusByOrderId(orderId, newStatus);
        return order;
    }

    public List<Order> getPendingRequests() {
        return orderRepository.findByStatus("Pending");
    }

    public List<Order> getAllRequests() {
        return orderRepository.findAll();
    }

    public Order reorderRouter(Long orderId, String userEmail) {
        Optional<Order> existingOrder = orderRepository.findById(orderId);
        if (existingOrder.isPresent()) {
            Order oldOrder = existingOrder.get();

            // Confirm ownership
            if (!oldOrder.getEmail().equals(userEmail)) {
                throw new IllegalArgumentException("Unauthorized to reorder this order.");
            }

            Order newOrder = new Order();
            newOrder.setReferenceNumber("BT-" + UUID.randomUUID().toString().replaceAll("-", "").substring(0, 8).toUpperCase());

            // Reuse linked entities
            newOrder.setCustomer(oldOrder.getCustomer());
            newOrder.setRouter(oldOrder.getRouter());
            newOrder.setRouterPreset(oldOrder.getRouterPreset());

            // Connection fields
            newOrder.setPrimaryOutsideConnections(oldOrder.getPrimaryOutsideConnections());
            newOrder.setSecondaryOutsideConnections(oldOrder.getSecondaryOutsideConnections());
            newOrder.setInsideConnections(oldOrder.getInsideConnections());

            // VLAN & DHCP
            newOrder.setVlans(oldOrder.getVlans());
            newOrder.setDhcp(oldOrder.getDhcp());

            // Site info
            newOrder.setSiteName(oldOrder.getSiteName());
            newOrder.setSiteAddress(oldOrder.getAddress());
            newOrder.setSitePostcode(oldOrder.getPostcode());
            newOrder.setSitePrimaryEmail(userEmail); // current user
            newOrder.setSiteSecondaryEmail(oldOrder.getSiteSecondaryEmail());
            newOrder.setSitePhoneNumber(oldOrder.getSitePhoneNumber());
            newOrder.setSiteContactName(oldOrder.getSiteContactName());

            // Other
            newOrder.setPriorityLevel(oldOrder.getPriorityLevel());
            newOrder.setAdditionalInformation(oldOrder.getAdditionalInformation());
            newOrder.setNumRouters(oldOrder.getNumberOfRouters());
            newOrder.setAddAnotherRouter(oldOrder.getAddAnotherRouter());
            newOrder.setStatus("Pending");
            newOrder.setOrderDate(LocalDateTime.now());

            // Optional metadata
            newOrder.setIpAddress(oldOrder.getIpAddress());
            newOrder.setConfigurationDetails(oldOrder.getConfigurationDetails());

            return orderRepository.save(newOrder);
        }

        throw new IllegalArgumentException("Order with ID " + orderId + " not found.");
    }
}