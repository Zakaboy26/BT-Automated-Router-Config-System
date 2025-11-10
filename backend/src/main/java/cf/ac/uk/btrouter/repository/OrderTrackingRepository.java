package cf.ac.uk.btrouter.repository;

import cf.ac.uk.btrouter.model.OrderTracking;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface OrderTrackingRepository extends JpaRepository<OrderTracking, Integer> {

    // Find order tracking by reference number
    Optional<OrderTracking> findByReferenceNumber(String referenceNumber);

    // Find order tracking by order id
    Optional<OrderTracking> findByOrderRouterOrderID(Long routerOrderID);
}
