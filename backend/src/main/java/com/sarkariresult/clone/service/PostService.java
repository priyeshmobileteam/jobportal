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

    public List<Post> getAllPosts() {
        return postRepository.findAll();
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
        return grouped;
    }
}
