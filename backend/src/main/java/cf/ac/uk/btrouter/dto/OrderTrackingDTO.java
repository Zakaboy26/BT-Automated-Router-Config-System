package cf.ac.uk.btrouter.dto;

import java.time.LocalDateTime;
import lombok.Data;
import lombok.Builder;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import jakarta.validation.constraints.*;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class OrderTrackingDTO {
    @NotBlank(message = "Reference number is required")
    @Size(max = 50, message = "Reference number must not exceed 50 characters")
    private String referenceNumber;

    @NotBlank(message = "Status is required")
    @Size(max = 50, message = "Status must not exceed 50 characters")
    private String status;

    private boolean canModify;
    private boolean canCancel;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    @Size(max = 100, message = "Router name must not exceed 100 characters")
    private String routerName;

    @Size(max = 100, message = "Customer name must not exceed 100 characters")
    private String customerName;

    @Min(value = 1, message = "Number of routers must be at least 1")
    private Integer numRouters;

    @Size(max = 100, message = "Site name must not exceed 100 characters")
    private String siteName;

    @Size(max = 200, message = "Site address must not exceed 200 characters")
    private String siteAddress;

    @Size(max = 20, message = "Site postcode must not exceed 20 characters")
    private String sitePostcode;

    @Email(message = "Please provide a valid email address")
    @Size(max = 100, message = "Email must not exceed 100 characters")
    private String sitePrimaryEmail;

    @Pattern(regexp = "^[0-9\\s+()-]+$", message = "Please provide a valid phone number")
    @Size(max = 20, message = "Phone number must not exceed 20 characters")
    private String sitePhoneNumber;

    @Size(max = 100, message = "Contact name must not exceed 100 characters")
    private String siteContactName;

    @Size(max = 50, message = "Priority level must not exceed 50 characters")
    private String priorityLevel;

    @Size(max = 50, message = "VLAN type must not exceed 50 characters")
    private String vlanType;

    @Size(max = 200, message = "Inside connections must not exceed 200 characters")
    private String insideConnections;

    @Size(max = 500, message = "Additional information must not exceed 500 characters")
    private String additionalInformation;
}
