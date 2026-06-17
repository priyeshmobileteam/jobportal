package com.sarkariresult.clone.repository;

import com.sarkariresult.clone.model.ScrapedPost;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ScrapedPostRepository extends JpaRepository<ScrapedPost, Long> {
}
