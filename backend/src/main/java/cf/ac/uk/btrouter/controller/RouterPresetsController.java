package cf.ac.uk.btrouter.controller;

import cf.ac.uk.btrouter.model.RouterPreset;
import cf.ac.uk.btrouter.service.RouterPresetService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/router-presets")
@CrossOrigin(origins = "*")
public class RouterPresetsController {

    private final RouterPresetService routerPresetService;

    public RouterPresetsController(RouterPresetService routerPresetService) {
        this.routerPresetService = routerPresetService;
    }

    /* CRUD Operations. */
    // Get all router presets.
    @GetMapping
    public ResponseEntity<List<RouterPreset>> getAllRouterPresets() {
        List<RouterPreset> routerPresets = routerPresetService.getAllRouterPresets();
        return ResponseEntity.ok(routerPresets);
    }

    // Get a single router preset by ID.
    @GetMapping("/{routerPresetID}")
    public ResponseEntity<RouterPreset> getRouterPresetById(@PathVariable Long routerPresetID) {
        Optional<RouterPreset> routerPreset = routerPresetService.getRouterPresetById(routerPresetID);
        return routerPreset.map(ResponseEntity::ok)
            .orElseGet(() -> ResponseEntity.notFound().build());
    }

    // Create or update a router preset.
    @PostMapping
    public ResponseEntity<RouterPreset> saveRouterPreset(@RequestBody RouterPreset routerPreset) {
        RouterPreset savedRouterPreset = routerPresetService.saveRouterPreset(routerPreset);
        return ResponseEntity.ok(savedRouterPreset);
    }

    // Delete a router preset by ID.
    @DeleteMapping("/{routerPresetID}")
    public ResponseEntity<Void> deleteRouterPreset(@PathVariable Long routerPresetID) {
        routerPresetService.deleteRouterPreset(routerPresetID);
        return ResponseEntity.noContent().build();
    }

    /* Custom Operations. */
    // Get all router presets by customer ID.
    @GetMapping("/customer/{customerId}")
    public ResponseEntity<List<RouterPreset>> getPresetsForCustomer(@PathVariable Long customerId) {
        List<RouterPreset> routerPresets = routerPresetService.getRouterPresetsByCustomerId(customerId);
        return ResponseEntity.ok(routerPresets);
    }

}
