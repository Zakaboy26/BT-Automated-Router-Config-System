package cf.ac.uk.btrouter.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;
import java.util.UUID;

@Entity
@Getter
@Setter
@Table(name = "user_reports")
public class UserReport {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String reportReference;  // unique ref

    private String issueType;

    private String referenceNumber;  // router order ref

    private String email;

    private LocalDate date;

    @Column(length = 2000)
    private String explanation;

    private String status = "pending"; // default status

    @PrePersist
    public void init() {
        if (this.reportReference == null || this.reportReference.isEmpty()) {
            this.reportReference = UUID.randomUUID().toString();
        }
        if (this.status == null || this.status.isEmpty()) {
            this.status = "pending";
        }
    }
}
