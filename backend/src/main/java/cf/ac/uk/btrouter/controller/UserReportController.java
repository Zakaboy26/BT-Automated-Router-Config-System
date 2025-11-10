package cf.ac.uk.btrouter.controller;

import cf.ac.uk.btrouter.model.UserReport;
import cf.ac.uk.btrouter.repository.UserReportRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/user-reports")
@CrossOrigin
public class UserReportController {

    private final UserReportRepository userReportRepository;

    public UserReportController(UserReportRepository userReportRepository) {
        this.userReportRepository = userReportRepository;
    }

    @PostMapping
    public ResponseEntity<?> submitReport(@RequestBody UserReport report) {
        // Validation
        if (report.getIssueType() == null || report.getReferenceNumber() == null ||
            report.getEmail() == null || report.getDate() == null || report.getExplanation() == null) {
            return ResponseEntity.badRequest().body(Map.of("error", "All fields are required"));
        }

        userReportRepository.save(report);
        return ResponseEntity.ok(Map.of("message", "Report submitted successfully"));
    }
}
