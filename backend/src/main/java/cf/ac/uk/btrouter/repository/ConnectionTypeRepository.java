package cf.ac.uk.btrouter.repository;

import java.util.List;
import java.util.Optional;
import cf.ac.uk.btrouter.model.ConnectionType;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ConnectionTypeRepository extends JpaRepository<ConnectionType, Long> {
    Optional<ConnectionType> findByConnectionName(String connectionName);
    List<ConnectionType> findByConnectionType(String connectionType);
}
