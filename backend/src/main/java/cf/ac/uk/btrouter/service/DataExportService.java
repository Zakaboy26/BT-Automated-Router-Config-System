package cf.ac.uk.btrouter.service;

import cf.ac.uk.btrouter.model.Order;
import cf.ac.uk.btrouter.model.User;
import cf.ac.uk.btrouter.repository.OrderRepository;
import cf.ac.uk.btrouter.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.io.PrintWriter;
import java.util.List;

@Service
public class DataExportService {

    private final UserRepository userRepository;
    private final OrderRepository orderRepository;

    @Autowired
    public DataExportService(UserRepository userRepository, OrderRepository orderRepository) {
        this.userRepository = userRepository;
        this.orderRepository = orderRepository;
    }

    public void exportUserData(String email, PrintWriter writer) {
        // Export user profile
        User user = userRepository.findByEmail(email)
            .orElseThrow(() -> new RuntimeException("User not found"));

        writer.println("=== USER DETAILS ===");
        writer.println("Email,First Name,Last Name,Phone Number,Business Type,VAT Number,Billing Address,Two Factor Auth,Marketing Emails,Order Updates,Billing Notifications");
        writer.printf("\"%s\",\"%s\",\"%s\",\"%s\",\"%s\",\"%s\",\"%s\",%s,%s,%s,%s\n\n",
            user.getEmail(),
            user.getFirstName(),
            user.getLastName(),
            user.getPhoneNumber(),
            user.getBusinessType(),
            user.getVatNumber(),
            user.getBillingAddress(),
            user.isTwoFactorAuth(),
            user.isMarketingEmails(),
            user.isOrderUpdates(),
            user.isBillingNotifications()
        );

        // Export orders
        List<Order> orders = orderRepository.findOrdersByEmail(email);

        writer.println("=== ORDER HISTORY ===");
        writer.println("Reference Number,Router Model,Customer Name,Num Routers,Site Name,Site Address,Postcode,Primary Email,Secondary Email,Phone,Contact Name,Priority Level,Order Date");

        for (Order order : orders) {
            writer.printf("\"%s\",\"%s\",\"%s\",%d,\"%s\",\"%s\",\"%s\",\"%s\",\"%s\",\"%s\",\"%s\",\"%s\",\"%s\"\n",
                order.getReferenceNumber(),
                order.getRouterModel(),
                order.getCustomer().getCustomerName(),
                order.getNumberOfRouters(),
                order.getSiteName(),
                order.getAddress(),
                order.getPostcode(),
                order.getEmail(),
                order.getSiteSecondaryEmail(),
                order.getSitePhoneNumber(),
                order.getSiteContactName(),
                order.getPriorityLevel(),
                order.getOrderDate()
            );
        }
    }
}
