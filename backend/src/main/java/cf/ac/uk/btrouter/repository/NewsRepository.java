package cf.ac.uk.btrouter.repository;

import cf.ac.uk.btrouter.model.News;
import org.springframework.data.jpa.repository.JpaRepository;

public interface NewsRepository extends JpaRepository<News, Long> {
}