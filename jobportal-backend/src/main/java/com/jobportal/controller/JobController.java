package com.jobportal.controller;

import com.jobportal.dto.JobDTO;
import com.jobportal.entity.Application;
import com.jobportal.entity.Interview;
import com.jobportal.entity.Job;
import com.jobportal.security.CustomUserDetails;
import com.jobportal.service.JobService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import java.time.ZonedDateTime;
import java.util.Map;

@RestController
@RequestMapping("/api/jobs")
public class JobController {

    @Autowired
    private JobService jobService;

    @PostMapping
    @PreAuthorize("hasRole('RECRUITER')")
    public ResponseEntity<?> postJob(@RequestBody JobDTO dto, @AuthenticationPrincipal CustomUserDetails userDetails) {
        try {
            Job job = jobService.postJob(dto, userDetails.getUser().getId());
            return ResponseEntity.ok(job);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/approved")
    public ResponseEntity<?> getApprovedJobs() {
        return ResponseEntity.ok(jobService.getAllApprovedJobs());
    }

    @GetMapping("/recruiter")
    @PreAuthorize("hasRole('RECRUITER')")
    public ResponseEntity<?> getRecruiterJobs(@AuthenticationPrincipal CustomUserDetails userDetails) {
        try {
            return ResponseEntity.ok(jobService.getJobsByRecruiter(userDetails.getUser().getId()));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/search")
    public ResponseEntity<?> searchJobs(
            @RequestParam(required = false, defaultValue = "") String keyword,
            @RequestParam(required = false, defaultValue = "") String location) {
        return ResponseEntity.ok(jobService.searchJobs(keyword, location));
    }

    @PostMapping("/{jobId}/apply")
    @PreAuthorize("hasRole('JOBSEEKER')")
    public ResponseEntity<?> applyJob(
            @PathVariable Long jobId,
            @RequestBody Map<String, String> body,
            @AuthenticationPrincipal CustomUserDetails userDetails) {
        try {
            String coverLetter = body.get("coverLetter");
            Application app = jobService.applyJob(jobId, coverLetter, userDetails.getUser().getId());
            return ResponseEntity.ok(app);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/applications/seeker")
    @PreAuthorize("hasRole('JOBSEEKER')")
    public ResponseEntity<?> getSeekerApplications(@AuthenticationPrincipal CustomUserDetails userDetails) {
        try {
            return ResponseEntity.ok(jobService.getApplicationsByCandidate(userDetails.getUser().getId()));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/{jobId}/applications")
    @PreAuthorize("hasRole('RECRUITER')")
    public ResponseEntity<?> getJobApplications(@PathVariable Long jobId) {
        return ResponseEntity.ok(jobService.getApplicationsByJob(jobId));
    }

    @PutMapping("/applications/{applicationId}/status")
    @PreAuthorize("hasRole('RECRUITER')")
    public ResponseEntity<?> updateApplicationStatus(
            @PathVariable Long applicationId,
            @RequestBody Map<String, String> body) {
        try {
            String status = body.get("status");
            Application app = jobService.updateApplicationStatus(applicationId, status);
            return ResponseEntity.ok(app);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping("/applications/{applicationId}/schedule")
    @PreAuthorize("hasRole('RECRUITER')")
    public ResponseEntity<?> scheduleInterview(
            @PathVariable Long applicationId,
            @RequestBody Map<String, Object> body) {
        try {
            ZonedDateTime scheduledAt = ZonedDateTime.parse((String) body.get("scheduledAt"));
            String meetingLink = (String) body.get("meetingLink");
            String notes = (String) body.get("notes");
            Interview interview = jobService.scheduleInterview(applicationId, scheduledAt, meetingLink, notes);
            return ResponseEntity.ok(interview);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/interviews")
    public ResponseEntity<?> getInterviews(@AuthenticationPrincipal CustomUserDetails userDetails) {
        try {
            String role = userDetails.getUser().getRoles().iterator().next().getName();
            return ResponseEntity.ok(jobService.getInterviewsForUser(userDetails.getUser().getId(), role));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
}
