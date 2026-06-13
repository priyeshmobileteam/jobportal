package com.jobportal.repository;

import com.jobportal.entity.Application;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface ApplicationRepository extends JpaRepository<Application, Long> {
    List<Application> findByCandidateProfileId(Long candidateProfileId);
    List<Application> findByJobId(Long jobId);
    Optional<Application> findByJobIdAndCandidateProfileId(Long jobId, Long candidateProfileId);
}
