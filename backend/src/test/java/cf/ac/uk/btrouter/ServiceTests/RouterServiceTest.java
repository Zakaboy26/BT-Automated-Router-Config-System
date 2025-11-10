package cf.ac.uk.btrouter.ServiceTests;

import cf.ac.uk.btrouter.model.Router;
import cf.ac.uk.btrouter.repository.RouterRepository;
import cf.ac.uk.btrouter.service.RouterService;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class RouterServiceTest {

    @Mock
    private RouterRepository routerRepository;

    @InjectMocks
    private RouterService routerService;

    @Test
    void getAllRouters_ReturnsAllRouters() {
        // Setup.
        Router router1 = new Router();
        router1.setRouterName("Router A");
        Router router2 = new Router();
        router2.setRouterName("Router B");
        when(routerRepository.findAll()).thenReturn(List.of(router1, router2));

        // Test.
        List<Router> result = routerService.getAllRouters();

        // Verify.
        assertEquals(2, result.size());
        assertEquals("Router A", result.get(0).getRouterName());
    }

    @Test
    void getRouterById_Exists_ReturnsRouter() {
        Router router = new Router();
        router.setRouterID(1L);
        when(routerRepository.findById(1L)).thenReturn(Optional.of(router));

        Optional<Router> result = routerService.getRouterById(1L);
        assertTrue(result.isPresent());
        assertEquals(1L, result.get().getRouterID());
    }

    @Test
    void saveRouter_ValidData_ReturnsSavedRouter() {
        Router newRouter = new Router();
        newRouter.setRouterName("Valid Router");
        when(routerRepository.save(newRouter)).thenReturn(newRouter);

        Router result = routerService.saveRouter(newRouter);
        assertNotNull(result);
        assertEquals("Valid Router", result.getRouterName());
    }

    @Test
    void deleteRouter_ValidId_DeletesSuccessfully() {
        routerService.deleteRouter(1L);
        verify(routerRepository, times(1)).deleteById(1L);
    }
}