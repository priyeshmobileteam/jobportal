package com.jobportal.controller;

import com.jobportal.entity.AuditLog;
import com.jobportal.entity.RecruiterProfile;
import com.jobportal.entity.User;
import com.jobportal.service.AdminService;
import com.jobportal.service.JobService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {

    @Autowired
    private AdminService adminService;

    @Autowired
    private JobService jobService;

    @GetMapping("/stats")
    public ResponseEntity<?> getStats() {
        return ResponseEntity.ok(adminService.getDashboardStats());
    }

    @GetMapping("/users")
    public ResponseEntity<?> getAllUsers() {
        return ResponseEntity.ok(adminService.getAllUsers());
    }

    @PutMapping("/users/{userId}/toggle-lock")
    public ResponseEntity<?> toggleUserLock(@PathVariable Long userId) {
        try {
            User user = adminService.toggleUserLock(userId);
            return ResponseEntity.ok(user);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/recruiters/unverified")
    public ResponseEntity<?> getUnverifiedRecruiters() {
        return ResponseEntity.ok(adminService.getUnverifiedRecruiters());
    }

    @PutMapping("/recruiters/{recruiterId}/verify")
    public ResponseEntity<?> verifyRecruiter(
            @PathVariable Long recruiterId,
            @RequestBody Map<String, Boolean> body) {
        try {
            Boolean verify = body.get("verify");
            RecruiterProfile profile = adminService.verifyRecruiter(recruiterId, verify);
            return ResponseEntity.ok(profile);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @PutMapping("/jobs/{jobId}/status")
    public ResponseEntity<?> updateJobStatus(
            @PathVariable Long jobId,
            @RequestBody Map<String, String> body) {
        try {
            String status = body.get("status"); // APPROVED, REJECTED
            return ResponseEntity.ok(jobService.updateJobStatus(jobId, status));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/audit-logs")
    public ResponseEntity<?> getAuditLogs() {
        return ResponseEntity.ok(adminService.getAuditLogs());
    }
}
