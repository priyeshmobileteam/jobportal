package com.jobportal.repository;

import com.jobportal.entity.OtpVerification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface OtpVerificationRepository extends JpaRepository<OtpVerification, Long> {
    Optional<OtpVerification> findTopByEmailAndOtpCodeAndPurposeAndIsUsedFalseOrderByCreatedAtDesc(
        String email, String otpCode, String purpose
    );
}
