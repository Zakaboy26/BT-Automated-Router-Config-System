package cf.ac.uk.btrouter.repository;

import java.util.List;
import cf.ac.uk.btrouter.model.RouterPreset;
import org.springframework.data.jpa.repository.JpaRepository;

public interface RouterPresetRepository extends JpaRepository<RouterPreset, Long> {
    List<RouterPreset> findByCustomer_CustomerID(Long customerId);
}
