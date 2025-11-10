package cf.ac.uk.btrouter.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Data
@Entity
@Table(name = "connection_types")
@NoArgsConstructor
@AllArgsConstructor
public class ConnectionType {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "connection_id")
    private Long connectionID;

    @Column(name = "connection_name", unique = true, nullable = false)
    private String connectionName;

    @Column(name = "connection_type", nullable = false)
    private String connectionType;
}