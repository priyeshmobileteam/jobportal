package com.sarkariresult.clone.controller;

import com.sarkariresult.clone.model.Post;
import com.sarkariresult.clone.model.UploadedPdf;
import com.sarkariresult.clone.repository.UploadedPdfRepository;
import com.sarkariresult.clone.service.PostService;
import com.sarkariresult.clone.service.JobSyncScheduler;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import java.io.File;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/admin/posts")
@CrossOrigin(origins = "*")
public class AdminPostController {

    @Autowired
    private PostService postService;

    @Autowired
    private JobSyncScheduler jobSyncScheduler;

    @Autowired
    private com.sarkariresult.clone.service.SiteViewsService siteViewsService;

    @Autowired
    private UploadedPdfRepository uploadedPdfRepository;

    // Get list of all posts for admin view
    @GetMapping
    public ResponseEntity<List<Post>> getAllPosts() {
        return ResponseEntity.ok(postService.getAllPosts());
    }

    // Create a new post
    @PostMapping
    public ResponseEntity<Post> createPost(@RequestBody Post post) {
        return ResponseEntity.ok(postService.savePost(post));
    }

    // Update existing post
    @PutMapping("/{id}")
    public ResponseEntity<Post> updatePost(@PathVariable Long id, @RequestBody Post post) {
        post.setId(id);
        return ResponseEntity.ok(postService.savePost(post));
    }

    // Delete post
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePost(@PathVariable Long id) {
        postService.deletePost(id);
        return ResponseEntity.ok().build();
    }

    // Toggle ads globally
    @PostMapping("/ads/toggle")
    public ResponseEntity<Map<String, Boolean>> toggleAds(@RequestBody Map<String, Boolean> body) {
        boolean enabled = body.getOrDefault("enabled", true);
        siteViewsService.setAdsEnabled(enabled);
        Map<String, Boolean> res = new HashMap<>();
        res.put("adsEnabled", enabled);
        return ResponseEntity.ok(res);
    }

    // Manually trigger the Jsoup scraper sync from SarkariResult
    @PostMapping("/sync")
    public ResponseEntity<Map<String, String>> triggerManualSync() {
        new Thread(() -> {
            try {
                jobSyncScheduler.syncSarkariResultData();
            } catch (Exception e) {
                System.err.println("Manual sync thread error: " + e.getMessage());
            }
        }).start();

        Map<String, String> response = new HashMap<>();
        response.put("message", "Web scraping job initiated in background. New vacancies will load dynamically.");
        return ResponseEntity.ok(response);
    }

    // Upload PDF File with Display Name
    @PostMapping("/upload-pdf")
    public ResponseEntity<?> uploadPdf(@RequestParam("file") MultipartFile file, @RequestParam("name") String name) {
        try {
            if (file.isEmpty()) {
                return ResponseEntity.badRequest().body("File is empty");
            }
            
            String userDir = System.getProperty("user.dir");
            File uploadsDir = new File(userDir, "uploads");
            if (!uploadsDir.exists()) {
                uploadsDir.mkdirs();
            }

            String originalFilename = file.getOriginalFilename();
            String extension = "";
            if (originalFilename != null && originalFilename.contains(".")) {
                extension = originalFilename.substring(originalFilename.lastIndexOf("."));
            }
            String newFilename = UUID.randomUUID().toString() + extension;
            Path filePath = Paths.get(uploadsDir.getAbsolutePath(), newFilename);
            Files.write(filePath, file.getBytes());

            UploadedPdf uploadedPdf = new UploadedPdf();
            uploadedPdf.setName(name);
            uploadedPdf.setUrl("/uploads/" + newFilename);
            uploadedPdf = uploadedPdfRepository.save(uploadedPdf);

            return ResponseEntity.ok(uploadedPdf);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Upload failed: " + e.getMessage());
        }
    }

    // List all uploaded PDFs
    @GetMapping("/list-pdfs")
    public ResponseEntity<List<UploadedPdf>> listPdfs() {
        return ResponseEntity.ok(uploadedPdfRepository.findAll());
    }

    // Fetch and parse single URL details dynamically
    @PostMapping("/fetch-url")
    public ResponseEntity<?> fetchSingleUrl(@RequestBody Map<String, String> body) {
        String url = body.get("url");
        if (url == null || url.trim().isEmpty()) {
            return ResponseEntity.badRequest().body("URL is required");
        }
        Post parsedPost = jobSyncScheduler.scrapeUrlAndReturnData(url);
        if (parsedPost == null) {
            return ResponseEntity.internalServerError().body("Could not parse details from URL.");
        }
        return ResponseEntity.ok(parsedPost);
    }

    // Clear all posts (Danger Zone)
    @PostMapping("/clear-all")
    public ResponseEntity<Map<String, String>> clearAllPosts() {
        postService.deleteAllPosts();
        Map<String, String> res = new HashMap<>();
        res.put("message", "All posts deleted successfully.");
        return ResponseEntity.ok(res);
    }
}
