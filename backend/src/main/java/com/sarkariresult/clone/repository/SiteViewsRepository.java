package com.sarkariresult.clone.repository;

import com.sarkariresult.clone.model.SiteViews;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface SiteViewsRepository extends JpaRepository<SiteViews, String> {
}
