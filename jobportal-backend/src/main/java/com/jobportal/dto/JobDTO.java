package com.jobportal.dto;

import lombok.*;
import java.math.BigDecimal;
import java.time.ZonedDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class JobDTO {
    private Long id;
    private Long recruiterId;
    private String companyName;
    private String companyLogoUrl;
    private String title;
    private String description;
    private String requirements;
    private String benefits;
    private String location;
    private String jobType;
    private BigDecimal salaryRangeMin;
    private BigDecimal salaryRangeMax;
    private String status;
    private ZonedDateTime createdAt;
}
