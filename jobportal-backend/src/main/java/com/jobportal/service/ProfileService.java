package com.jobportal.service;

import com.jobportal.dto.ProfileDTO;
import com.jobportal.entity.*;
import com.jobportal.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ProfileService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private CandidateProfileRepository candidateProfileRepository;

    @Autowired
    private RecruiterProfileRepository recruiterProfileRepository;

    @Autowired
    private SkillRepository skillRepository;

    @Autowired
    private EducationRepository educationRepository;

    @Autowired
    private ExperienceRepository experienceRepository;

    public ProfileDTO getProfile(Long userId, String role) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        ProfileDTO.ProfileDTOBuilder builder = ProfileDTO.builder()
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .phoneNumber(user.getPhoneNumber());

        if ("ROLE_JOBSEEKER".equalsIgnoreCase(role)) {
            CandidateProfile candidate = candidateProfileRepository.findByUserId(userId)
                    .orElseThrow(() -> new RuntimeException("Candidate profile not found"));
            builder.headline(candidate.getHeadline())
                    .bio(candidate.getBio())
                    .currentLocation(candidate.getCurrentLocation())
                    .expectedSalary(candidate.getExpectedSalary())
                    .resumeUrl(candidate.getResumeUrl())
                    .portfolioUrl(candidate.getPortfolioUrl())
                    .linkedinUrl(candidate.getLinkedinUrl())
                    .githubUrl(candidate.getGithubUrl())
                    .skills(candidate.getSkills().stream().map(Skill::getName).collect(Collectors.toList()));
        } else if ("ROLE_RECRUITER".equalsIgnoreCase(role)) {
            RecruiterProfile recruiter = recruiterProfileRepository.findByUserId(userId)
                    .orElseThrow(() -> new RuntimeException("Recruiter profile not found"));
            builder.companyName(recruiter.getCompanyName())
                    .companyWebsite(recruiter.getCompanyWebsite())
                    .companyLogoUrl(recruiter.getCompanyLogoUrl())
                    .companyDescription(recruiter.getCompanyDescription())
                    .companyAddress(recruiter.getCompanyAddress())
                    .industry(recruiter.getIndustry())
                    .isVerified(recruiter.getIsVerified());
        }

        return builder.build();
    }

    @Transactional
    public ProfileDTO updateProfile(Long userId, String role, ProfileDTO dto) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        user.setFirstName(dto.getFirstName());
        user.setLastName(dto.getLastName());
        user.setPhoneNumber(dto.getPhoneNumber());
        userRepository.save(user);

        if ("ROLE_JOBSEEKER".equalsIgnoreCase(role)) {
            CandidateProfile candidate = candidateProfileRepository.findByUserId(userId)
                    .orElseThrow(() -> new RuntimeException("Candidate profile not found"));

            candidate.setHeadline(dto.getHeadline());
            candidate.setBio(dto.getBio());
            candidate.setCurrentLocation(dto.getCurrentLocation());
            candidate.setExpectedSalary(dto.getExpectedSalary());
            candidate.setResumeUrl(dto.getResumeUrl());
            candidate.setPortfolioUrl(dto.getPortfolioUrl());
            candidate.setLinkedinUrl(dto.getLinkedinUrl());
            candidate.setGithubUrl(dto.getGithubUrl());

            if (dto.getSkills() != null) {
                List<Skill> skillList = new ArrayList<>();
                for (String skillName : dto.getSkills()) {
                    Skill skill = skillRepository.findByName(skillName)
                            .orElseGet(() -> skillRepository.save(Skill.builder().name(skillName).build()));
                    skillList.add(skill);
                }
                candidate.setSkills(skillList);
            }

            candidateProfileRepository.save(candidate);

        } else if ("ROLE_RECRUITER".equalsIgnoreCase(role)) {
            RecruiterProfile recruiter = recruiterProfileRepository.findByUserId(userId)
                    .orElseThrow(() -> new RuntimeException("Recruiter profile not found"));

            recruiter.setCompanyName(dto.getCompanyName());
            recruiter.setCompanyWebsite(dto.getCompanyWebsite());
            recruiter.setCompanyLogoUrl(dto.getCompanyLogoUrl());
            recruiter.setCompanyDescription(dto.getCompanyDescription());
            recruiter.setCompanyAddress(dto.getCompanyAddress());
            recruiter.setIndustry(dto.getIndustry());

            recruiterProfileRepository.save(recruiter);
        }

        return getProfile(userId, role);
    }

    @Transactional
    public Education addEducation(Long userId, Education edu) {
        CandidateProfile candidate = candidateProfileRepository.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("Candidate profile not found"));
        edu.setCandidateProfile(candidate);
        return educationRepository.save(edu);
    }

    @Transactional
    public Experience addExperience(Long userId, Experience exp) {
        CandidateProfile candidate = candidateProfileRepository.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("Candidate profile not found"));
        exp.setCandidateProfile(candidate);
        return experienceRepository.save(exp);
    }

    public List<Education> getEducation(Long userId) {
        CandidateProfile candidate = candidateProfileRepository.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("Candidate profile not found"));
        return candidate.getEducationList();
    }

    public List<Experience> getExperience(Long userId) {
        CandidateProfile candidate = candidateProfileRepository.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("Candidate profile not found"));
        return candidate.getExperienceList();
    }
}
