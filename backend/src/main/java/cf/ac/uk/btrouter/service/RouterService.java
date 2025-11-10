package cf.ac.uk.btrouter.service;

import cf.ac.uk.btrouter.model.Router;
import cf.ac.uk.btrouter.repository.RouterRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class RouterService {
    private final RouterRepository routerRepository;

    /* CRUD Operations. */
    public RouterService(RouterRepository routerRepository) { this.routerRepository = routerRepository; }
    public List<Router> getAllRouters() { return routerRepository.findAll(); }
    public Optional<Router> getRouterById(Long routerID) { return routerRepository.findById(routerID); }
    public Router saveRouter(Router router) { return routerRepository.save(router); }
    public void deleteRouter(Long routerID) { routerRepository.deleteById(routerID); }
}
