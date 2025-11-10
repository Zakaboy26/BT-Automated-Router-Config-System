package cf.ac.uk.btrouter.repository;

import cf.ac.uk.btrouter.model.Customer;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CustomerRepository extends JpaRepository<Customer, Long> {
}
