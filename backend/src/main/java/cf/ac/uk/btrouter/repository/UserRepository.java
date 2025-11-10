package cf.ac.uk.btrouter.repository;

import cf.ac.uk.btrouter.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    // Find user by email
    Optional<User> findByEmail(String email);

    // Find user by reset token
    Optional<User> findByResetToken(String token);

    // Delete user
    void deleteByEmail(String email);

}