package com.jobportal.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import java.util.HashMap;
import java.util.Map;

@Service
public class SmsService {

    @Value("${app.sms.api-key}")
    private String apiKey;

    @Value("${app.sms.api-url}")
    private String apiUrl;

    private final RestTemplate restTemplate = new RestTemplate();

    public void sendOtpSms(String phoneNumber, String otpCode) {
        if (phoneNumber == null || phoneNumber.trim().isEmpty()) {
            System.err.println("Cannot send SMS: phone number is empty.");
            return;
        }
        
        // Clean phone number (must be 10 digits without prefix or with country code if needed)
        // Fast2SMS expects a 10 digit number or comma separated list of numbers
        String cleanNumber = phoneNumber.replaceAll("[^0-9]", "");
        if (cleanNumber.length() > 10) {
            cleanNumber = cleanNumber.substring(cleanNumber.length() - 10);
        }

        try {
            HttpHeaders headers = new HttpHeaders();
            headers.set("authorization", apiKey);
            headers.set("Content-Type", "application/json");

            Map<String, Object> body = new HashMap<>();
            body.put("route", "otp");
            body.put("variables_values", otpCode);
            body.put("numbers", cleanNumber);

            HttpEntity<Map<String, Object>> entity = new HttpEntity<>(body, headers);

            ResponseEntity<String> response = restTemplate.exchange(
                apiUrl,
                HttpMethod.POST,
                entity,
                String.class
            );

            System.out.println(">>> Fast2SMS Response: " + response.getBody());
        } catch (Exception e) {
            System.err.println(">>> Failed to send SMS via Fast2SMS to " + cleanNumber + ": " + e.getMessage());
        }
    }
}
