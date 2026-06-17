package com.sarkariresult.clone.service;

import com.sarkariresult.clone.model.Category;
import com.sarkariresult.clone.model.Post;
import com.sarkariresult.clone.repository.PostRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDateTime;
import java.util.*;

@Service
public class PostService {

    @Autowired
    private PostRepository postRepository;

    @Autowired
    private com.sarkariresult.clone.repository.ScrapedPostRepository scrapedPostRepository;

    public List<Post> getAllPosts() {
        return postRepository.findAllByOrderByIdDesc();
    }

    public List<Post> getPostsByCategory(Category category) {
        return postRepository.findByCategoryOrderByLastUpdateDateDesc(category);
    }

    @Transactional
    public Optional<Post> getPostByIdAndIncrementViews(Long id) {
        Optional<Post> postOpt = postRepository.findById(id);
        if (postOpt.isPresent()) {
            Post post = postOpt.get();
            post.setViews(post.getViews() + 1);
            postRepository.save(post);
        }
        return postOpt;
    }

    public Post savePost(Post post) {
        if (post.getId() != null) {
            post.setLastUpdateDate(LocalDateTime.now());
        } else {
            post.setPostDate(LocalDateTime.now());
            post.setLastUpdateDate(LocalDateTime.now());
            if (post.getViews() == null) {
                post.setViews(0);
            }
        }
        return postRepository.save(post);
    }

    public void deletePost(Long id) {
        postRepository.deleteById(id);
    }

    @Transactional
    public void deleteAllPosts() {
        List<Post> allPosts = postRepository.findAll();
        List<com.sarkariresult.clone.model.ScrapedPost> backups = new ArrayList<>();
        for (Post p : allPosts) {
            com.sarkariresult.clone.model.ScrapedPost b = new com.sarkariresult.clone.model.ScrapedPost();
            b.setOriginalPostId(p.getId());
            b.setTitle(p.getTitle());
            b.setCategory(p.getCategory());
            b.setPostDate(p.getPostDate());
            b.setLastUpdateDate(p.getLastUpdateDate());
            b.setShortInfo(p.getShortInfo());
            b.setTotalPosts(p.getTotalPosts());
            b.setApplicationStartDate(p.getApplicationStartDate());
            b.setApplicationEndDate(p.getApplicationEndDate());
            b.setFeeDetails(p.getFeeDetails());
            b.setAgeLimits(p.getAgeLimits());
            b.setVacancyDetails(p.getVacancyDetails());
            b.setOfficialNotificationUrl(p.getOfficialNotificationUrl());
            b.setApplyOnlineUrl(p.getApplyOnlineUrl());
            b.setOfficialWebsiteUrl(p.getOfficialWebsiteUrl());
            b.setViews(p.getViews());
            b.setIsHotLink(p.getIsHotLink());
            b.setHotLinkTitle(p.getHotLinkTitle());
            b.setHotLinkOrder(p.getHotLinkOrder());
            backups.add(b);
        }
        if (!backups.isEmpty()) {
            scrapedPostRepository.saveAll(backups);
            System.out.println("PostService: Successfully backed up " + backups.size() + " posts to scraped_posts table.");
        }
        postRepository.deleteAll();
    }

    public Map<String, List<Post>> getHomepagePosts() {
        Map<String, List<Post>> grouped = new HashMap<>();
        for (Category category : Category.values()) {
            List<Post> posts = postRepository.findByCategoryOrderByLastUpdateDateDesc(category);
            // Limit to top 15-20 posts on homepage for scalability, similar to SarkariResult layout
            if (posts.size() > 20) {
                grouped.put(category.name(), posts.subList(0, 20));
            } else {
                grouped.put(category.name(), posts);
            }
        }
        List<Post> hotLinks = postRepository.findByIsHotLinkTrueOrderByHotLinkOrderAsc();
        grouped.put("HOT_LINKS", hotLinks);
        return grouped;
    }
}
