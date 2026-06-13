package com.jobportal.repository;

import com.jobportal.entity.Interview;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface InterviewRepository extends JpaRepository<Interview, Long> {
    @Query("SELECT i FROM Interview i WHERE i.application.candidateProfile.id = :candidateId")
    List<Interview> findByCandidateProfileId(@Param("candidateId") Long candidateId);

    @Query("SELECT i FROM Interview i WHERE i.application.job.recruiterProfile.id = :recruiterId")
    List<Interview> findByRecruiterProfileId(@Param("recruiterId") Long recruiterId);
}
