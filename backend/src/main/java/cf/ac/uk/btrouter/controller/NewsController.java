package cf.ac.uk.btrouter.controller;

import cf.ac.uk.btrouter.model.News;
import cf.ac.uk.btrouter.service.NewsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/news")
@CrossOrigin(origins = "*")
public class NewsController {

    @Autowired
    private NewsService newsService;

    @PostMapping(consumes = {"multipart/form-data"})
    public ResponseEntity<?> createPost(
            @RequestParam("title") String title,
            @RequestParam("description") String description,
            @RequestParam(value = "author", defaultValue = "Admin") String author,
            @RequestParam(value = "image", required = false) MultipartFile image
    ) {
        try {
            News news = newsService.createPost(title, description, author, image);
            return ResponseEntity.ok(news);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(500).body("❌ Failed to create news post.");
        }
    }

    @GetMapping
    public ResponseEntity<List<News>> getAllPosts() {
        return ResponseEntity.ok(newsService.getAllPosts());
    }
}
