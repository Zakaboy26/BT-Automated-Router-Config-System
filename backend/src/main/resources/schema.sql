-- Use the BT Router database
DROP DATABASE IF EXISTS bt_router_db;
CREATE DATABASE IF NOT EXISTS bt_router_db;
USE bt_router_db;

SET FOREIGN_KEY_CHECKS=0;

DROP TABLE IF EXISTS requested_routers;
DROP TABLE IF EXISTS router_requests;
DROP TABLE IF EXISTS router_presets;
DROP TABLE IF EXISTS routers;
DROP TABLE IF EXISTS orders;
DROP TABLE IF EXISTS customers;
DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS roles;
DROP TABLE IF EXISTS order_tracking;

SET FOREIGN_KEY_CHECKS=1;

CREATE TABLE users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    first_name VARCHAR(255) NOT NULL,
    last_name VARCHAR(255) NOT NULL,
    role ENUM('ADMIN', 'SUPPORT_AGENT', 'USER') NOT NULL,
    reset_token VARCHAR(100),
    reset_token_expiry TIMESTAMP,

    phone_number VARCHAR(20),
    business_type VARCHAR(255),
    vat_number VARCHAR(50),
    billing_address VARCHAR(255),
    two_factor_auth BOOLEAN DEFAULT FALSE,
    order_updates BOOLEAN DEFAULT FALSE,
    billing_notifications BOOLEAN DEFAULT FALSE,
    marketing_emails BOOLEAN DEFAULT FALSE,

    two_factor_code VARCHAR(10),
    two_factor_expiry TIMESTAMP
);

CREATE TABLE customers (
    customer_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    customer_name VARCHAR(255) NOT NULL
);

CREATE TABLE connection_types (
    connection_id SERIAL PRIMARY KEY,
    connection_name VARCHAR(255) UNIQUE NOT NULL,
    connection_type VARCHAR(20) NOT NULL CHECK (connection_type IN ('INSIDE', 'OUTSIDE'))
);

CREATE TABLE routers (
    router_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    router_name VARCHAR(255) NOT NULL,
    outside_connection_types TEXT NOT NULL,
    inside_connection_types TEXT NOT NULL,
    ethernet_max_ports SMALLINT CHECK (ethernet_max_ports >= 0),
    serial_max_ports SMALLINT CHECK (serial_max_ports >= 0)
);

CREATE TABLE router_presets (
    router_preset_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    router_id BIGINT NOT NULL,
    customer_id BIGINT NOT NULL,
    router_preset_name VARCHAR(255) NOT NULL,
    primary_outside_connections VARCHAR(255) NOT NULL,
    secondary_outside_connections VARCHAR(255),
    inside_connections VARCHAR(255) NOT NULL,
    number_of_ethernet_ports SMALLINT CHECK (number_of_ethernet_ports >= 0),
    number_of_serial_ports SMALLINT CHECK (number_of_serial_ports >= 0),
    vlans ENUM('UNSPECIFIED', 'SPECIFIED', 'OPEN_TRUNK') NOT NULL,
    dhcp BOOLEAN DEFAULT NULL,
    additional_information VARCHAR(500),

    FOREIGN KEY (router_id) REFERENCES routers(router_id)
        ON DELETE CASCADE
        ON UPDATE CASCADE,

    FOREIGN KEY (customer_id) REFERENCES customers(customer_id)
        ON DELETE CASCADE
        ON UPDATE CASCADE
);

CREATE TABLE orders (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    site_name VARCHAR(255) NOT NULL,
    router_model VARCHAR(255) NOT NULL,
    ip_address VARCHAR(255),
    configuration_details TEXT,
    router_type VARCHAR(255) NOT NULL,
    number_of_routers INT NOT NULL DEFAULT 1,
    address VARCHAR(255) NOT NULL,
    city VARCHAR(255) NOT NULL,
    postcode VARCHAR(20) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone_number VARCHAR(50) NOT NULL,
    order_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,

    user_id BIGINT NULL,
    FOREIGN KEY (email) REFERENCES users(email) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
);

CREATE TABLE router_orders (
    router_order_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    customer_id BIGINT NOT NULL,
    router_id BIGINT NOT NULL,
    router_preset_id BIGINT,
    primary_outside_connections VARCHAR(255) NOT NULL,
    secondary_outside_connections VARCHAR(255),
    inside_connections VARCHAR(255) NOT NULL,
    number_of_ethernet_ports SMALLINT CHECK (number_of_ethernet_ports >= 0),
    number_of_serial_ports SMALLINT CHECK (number_of_serial_ports >= 0),
    vlans ENUM('UNSPECIFIED', 'SPECIFIED', 'OPEN_TRUNK') NOT NULL,
    dhcp BOOLEAN DEFAULT NULL,
    site_name VARCHAR(100) NOT NULL,
    site_address VARCHAR(255) NOT NULL,
    site_postcode VARCHAR(20) NOT NULL,
    site_primary_email VARCHAR(100) NOT NULL,
    site_secondary_email VARCHAR(100),
    site_phone_number VARCHAR(20) NOT NULL,
    site_contact_name VARCHAR(100) NOT NULL,
    num_routers INT NOT NULL DEFAULT 1 CHECK (num_routers > 0),
    priority_level VARCHAR(20) NOT NULL,
    additional_information VARCHAR(500),
    add_another_router BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    FOREIGN KEY (customer_id) REFERENCES customers(customer_id)
        ON DELETE CASCADE
        ON UPDATE CASCADE,

    FOREIGN KEY (router_id) REFERENCES routers(router_id)
        ON DELETE CASCADE
        ON UPDATE CASCADE,

    FOREIGN KEY (router_preset_id) REFERENCES router_presets(router_preset_id)
        ON DELETE CASCADE
        ON UPDATE CASCADE
);

CREATE TABLE order_tracking (
    id INT AUTO_INCREMENT PRIMARY KEY,
    router_order_id BIGINT NOT NULL,
    reference_number VARCHAR(20) UNIQUE NOT NULL,
    status ENUM('PENDING', 'CONFIRMED', 'IN_PRODUCTION', 'QUALITY_CHECK', 'READY_FOR_SHIPPING', 'IN_TRANSIT', 'DELIVERED', 'CANCELLED') NOT NULL DEFAULT 'PENDING',
    can_modify BOOLEAN DEFAULT TRUE,
    can_cancel BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (router_order_id) REFERENCES router_orders(router_order_id) ON DELETE CASCADE,
    INDEX idx_reference_number (reference_number),
    INDEX idx_order_status (status)
);

CREATE TABLE news (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description VARCHAR(5000),
    author VARCHAR(255),
    created_at DATETIME
);

CREATE TABLE user_reports (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    report_reference VARCHAR(255) NOT NULL,
    issue_type VARCHAR(255) NOT NULL,
    reference_number VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    date DATE NOT NULL,
    explanation TEXT,
    CONSTRAINT uq_report_reference UNIQUE (report_reference)
);
