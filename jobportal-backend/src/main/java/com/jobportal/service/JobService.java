package com.jobportal.service;

import com.jobportal.dto.ApplicationDTO;
import com.jobportal.dto.JobDTO;
import com.jobportal.entity.*;
import com.jobportal.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.ZonedDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class JobService {

    @Autowired
    private JobRepository jobRepository;

    @Autowired
    private RecruiterProfileRepository recruiterProfileRepository;

    @Autowired
    private CandidateProfileRepository candidateProfileRepository;

    @Autowired
    private ApplicationRepository applicationRepository;

    @Autowired
    private InterviewRepository interviewRepository;

    @Transactional
    public Job postJob(JobDTO dto, Long userId) {
        RecruiterProfile recruiter = recruiterProfileRepository.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("Recruiter profile not found"));

        Job job = Job.builder()
                .recruiterProfile(recruiter)
                .title(dto.getTitle())
                .description(dto.getDescription())
                .requirements(dto.getRequirements())
                .benefits(dto.getBenefits())
                .location(dto.getLocation())
                .jobType(dto.getJobType())
                .salaryRangeMin(dto.getSalaryRangeMin())
                .salaryRangeMax(dto.getSalaryRangeMax())
                .status("PENDING") // Always pending until admin approves
                .build();

        return jobRepository.save(job);
    }

    public List<JobDTO> getAllApprovedJobs() {
        return jobRepository.findByStatus("APPROVED").stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public List<JobDTO> getJobsByRecruiter(Long userId) {
        RecruiterProfile recruiter = recruiterProfileRepository.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("Recruiter not found"));
        return jobRepository.findByRecruiterProfileId(recruiter.getId()).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public List<JobDTO> searchJobs(String keyword, String location) {
        return jobRepository.searchJobs(keyword, location).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Transactional
    public Job updateJobStatus(Long jobId, String status) {
        Job job = jobRepository.findById(jobId)
                .orElseThrow(() -> new RuntimeException("Job not found"));
        job.setStatus(status);
        return jobRepository.save(job);
    }

    @Transactional
    public Application applyJob(Long jobId, String coverLetter, Long userId) {
        CandidateProfile candidate = candidateProfileRepository.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("Candidate profile not found"));

        Job job = jobRepository.findById(jobId)
                .orElseThrow(() -> new RuntimeException("Job not found"));

        if (!"APPROVED".equals(job.getStatus())) {
            throw new RuntimeException("This job is not accepting applications");
        }

        Application application = Application.builder()
                .job(job)
                .candidateProfile(candidate)
                .resumeUrl(candidate.getResumeUrl())
                .coverLetter(coverLetter)
                .status("APPLIED")
                .build();

        return applicationRepository.save(application);
    }

    public List<ApplicationDTO> getApplicationsByCandidate(Long userId) {
        CandidateProfile candidate = candidateProfileRepository.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("Candidate not found"));
        return applicationRepository.findByCandidateProfileId(candidate.getId()).stream()
                .map(this::convertToApplicationDTO)
                .collect(Collectors.toList());
    }

    public List<ApplicationDTO> getApplicationsByJob(Long jobId) {
        return applicationRepository.findByJobId(jobId).stream()
                .map(this::convertToApplicationDTO)
                .collect(Collectors.toList());
    }

    @Transactional
    public Application updateApplicationStatus(Long applicationId, String status) {
        Application app = applicationRepository.findById(applicationId)
                .orElseThrow(() -> new RuntimeException("Application not found"));
        app.setStatus(status);
        return applicationRepository.save(app);
    }

    @Transactional
    public Interview scheduleInterview(Long applicationId, ZonedDateTime scheduledAt, String meetingLink, String notes) {
        Application app = applicationRepository.findById(applicationId)
                .orElseThrow(() -> new RuntimeException("Application not found"));

        Interview interview = Interview.builder()
                .application(app)
                .scheduledAt(scheduledAt)
                .meetingLink(meetingLink)
                .notes(notes)
                .status("SCHEDULED")
                .build();

        app.setStatus("INTERVIEWING");
        applicationRepository.save(app);

        return interviewRepository.save(interview);
    }

    public List<Interview> getInterviewsForUser(Long userId, String role) {
        if ("ROLE_JOBSEEKER".equalsIgnoreCase(role)) {
            CandidateProfile candidate = candidateProfileRepository.findByUserId(userId)
                    .orElseThrow(() -> new RuntimeException("Candidate not found"));
            return interviewRepository.findByCandidateProfileId(candidate.getId());
        } else {
            RecruiterProfile recruiter = recruiterProfileRepository.findByUserId(userId)
                    .orElseThrow(() -> new RuntimeException("Recruiter not found"));
            return interviewRepository.findByRecruiterProfileId(recruiter.getId());
        }
    }

    private JobDTO convertToDTO(Job job) {
        return JobDTO.builder()
                .id(job.getId())
                .recruiterId(job.getRecruiterProfile().getId())
                .companyName(job.getRecruiterProfile().getCompanyName())
                .companyLogoUrl(job.getRecruiterProfile().getCompanyLogoUrl())
                .title(job.getTitle())
                .description(job.getDescription())
                .requirements(job.getRequirements())
                .benefits(job.getBenefits())
                .location(job.getLocation())
                .jobType(job.getJobType())
                .salaryRangeMin(job.getSalaryRangeMin())
                .salaryRangeMax(job.getSalaryRangeMax())
                .status(job.getStatus())
                .createdAt(job.getCreatedAt())
                .build();
    }

    private ApplicationDTO convertToApplicationDTO(Application app) {
        User u = app.getCandidateProfile().getUser();
        return ApplicationDTO.builder()
                .id(app.getId())
                .jobId(app.getJob().getId())
                .jobTitle(app.getJob().getTitle())
                .companyName(app.getJob().getRecruiterProfile().getCompanyName())
                .candidateId(app.getCandidateProfile().getId())
                .candidateName(u.getFirstName() + " " + u.getLastName())
                .candidateEmail(u.getEmail())
                .status(app.getStatus())
                .resumeUrl(app.getResumeUrl())
                .coverLetter(app.getCoverLetter())
                .createdAt(app.getCreatedAt())
                .build();
    }
}
