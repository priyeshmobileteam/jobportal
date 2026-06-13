-- Insert Recruiter User (password: 'password')
INSERT INTO users (email, phone_number, password_hash, first_name, last_name, is_enabled, is_locked)
VALUES ('recruiter@example.com', '1234567890', '$2a$10$8.ZTRTu3sh5451.Mgu3oZO0e75Q.D2D1B28t81fB6t28uE92C3D4E', 'John', 'Recruiter', TRUE, FALSE)
ON CONFLICT (email) DO UPDATE SET is_enabled = TRUE;

-- Map User to ROLE_RECRUITER
INSERT INTO user_roles (user_id, role_id)
VALUES (
    (SELECT id FROM users WHERE email = 'recruiter@example.com'),
    (SELECT id FROM roles WHERE name = 'ROLE_RECRUITER')
)
ON CONFLICT DO NOTHING;

-- Insert Recruiter Profile
INSERT INTO recruiter_profile (user_id, company_name, company_website, company_logo_url, company_description, company_address, industry, is_verified)
VALUES (
    (SELECT id FROM users WHERE email = 'recruiter@example.com'),
    'Google',
    'https://google.com',
    'https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg',
    'A multinational technology company focusing on search engine technology, online advertising, cloud computing, computer software, quantum computing, e-commerce, consumer electronics, and artificial intelligence.',
    'Mountain View, CA',
    'Information Technology',
    TRUE
)
ON CONFLICT (user_id) DO NOTHING;

-- Insert Recruiter User 2
INSERT INTO users (email, phone_number, password_hash, first_name, last_name, is_enabled, is_locked)
VALUES ('recruiter2@example.com', '9876543210', '$2a$10$8.ZTRTu3sh5451.Mgu3oZO0e75Q.D2D1B28t81fB6t28uE92C3D4E', 'Jane', 'Recruiter', TRUE, FALSE)
ON CONFLICT (email) DO UPDATE SET is_enabled = TRUE;

-- Map User to ROLE_RECRUITER
INSERT INTO user_roles (user_id, role_id)
VALUES (
    (SELECT id FROM users WHERE email = 'recruiter2@example.com'),
    (SELECT id FROM roles WHERE name = 'ROLE_RECRUITER')
)
ON CONFLICT DO NOTHING;

-- Insert Recruiter Profile 2
INSERT INTO recruiter_profile (user_id, company_name, company_website, company_logo_url, company_description, company_address, industry, is_verified)
VALUES (
    (SELECT id FROM users WHERE email = 'recruiter2@example.com'),
    'Meta',
    'https://meta.com',
    'https://upload.wikimedia.org/wikipedia/commons/7/7b/Meta_Platforms_Inc._logo.svg',
    'Meta builds technologies that help people connect, find communities and grow businesses.',
    'Menlo Park, CA',
    'Social Media & Tech',
    TRUE
)
ON CONFLICT (user_id) DO NOTHING;

-- Clean existing dummy jobs if any to avoid duplication
DELETE FROM jobs WHERE recruiter_profile_id IN (
    SELECT id FROM recruiter_profile WHERE company_name IN ('Google', 'Meta')
);

-- Insert Dummy Jobs
INSERT INTO jobs (recruiter_profile_id, title, description, requirements, benefits, location, job_type, salary_range_min, salary_range_max, status)
VALUES 
(
    (SELECT id FROM recruiter_profile WHERE company_name = 'Google'),
    'Senior Software Engineer (Java/Spring Boot)',
    'We are looking for a Senior Software Engineer to build and scale our high-throughput backend services. You will design APIs, work on performance tuning, and collaborate across teams.',
    '• 5+ years of experience with Java and Spring Boot framework.\n• Strong database design skills (PostgreSQL or similar relational DBs).\n• Experience with containerization (Docker, Kubernetes).\n• Familiarity with cloud platforms (GCP or AWS).',
    '• Competitive salary and equity package.\n• Premium healthcare, dental, and vision insurance.\n• Unlimited PTO and flexible work options.\n• Free gourmet meals and state-of-the-art office equipment.',
    'Remote / Mountain View',
    'FULL_TIME',
    140000.00,
    195000.00,
    'APPROVED'
),
(
    (SELECT id FROM recruiter_profile WHERE company_name = 'Google'),
    'Frontend Developer (React/TS)',
    'Join our product team to build beautiful, responsive, and intuitive web interfaces. You will collaborate closely with UX designers and backend engineers to construct rich web apps.',
    '• 3+ years of experience with React.js, TypeScript, and modern styling libraries.\n• Excellent understanding of state management (Redux, Context API).\n• Experience with build tools (Vite, Webpack).\n• Passion for writing clean, modular, and maintainable CSS.',
    '• Generous health and wellness allowances.\n• Work from anywhere support.\n• Learning and development budget.\n• Annual company retreats.',
    'Remote',
    'FULL_TIME',
    100000.00,
    140000.00,
    'APPROVED'
),
(
    (SELECT id FROM recruiter_profile WHERE company_name = 'Meta'),
    'Product Manager - AI Platform',
    'As a Product Manager, you will define the roadmap and drive execution for our next-generation AI platforms. You will work with engineering, design, and analytics to deliver high-impact products.',
    '• 4+ years of product management experience, preferably in AI or infrastructure.\n• Strong analytical and quantitative skills; ability to use hard data and metrics to back up assumptions.\n• Excellent communication skills to bridge technical and business requirements.',
    '• Generous compensation with annual bonuses.\n• Comprehensive mental health benefits.\n• Cell phone and home internet reimbursement.\n• Fully loaded tech pack (MacBook, Monitor, etc.).',
    'Menlo Park, CA',
    'FULL_TIME',
    160000.00,
    220000.00,
    'APPROVED'
),
(
    (SELECT id FROM recruiter_profile WHERE company_name = 'Meta'),
    'UX/UI Designer',
    'We are seeking a UX/UI Designer to craft engaging experiences across our suite of applications. You will create user personas, wireframes, prototypes, and high-fidelity visual designs.',
    '• 3+ years of experience designing mobile and desktop applications.\n• Strong portfolio demonstrating layout, typography, and visual hierarchy skills.\n• Proficiency in Figma and other design tools.\n• Basic knowledge of HTML/CSS is a plus.',
    '• Competitive hourly or project rate.\n• Flexible working hours.\n• Collaborating with a world-class design system.\n• Health insurance stipend.',
    'Remote',
    'CONTRACT',
    85000.00,
    120000.00,
    'APPROVED'
);
