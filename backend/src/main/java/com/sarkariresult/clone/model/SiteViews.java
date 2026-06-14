package com.sarkariresult.clone.model;

import jakarta.persistence.*;

@Entity
@Table(name = "site_views")
public class SiteViews {

    @Id
    @Column(length = 50)
    private String id;

    @Column(nullable = false)
    private Long count = 0L;

    public SiteViews() {}

    public SiteViews(String id, Long count) {
        this.id = id;
        this.count = count;
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public Long getCount() { return count; }
    public void setCount(Long count) { this.count = count; }
}
