CREATE DATABASE expertSoft;
USE expertSoft;


CREATE TABLE state (
    transaction_status varchar(50) PRIMARY KEY
);


CREATE TABLE client (
    identificacion INT PRIMARY KEY,
    name_client VARCHAR(50),
    phone VARCHAR(50),
    address VARCHAR(50),
    email VARCHAR(50)
);

CREATE TABLE transaction (
    id_transaction VARCHAR(50) PRIMARY KEY,
    date_and_time TIMESTAMP,
    amount INT,
    transaction_type VARCHAR(50),
    transaction_status VARCHAR(50),
    FOREIGN KEY (transaction_status) REFERENCES state(transaction_status) ON DELETE RESTRICT
);

CREATE TABLE invoiced (
    invoice_number VARCHAR(50) PRIMARY KEY,
    platform VARCHAR(50),
    billing_period TIMESTAMP,
    invoiced_amount INT,
    amount_paid INT,
    identificacion INT,
    id_transaction VARCHAR(50),
    FOREIGN KEY (identificacion) REFERENCES client(identificacion) ON DELETE CASCADE,
    FOREIGN KEY (id_transaction) REFERENCES transaction(id_transaction) ON DELETE CASCADE
);