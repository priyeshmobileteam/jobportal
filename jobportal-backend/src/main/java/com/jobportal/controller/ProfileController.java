package com.jobportal.controller;

import com.jobportal.dto.ProfileDTO;
import com.jobportal.entity.Education;
import com.jobportal.entity.Experience;
import com.jobportal.security.CustomUserDetails;
import com.jobportal.service.ProfileService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import java.util.Map;

@RestController
@RequestMapping("/api/profiles")
public class ProfileController {

    @Autowired
    private ProfileService profileService;

    @GetMapping("/me")
    public ResponseEntity<?> getMyProfile(@AuthenticationPrincipal CustomUserDetails userDetails) {
        try {
            String role = userDetails.getUser().getRoles().iterator().next().getName();
            ProfileDTO profile = profileService.getProfile(userDetails.getUser().getId(), role);
            return ResponseEntity.ok(profile);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @PutMapping("/me")
    public ResponseEntity<?> updateProfile(
            @RequestBody ProfileDTO dto,
            @AuthenticationPrincipal CustomUserDetails userDetails) {
        try {
            String role = userDetails.getUser().getRoles().iterator().next().getName();
            ProfileDTO updated = profileService.updateProfile(userDetails.getUser().getId(), role, dto);
            return ResponseEntity.ok(updated);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping("/education")
    public ResponseEntity<?> addEducation(
            @RequestBody Education edu,
            @AuthenticationPrincipal CustomUserDetails userDetails) {
        try {
            Education saved = profileService.addEducation(userDetails.getUser().getId(), edu);
            return ResponseEntity.ok(saved);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping("/experience")
    public ResponseEntity<?> addExperience(
            @RequestBody Experience exp,
            @AuthenticationPrincipal CustomUserDetails userDetails) {
        try {
            Experience saved = profileService.addExperience(userDetails.getUser().getId(), exp);
            return ResponseEntity.ok(saved);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/education")
    public ResponseEntity<?> getEducation(@AuthenticationPrincipal CustomUserDetails userDetails) {
        try {
            return ResponseEntity.ok(profileService.getEducation(userDetails.getUser().getId()));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/experience")
    public ResponseEntity<?> getExperience(@AuthenticationPrincipal CustomUserDetails userDetails) {
        try {
            return ResponseEntity.ok(profileService.getExperience(userDetails.getUser().getId()));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
}
