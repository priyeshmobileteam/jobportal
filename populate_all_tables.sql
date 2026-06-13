-- ============================================================
-- FULL DUMMY DATA FOR ALL TABLES
-- Password for all users: Test@1234
-- Hash: $2a$10$8.ZTRTu3sh5451.Mgu3oZO0e75Q.D2D1B28t81fB6t28uE92C3D4E
-- ============================================================

-- 1. PERMISSIONS
INSERT INTO permissions (name) VALUES
('VIEW_JOBS'), ('APPLY_JOBS'), ('MANAGE_JOBS'), ('MANAGE_USERS'),
('VIEW_APPLICATIONS'), ('MANAGE_APPLICATIONS'), ('VIEW_REPORTS'),
('MANAGE_RECRUITERS'), ('VIEW_DASHBOARD'), ('SEND_MESSAGES')
ON CONFLICT DO NOTHING;

-- 2. ROLE PERMISSIONS
INSERT INTO role_permissions (role_id, permission_id) VALUES
((SELECT id FROM roles WHERE name='ROLE_JOBSEEKER'), (SELECT id FROM permissions WHERE name='VIEW_JOBS')),
((SELECT id FROM roles WHERE name='ROLE_JOBSEEKER'), (SELECT id FROM permissions WHERE name='APPLY_JOBS')),
((SELECT id FROM roles WHERE name='ROLE_JOBSEEKER'), (SELECT id FROM permissions WHERE name='SEND_MESSAGES')),
((SELECT id FROM roles WHERE name='ROLE_JOBSEEKER'), (SELECT id FROM permissions WHERE name='VIEW_DASHBOARD')),
((SELECT id FROM roles WHERE name='ROLE_RECRUITER'), (SELECT id FROM permissions WHERE name='VIEW_JOBS')),
((SELECT id FROM roles WHERE name='ROLE_RECRUITER'), (SELECT id FROM permissions WHERE name='MANAGE_JOBS')),
((SELECT id FROM roles WHERE name='ROLE_RECRUITER'), (SELECT id FROM permissions WHERE name='VIEW_APPLICATIONS')),
((SELECT id FROM roles WHERE name='ROLE_RECRUITER'), (SELECT id FROM permissions WHERE name='MANAGE_APPLICATIONS')),
((SELECT id FROM roles WHERE name='ROLE_RECRUITER'), (SELECT id FROM permissions WHERE name='SEND_MESSAGES')),
((SELECT id FROM roles WHERE name='ROLE_ADMIN'), (SELECT id FROM permissions WHERE name='VIEW_JOBS')),
((SELECT id FROM roles WHERE name='ROLE_ADMIN'), (SELECT id FROM permissions WHERE name='MANAGE_JOBS')),
((SELECT id FROM roles WHERE name='ROLE_ADMIN'), (SELECT id FROM permissions WHERE name='MANAGE_USERS')),
((SELECT id FROM roles WHERE name='ROLE_ADMIN'), (SELECT id FROM permissions WHERE name='VIEW_REPORTS')),
((SELECT id FROM roles WHERE name='ROLE_ADMIN'), (SELECT id FROM permissions WHERE name='MANAGE_RECRUITERS')),
((SELECT id FROM roles WHERE name='ROLE_ADMIN'), (SELECT id FROM permissions WHERE name='VIEW_DASHBOARD'))
ON CONFLICT DO NOTHING;

-- 3. ADMIN USER
INSERT INTO users (email, phone_number, password_hash, first_name, last_name, is_enabled, is_locked)
VALUES ('admin@careersphere.com', '9999999999', '$2a$10$8.ZTRTu3sh5451.Mgu3oZO0e75Q.D2D1B28t81fB6t28uE92C3D4E', 'Super', 'Admin', TRUE, FALSE)
ON CONFLICT DO NOTHING;
INSERT INTO user_roles (user_id, role_id) VALUES
((SELECT id FROM users WHERE email='admin@careersphere.com'), (SELECT id FROM roles WHERE name='ROLE_ADMIN'))
ON CONFLICT DO NOTHING;

-- 4. CANDIDATE USERS (10 Job Seekers)
INSERT INTO users (email, phone_number, password_hash, first_name, last_name, is_enabled, is_locked) VALUES
('rahul.sharma@gmail.com', '9811000001', '$2a$10$8.ZTRTu3sh5451.Mgu3oZO0e75Q.D2D1B28t81fB6t28uE92C3D4E', 'Rahul', 'Sharma', TRUE, FALSE),
('priya.patel@gmail.com', '9811000002', '$2a$10$8.ZTRTu3sh5451.Mgu3oZO0e75Q.D2D1B28t81fB6t28uE92C3D4E', 'Priya', 'Patel', TRUE, FALSE),
('amit.kumar@gmail.com', '9811000003', '$2a$10$8.ZTRTu3sh5451.Mgu3oZO0e75Q.D2D1B28t81fB6t28uE92C3D4E', 'Amit', 'Kumar', TRUE, FALSE),
('sneha.singh@gmail.com', '9811000004', '$2a$10$8.ZTRTu3sh5451.Mgu3oZO0e75Q.D2D1B28t81fB6t28uE92C3D4E', 'Sneha', 'Singh', TRUE, FALSE),
('rohit.verma@gmail.com', '9811000005', '$2a$10$8.ZTRTu3sh5451.Mgu3oZO0e75Q.D2D1B28t81fB6t28uE92C3D4E', 'Rohit', 'Verma', TRUE, FALSE),
('anjali.gupta@gmail.com', '9811000006', '$2a$10$8.ZTRTu3sh5451.Mgu3oZO0e75Q.D2D1B28t81fB6t28uE92C3D4E', 'Anjali', 'Gupta', TRUE, FALSE),
('vikram.mishra@gmail.com', '9811000007', '$2a$10$8.ZTRTu3sh5451.Mgu3oZO0e75Q.D2D1B28t81fB6t28uE92C3D4E', 'Vikram', 'Mishra', TRUE, FALSE),
('neha.joshi@gmail.com', '9811000008', '$2a$10$8.ZTRTu3sh5451.Mgu3oZO0e75Q.D2D1B28t81fB6t28uE92C3D4E', 'Neha', 'Joshi', TRUE, FALSE),
('arjun.reddy@gmail.com', '9811000009', '$2a$10$8.ZTRTu3sh5451.Mgu3oZO0e75Q.D2D1B28t81fB6t28uE92C3D4E', 'Arjun', 'Reddy', TRUE, FALSE),
('kavya.nair@gmail.com', '9811000010', '$2a$10$8.ZTRTu3sh5451.Mgu3oZO0e75Q.D2D1B28t81fB6t28uE92C3D4E', 'Kavya', 'Nair', TRUE, FALSE)
ON CONFLICT DO NOTHING;

-- Assign JOBSEEKER role to all candidates
INSERT INTO user_roles (user_id, role_id)
SELECT u.id, r.id FROM users u, roles r
WHERE u.email IN ('rahul.sharma@gmail.com','priya.patel@gmail.com','amit.kumar@gmail.com','sneha.singh@gmail.com','rohit.verma@gmail.com','anjali.gupta@gmail.com','vikram.mishra@gmail.com','neha.joshi@gmail.com','arjun.reddy@gmail.com','kavya.nair@gmail.com')
AND r.name = 'ROLE_JOBSEEKER'
ON CONFLICT DO NOTHING;

-- 5. CANDIDATE PROFILES
INSERT INTO candidate_profile (user_id, headline, bio, current_location, expected_salary, linkedin_url, github_url) VALUES
((SELECT id FROM users WHERE email='rahul.sharma@gmail.com'), 'Senior React Developer | 5 Years Exp', 'Passionate frontend developer with expertise in React, TypeScript and modern web technologies.', 'Noida, UP', 1500000, 'https://linkedin.com/in/rahulsharma', 'https://github.com/rahulsharma'),
((SELECT id FROM users WHERE email='priya.patel@gmail.com'), 'Full Stack Developer | MERN Stack', 'Full stack developer experienced in building scalable web applications using MERN stack.', 'Bengaluru, Karnataka', 1200000, 'https://linkedin.com/in/priyapatel', 'https://github.com/priyapatel'),
((SELECT id FROM users WHERE email='amit.kumar@gmail.com'), 'Java Backend Engineer | Spring Boot', 'Backend developer with 4 years of experience in Java, Spring Boot, and microservices architecture.', 'Hyderabad, Telangana', 1400000, 'https://linkedin.com/in/amitkumar', 'https://github.com/amitkumar'),
((SELECT id FROM users WHERE email='sneha.singh@gmail.com'), 'Data Scientist | Python & ML', 'Data scientist with expertise in machine learning, deep learning, and data visualization.', 'Mumbai, Maharashtra', 1600000, 'https://linkedin.com/in/snehasingh', 'https://github.com/snehasingh'),
((SELECT id FROM users WHERE email='rohit.verma@gmail.com'), 'DevOps Engineer | AWS & Kubernetes', 'DevOps professional with hands-on experience in CI/CD, Docker, Kubernetes, and AWS cloud.', 'Pune, Maharashtra', 1300000, 'https://linkedin.com/in/rohitverma', 'https://github.com/rohitverma'),
((SELECT id FROM users WHERE email='anjali.gupta@gmail.com'), 'UI/UX Designer | Figma Expert', 'Creative UI/UX designer with 3 years of experience in designing intuitive digital experiences.', 'Delhi, NCR', 900000, 'https://linkedin.com/in/anjaligupta', NULL),
((SELECT id FROM users WHERE email='vikram.mishra@gmail.com'), 'Android Developer | Kotlin & Jetpack', 'Android developer skilled in Kotlin, Jetpack Compose, and MVVM architecture.', 'Chennai, Tamil Nadu', 1100000, 'https://linkedin.com/in/vikrammishra', 'https://github.com/vikrammishra'),
((SELECT id FROM users WHERE email='neha.joshi@gmail.com'), 'QA Engineer | Automation Testing', 'QA engineer with experience in Selenium, Appium, and test automation frameworks.', 'Noida, UP', 800000, 'https://linkedin.com/in/nehajoshi', 'https://github.com/nehajoshi'),
((SELECT id FROM users WHERE email='arjun.reddy@gmail.com'), 'Cloud Architect | AWS Solutions', 'AWS certified cloud architect with 6 years of experience designing cloud-native solutions.', 'Hyderabad, Telangana', 2000000, 'https://linkedin.com/in/arjunreddy', 'https://github.com/arjunreddy'),
((SELECT id FROM users WHERE email='kavya.nair@gmail.com'), 'Python Developer | Django & FastAPI', 'Backend developer specializing in Python frameworks, REST APIs, and database optimization.', 'Bengaluru, Karnataka', 1100000, 'https://linkedin.com/in/kavyanair', 'https://github.com/kavyanair')
ON CONFLICT DO NOTHING;

-- 6. SKILLS
INSERT INTO skills (name) VALUES
('Java'), ('Spring Boot'), ('React.js'), ('TypeScript'), ('Python'),
('Machine Learning'), ('AWS'), ('Docker'), ('Kubernetes'), ('PostgreSQL'),
('MongoDB'), ('Node.js'), ('Angular'), ('Vue.js'), ('Kotlin'),
('Android'), ('iOS'), ('Swift'), ('Figma'), ('Adobe XD'),
('Selenium'), ('Jenkins'), ('Git'), ('REST API'), ('GraphQL'),
('Microservices'), ('Hibernate'), ('Redis'), ('Elasticsearch'), ('Kafka')
ON CONFLICT DO NOTHING;

-- 7. CANDIDATE SKILLS
INSERT INTO candidate_skills (candidate_profile_id, skill_id) VALUES
-- Rahul - React Developer
((SELECT id FROM candidate_profile WHERE user_id=(SELECT id FROM users WHERE email='rahul.sharma@gmail.com')), (SELECT id FROM skills WHERE name='React.js')),
((SELECT id FROM candidate_profile WHERE user_id=(SELECT id FROM users WHERE email='rahul.sharma@gmail.com')), (SELECT id FROM skills WHERE name='TypeScript')),
((SELECT id FROM candidate_profile WHERE user_id=(SELECT id FROM users WHERE email='rahul.sharma@gmail.com')), (SELECT id FROM skills WHERE name='Node.js')),
-- Priya - Full Stack
((SELECT id FROM candidate_profile WHERE user_id=(SELECT id FROM users WHERE email='priya.patel@gmail.com')), (SELECT id FROM skills WHERE name='React.js')),
((SELECT id FROM candidate_profile WHERE user_id=(SELECT id FROM users WHERE email='priya.patel@gmail.com')), (SELECT id FROM skills WHERE name='Node.js')),
((SELECT id FROM candidate_profile WHERE user_id=(SELECT id FROM users WHERE email='priya.patel@gmail.com')), (SELECT id FROM skills WHERE name='MongoDB')),
-- Amit - Java Backend
((SELECT id FROM candidate_profile WHERE user_id=(SELECT id FROM users WHERE email='amit.kumar@gmail.com')), (SELECT id FROM skills WHERE name='Java')),
((SELECT id FROM candidate_profile WHERE user_id=(SELECT id FROM users WHERE email='amit.kumar@gmail.com')), (SELECT id FROM skills WHERE name='Spring Boot')),
((SELECT id FROM candidate_profile WHERE user_id=(SELECT id FROM users WHERE email='amit.kumar@gmail.com')), (SELECT id FROM skills WHERE name='PostgreSQL')),
-- Sneha - Data Science
((SELECT id FROM candidate_profile WHERE user_id=(SELECT id FROM users WHERE email='sneha.singh@gmail.com')), (SELECT id FROM skills WHERE name='Python')),
((SELECT id FROM candidate_profile WHERE user_id=(SELECT id FROM users WHERE email='sneha.singh@gmail.com')), (SELECT id FROM skills WHERE name='Machine Learning')),
-- Rohit - DevOps
((SELECT id FROM candidate_profile WHERE user_id=(SELECT id FROM users WHERE email='rohit.verma@gmail.com')), (SELECT id FROM skills WHERE name='AWS')),
((SELECT id FROM candidate_profile WHERE user_id=(SELECT id FROM users WHERE email='rohit.verma@gmail.com')), (SELECT id FROM skills WHERE name='Docker')),
((SELECT id FROM candidate_profile WHERE user_id=(SELECT id FROM users WHERE email='rohit.verma@gmail.com')), (SELECT id FROM skills WHERE name='Kubernetes')),
-- Anjali - UI/UX
((SELECT id FROM candidate_profile WHERE user_id=(SELECT id FROM users WHERE email='anjali.gupta@gmail.com')), (SELECT id FROM skills WHERE name='Figma')),
((SELECT id FROM candidate_profile WHERE user_id=(SELECT id FROM users WHERE email='anjali.gupta@gmail.com')), (SELECT id FROM skills WHERE name='Adobe XD')),
-- Vikram - Android
((SELECT id FROM candidate_profile WHERE user_id=(SELECT id FROM users WHERE email='vikram.mishra@gmail.com')), (SELECT id FROM skills WHERE name='Kotlin')),
((SELECT id FROM candidate_profile WHERE user_id=(SELECT id FROM users WHERE email='vikram.mishra@gmail.com')), (SELECT id FROM skills WHERE name='Android')),
-- Neha - QA
((SELECT id FROM candidate_profile WHERE user_id=(SELECT id FROM users WHERE email='neha.joshi@gmail.com')), (SELECT id FROM skills WHERE name='Selenium')),
((SELECT id FROM candidate_profile WHERE user_id=(SELECT id FROM users WHERE email='neha.joshi@gmail.com')), (SELECT id FROM skills WHERE name='Git')),
-- Arjun - Cloud
((SELECT id FROM candidate_profile WHERE user_id=(SELECT id FROM users WHERE email='arjun.reddy@gmail.com')), (SELECT id FROM skills WHERE name='AWS')),
((SELECT id FROM candidate_profile WHERE user_id=(SELECT id FROM users WHERE email='arjun.reddy@gmail.com')), (SELECT id FROM skills WHERE name='Kubernetes')),
-- Kavya - Python
((SELECT id FROM candidate_profile WHERE user_id=(SELECT id FROM users WHERE email='kavya.nair@gmail.com')), (SELECT id FROM skills WHERE name='Python')),
((SELECT id FROM candidate_profile WHERE user_id=(SELECT id FROM users WHERE email='kavya.nair@gmail.com')), (SELECT id FROM skills WHERE name='REST API'))
ON CONFLICT DO NOTHING;

-- 8. EDUCATION
INSERT INTO education (candidate_profile_id, institution, degree, field_of_study, start_date, end_date, grade) VALUES
((SELECT id FROM candidate_profile WHERE user_id=(SELECT id FROM users WHERE email='rahul.sharma@gmail.com')), 'IIT Delhi', 'B.Tech', 'Computer Science', '2015-07-01', '2019-05-31', '8.5 CGPA'),
((SELECT id FROM candidate_profile WHERE user_id=(SELECT id FROM users WHERE email='priya.patel@gmail.com')), 'NIT Surat', 'B.Tech', 'Information Technology', '2016-07-01', '2020-05-31', '8.2 CGPA'),
((SELECT id FROM candidate_profile WHERE user_id=(SELECT id FROM users WHERE email='amit.kumar@gmail.com')), 'VIT Vellore', 'B.Tech', 'Computer Science', '2016-07-01', '2020-05-31', '8.0 CGPA'),
((SELECT id FROM candidate_profile WHERE user_id=(SELECT id FROM users WHERE email='sneha.singh@gmail.com')), 'IIT Bombay', 'M.Tech', 'Data Science', '2018-07-01', '2020-05-31', '9.1 CGPA'),
((SELECT id FROM candidate_profile WHERE user_id=(SELECT id FROM users WHERE email='rohit.verma@gmail.com')), 'BITS Pilani', 'B.E.', 'Computer Science', '2015-07-01', '2019-05-31', '7.9 CGPA'),
((SELECT id FROM candidate_profile WHERE user_id=(SELECT id FROM users WHERE email='anjali.gupta@gmail.com')), 'Delhi College of Art', 'B.Des', 'Visual Communication', '2017-07-01', '2021-05-31', 'First Division'),
((SELECT id FROM candidate_profile WHERE user_id=(SELECT id FROM users WHERE email='vikram.mishra@gmail.com')), 'SRM University', 'B.Tech', 'Computer Science', '2017-07-01', '2021-05-31', '8.3 CGPA'),
((SELECT id FROM candidate_profile WHERE user_id=(SELECT id FROM users WHERE email='neha.joshi@gmail.com')), 'Pune University', 'B.E.', 'IT', '2018-07-01', '2022-05-31', '7.5 CGPA'),
((SELECT id FROM candidate_profile WHERE user_id=(SELECT id FROM users WHERE email='arjun.reddy@gmail.com')), 'JNTU Hyderabad', 'B.Tech', 'Electronics & CS', '2013-07-01', '2017-05-31', '8.7 CGPA'),
((SELECT id FROM candidate_profile WHERE user_id=(SELECT id FROM users WHERE email='kavya.nair@gmail.com')), 'University of Kerala', 'B.Tech', 'Computer Science', '2017-07-01', '2021-05-31', '8.6 CGPA')
ON CONFLICT DO NOTHING;

-- 9. EXPERIENCE
INSERT INTO experience (candidate_profile_id, company_name, title, location, start_date, end_date, is_current, description) VALUES
((SELECT id FROM candidate_profile WHERE user_id=(SELECT id FROM users WHERE email='rahul.sharma@gmail.com')), 'Infosys', 'Frontend Developer', 'Noida', '2019-06-01', '2022-07-31', FALSE, 'Built customer-facing dashboards using React.js and TypeScript.'),
((SELECT id FROM candidate_profile WHERE user_id=(SELECT id FROM users WHERE email='rahul.sharma@gmail.com')), 'Paytm', 'Senior Frontend Developer', 'Noida', '2022-08-01', NULL, TRUE, 'Leading a team of 5 developers building payment UI flows.'),
((SELECT id FROM candidate_profile WHERE user_id=(SELECT id FROM users WHERE email='priya.patel@gmail.com')), 'TCS', 'Software Developer', 'Mumbai', '2020-07-01', '2023-01-31', FALSE, 'Developed REST APIs and React dashboards for banking clients.'),
((SELECT id FROM candidate_profile WHERE user_id=(SELECT id FROM users WHERE email='amit.kumar@gmail.com')), 'Wipro', 'Java Developer', 'Hyderabad', '2020-08-01', '2023-06-30', FALSE, 'Built microservices using Spring Boot and deployed on AWS.'),
((SELECT id FROM candidate_profile WHERE user_id=(SELECT id FROM users WHERE email='sneha.singh@gmail.com')), 'Flipkart', 'Data Analyst', 'Bengaluru', '2020-06-01', '2022-12-31', FALSE, 'Analyzed product recommendation algorithms and customer churn models.'),
((SELECT id FROM candidate_profile WHERE user_id=(SELECT id FROM users WHERE email='rohit.verma@gmail.com')), 'HCLTech', 'DevOps Engineer', 'Pune', '2019-08-01', NULL, TRUE, 'Managing CI/CD pipelines and Kubernetes clusters for 50+ microservices.'),
((SELECT id FROM candidate_profile WHERE user_id=(SELECT id FROM users WHERE email='arjun.reddy@gmail.com')), 'Cognizant', 'Cloud Engineer', 'Hyderabad', '2017-07-01', '2021-12-31', FALSE, 'Architected and migrated legacy apps to AWS infrastructure.'),
((SELECT id FROM candidate_profile WHERE user_id=(SELECT id FROM users WHERE email='arjun.reddy@gmail.com')), 'Amazon', 'Senior Cloud Architect', 'Hyderabad', '2022-01-01', NULL, TRUE, 'Designing cloud-native architectures for enterprise clients.')
ON CONFLICT DO NOTHING;

-- 10. APPLICATIONS
INSERT INTO applications (job_id, candidate_profile_id, status, cover_letter) VALUES
((SELECT id FROM jobs WHERE title='Senior Frontend Engineer (React/TypeScript)' LIMIT 1), (SELECT id FROM candidate_profile WHERE user_id=(SELECT id FROM users WHERE email='rahul.sharma@gmail.com')), 'INTERVIEWING', 'I have 5 years of React experience and am excited about this role at Infosys.'),
((SELECT id FROM jobs WHERE title='Java Backend Developer (Spring Boot)' LIMIT 1), (SELECT id FROM candidate_profile WHERE user_id=(SELECT id FROM users WHERE email='amit.kumar@gmail.com')), 'SCREENING', 'Spring Boot expert with 4 years experience ready to contribute to Wipro.'),
((SELECT id FROM jobs WHERE title='Senior Frontend Engineer (React/TypeScript)' LIMIT 1), (SELECT id FROM candidate_profile WHERE user_id=(SELECT id FROM users WHERE email='priya.patel@gmail.com')), 'APPLIED', 'Full stack developer eager to specialize in frontend at Infosys.'),
((SELECT id FROM jobs WHERE title='Data Scientist (Python & ML)' LIMIT 1), (SELECT id FROM candidate_profile WHERE user_id=(SELECT id FROM users WHERE email='sneha.singh@gmail.com')), 'OFFERED', 'IIT Bombay M.Tech with deep ML expertise, perfect for this role.'),
((SELECT id FROM jobs WHERE title='DevOps Engineer (AWS & Kubernetes)' LIMIT 1), (SELECT id FROM candidate_profile WHERE user_id=(SELECT id FROM users WHERE email='rohit.verma@gmail.com')), 'INTERVIEWING', 'Currently managing Kubernetes clusters at HCL, perfect fit for TCS DevOps.'),
((SELECT id FROM jobs WHERE title='Cloud Solutions Architect' LIMIT 1), (SELECT id FROM candidate_profile WHERE user_id=(SELECT id FROM users WHERE email='arjun.reddy@gmail.com')), 'SCREENING', 'AWS certified architect with 6 years experience at Amazon and Cognizant.')
ON CONFLICT DO NOTHING;

-- 11. INTERVIEWS
INSERT INTO interviews (application_id, scheduled_at, duration_minutes, meeting_link, notes, status) VALUES
((SELECT id FROM applications WHERE candidate_profile_id=(SELECT id FROM candidate_profile WHERE user_id=(SELECT id FROM users WHERE email='rahul.sharma@gmail.com')) LIMIT 1),
 '2026-06-20 10:00:00+05:30', 60, 'https://meet.google.com/abc-defg-hij', 'Technical round - React & TypeScript assessment', 'SCHEDULED'),
((SELECT id FROM applications WHERE candidate_profile_id=(SELECT id FROM candidate_profile WHERE user_id=(SELECT id FROM users WHERE email='rohit.verma@gmail.com')) LIMIT 1),
 '2026-06-21 14:00:00+05:30', 45, 'https://zoom.us/j/123456789', 'DevOps practical interview - Kubernetes scenario', 'SCHEDULED'),
((SELECT id FROM applications WHERE candidate_profile_id=(SELECT id FROM candidate_profile WHERE user_id=(SELECT id FROM users WHERE email='arjun.reddy@gmail.com')) LIMIT 1),
 '2026-06-18 11:00:00+05:30', 90, 'https://teams.microsoft.com/meet/xyz', 'System design round for Cloud Architect', 'COMPLETED')
ON CONFLICT DO NOTHING;

-- 12. MESSAGES
INSERT INTO messages (sender_id, receiver_id, content, is_read) VALUES
((SELECT id FROM users WHERE email='infosys@recruiter.com'), (SELECT id FROM users WHERE email='rahul.sharma@gmail.com'), 'Hi Rahul, we reviewed your application and would like to schedule a technical interview. Are you available next week?', FALSE),
((SELECT id FROM users WHERE email='rahul.sharma@gmail.com'), (SELECT id FROM users WHERE email='infosys@recruiter.com'), 'Hello! Yes, I am available next week. Monday or Tuesday works best for me.', TRUE),
((SELECT id FROM users WHERE email='tcs@recruiter.com'), (SELECT id FROM users WHERE email='rohit.verma@gmail.com'), 'Rohit, your DevOps experience is impressive. We would like to proceed with your application.', FALSE),
((SELECT id FROM users WHERE email='wipro@recruiter.com'), (SELECT id FROM users WHERE email='amit.kumar@gmail.com'), 'Hi Amit, please share your latest resume and GitHub profile link for our review.', FALSE)
ON CONFLICT DO NOTHING;

-- 13. NOTIFICATIONS
INSERT INTO notifications (user_id, title, message, is_read) VALUES
((SELECT id FROM users WHERE email='rahul.sharma@gmail.com'), 'Interview Scheduled!', 'Your interview for Senior Frontend Engineer at Infosys is scheduled for June 20, 2026 at 10:00 AM.', FALSE),
((SELECT id FROM users WHERE email='sneha.singh@gmail.com'), 'Offer Received! 🎉', 'Congratulations! You have received a job offer from Tech Mahindra for Data Scientist position.', FALSE),
((SELECT id FROM users WHERE email='amit.kumar@gmail.com'), 'Application Under Review', 'Your application for Java Backend Developer at Wipro is currently being screened.', TRUE),
((SELECT id FROM users WHERE email='rohit.verma@gmail.com'), 'Application Update', 'You have been shortlisted for the DevOps Engineer role at TCS.', FALSE),
((SELECT id FROM users WHERE email='arjun.reddy@gmail.com'), 'Interview Completed', 'Your Cloud Architect interview at HCLTech is completed. Results will be shared soon.', TRUE),
((SELECT id FROM users WHERE email='infosys@recruiter.com'), 'New Application', '3 new candidates have applied to your Senior Frontend Engineer job posting.', FALSE),
((SELECT id FROM users WHERE email='wipro@recruiter.com'), 'New Application', 'Amit Kumar has applied for the Java Backend Developer position.', FALSE)
ON CONFLICT DO NOTHING;

-- 14. AUDIT LOGS
INSERT INTO audit_logs (user_id, action, details, ip_address) VALUES
((SELECT id FROM users WHERE email='admin@careersphere.com'), 'USER_LOGIN', 'Admin logged in successfully', '192.168.1.1'),
((SELECT id FROM users WHERE email='rahul.sharma@gmail.com'), 'JOB_APPLIED', 'Applied to Senior Frontend Engineer at Infosys', '103.25.44.12'),
((SELECT id FROM users WHERE email='sneha.singh@gmail.com'), 'JOB_APPLIED', 'Applied to Data Scientist position at Tech Mahindra', '106.78.33.21'),
((SELECT id FROM users WHERE email='infosys@recruiter.com'), 'JOB_POSTED', 'Posted new job: Senior Frontend Engineer (React/TypeScript)', '49.36.12.45'),
((SELECT id FROM users WHERE email='admin@careersphere.com'), 'JOB_APPROVED', 'Approved job posting by Infosys - Senior Frontend Engineer', '192.168.1.1'),
((SELECT id FROM users WHERE email='rohit.verma@gmail.com'), 'PROFILE_UPDATED', 'Updated candidate profile with new skills', '117.55.22.8'),
((SELECT id FROM users WHERE email='tcs@recruiter.com'), 'APPLICATION_STATUS_UPDATED', 'Changed Rohit Verma application status to INTERVIEWING', '52.66.44.100')
ON CONFLICT DO NOTHING;
