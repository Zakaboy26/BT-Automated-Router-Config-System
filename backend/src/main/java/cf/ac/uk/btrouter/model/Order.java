package cf.ac.uk.btrouter.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Getter
@Setter
@Table(name = "router_orders")
public class Order {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "router_order_id")
    private Long routerOrderID;

    @ManyToOne
    @JoinColumn(name = "customer_id", nullable = false)
    private Customer customer;

    @ManyToOne
    @JoinColumn(name = "router_id", nullable = false)
    private Router router;

    @ManyToOne
    @JoinColumn(name = "router_preset_id")
    private RouterPreset routerPreset;

    private String referenceNumber;
    private String primaryOutsideConnections;
    private String secondaryOutsideConnections;
    private String insideConnections;

    @NotNull(message = "VLAN type must be specified.")
    @Enumerated(EnumType.STRING)
    @Column(name = "vlans", nullable = false)
    private RouterPreset.VlanType vlans;

    private Boolean dhcp;

    @Column(name = "num_routers", nullable = false)
    private Integer numRouters;

    private String siteName;
    private String siteAddress;
    private String sitePostcode;
    private String sitePrimaryEmail;
    private String siteSecondaryEmail;
    private String sitePhoneNumber;
    private String siteContactName;
    private String priorityLevel;
    private Boolean addAnotherRouter;

    @Column(length = 500)
    private String additionalInformation;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime orderDate;
    private String status;

    private String ipAddress;
    private String configurationDetails;

    @PrePersist
    public void setDefaultValues() {
        if (referenceNumber == null || referenceNumber.isEmpty()) {
            referenceNumber = "BT-" + UUID.randomUUID().toString().replaceAll("-", "").substring(0, 8).toUpperCase();
        }
        if (orderDate == null) {
            orderDate = LocalDateTime.now();
        }
        if (status == null || status.isEmpty()) {
            status = "Pending";
        }
        if (numRouters == null || numRouters <= 0) {
            numRouters = 1;
        }
    }

    public String getEmail() {
        return sitePrimaryEmail;
    }
    public void setEmail(String email) {
        this.sitePrimaryEmail = email;
    }

    public String getRouterModel() {
        return router.getRouterName();
    }

    public String getConfigurationDetails() {
        if (configurationDetails != null && !configurationDetails.isEmpty()) {
            return configurationDetails;
        } else {
            return "VLAN Config: " + vlans;
        }
    }
    public void setConfigurationDetails(String configurationDetails) {
        this.configurationDetails = configurationDetails;
    }

    public int getNumberOfRouters() {
        return numRouters;
    }
    public void setNumberOfRouters(int numberOfRouters) {
        this.numRouters = numberOfRouters;
    }

    public String getAddress() {
        return siteAddress;
    }
    public void setAddress(String address) {
        this.siteAddress = address;
    }

    public String getPostcode() {
        return sitePostcode;
    }
    public void setPostcode(String postcode) {
        this.sitePostcode = postcode;
    }

    public String getSitePhoneNumber() { return sitePhoneNumber; }
    public void setPhoneNumber(String phoneNumber) {
        this.sitePhoneNumber = phoneNumber;
    }

    public LocalDateTime getOrderDate() {
        return orderDate;
    }
    public void setOrderDate(LocalDateTime orderDate) {
        this.orderDate = orderDate;
    }
}
