package com.sarkariresult.clone.service;

import com.sarkariresult.clone.model.Category;
import com.sarkariresult.clone.model.Post;
import com.sarkariresult.clone.repository.PostRepository;
import com.sarkariresult.clone.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Component
public class DataInitializer implements CommandLineRunner {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PostRepository postRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        // Seed Admin User
        if (userRepository.findByUsername("admin").isEmpty()) {
            com.sarkariresult.clone.model.User admin = new com.sarkariresult.clone.model.User();
            admin.setUsername("admin");
            admin.setPassword(passwordEncoder.encode("admin123"));
            admin.setRole("ADMIN");
            userRepository.save(admin);
            System.out.println("Seeded Default Admin: admin / admin123");
        }

        // No mock data seeding in production. Start with a clean database.
        // Scraper runs automatically or manually to populate live records.
    }

    private void seedSamplePosts() {
        // 1. Latest Job
        Post job1 = new Post();
        job1.setTitle("SSC CGL Online Form 2026");
        job1.setCategory(Category.JOB);
        job1.setPostDate(LocalDateTime.now().minusDays(5));
        job1.setLastUpdateDate(LocalDateTime.now().minusDays(5));
        job1.setShortInfo("Staff Selection Commission (SSC) has released the Combined Graduate Level (CGL) 2026 notification for recruitment of various Group B and C posts.");
        job1.setTotalPosts(12256);
        job1.setApplicationStartDate(LocalDate.of(2026, 6, 1));
        job1.setApplicationEndDate(LocalDate.of(2026, 7, 10));
        job1.setFeeDetails("{\"General / OBC / EWS\": \"100\", \"SC / ST / PH\": \"0\", \"All Category Female\": \"0\", \"Payment Mode\": \"Online Credit/Debit Card, Net Banking or UPI\"}");
        job1.setAgeLimits("{\"Minimum Age\": \"18 Years\", \"Maximum Age\": \"30-32 Years (Post Wise)\", \"Age Relaxation\": \"As per SSC CGL Rules\"}");
        job1.setVacancyDetails("{\"Assistant Section Officer (ASO)\": \"General Graduate - 2500 Posts\", \"Inspector of Income Tax\": \"General Graduate - 1200 Posts\", \"Sub Inspector (CBI)\": \"General Graduate - 450 Posts\", \"Tax Assistant\": \"General Graduate - 3100 Posts\"}");
        job1.setOfficialNotificationUrl("https://ssc.gov.in");
        job1.setApplyOnlineUrl("https://ssc.gov.in");
        job1.setOfficialWebsiteUrl("https://ssc.gov.in");
        job1.setViews(1450);
        postRepository.save(job1);

        // 2. Admit Card
        Post admit1 = new Post();
        admit1.setTitle("RRB NTPC Graduate Level Exam Admit Card 2026");
        admit1.setCategory(Category.ADMIT_CARD);
        admit1.setPostDate(LocalDateTime.now().minusDays(2));
        admit1.setLastUpdateDate(LocalDateTime.now().minusDays(1));
        admit1.setShortInfo("Railway Recruitment Board (RRB) has released the exam dates and city details for NTPC Graduate Level posts.");
        admit1.setTotalPosts(8113);
        admit1.setApplicationStartDate(LocalDate.of(2026, 3, 10));
        admit1.setApplicationEndDate(LocalDate.of(2026, 4, 15));
        admit1.setFeeDetails("{\"General / OBC\": \"500 (Refundable)\", \"SC / ST / Female\": \"250 (Refundable)\"}");
        admit1.setAgeLimits("{\"Minimum Age\": \"18 Years\", \"Maximum Age\": \"33 Years\"}");
        admit1.setVacancyDetails("{\"Goods Train Manager\": \"3100 Posts\", \"Station Master\": \"1200 Posts\", \"Senior Clerk cum Typist\": \"2500 Posts\"}");
        admit1.setOfficialNotificationUrl("https://rrcb.gov.in");
        admit1.setApplyOnlineUrl("https://rrcb.gov.in");
        admit1.setOfficialWebsiteUrl("https://rrcb.gov.in");
        admit1.setViews(2380);
        postRepository.save(admit1);

        // 3. Result
        Post result1 = new Post();
        result1.setTitle("UPSC CAPF AC 2024 Final Result");
        result1.setCategory(Category.RESULT);
        result1.setPostDate(LocalDateTime.now().minusDays(15));
        result1.setLastUpdateDate(LocalDateTime.now().minusDays(1));
        result1.setShortInfo("Union Public Service Commission (UPSC) has declared the final results for Central Armed Police Forces (Assistant Commandants) Exam 2024.");
        result1.setTotalPosts(350);
        result1.setFeeDetails("{\"Application Fee\": \"No Fee for downloading result\"}");
        result1.setAgeLimits("{\"Status\": \"Result Out\"}");
        result1.setVacancyDetails("{\"Assistant Commandant\": \"350 Selected Candidates\"}");
        result1.setOfficialNotificationUrl("https://upsc.gov.in");
        result1.setApplyOnlineUrl("https://upsc.gov.in");
        result1.setOfficialWebsiteUrl("https://upsc.gov.in");
        result1.setViews(920);
        postRepository.save(result1);

        // 4. Syllabus
        Post syllabus1 = new Post();
        syllabus1.setTitle("UPSSSC Lower PCS Syllabus 2026");
        syllabus1.setCategory(Category.SYLLABUS);
        syllabus1.setPostDate(LocalDateTime.now().minusDays(10));
        syllabus1.setLastUpdateDate(LocalDateTime.now().minusDays(10));
        syllabus1.setShortInfo("Uttar Pradesh Subordinate Services Selection Commission (UPSSSC) has released the revised exam pattern and syllabus for Lower Subordinate Services.");
        syllabus1.setTotalPosts(2516);
        syllabus1.setVacancyDetails("{\"Paper I (General Studies)\": \"150 Questions, 300 Marks\", \"Paper II (General Aptitude)\": \"50 Questions, 100 Marks\"}");
        syllabus1.setOfficialNotificationUrl("https://upsssc.gov.in");
        syllabus1.setApplyOnlineUrl("https://upsssc.gov.in");
        syllabus1.setOfficialWebsiteUrl("https://upsssc.gov.in");
        syllabus1.setViews(410);
        postRepository.save(syllabus1);

        // 5. Answer Key
        Post key1 = new Post();
        key1.setTitle("UP Polytechnic JEECUP Answer Key 2026");
        key1.setCategory(Category.ANSWER_KEY);
        key1.setPostDate(LocalDateTime.now().minusDays(3));
        key1.setLastUpdateDate(LocalDateTime.now().minusDays(3));
        key1.setShortInfo("Joint Entrance Examination Council, Uttar Pradesh (JEECUP) has released the preliminary answer key and response sheet for Group A to K exams.");
        key1.setTotalPosts(0);
        key1.setOfficialNotificationUrl("https://jeecup.admissions.nic.in");
        key1.setApplyOnlineUrl("https://jeecup.admissions.nic.in");
        key1.setOfficialWebsiteUrl("https://jeecup.admissions.nic.in");
        key1.setViews(680);
        postRepository.save(key1);

        // 6. Admission
        Post admission1 = new Post();
        admission1.setTitle("UP Board Class 10th, 12th Compartment Online Form 2026");
        admission1.setCategory(Category.ADMISSION);
        admission1.setPostDate(LocalDateTime.now().minusDays(4));
        admission1.setLastUpdateDate(LocalDateTime.now().minusDays(4));
        admission1.setShortInfo("Uttar Pradesh Madhyamik Shiksha Parishad (UPMSP) has invited online applications for High School and Intermediate Compartment/Improvement examinations.");
        postRepository.save(admission1);

        System.out.println("Seeded Sample Posts and Categories Successfully.");
    }
}
