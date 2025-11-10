package cf.ac.uk.btrouter.repository;

import cf.ac.uk.btrouter.model.NewsNotification;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface NewsNotificationRepository extends JpaRepository<NewsNotification, Long> {
    List<NewsNotification> findByUserEmailAndReadFalse(String userEmail);
    List<NewsNotification> findByUserEmail(String userEmail);
}
