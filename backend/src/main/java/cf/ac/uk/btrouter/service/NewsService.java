package cf.ac.uk.btrouter.service;

import cf.ac.uk.btrouter.model.News;
import cf.ac.uk.btrouter.repository.NewsRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.*;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
public class NewsService {

    @Autowired
    private NewsRepository newsRepository;

    private final String UPLOAD_DIR = "uploads/news-images/";

    // ✅ Overloaded version for legacy calls without image
    public News createPost(String title, String description, String author) {
        try {
            return createPost(title, description, author, null);
        } catch (IOException e) {
            throw new RuntimeException("Failed to create news post without image", e);
        }
    }

    // ✅ Main version that handles optional image upload
    public News createPost(String title, String description, String author, MultipartFile image) throws IOException {
        String imageUrl = null;

        // 1. Validate and save image if provided
        if (image != null && !image.isEmpty()) {
            String contentType = image.getContentType();
            long size = image.getSize();

            if (!List.of("image/jpeg", "image/jpg", "image/png").contains(contentType)) {
                throw new IllegalArgumentException("Unsupported image type. Only PNG, JPG, JPEG allowed.");
            }
            if (size > 2 * 1024 * 1024) {
                throw new IllegalArgumentException("File too large. Maximum allowed size is 2MB.");
            }

            // Ensure upload directory exists
            File dir = new File(UPLOAD_DIR);
            if (!dir.exists()) dir.mkdirs();

            // Generate unique file name
            String fileExtension = contentType.substring(contentType.lastIndexOf("/") + 1);
            String filename = UUID.randomUUID() + "." + fileExtension;
            Path filePath = Paths.get(UPLOAD_DIR + filename);
            Files.copy(image.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

            imageUrl = "/uploads/news-images/" + filename;
        }

        // 2. Create and save the News entity
        News news = News.builder()
                .title(title)
                .description(description)
                .author(author)
                .createdAt(LocalDateTime.now())
                .imageUrl(imageUrl)
                .build();

        return newsRepository.save(news);
    }

    // Used for system-generated posts
    public void createNews(String title, String content) {
        News news = News.builder()
                .title(title)
                .description(content)
                .author("System Notification")
                .createdAt(LocalDateTime.now())
                .build();
        newsRepository.save(news);
    }

    public List<News> getAllPosts() {
        return newsRepository.findAll();
    }
}
