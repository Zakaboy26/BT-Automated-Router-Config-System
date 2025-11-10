package cf.ac.uk.btrouter.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.util.Map;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*")  // Allows requests from any origin
public class HomeController {

    // Admin-only dashboard access
    @GetMapping("/admin/dashboard")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> adminDashboard() {
        return ResponseEntity.ok(Map.of(
                "message", "Admin Dashboard",
                "access", "full"
        ));
    }

    // Support dashboard for admins and support agents
    @GetMapping("/support/dashboard")
    @PreAuthorize("hasAnyRole('ADMIN', 'SUPPORT_AGENT')")
    public ResponseEntity<?> supportDashboard() {
        return ResponseEntity.ok(Map.of(
                "message", "Support Dashboard",
                "access", "limited"
        ));
    }

    // Basic dashboard accessible by all authenticated users
    @GetMapping("/user/dashboard")
    @PreAuthorize("hasAnyRole('ADMIN', 'SUPPORT_AGENT', 'USER')")
    public ResponseEntity<?> userDashboard() {
        return ResponseEntity.ok(Map.of(
                "message", "User Dashboard",
                "access", "basic"
        ));
    }


    // Admin-only router management endpoint
    @GetMapping("/admin/routers")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> manageRouters() {
        return ResponseEntity.ok(Map.of("message", "Router Management"));
    }

    // Admin-only router management endpoint
    @GetMapping("/admin/customers")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> manageCustomers() {
        return ResponseEntity.ok(Map.of("message", "Customer Management"));
    }

    // Router request endpoint for all authenticated users
    @GetMapping("/user/router-requests")
    @PreAuthorize("hasAnyRole('ADMIN', 'SUPPORT_AGENT', 'USER')")
    public ResponseEntity<?> routerRequest() {
        return ResponseEntity.ok(Map.of("message", "Router Request Form"));
    }

    // Router request endpoint for all authenticated users
    @GetMapping("/user/order-history")
    @PreAuthorize("hasAnyRole('ADMIN', 'SUPPORT_AGENT', 'USER')")
    public ResponseEntity<?> orderHistory() {
        return ResponseEntity.ok(Map.of("message", "Order History"));
    }
}
