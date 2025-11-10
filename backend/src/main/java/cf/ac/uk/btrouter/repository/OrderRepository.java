package cf.ac.uk.btrouter.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import cf.ac.uk.btrouter.model.Order;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface OrderRepository extends JpaRepository<Order, Long> {

    // Fetch orders only for the logged-in user, sorted by order date
    @Query("SELECT o FROM Order o WHERE o.sitePrimaryEmail = :email ORDER BY o.orderDate DESC")
    List<Order> findOrdersByEmail(@Param("email") String email);

    @Query("SELECT o FROM Order o WHERE o.routerOrderID = :orderId AND o.sitePrimaryEmail = :email")
    Order findOrderByIdAndEmail(@Param("orderId") Long orderId, @Param("email") String email);

    // Fetch orders by status (e.g., Pending, Approved, Denied)
    @Query("SELECT o FROM Order o WHERE o.status = :status ORDER BY o.orderDate DESC")
    List<Order> findByStatus(@Param("status") String status);

    // Fetch order by reference number
    @Query("SELECT o FROM Order o WHERE o.referenceNumber = :referenceNumber")
    Order findByReferenceNumber(@Param("referenceNumber") String referenceNumber);

    @Query("SELECT DISTINCT o.sitePrimaryEmail FROM Order o")
    List<String> findDistinctBySitePrimaryEmail();
}