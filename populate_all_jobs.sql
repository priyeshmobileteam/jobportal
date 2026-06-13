-- Truncate existing jobs, applications, recruiter_profile and users mapped to these recruiters to clean up
DELETE FROM jobs;
DELETE FROM recruiter_profile;
DELETE FROM user_roles WHERE user_id IN (SELECT id FROM users WHERE email LIKE '%@recruiter.com');
DELETE FROM users WHERE email LIKE '%@recruiter.com';

-- Helper Function/Block to Insert Recruiter and Profile
-- We will write standard INSERT statements to support plain psql run.

-- 1. Infosys Recruiter
INSERT INTO users (email, phone_number, password_hash, first_name, last_name, is_enabled, is_locked)
VALUES ('infosys@recruiter.com', '9000000001', '$2a$10$8.ZTRTu3sh5451.Mgu3oZO0e75Q.D2D1B28t81fB6t28uE92C3D4E', 'Infosys', 'HR', TRUE, FALSE) ON CONFLICT DO NOTHING;
INSERT INTO user_roles (user_id, role_id) VALUES ((SELECT id FROM users WHERE email = 'infosys@recruiter.com'), (SELECT id FROM roles WHERE name = 'ROLE_RECRUITER')) ON CONFLICT DO NOTHING;
INSERT INTO recruiter_profile (user_id, company_name, company_website, industry, is_verified)
VALUES ((SELECT id FROM users WHERE email = 'infosys@recruiter.com'), 'Infosys', 'https://infosys.com', 'IT Services', TRUE) ON CONFLICT DO NOTHING;

-- 2. Wipro Recruiter
INSERT INTO users (email, phone_number, password_hash, first_name, last_name, is_enabled, is_locked)
VALUES ('wipro@recruiter.com', '9000000002', '$2a$10$8.ZTRTu3sh5451.Mgu3oZO0e75Q.D2D1B28t81fB6t28uE92C3D4E', 'Wipro', 'HR', TRUE, FALSE) ON CONFLICT DO NOTHING;
INSERT INTO user_roles (user_id, role_id) VALUES ((SELECT id FROM users WHERE email = 'wipro@recruiter.com'), (SELECT id FROM roles WHERE name = 'ROLE_RECRUITER')) ON CONFLICT DO NOTHING;
INSERT INTO recruiter_profile (user_id, company_name, company_website, industry, is_verified)
VALUES ((SELECT id FROM users WHERE email = 'wipro@recruiter.com'), 'Wipro', 'https://wipro.com', 'IT Services', TRUE) ON CONFLICT DO NOTHING;

-- 3. Tech Mahindra Recruiter
INSERT INTO users (email, phone_number, password_hash, first_name, last_name, is_enabled, is_locked)
VALUES ('techm@recruiter.com', '9000000003', '$2a$10$8.ZTRTu3sh5451.Mgu3oZO0e75Q.D2D1B28t81fB6t28uE92C3D4E', 'TechM', 'HR', TRUE, FALSE) ON CONFLICT DO NOTHING;
INSERT INTO user_roles (user_id, role_id) VALUES ((SELECT id FROM users WHERE email = 'techm@recruiter.com'), (SELECT id FROM roles WHERE name = 'ROLE_RECRUITER')) ON CONFLICT DO NOTHING;
INSERT INTO recruiter_profile (user_id, company_name, company_website, industry, is_verified)
VALUES ((SELECT id FROM users WHERE email = 'techm@recruiter.com'), 'Tech Mahindra', 'https://techmahindra.com', 'IT Consulting', TRUE) ON CONFLICT DO NOTHING;

-- 4. TCS Recruiter
INSERT INTO users (email, phone_number, password_hash, first_name, last_name, is_enabled, is_locked)
VALUES ('tcs@recruiter.com', '9000000004', '$2a$10$8.ZTRTu3sh5451.Mgu3oZO0e75Q.D2D1B28t81fB6t28uE92C3D4E', 'TCS', 'HR', TRUE, FALSE) ON CONFLICT DO NOTHING;
INSERT INTO user_roles (user_id, role_id) VALUES ((SELECT id FROM users WHERE email = 'tcs@recruiter.com'), (SELECT id FROM roles WHERE name = 'ROLE_RECRUITER')) ON CONFLICT DO NOTHING;
INSERT INTO recruiter_profile (user_id, company_name, company_website, industry, is_verified)
VALUES ((SELECT id FROM users WHERE email = 'tcs@recruiter.com'), 'TCS', 'https://tcs.com', 'Software Services', TRUE) ON CONFLICT DO NOTHING;

-- 5. HCLTech Recruiter
INSERT INTO users (email, phone_number, password_hash, first_name, last_name, is_enabled, is_locked)
VALUES ('hcl@recruiter.com', '9000000005', '$2a$10$8.ZTRTu3sh5451.Mgu3oZO0e75Q.D2D1B28t81fB6t28uE92C3D4E', 'HCLTech', 'HR', TRUE, FALSE) ON CONFLICT DO NOTHING;
INSERT INTO user_roles (user_id, role_id) VALUES ((SELECT id FROM users WHERE email = 'hcl@recruiter.com'), (SELECT id FROM roles WHERE name = 'ROLE_RECRUITER')) ON CONFLICT DO NOTHING;
INSERT INTO recruiter_profile (user_id, company_name, company_website, industry, is_verified)
VALUES ((SELECT id FROM users WHERE email = 'hcl@recruiter.com'), 'HCLTech', 'https://hcltech.com', 'IT Infrastructure', TRUE) ON CONFLICT DO NOTHING;

-- 6. Cognizant Recruiter
INSERT INTO users (email, phone_number, password_hash, first_name, last_name, is_enabled, is_locked)
VALUES ('cognizant@recruiter.com', '9000000006', '$2a$10$8.ZTRTu3sh5451.Mgu3oZO0e75Q.D2D1B28t81fB6t28uE92C3D4E', 'Cognizant', 'HR', TRUE, FALSE) ON CONFLICT DO NOTHING;
INSERT INTO user_roles (user_id, role_id) VALUES ((SELECT id FROM users WHERE email = 'cognizant@recruiter.com'), (SELECT id FROM roles WHERE name = 'ROLE_RECRUITER')) ON CONFLICT DO NOTHING;
INSERT INTO recruiter_profile (user_id, company_name, company_website, industry, is_verified)
VALUES ((SELECT id FROM users WHERE email = 'cognizant@recruiter.com'), 'Cognizant', 'https://cognizant.com', 'IT Consulting', TRUE) ON CONFLICT DO NOTHING;

-- 7. Capgemini Recruiter
INSERT INTO users (email, phone_number, password_hash, first_name, last_name, is_enabled, is_locked)
VALUES ('capgemini@recruiter.com', '9000000007', '$2a$10$8.ZTRTu3sh5451.Mgu3oZO0e75Q.D2D1B28t81fB6t28uE92C3D4E', 'Capgemini', 'HR', TRUE, FALSE) ON CONFLICT DO NOTHING;
INSERT INTO user_roles (user_id, role_id) VALUES ((SELECT id FROM users WHERE email = 'capgemini@recruiter.com'), (SELECT id FROM roles WHERE name = 'ROLE_RECRUITER')) ON CONFLICT DO NOTHING;
INSERT INTO recruiter_profile (user_id, company_name, company_website, industry, is_verified)
VALUES ((SELECT id FROM users WHERE email = 'capgemini@recruiter.com'), 'Capgemini', 'https://capgemini.com', 'Business Services', TRUE) ON CONFLICT DO NOTHING;

-- 8. Accenture Recruiter
INSERT INTO users (email, phone_number, password_hash, first_name, last_name, is_enabled, is_locked)
VALUES ('accenture@recruiter.com', '9000000008', '$2a$10$8.ZTRTu3sh5451.Mgu3oZO0e75Q.D2D1B28t81fB6t28uE92C3D4E', 'Accenture', 'HR', TRUE, FALSE) ON CONFLICT DO NOTHING;
INSERT INTO user_roles (user_id, role_id) VALUES ((SELECT id FROM users WHERE email = 'accenture@recruiter.com'), (SELECT id FROM roles WHERE name = 'ROLE_RECRUITER')) ON CONFLICT DO NOTHING;
INSERT INTO recruiter_profile (user_id, company_name, company_website, industry, is_verified)
VALUES ((SELECT id FROM users WHERE email = 'accenture@recruiter.com'), 'Accenture', 'https://accenture.com', 'Strategy & Tech', TRUE) ON CONFLICT DO NOTHING;

-- 9. LTI-Mindtree Recruiter
INSERT INTO users (email, phone_number, password_hash, first_name, last_name, is_enabled, is_locked)
VALUES ('lti@recruiter.com', '9000000009', '$2a$10$8.ZTRTu3sh5451.Mgu3oZO0e75Q.D2D1B28t81fB6t28uE92C3D4E', 'LTI-Mindtree', 'HR', TRUE, FALSE) ON CONFLICT DO NOTHING;
INSERT INTO user_roles (user_id, role_id) VALUES ((SELECT id FROM users WHERE email = 'lti@recruiter.com'), (SELECT id FROM roles WHERE name = 'ROLE_RECRUITER')) ON CONFLICT DO NOTHING;
INSERT INTO recruiter_profile (user_id, company_name, company_website, industry, is_verified)
VALUES ((SELECT id FROM users WHERE email = 'lti@recruiter.com'), 'LTI-Mindtree', 'https://ltimindtree.com', 'Information Technology', TRUE) ON CONFLICT DO NOTHING;

-- 10. WNS Recruiter
INSERT INTO users (email, phone_number, password_hash, first_name, last_name, is_enabled, is_locked)
VALUES ('wns@recruiter.com', '9000000010', '$2a$10$8.ZTRTu3sh5451.Mgu3oZO0e75Q.D2D1B28t81fB6t28uE92C3D4E', 'WNS', 'HR', TRUE, FALSE) ON CONFLICT DO NOTHING;
INSERT INTO user_roles (user_id, role_id) VALUES ((SELECT id FROM users WHERE email = 'wns@recruiter.com'), (SELECT id FROM roles WHERE name = 'ROLE_RECRUITER')) ON CONFLICT DO NOTHING;
INSERT INTO recruiter_profile (user_id, company_name, company_website, industry, is_verified)
VALUES ((SELECT id FROM users WHERE email = 'wns@recruiter.com'), 'WNS', 'https://wns.com', 'BPO Services', TRUE) ON CONFLICT DO NOTHING;


-- Insert the 10 Approved Jobs
INSERT INTO jobs (recruiter_profile_id, title, description, requirements, benefits, location, job_type, salary_range_min, salary_range_max, status)
VALUES 
(
    (SELECT id FROM recruiter_profile WHERE company_name = 'Infosys'),
    'Senior Frontend Engineer (React/TypeScript)',
    'We are looking for a Senior Frontend Engineer with expert level React and TypeScript skills to lead our user interface development team in Noida.',
    '• 5+ years of React.js experience.\n• Proficiency in TypeScript, Tailwind CSS, and state management.',
    '• Health Insurance\n• Flexible Working Hours\n• Annual Performance Bonus',
    'Noida, Uttar Pradesh',
    'FULL_TIME',
    1200000.00,
    1800000.00,
    'APPROVED'
),
(
    (SELECT id FROM recruiter_profile WHERE company_name = 'Wipro'),
    'Java Backend Developer (Spring Boot)',
    'Join our backend development squad. You will build and deploy microservices using Spring Boot, Hibernate, and PostgreSQL.',
    '• 3+ years experience with Java, Spring Boot, Hibernate.\n• Strong database design capabilities.',
    '• Commuter benefits\n• Comprehensive healthcare plans\n• Wellness allowance',
    'Delhi NCR',
    'FULL_TIME',
    900000.00,
    1400000.00,
    'APPROVED'
),
(
    (SELECT id FROM recruiter_profile WHERE company_name = 'Tech Mahindra'),
    'UI/UX Designer',
    'Create user journeys, wireframes, prototypes, and beautiful screen layouts for high-traffic enterprise web applications.',
    '• Proficiency in Figma or Adobe XD.\n• Solid understanding of design principles and color theory.',
    '• Work from home setup allowance\n• Performance incentive plans',
    'Mumbai, Maharashtra',
    'CONTRACT',
    800000.00,
    1200000.00,
    'APPROVED'
),
(
    (SELECT id FROM recruiter_profile WHERE company_name = 'TCS'),
    'Data Scientist (Machine Learning)',
    'We are looking for a Data Scientist to join our advanced analytics team. You will build predictive ML models and pipelines.',
    '• Strong experience with Python, Pandas, Scikit-learn, TensorFlow.\n• Experience with SQL and database design.',
    '• Top-tier health coverage\n• Free gourmet meals\n• Learning & certification support',
    'Bengaluru, Karnataka',
    'FULL_TIME',
    1400000.00,
    2200000.00,
    'APPROVED'
),
(
    (SELECT id FROM recruiter_profile WHERE company_name = 'HCLTech'),
    'DevOps & Cloud Engineer',
    'Help us design and maintain CI/CD pipelines, automate cloud infrastructure, and manage Kubernetes clusters.',
    '• 3+ years managing AWS or Azure cloud infrastructure.\n• Proficient in Docker, Kubernetes, Terraform, and Jenkins.',
    '• Flexible remote options\n• Modern work equipment allowance\n• Annual bonus',
    'Hyderabad, Telangana',
    'FULL_TIME',
    1100000.00,
    1600000.00,
    'APPROVED'
),
(
    (SELECT id FROM recruiter_profile WHERE company_name = 'Cognizant'),
    'Mobile App Developer (Flutter/iOS/Android)',
    'We are looking for a passionate mobile developer to create smooth, high-fidelity applications across Android and iOS platforms.',
    '• 2+ years of Dart and Flutter development.\n• Published apps on App Store or Google Play Store.',
    '• Medical & dental allowance\n• Cab pickup/drop service\n• Team outings',
    'Pune, Maharashtra',
    'FULL_TIME',
    750000.00,
    1100000.00,
    'APPROVED'
),
(
    (SELECT id FROM recruiter_profile WHERE company_name = 'Capgemini'),
    'Full Stack MERN Developer',
    'Develop full stack web applications using MongoDB, Express, React, and Node.js. Join a fast-paced software delivery team.',
    '• 3+ years experience with JavaScript/Node.js, Express, React, MongoDB.\n• Strong Git practices.',
    '• Home office setup stipend\n• Comprehensive insurance\n• 25 days paid leaves',
    'Gurgaon, Haryana',
    'FULL_TIME',
    850000.00,
    1300000.00,
    'APPROVED'
),
(
    (SELECT id FROM recruiter_profile WHERE company_name = 'Accenture'),
    'QA Automation Engineer',
    'Write automation test scripts for web applications and APIs. Ensure robust quality standards for our corporate web projects.',
    '• Expert in Selenium, Java/Python, and REST Assured.\n• Experience with CI/CD integrations.',
    '• Wellness allowance\n• Flexible work environment\n• Childcare support',
    'Chennai, Tamil Nadu',
    'FULL_TIME',
    700000.00,
    1050000.00,
    'APPROVED'
),
(
    (SELECT id FROM recruiter_profile WHERE company_name = 'LTI-Mindtree'),
    'Technical Product Manager',
    'Drive the product lifecycle of enterprise cloud platforms. Collaborate with developers, designers, and customers to shape the product roadmap.',
    '• 4+ years product management experience.\n• Exceptional communication and planning skills.',
    '• Work from anywhere in India\n• Top-tier salary and stock options\n• Health insurance',
    'Remote',
    'FULL_TIME',
    1500000.00,
    2200000.00,
    'APPROVED'
),
(
    (SELECT id FROM recruiter_profile WHERE company_name = 'WNS'),
    'HR Talent Acquisition Specialist',
    'Manage the recruitment process, coordinate interviews, source candidates, and handle onboarding for our corporate divisions.',
    '• 2+ years of full-cycle recruiting experience.\n• Experience with ATS systems.',
    '• Performance bonuses\n• Commuter assistance\n• Work-life balance policies',
    'Jaipur, Rajasthan',
    'FULL_TIME',
    500000.00,
    750000.00,
    'APPROVED'
);
