package com.sarkariresult.clone.controller;

import com.sarkariresult.clone.model.Post;
import com.sarkariresult.clone.service.PostService;
import com.sarkariresult.clone.service.JobSyncScheduler;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/admin/posts")
@CrossOrigin(origins = "*")
public class AdminPostController {

    @Autowired
    private PostService postService;

    @Autowired
    private JobSyncScheduler jobSyncScheduler;

    // Get list of all posts for admin view with hits/views tracking
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

    // Manually trigger the Jsoup scraper sync from SarkariResult
    @PostMapping("/sync")
    public ResponseEntity<Map<String, String>> triggerManualSync() {
        // Trigger scraping in a separate thread so the admin request doesn't timeout
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
}
