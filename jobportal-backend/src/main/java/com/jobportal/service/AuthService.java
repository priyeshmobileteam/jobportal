package com.jobportal.service;

import com.jobportal.dto.*;
import com.jobportal.entity.*;
import com.jobportal.repository.*;
import com.jobportal.security.JwtUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.ZonedDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class AuthService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private RoleRepository roleRepository;

    @Autowired
    private CandidateProfileRepository candidateProfileRepository;

    @Autowired
    private RecruiterProfileRepository recruiterProfileRepository;

    @Autowired
    private OtpVerificationRepository otpVerificationRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private JwtUtils jwtUtils;

    @Autowired
    private SmsService smsService;

    @Transactional
    public String registerUser(SignupRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email is already taken!");
        }

        Role userRole = roleRepository.findByName(request.getRole())
                .orElseThrow(() -> new RuntimeException("Error: Role is not found."));

        User user = User.builder()
                .email(request.getEmail())
                .passwordHash(passwordEncoder.encode(request.getPassword()))
                .firstName(request.getFirstName())
                .lastName(request.getLastName())
                .phoneNumber(request.getPhoneNumber())
                .isEnabled(true) // Automatically enabled for simplicity in this demo, but verification OTP table is populated
                .isLocked(false)
                .failedLoginAttempts(0)
                .roles(Set.of(userRole))
                .build();

        user = userRepository.save(user);

        // Populate Candidate or Recruiter profiles
        if ("ROLE_JOBSEEKER".equalsIgnoreCase(request.getRole())) {
            CandidateProfile candidateProfile = CandidateProfile.builder()
                    .user(user)
                    .headline("Job Seeker")
                    .build();
            candidateProfileRepository.save(candidateProfile);
        } else if ("ROLE_RECRUITER".equalsIgnoreCase(request.getRole())) {
            RecruiterProfile recruiterProfile = RecruiterProfile.builder()
                    .user(user)
                    .companyName(request.getCompanyName() != null ? request.getCompanyName() : "Company Name")
                    .industry(request.getIndustry())
                    .isVerified(false)
                    .build();
            recruiterProfileRepository.save(recruiterProfile);
        }

        // Generate Registration OTP (Logged for simplicity)
        String otp = String.format("%06d", new Random().nextInt(999999));
        OtpVerification verification = OtpVerification.builder()
                .email(request.getEmail())
                .otpCode(otp)
                .purpose("SIGNUP")
                .expiresAt(ZonedDateTime.now().plusMinutes(10))
                .isUsed(false)
                .build();
        otpVerificationRepository.save(verification);
        System.out.println(">>> OTP SENDING MOCKUP FOR EMAIL: " + request.getEmail() + " | CODE: " + otp);
        smsService.sendOtpSms(request.getPhoneNumber(), otp);

        return "User registered successfully! OTP sent to: " + request.getEmail();
    }

    public AuthResponse authenticateUser(AuthRequest request) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword()));

        SecurityContextHolder.getContext().setAuthentication(authentication);
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("User not found"));

        String jwt = jwtUtils.generateToken(
                new org.springframework.security.core.userdetails.User(
                        user.getEmail(), user.getPasswordHash(), new ArrayList<>()
                )
        );

        List<String> roles = user.getRoles().stream()
                .map(Role::getName)
                .collect(Collectors.toList());

        return AuthResponse.builder()
                .token(jwt)
                .refreshToken(UUID.randomUUID().toString())
                .id(user.getId())
                .email(user.getEmail())
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .roles(roles)
                .build();
    }

    public String sendOtp(String email, String purpose) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found with email " + email));

        String otp = String.format("%06d", new Random().nextInt(999999));
        OtpVerification verification = OtpVerification.builder()
                .email(email)
                .otpCode(otp)
                .purpose(purpose)
                .expiresAt(ZonedDateTime.now().plusMinutes(10))
                .isUsed(false)
                .build();
        otpVerificationRepository.save(verification);
        System.out.println(">>> OTP SENDING MOCKUP FOR " + purpose + " | EMAIL: " + email + " | CODE: " + otp);
        smsService.sendOtpSms(user.getPhoneNumber(), otp);

        return "OTP sent successfully to " + email;
    }

    @Transactional
    public String verifyOtpAndResetPassword(String email, String otp, String newPassword) {
        OtpVerification verification = otpVerificationRepository
                .findTopByEmailAndOtpCodeAndPurposeAndIsUsedFalseOrderByCreatedAtDesc(email, otp, "PASSWORD_RESET")
                .orElseThrow(() -> new RuntimeException("Invalid or expired OTP"));

        if (verification.getExpiresAt().isBefore(ZonedDateTime.now())) {
            throw new RuntimeException("OTP has expired");
        }

        verification.setIsUsed(true);
        otpVerificationRepository.save(verification);

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
        user.setPasswordHash(passwordEncoder.encode(newPassword));
        userRepository.save(user);

        return "Password has been reset successfully!";
    }
}
