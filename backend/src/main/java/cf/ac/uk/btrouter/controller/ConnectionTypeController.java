package cf.ac.uk.btrouter.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import cf.ac.uk.btrouter.model.ConnectionType;
import cf.ac.uk.btrouter.service.ConnectionTypeService;

@RestController
@RequestMapping("/api/connection-types")
@CrossOrigin(origins = "*")
public class ConnectionTypeController {

    private final ConnectionTypeService connectionTypeService;
    public ConnectionTypeController(ConnectionTypeService connectionTypeService) { this.connectionTypeService = connectionTypeService; }

    @GetMapping
    public List<ConnectionType> getAllConnectionTypes(@RequestParam(required = false) String connectionType) {
        List<ConnectionType> result = (connectionType != null)
            ? connectionTypeService.getAllConnectionTypesByType(connectionType)
            : connectionTypeService.getAllConnectionTypes();
        result.sort((a, b) -> a.getConnectionName().compareToIgnoreCase(b.getConnectionName()));
        return result;
    }

    @PostMapping
    public ResponseEntity<ConnectionType> addConnectionType(@RequestBody ConnectionType connectionType) {
        if (connectionType.getConnectionName() == null || connectionType.getConnectionName().isBlank() || connectionType.getConnectionType() == null) {
            return ResponseEntity.badRequest().build();
        }
        if (connectionTypeService.getConnectionTypeByName(connectionType.getConnectionName()).isPresent()) {
            return ResponseEntity.status(HttpStatus.CONFLICT).build();
        }
        return ResponseEntity.ok(connectionTypeService.saveConnectionType(connectionType));
    }

    @DeleteMapping("/{connectionID}")
    public ResponseEntity<Void> deleteConnectionType(@PathVariable Long connectionID) {
        connectionTypeService.deleteConnectionType(connectionID);
        return ResponseEntity.noContent().build();
    }
}
