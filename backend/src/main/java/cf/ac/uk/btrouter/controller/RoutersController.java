package cf.ac.uk.btrouter.controller;

import cf.ac.uk.btrouter.model.Router;
import cf.ac.uk.btrouter.service.RouterService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/routers")
@CrossOrigin(origins = "*")
public class RoutersController {

    private final RouterService routerService;

    public RoutersController(RouterService routerService) {
        this.routerService = routerService;
    }

    /* CRUD Operations. */
    // Get all routers.
    @GetMapping
    public ResponseEntity<List<Router>> getAllRouters() {
        List<Router> routers = routerService.getAllRouters();
        return ResponseEntity.ok(routers);
    }

    // Get a single router by ID.
    @GetMapping("/{routerID}")
    public ResponseEntity<Router> getRouterById(@PathVariable Long routerID) {
        Optional<Router> router = routerService.getRouterById(routerID);
        return router.map(ResponseEntity::ok)
            .orElseGet(() -> ResponseEntity.notFound().build());
    }

    // Create or update a router.
    @PostMapping
    public ResponseEntity<Router> saveRouter(@RequestBody Router router) {
        Router savedRouter = routerService.saveRouter(router);
        return ResponseEntity.ok(savedRouter);
    }

    // Delete a router by ID.
    @DeleteMapping("/{routerID}")
    public ResponseEntity<Void> deleteRouter(@PathVariable Long routerID) {
        routerService.deleteRouter(routerID);
        return ResponseEntity.noContent().build();
    }
}
