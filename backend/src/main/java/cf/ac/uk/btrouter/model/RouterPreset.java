package cf.ac.uk.btrouter.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Data
@Entity
@Table(name = "router_presets")
@NoArgsConstructor
@AllArgsConstructor
public class RouterPreset {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "router_preset_id")
    private Long routerPresetID;

    @ManyToOne(optional = false)
    @JoinColumn(name = "router_id", nullable = false)
    private Router router;

    @ManyToOne
    @JoinColumn(name = "customer_id")
    private Customer customer;

    @NotBlank(message = "Router preset name is required.")
    @Size(min = 3, max = 255)
    @Column(name = "router_preset_name", nullable = false)
    private String routerPresetName;

    @NotBlank(message = "Primary outside connection is required.")
    @Column(name = "primary_outside_connections", nullable = false)
    private String primaryOutsideConnections;

    @Column(name = "secondary_outside_connections")
    private String secondaryOutsideConnections;

    @NotNull(message = "Inside connection type is required.")
    @Column(name = "inside_connections", nullable = false)
    private String insideConnections;

    @Min(value = 0, message = "Number of ethernet ports cannot be negative.")
    @Column(name = "number_of_ethernet_ports")
    private Short numberOfEthernetPorts;

    @Min(value = 0, message = "Number of serial ports cannot be negative.")
    @Column(name = "number_of_serial_ports")
    private Short numberOfSerialPorts;

    @NotNull(message = "VLAN type must be specified.")
    @Enumerated(EnumType.STRING)
    @Column(name = "vlans", nullable = false)
    private VlanType vlans;

    @Column(name = "dhcp")
    private Boolean dhcp;

    @Column(name = "additional_information", length = 500)
    private String additionalInformation;

    /* Validation Logic. */
    @PrePersist
    @PreUpdate
    private void validatePreset() {
        // Logic for VLANs validation.
        if (insideConnections.equals("SERIAL") && vlans != VlanType.UNSPECIFIED) {
            throw new IllegalArgumentException("Serial-only presets must have VLANs set to 'Unspecified'.");
        }

        // Logic for DHCP validation.
        if (vlans != VlanType.OPEN_TRUNK && Boolean.TRUE.equals(dhcp)) {
            throw new IllegalArgumentException("DHCP can only be true when VLANs is 'Open Trunk'.");
        }
    }

    /* Enumeration Declarations. */
    public enum VlanType {
        UNSPECIFIED,
        SPECIFIED,
        OPEN_TRUNK
    }
}
