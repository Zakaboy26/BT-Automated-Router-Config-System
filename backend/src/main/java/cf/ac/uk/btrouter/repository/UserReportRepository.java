package cf.ac.uk.btrouter.repository;

import cf.ac.uk.btrouter.model.UserReport;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UserReportRepository extends JpaRepository<UserReport, Long> {
    Optional<UserReport> findByReportReference(String reportReference);
}
