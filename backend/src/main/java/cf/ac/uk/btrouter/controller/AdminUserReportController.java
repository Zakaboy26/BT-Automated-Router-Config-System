package cf.ac.uk.btrouter.controller;

import cf.ac.uk.btrouter.model.UserReport;
import cf.ac.uk.btrouter.repository.UserReportRepository;
import cf.ac.uk.btrouter.service.NewsService; // 🔁 Inject the news service
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/admin/user-reports")
@CrossOrigin
public class AdminUserReportController {

    private final UserReportRepository userReportRepository;

    @Autowired
    private NewsService newsService; // ✅ Autowire news service

    public AdminUserReportController(UserReportRepository userReportRepository) {
        this.userReportRepository = userReportRepository;
    }

    // 📄 Get all reports
    @GetMapping
    public ResponseEntity<List<UserReport>> getAllReports() {
        return ResponseEntity.ok(userReportRepository.findAll());
    }

    // 📄 Get specific report by reference
    @GetMapping("/{reportReference}")
    public ResponseEntity<?> getReportByReference(@PathVariable String reportReference) {
        return userReportRepository.findByReportReference(reportReference)
                .<ResponseEntity<?>>map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.status(404).body(Map.of("error", "Report not found")));
    }

    // ✅ Update status of a report and push a news update
    @PutMapping("/{reportReference}/status")
    public ResponseEntity<?> updateReportStatus(
            @PathVariable String reportReference,
            @RequestBody Map<String, String> body) {

        String newStatus = body.get("status");

        Optional<UserReport> optionalReport = userReportRepository.findByReportReference(reportReference);
        if (optionalReport.isEmpty()) {
            return ResponseEntity.status(404).body(Map.of("error", "Report not found"));
        }

        UserReport report = optionalReport.get();
        report.setStatus(newStatus);
        userReportRepository.save(report);

        // ✅ Create news entry for the user
        String title = "Update on Your Report: " + reportReference;
        String content = "Your report status has been updated to **" + newStatus.toUpperCase() + "**.";
        newsService.createNews(title, content);

        return ResponseEntity.ok(Map.of("message", "Status updated to " + newStatus));
    }
}
