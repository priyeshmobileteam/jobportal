package com.sarkariresult.clone.config;

import com.sarkariresult.clone.model.User;
import com.sarkariresult.clone.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.Optional;

@Component
public class DatabaseSeeder implements CommandLineRunner {

    @Autowired
    private UserRepository userRepository;

    @Override
    public void run(String... args) throws Exception {
        Optional<User> kaushalOpt = userRepository.findByUsername("kaushal");
        Optional<User> adminOpt = userRepository.findByUsername("admin");

        // default hash for 'admin123' if admin doesn't exist
        String passwordHash = "$2a$10$KmZuPIukgXYwYWL7lI2MoukLpHov9/nIxh2qAZa2h8pXLbofJjpAa"; 
        if (adminOpt.isPresent()) {
            passwordHash = adminOpt.get().getPassword();
        }

        if (kaushalOpt.isPresent()) {
            User kaushal = kaushalOpt.get();
            if (!"ADMIN".equals(kaushal.getRole()) || !passwordHash.equals(kaushal.getPassword())) {
                kaushal.setRole("ADMIN");
                kaushal.setPassword(passwordHash);
                userRepository.save(kaushal);
                System.out.println("DatabaseSeeder: Updated 'kaushal' to ADMIN with admin password hash.");
            }
        } else {
            User kaushal = new User();
            kaushal.setUsername("kaushal");
            kaushal.setPassword(passwordHash);
            kaushal.setRole("ADMIN");
            userRepository.save(kaushal);
            System.out.println("DatabaseSeeder: Created ADMIN user 'kaushal' with admin password hash.");
        }
    }
}
