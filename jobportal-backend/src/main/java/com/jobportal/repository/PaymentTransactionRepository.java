package com.jobportal.repository;

import com.jobportal.entity.PaymentTransaction;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface PaymentTransactionRepository extends JpaRepository<PaymentTransaction, Long> {
    List<PaymentTransaction> findAllByOrderByPaymentDateDesc();
    Optional<PaymentTransaction> findByRazorpayOrderId(String orderId);
}
