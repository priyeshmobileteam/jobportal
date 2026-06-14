package com.sarkariresult.clone.controller;

import com.sarkariresult.clone.model.Category;
import com.sarkariresult.clone.model.Post;
import com.sarkariresult.clone.service.PostService;
import com.sarkariresult.clone.service.SiteViewsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.*;

@RestController
@RequestMapping("/api/posts")
@CrossOrigin(origins = "*")
public class PostController {

    @Autowired
    private PostService postService;

    @Autowired
    private SiteViewsService siteViewsService;

    // Fetch all posts grouped by category (or top posts for homepage)
    @GetMapping
    public ResponseEntity<Map<String, List<Post>>> getGroupedPosts() {
        return ResponseEntity.ok(postService.getHomepagePosts());
    }

    // Fetch single post details (increments post view count)
    @GetMapping("/{id}")
    public ResponseEntity<Post> getPostDetail(@PathVariable Long id) {
        return postService.getPostByIdAndIncrementViews(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // Get posts by category
    @GetMapping("/category/{categoryName}")
    public ResponseEntity<List<Post>> getPostsByCategory(@PathVariable String categoryName) {
        try {
            Category category = Category.valueOf(categoryName.toUpperCase());
            return ResponseEntity.ok(postService.getPostsByCategory(category));
        } catch (IllegalArgumentException ex) {
            return ResponseEntity.badRequest().build();
        }
    }

    // Increment and fetch site stats (called when page loads)
    @PostMapping("/stats/hit")
    public ResponseEntity<Map<String, Object>> hitGlobalStats() {
        Long totalHits = siteViewsService.incrementGlobalViews();
        Map<String, Object> stats = new HashMap<>();
        stats.put("totalViews", totalHits);
        stats.put("adsEnabled", siteViewsService.getAdsEnabled());
        return ResponseEntity.ok(stats);
    }

    // Fetch global site stats without incrementing
    @GetMapping("/stats")
    public ResponseEntity<Map<String, Object>> getGlobalStats() {
        Long totalHits = siteViewsService.getGlobalViews();
        Map<String, Object> stats = new HashMap<>();
        stats.put("totalViews", totalHits);
        stats.put("adsEnabled", siteViewsService.getAdsEnabled());
        return ResponseEntity.ok(stats);
    }
}
