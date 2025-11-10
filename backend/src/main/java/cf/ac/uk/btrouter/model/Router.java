package cf.ac.uk.btrouter.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.util.Arrays;
import java.util.List;

@Data
@Entity
@Table(name = "routers")
@NoArgsConstructor
@AllArgsConstructor
public class Router {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "router_id")
    private Long routerID;

    @NotBlank(message = "Router name is required.")
    @Size(min = 2, max = 255, message = "Router name must be between 2 and 255 characters.")
    @Column(name = "router_name", nullable = false, unique = true)
    private String routerName;

    // Stores outside connection types as a comma-separated string.
    @NotBlank(message = "At least one outside connection type is required.")
    @Column(name = "outside_connection_types", nullable = false)
    private String outsideConnectionTypes;

    // Stores inside connection types as a comma-separated string.
    @NotBlank(message = "At least one inside connection type is required.")
    @Column(name = "inside_connection_types", nullable = false)
    private String insideConnectionTypes;

    @Min(value = 1, message = "Ethernet ports must be at least 1 if Ethernet is selected.")
    @Column(name = "ethernet_max_ports")
    private Short ethernetPorts;

    @Min(value = 1, message = "Serial ports must be at least 1 if Serial is selected.")
    @Column(name = "serial_max_ports")
    private Short serialPorts;

    /* Validation Logic. */
    @PrePersist
    @PreUpdate
    private void validateRouter() {
        // Logic for port validation.
        List<String> insideConnections = Arrays.asList(insideConnectionTypes.split(",\\s*"));

        if (!insideConnections.contains("ETHERNET")) {
            ethernetPorts = null;
        } else if (ethernetPorts == null || ethernetPorts < 1) {
            throw new IllegalArgumentException("Ethernet ports must be specified.");
        }

        if (!insideConnections.contains("SERIAL")) {
            serialPorts = null;
        } else if (serialPorts == null || serialPorts < 1) {
            throw new IllegalArgumentException("Serial ports must be specified.");
        }
    }

    /* Helper Methods. */
    // Will convert the comma-separated values into a list if needed.
    public List<String> getOutsideConnectionTypesList() { return outsideConnectionTypes != null ? Arrays.asList(outsideConnectionTypes.split(",\\s*")) : List.of(); }
    public List<String> getInsideConnectionTypesList() { return insideConnectionTypes != null ? Arrays.asList(insideConnectionTypes.split(",\\s*")) : List.of(); }

    // Will convert the list back to comma-separated string if needed.
    public void setOutsideConnectionTypes(List<String> types) { this.outsideConnectionTypes = String.join(", ", types); }
    public void setInsideConnectionTypes(List<String> types) { this.insideConnectionTypes = String.join(", ", types); }

}
