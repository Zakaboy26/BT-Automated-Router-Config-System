package cf.ac.uk.btrouter.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class OrderRequest {
    private Long routerId;
    private Long customerId;
    private Long routerPresetId;
    private String primaryOutsideConnections;
    private String secondaryOutsideConnections;
    private String insideConnections;
    private String vlans;
    private Boolean dhcpConfiguration;
    private Integer numRouters;
    private String siteName;
    private String siteAddress;
    private String sitePostcode;
    private String sitePrimaryEmail;
    private String siteSecondaryEmail;
    private String sitePhoneNumber;
    private String siteContactName;
    private String priorityLevel;
    private String additionalInformation;
    private Boolean addAnotherRouter;
}
