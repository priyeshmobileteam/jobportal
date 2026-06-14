package com.sarkariresult.clone.controller;

import com.sarkariresult.clone.model.PaymentTransaction;
import com.sarkariresult.clone.repository.PaymentTransactionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/admin/payments")
@CrossOrigin(origins = "*")
public class AdminPaymentController {

    @Autowired
    private PaymentTransactionRepository paymentTransactionRepository;

    @GetMapping
    public ResponseEntity<List<PaymentTransaction>> getPaymentTransactions() {
        List<PaymentTransaction> transactions = paymentTransactionRepository.findAllByOrderByPaymentDateDesc();
        return ResponseEntity.ok(transactions);
    }
}
