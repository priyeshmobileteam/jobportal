package com.jobportal.dto;

import lombok.*;
import java.math.BigDecimal;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProfileDTO {
    // Basic user info
    private String firstName;
    private String lastName;
    private String phoneNumber;

    // Candidate fields
    private String headline;
    private String bio;
    private String currentLocation;
    private BigDecimal expectedSalary;
    private String resumeUrl;
    private String portfolioUrl;
    private String linkedinUrl;
    private String githubUrl;
    private List<String> skills;

    // Recruiter fields
    private String companyName;
    private String companyWebsite;
    private String companyLogoUrl;
    private String companyDescription;
    private String companyAddress;
    private String industry;
    private Boolean isVerified;
}
