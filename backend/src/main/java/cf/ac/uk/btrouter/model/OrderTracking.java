package cf.ac.uk.btrouter.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import jakarta.validation.constraints.*;
import java.time.LocalDateTime;

@Entity
@Getter
@Setter
@Table(name = "order_tracking", 
       indexes = @Index(name = "idx_order_tracking_router_order_id", 
                       columnList = "router_order_id"))
public class OrderTracking {

    // Primary key for order tracking
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    // Reference to the original order
    @Column(name = "router_order_id", nullable = false)
    private Long routerOrderID;

    // Unique reference number for customer tracking
    @Column(name = "reference_number", unique = true, nullable = false)
    @NotBlank(message = "Reference number is required")
    @Size(max = 50, message = "Reference number must not exceed 50 characters")
    private String referenceNumber;

    // Current status of the order
    @Column(nullable = false)
    @NotBlank(message = "Status is required")
    @Size(max = 50, message = "Status must not exceed 50 characters")
    private String status;

    // Flags for order modification permissions
    @Column(name = "can_modify")
    private boolean canModify;

    @Column(name = "can_cancel")
    private boolean canCancel;

    // Timestamps for tracking history
    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    // Relationship with the Order entity
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "router_order_id", referencedColumnName = "router_order_id", insertable = false, updatable = false)
    private Order order;

    // Lifecycle hooks for timestamp management
    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}