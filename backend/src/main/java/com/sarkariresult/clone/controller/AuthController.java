package com.sarkariresult.clone.controller;

import com.sarkariresult.clone.security.JwtTokenProvider;
import com.sarkariresult.clone.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.*;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class AuthController {

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private JwtTokenProvider tokenProvider;

    @Autowired
    private UserService userService;

    @PostMapping("/login")
    public ResponseEntity<?> authenticateUser(@RequestBody LoginRequest loginRequest) {
        try {
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            loginRequest.getUsername(),
                            loginRequest.getPassword()
                    )
            );

            SecurityContextHolder.getContext().setAuthentication(authentication);
            String jwt = tokenProvider.generateToken(authentication);

            com.sarkariresult.clone.model.User user = userService.findByUsername(loginRequest.getUsername()).orElse(null);
            Map<String, String> response = new HashMap<>();
            response.put("token", jwt);
            response.put("type", "Bearer");
            response.put("username", loginRequest.getUsername());
            response.put("role", user != null ? user.getRole() : "USER");

            return ResponseEntity.ok(response);
        } catch (BadCredentialsException ex) {
            Map<String, String> errors = new HashMap<>();
            errors.put("error", "Invalid username or password");
            return ResponseEntity.status(401).body(errors);
        }
    }

    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@RequestBody LoginRequest registrationRequest) {
        try {
            com.sarkariresult.clone.model.User registeredUser = userService.registerUser(
                    registrationRequest.getUsername(),
                    registrationRequest.getPassword()
            );
            Map<String, String> response = new HashMap<>();
            response.put("message", "User registered successfully");
            response.put("username", registeredUser.getUsername());
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, String> errors = new HashMap<>();
            errors.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(errors);
        }
    }

    @PostMapping("/upgrade")
    public ResponseEntity<?> upgradeToPremium(@RequestBody UpgradeRequest upgradeRequest) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || !auth.isAuthenticated() || auth instanceof AnonymousAuthenticationToken) {
            Map<String, String> response = new HashMap<>();
            response.put("error", "Unauthorized: Please log in first");
            return ResponseEntity.status(401).body(response);
        }
        String username = auth.getName();
        try {
            com.sarkariresult.clone.model.User upgraded = userService.upgradeUserToPremium(username, upgradeRequest);
            Map<String, String> response = new HashMap<>();
            response.put("message", "User upgraded to PREMIUM successfully");
            response.put("username", username);
            response.put("role", upgraded.getRole());
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, String> response = new HashMap<>();
            response.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }

    @GetMapping("/me")
    public ResponseEntity<?> getCurrentUser() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || !auth.isAuthenticated() || auth instanceof AnonymousAuthenticationToken) {
            Map<String, String> response = new HashMap<>();
            response.put("role", "GUEST");
            return ResponseEntity.ok(response);
        }
        String username = auth.getName();
        try {
            com.sarkariresult.clone.model.User user = userService.findByUsername(username).orElse(null);
            Map<String, String> response = new HashMap<>();
            if (user != null) {
                response.put("username", username);
                response.put("role", user.getRole());
            } else {
                response.put("role", "GUEST");
            }
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, String> response = new HashMap<>();
            response.put("role", "GUEST");
            return ResponseEntity.ok(response);
        }
    }


    public static class LoginRequest {
        private String username;
        private String password;

        public String getUsername() { return username; }
        public void setUsername(String username) { this.username = username; }
        public String getPassword() { return password; }
        public void setPassword(String password) { this.password = password; }
    }

    public static class UpgradeRequest {
        private Double amount;
        private String planName;
        private String razorpayPaymentId;

        public Double getAmount() { return amount; }
        public void setAmount(Double amount) { this.amount = amount; }
        public String getPlanName() { return planName; }
        public void setPlanName(String planName) { this.planName = planName; }
        public String getRazorpayPaymentId() { return razorpayPaymentId; }
        public void setRazorpayPaymentId(String razorpayPaymentId) { this.razorpayPaymentId = razorpayPaymentId; }
    }
}
