package com.sarkariresult.clone.service;

import com.sarkariresult.clone.model.User;
import com.sarkariresult.clone.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import java.util.Optional;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private com.sarkariresult.clone.repository.PaymentTransactionRepository paymentTransactionRepository;

    public User createAdmin(String username, String password) {
        User user = new User();
        user.setUsername(username);
        user.setPassword(passwordEncoder.encode(password));
        user.setRole("ADMIN");
        return userRepository.save(user);
    }

    public User registerUser(String username, String password) {
        if (userRepository.findByUsername(username).isPresent()) {
            throw new RuntimeException("Username already exists");
        }
        User user = new User();
        user.setUsername(username);
        user.setPassword(passwordEncoder.encode(password));
        user.setRole("USER");
        return userRepository.save(user);
    }

    public User upgradeUserToPremium(String username, com.sarkariresult.clone.controller.AuthController.UpgradeRequest upgradeRequest) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));
        user.setRole("PREMIUM");
        User savedUser = userRepository.save(user);

        // Record the transaction details
        com.sarkariresult.clone.model.PaymentTransaction transaction = new com.sarkariresult.clone.model.PaymentTransaction();
        transaction.setUsername(username);
        transaction.setAmount(upgradeRequest.getAmount() != null ? upgradeRequest.getAmount() : 99.0);
        transaction.setPlanName(upgradeRequest.getPlanName() != null ? upgradeRequest.getPlanName() : "Premium Upgrade");
        transaction.setPaymentDate(java.time.Instant.now());
        transaction.setRazorpayPaymentId(upgradeRequest.getRazorpayPaymentId());
        paymentTransactionRepository.save(transaction);

        return savedUser;
    }

    public Optional<User> findByUsername(String username) {
        return userRepository.findByUsername(username);
    }
}
