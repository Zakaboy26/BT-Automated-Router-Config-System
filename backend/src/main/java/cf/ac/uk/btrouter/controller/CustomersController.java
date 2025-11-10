package cf.ac.uk.btrouter.controller;

import cf.ac.uk.btrouter.model.Customer;
import cf.ac.uk.btrouter.service.CustomerService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/customers")
@CrossOrigin(origins = "*")
public class CustomersController {

    private final CustomerService customerService;

    public CustomersController(CustomerService customerService) {
        this.customerService = customerService;
    }

    /* CRUD Operations. */
    // Get all customers.
    @GetMapping
    public ResponseEntity<List<Customer>> getAllCustomers() {
        List<Customer> customers = customerService.getAllCustomers();
        return ResponseEntity.ok(customers);
    }

    // Get a single customer by ID.
    @GetMapping("/{customerID}")
    public ResponseEntity<Customer> getCustomerById(@PathVariable Long customerID) {
        Optional<Customer> customer = customerService.getCustomerById(customerID);
        return customer.map(ResponseEntity::ok)
            .orElseGet(() -> ResponseEntity.notFound().build());
    }

    // Create or update a customer.
    @PostMapping
    public ResponseEntity<Customer> saveCustomer(@RequestBody Customer customer) {
        Customer savedCustomer = customerService.saveCustomer(customer);
        return ResponseEntity.ok(savedCustomer);
    }

    // Delete a customer by ID.
    @DeleteMapping("/{customerID}")
    public ResponseEntity<Void> deleteCustomer(@PathVariable Long customerID) {
        customerService.deleteCustomer(customerID);
        return ResponseEntity.noContent().build();
    }
}
