package com.sarkariresult.clone.model;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "posts")
public class Post {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(length = 500, nullable = false)
    private String title;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Category category;

    @Column(name = "post_date")
    private LocalDateTime postDate = LocalDateTime.now();

    @Column(name = "last_update_date")
    private LocalDateTime lastUpdateDate = LocalDateTime.now();

    @Column(name = "short_info", columnDefinition = "TEXT")
    private String shortInfo;

    @Column(name = "total_posts")
    private Integer totalPosts;

    @Column(name = "application_start_date")
    private LocalDate applicationStartDate;

    @Column(name = "application_end_date")
    private LocalDate applicationEndDate;

    @Column(name = "fee_details", columnDefinition = "TEXT")
    private String feeDetails;

    @Column(name = "age_limits", columnDefinition = "TEXT")
    private String ageLimits;

    @Column(name = "vacancy_details", columnDefinition = "TEXT")
    private String vacancyDetails;

    @Column(name = "official_notification_url", length = 1000)
    private String officialNotificationUrl;

    @Column(name = "apply_online_url", length = 1000)
    private String applyOnlineUrl;

    @Column(name = "official_website_url", length = 1000)
    private String officialWebsiteUrl;

    @Column(columnDefinition = "integer default 0")
    private Integer views = 0;

    public Post() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public Category getCategory() { return category; }
    public void setCategory(Category category) { this.category = category; }

    public LocalDateTime getPostDate() { return postDate; }
    public void setPostDate(LocalDateTime postDate) { this.postDate = postDate; }

    public LocalDateTime getLastUpdateDate() { return lastUpdateDate; }
    public void setLastUpdateDate(LocalDateTime lastUpdateDate) { this.lastUpdateDate = lastUpdateDate; }

    public String getShortInfo() { return shortInfo; }
    public void setShortInfo(String shortInfo) { this.shortInfo = shortInfo; }

    public Integer getTotalPosts() { return totalPosts; }
    public void setTotalPosts(Integer totalPosts) { this.totalPosts = totalPosts; }

    public LocalDate getApplicationStartDate() { return applicationStartDate; }
    public void setApplicationStartDate(LocalDate applicationStartDate) { this.applicationStartDate = applicationStartDate; }

    public LocalDate getApplicationEndDate() { return applicationEndDate; }
    public void setApplicationEndDate(LocalDate applicationEndDate) { this.applicationEndDate = applicationEndDate; }

    public String getFeeDetails() { return feeDetails; }
    public void setFeeDetails(String feeDetails) { this.feeDetails = feeDetails; }

    public String getAgeLimits() { return ageLimits; }
    public void setAgeLimits(String ageLimits) { this.ageLimits = ageLimits; }

    public String getVacancyDetails() { return vacancyDetails; }
    public void setVacancyDetails(String vacancyDetails) { this.vacancyDetails = vacancyDetails; }

    public String getOfficialNotificationUrl() { return officialNotificationUrl; }
    public void setOfficialNotificationUrl(String officialNotificationUrl) { this.officialNotificationUrl = officialNotificationUrl; }

    public String getApplyOnlineUrl() { return applyOnlineUrl; }
    public void setApplyOnlineUrl(String applyOnlineUrl) { this.applyOnlineUrl = applyOnlineUrl; }

    public String getOfficialWebsiteUrl() { return officialWebsiteUrl; }
    public void setOfficialWebsiteUrl(String officialWebsiteUrl) { this.officialWebsiteUrl = officialWebsiteUrl; }

    public Integer getViews() { return views; }
    public void setViews(Integer views) { this.views = views; }
}
