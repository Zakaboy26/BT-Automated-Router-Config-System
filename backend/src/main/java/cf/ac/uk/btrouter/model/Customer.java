package cf.ac.uk.btrouter.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Data
@Entity
@Table(name = "customers")
@NoArgsConstructor
@AllArgsConstructor
public class Customer {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "customer_id")
    private Long customerID;

    @NotBlank(message = "Customer name is required.")
    @Size(min = 2, max = 255, message = "Customer name must be between 2 and 255 characters.")
    @Column(name = "customer_name", nullable = false, unique = true)
    private String customerName;

}