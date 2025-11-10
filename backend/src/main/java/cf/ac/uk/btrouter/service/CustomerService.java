package cf.ac.uk.btrouter.service;

import cf.ac.uk.btrouter.model.Customer;
import cf.ac.uk.btrouter.repository.CustomerRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class CustomerService {
    private final CustomerRepository customerRepository;

    /* CRUD Operations. */
    public CustomerService(CustomerRepository customerRepository) {
        this.customerRepository = customerRepository;
    }
    public List<Customer> getAllCustomers() {
        return customerRepository.findAll();
    }
    public Optional<Customer> getCustomerById(Long customerID) {
        return customerRepository.findById(customerID);
    }
    public Customer saveCustomer(Customer customer) {
        return customerRepository.save(customer);
    }
    public void deleteCustomer(Long customerID) {
        customerRepository.deleteById(customerID);
    }
}
