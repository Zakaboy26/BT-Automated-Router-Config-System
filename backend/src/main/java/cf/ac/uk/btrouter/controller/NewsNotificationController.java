package cf.ac.uk.btrouter.controller;

import cf.ac.uk.btrouter.model.NewsNotification;
import cf.ac.uk.btrouter.service.NewsNotificationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/notifications")
@CrossOrigin(origins = "*")
public class NewsNotificationController {

    @Autowired
    private NewsNotificationService service;

    @GetMapping("/{email}")
    public ResponseEntity<List<NewsNotification>> getUnread(@PathVariable String email) {
        return ResponseEntity.ok(service.getUnreadNotifications(email));
    }

    @PostMapping("/mark-read/{email}")
    public ResponseEntity<?> markAllRead(@PathVariable String email) {
        service.markAllAsRead(email);
        return ResponseEntity.ok("Marked as read");
    }
}
