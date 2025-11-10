package cf.ac.uk.btrouter.service;

import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import cf.ac.uk.btrouter.model.ConnectionType;
import cf.ac.uk.btrouter.repository.ConnectionTypeRepository;

@Service
public class ConnectionTypeService {
    private final ConnectionTypeRepository connectionTypeRepository;

    /* CRUD Operations. */
    public ConnectionTypeService(ConnectionTypeRepository connectionTypeRepository) { this.connectionTypeRepository = connectionTypeRepository; }
    public List<ConnectionType> getAllConnectionTypes() { return connectionTypeRepository.findAll(); }
    public Optional<ConnectionType> getConnectionTypeByName(String connectionName) { return connectionTypeRepository.findByConnectionName(connectionName); }
    public ConnectionType saveConnectionType(ConnectionType connectionType) { return connectionTypeRepository.save(connectionType); }
    public void deleteConnectionType(Long connectionID) { connectionTypeRepository.deleteById(connectionID); }

    /* Custom Operations. */
    public List<ConnectionType> getAllConnectionTypesByType(String connectionType) { return connectionTypeRepository.findByConnectionType(connectionType); }
}
