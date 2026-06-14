package com.jobportal.controller;

import com.jobportal.entity.PaymentTransaction;
import com.jobportal.entity.User;
import com.jobportal.repository.PaymentTransactionRepository;
import com.jobportal.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.ZonedDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/admin/payments")
@PreAuthorize("hasRole('ADMIN')")
public class AdminPaymentController {

    @Autowired
    private PaymentTransactionRepository paymentTransactionRepository;

    @Autowired
    private UserRepository userRepository;

    @GetMapping
    public ResponseEntity<?> getTransactions() {
        List<PaymentTransaction> transactions = paymentTransactionRepository.findAllByOrderByPaymentDateDesc();
        
        List<Map<String, Object>> response = transactions.stream().map(t -> {
            Map<String, Object> map = new HashMap<>();
            map.put("id", t.getId());
            map.put("userEmail", t.getUser().getEmail());
            map.put("userName", t.getUser().getFirstName() + " " + t.getUser().getLastName());
            map.put("amount", t.getAmount());
            map.put("currency", t.getCurrency());
            map.put("status", t.getStatus());
            map.put("orderId", t.getRazorpayOrderId());
            map.put("paymentId", t.getRazorpayPaymentId());
            map.put("paymentDate", t.getPaymentDate());
            return map;
        }).collect(Collectors.toList());

        return ResponseEntity.ok(response);
    }

    @PostMapping("/toggle-premium/{userId}")
    public ResponseEntity<?> toggleUserPremium(@PathVariable Long userId, @RequestParam boolean premium) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        user.setIsPremium(premium);
        if (premium) {
            user.setPremiumUntil(ZonedDateTime.now().plusYears(1));
        } else {
            user.setPremiumUntil(null);
        }
        
        userRepository.save(user);
        return ResponseEntity.ok(Map.of(
            "success", true,
            "message", "User premium status successfully updated to: " + premium
        ));
    }
}
