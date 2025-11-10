package cf.ac.uk.btrouter.service;

import cf.ac.uk.btrouter.model.NewsNotification;
import cf.ac.uk.btrouter.repository.NewsNotificationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class NewsNotificationService {

    @Autowired
    private NewsNotificationRepository repository;

    public void createNotificationsForAllUsers(Long newsId, List<String> userEmails) {
        for (String email : userEmails) {
            NewsNotification notif = NewsNotification.builder()
                    .newsId(newsId)
                    .userEmail(email)
                    .read(false)
                    .timestamp(LocalDateTime.now())
                    .build();
            repository.save(notif);
        }
    }

    public List<NewsNotification> getUnreadNotifications(String email) {
        return repository.findByUserEmailAndReadFalse(email);
    }

    public void markAllAsRead(String email) {
        List<NewsNotification> notifs = repository.findByUserEmailAndReadFalse(email);
        for (NewsNotification n : notifs) {
            n.setRead(true);
        }
        repository.saveAll(notifs);
    }
}
