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


CREATE TABLE category (
  id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(50) NOT NULL
);



CREATE TABLE products (
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    categoryId INT NOT NULL,
    description TEXT,
    price DECIMAL(10, 2) NOT NULL,
    status ENUM('active', 'inactive') DEFAULT 'active'
);


CREATE TABLE Bill (
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    uuid VARCHAR(36) NOT NULL,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL,
    contactNumber VARCHAR(15) NOT NULL,
    paymentMethod VARCHAR(15) NOT NULL,
    total int NOT NULL,
    productDetails JSOn DEFAULT NULL,
    createdBy VARCHAR(100) NOT NULL,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
