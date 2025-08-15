CREATE DATABASE expertSoft;
USE expertSoft;


-- Create client table
CREATE TABLE IF NOT EXISTS client (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name_client VARCHAR(255) NOT NULL,
    identificacion VARCHAR(50) UNIQUE NOT NULL,
    address TEXT,
    phone VARCHAR(50),
    email VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Create transaction table
CREATE TABLE IF NOT EXISTS transaction (
    id INT AUTO_INCREMENT PRIMARY KEY,
    id_transaction VARCHAR(50) UNIQUE NOT NULL,
    date_and_time DATETIME NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    transaction_type VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Create invoiced table
CREATE TABLE IF NOT EXISTS invoiced (
    id INT AUTO_INCREMENT PRIMARY KEY,
    invoice_numbe VARCHAR(50) UNIQUE NOT NULL,
    platform VARCHAR(100) NOT NULL,
    billing_period VARCHAR(20) NOT NULL,
    invoiced_amount DECIMAL(10,2) NOT NULL,
    amount_paid DECIMAL(10,2) DEFAULT 0,
    identificacion VARCHAR(50) NOT NULL,
    id_transaction VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (identificacion) REFERENCES client(identificacion) ON DELETE CASCADE,
    FOREIGN KEY (id_transaction) REFERENCES transaction(id_transaction) ON DELETE SET NULL
);

-- Create state table
CREATE TABLE IF NOT EXISTS state (
    id INT AUTO_INCREMENT PRIMARY KEY,
    transaction_status VARCHAR(50) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

