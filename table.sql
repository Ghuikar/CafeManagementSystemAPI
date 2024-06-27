CREATE TABLE user (
    id INT AUTO_INCREMENT PRIMARY KEY,
    contactnumber VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    status TINYINT(1) NOT NULL DEFAULT 1,
    role ENUM('admin', 'user') DEFAULT 'user',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);



INSERT INTO user (contactnumber, email, password, status, role, created_at)
VALUES ('1234567890', 'admin@admin.com', 'admin', 'true', 'admin', NOW());
