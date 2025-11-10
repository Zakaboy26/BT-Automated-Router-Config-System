INSERT INTO customers (customer_name)
VALUES
('Industrial Signalling'),
('Cash Machines'),
('Water Utility 1'),
('Water Utility 2'),
('Water Utility 3');

-- Outside
INSERT INTO connection_types (connection_name, connection_type
) VALUES
    ('Mobile Radio - Roaming Sim', 'OUTSIDE'),
    ('Mobile Radio - UK SIM', 'OUTSIDE'),
    ('FTTP - Private Broadband', 'OUTSIDE'),
    ('FTTP - Internet', 'OUTSIDE'),
    ('ADSL - Private Broadband', 'OUTSIDE'),
    ('ADSL - Internet', 'OUTSIDE'),
    ('SOGEA - Private Broadband', 'OUTSIDE'),
    ('VSAT Satellite - Internet', 'OUTSIDE');

-- Inside
INSERT INTO connection_types (connection_name, connection_type
) VALUES
    ('ETHERNET', 'INSIDE'),
    ('SERIAL', 'INSIDE');

INSERT INTO routers (
    router_name,
    outside_connection_types,
    inside_connection_types,
    ethernet_max_ports,
    serial_max_ports
) VALUES
    ('Virtual Access - GW1042M', 'Mobile Radio - Roaming Sim, Mobile Radio - UK SIM, FTTP - Private Broadband, FTTP - Internet, VSAT Satellite - Internet', 'ETHERNET, SERIAL', 4, 1),
    ('Virtual Access - GW1400M', 'Mobile Radio - Roaming Sim, Mobile Radio - UK SIM', 'ETHERNET', 2, NULL),
    ('Virtual Access - GW6650V', 'Mobile Radio - Roaming Sim, Mobile Radio - UK SIM, ADSL - Private Broadband, ADSL - Internet, SOGEA - Private Broadband', 'ETHERNET', 4, NULL),
    ('Westermo - Merlin-4708', 'Mobile Radio - Roaming Sim, Mobile Radio - UK SIM, FTTP - Private Broadband, FTTP - Internet, ADSL - Private Broadband, ADSL - Internet, SOGEA - Private Broadband, VSAT Satellite - Internet', 'ETHERNET, SERIAL', 4, 2);

INSERT INTO router_presets (
    router_id,
    customer_id,
    router_preset_name,
    primary_outside_connections,
    secondary_outside_connections,
    inside_connections,
    number_of_ethernet_ports,
    number_of_serial_ports,
    vlans,
    dhcp,
    additional_information
) VALUES
    (1, 1, 'Preset 1 - Virtual Access - GW1042M', 'Mobile Radio - Roaming Sim', 'Mobile Radio - UK SIM', 'ETHERNET', 2, NULL, 'OPEN_TRUNK', TRUE, NULL),
    (1, 2, 'Preset 1 - Virtual Access - GW1042M', 'Mobile Radio - Roaming Sim', 'Mobile Radio - UK SIM', 'ETHERNET', 1, NULL, 'UNSPECIFIED', FALSE, NULL),
    (3, 2, 'Preset 2 - Virtual Access - GW6650V', 'Mobile Radio - Roaming Sim', NULL, 'ETHERNET', 1, NULL, 'UNSPECIFIED', FALSE, NULL),
    (1, 3, 'Preset 1 - Virtual Access - GW1042M', 'Mobile Radio - Roaming Sim', 'Mobile Radio - UK SIM', 'ETHERNET', 2, NULL, 'UNSPECIFIED', FALSE, NULL),
    (4, 3, 'Preset 2 - Westermo - Merlin-4708', 'SOGEA - Private Broadband', 'Mobile Radio - Roaming Sim', 'ETHERNET, SERIAL', 4, 1, 'UNSPECIFIED', FALSE, NULL),
    (4, 4, 'Preset 1 - Westermo - Merlin-4708', 'SOGEA - Private Broadband', 'VSAT Satellite - Internet', 'ETHERNET', 4, NULL, 'SPECIFIED', FALSE, NULL),
    (3, 5, 'Preset 1 - Virtual Access - GW6650V', 'Mobile Radio - Roaming Sim', NULL, 'ETHERNET', 4, NULL, 'SPECIFIED', FALSE, NULL);

INSERT INTO users (email, password, first_name, last_name, role, phone_number, business_type, vat_number, billing_address, two_factor_auth, order_updates, billing_notifications, marketing_emails)
VALUES
    ('admin@bt.com', '$2a$10$ooitv27eorIEevquWn9SQOz3L/rRPGUjxGUm62QHGwRo/.iNGarta', 'Admin', 'User', 'ADMIN', '1234567890', 'Enterprise', 'GB123456789', '123 Admin Street', false, false, false, false),
    ('support@bt.com', '$2a$10$tR2UAICCTT2qhbSwxGXeVOLPB699bKAupr7W79ltooUxx64sJ/squ', 'Support', 'Agent', 'SUPPORT_AGENT', '9876543210', 'Enterprise', 'GB987654321', '456 Support Avenue', false, false, false, false),
    ('user@bt.com', '$2a$10$xn3LI/AjqicFYZFruSwve.ODd6/B.rq4yK/AHLC4bLVW9B5r0xE7W', 'Standard', 'User', 'USER', '5551112222', 'Individual', '', '789 User Road', false, false, false, false),
    ('user1@bt.com', '$2a$10$PcMFosYZpuof9buO6IkJVuD5yigjzsUniuL4c1Sr9kT3WxOwEdHp6', 'Standard', 'User', 'USER', '4443332222', 'Individual', '', '987 User Lane', false, false, false, false),
    ('tuc21087358@gmail.com', '$2a$10$PcMFosYZpuof9buO6IkJVuD5yigjzsUniuL4c1Sr9kT3WxOwEdHp6', 'Test', 'User', 'USER', '4443332222', 'Individual', '', '987 User Lane', false, false, false, false),
    ('admin1@bt.com', '$2a$10$PcMFosYZpuof9buO6IkJVuD5yigjzsUniuL4c1Sr9kT3WxOwEdHp6', 'Admin', 'User', 'ADMIN', '1234567890', 'Enterprise', 'GB123456789', '123 Admin Street', false, false, false, false);

INSERT INTO router_orders (
    customer_id, router_id, router_preset_id,
    primary_outside_connections, secondary_outside_connections,
    inside_connections, number_of_ethernet_ports, number_of_serial_ports,
    vlans, dhcp, site_name, site_address, site_postcode,
    site_primary_email, site_secondary_email, site_phone_number, site_contact_name,
    num_routers, priority_level, additional_information, add_another_router
) VALUES
      (1, 1, 1, 'Mobile Radio - Roaming Sim', 'Mobile Radio - UK SIM', 'ETHERNET', 2, 0, 'OPEN_TRUNK', TRUE, 'Signal Station A', '123 Industrial Way', 'IS1 2AA', 'contact@indusignal.com', NULL, '+441234000001', 'Alice Johnson', 1, 'High', NULL, FALSE),
      (2, 1, 2, 'Mobile Radio - Roaming Sim', 'Mobile Radio - UK SIM', 'ETHERNET', 1, 0, 'UNSPECIFIED', FALSE, 'ATM Hub 01', '45 Cash St', 'CM2 3BB', 'ops@cashcorp.com', 'support@cashcorp.com', '+441234000002', 'Bob Smith', 2, 'Medium', NULL, FALSE),
      (2, 3, 3, 'Mobile Radio - Roaming Sim', NULL, 'ETHERNET', 1, 0, 'UNSPECIFIED', FALSE, 'ATM Backup Site', '12 Vault Ave', 'CM4 5CC', 'infra@cashcorp.com', NULL, '+441234000003', 'Catherine Ray', 1, 'Low', NULL, FALSE),
      (3, 1, 4, 'Mobile Radio - Roaming Sim', 'Mobile Radio - UK SIM', 'ETHERNET', 2, 0, 'UNSPECIFIED', FALSE, 'Water Utility Pump A', '4 Riverbank Rd', 'WU1 1DD', 'admin@water1.co.uk', 'maintenance@water1.co.uk', '+441234000004', 'Daniel Owens', 1, 'Medium', NULL, TRUE),
      (3, 4, 5, 'SOGEA - Private Broadband', 'Mobile Radio - Roaming Sim', 'ETHERNET, SERIAL', 4, 1, 'UNSPECIFIED', FALSE, 'Reservoir 7', 'Reservoir Drive', 'WU1 2EE', 'ops@water1.co.uk', NULL, '+441234000005', 'Eva Green', 1, 'High', 'Needs rapid failover support', FALSE),
      (4, 4, 6, 'SOGEA - Private Broadband', 'VSAT Satellite - Internet', 'ETHERNET', 4, 0, 'SPECIFIED', FALSE, 'Water Utility HQ', '100 Treatment Ln', 'WU2 3FF', 'hq@water2.co.uk', NULL, '+441234000006', 'Frank Wu', 3, 'High', NULL, TRUE),
      (5, 3, 7, 'Mobile Radio - Roaming Sim', NULL, 'ETHERNET', 4, 0, 'SPECIFIED', FALSE, 'Monitoring Site B', '22 Pipeline Way', 'WU3 4GG', 'alert@water3.co.uk', 'notify@water3.co.uk', '+441234000007', 'Grace Lee', 1, 'Low', NULL, FALSE),
      (2, 3, 3, 'Mobile Radio - Roaming Sim', NULL, 'ETHERNET', 1, 0, 'UNSPECIFIED', FALSE, 'ATM Control Centre', '78 Bank Ln', 'CM5 6HH', 'core@cashcorp.com', NULL, '+441234000008', 'Henry Morris', 2, 'Medium', NULL, FALSE),
      (1, 1, 1, 'Mobile Radio - Roaming Sim', 'Mobile Radio - UK SIM', 'ETHERNET', 2, 0, 'OPEN_TRUNK', TRUE, 'Relay Station Z', '200 Signal Hill', 'IS3 7JJ', 'zeta@indusignal.com', NULL, '+441234000009', 'Ivy Bell', 1, 'High', NULL, FALSE),
      (4, 4, 6, 'SOGEA - Private Broadband', 'VSAT Satellite - Internet', 'ETHERNET', 4, 0, 'SPECIFIED', FALSE, 'Water Utility 2 Node', '34 Aqueduct Ave', 'WU2 8KK', 'aqua@water2.co.uk', NULL, '+441234000010', 'Jake Ford', 2, 'Medium', NULL, TRUE);

INSERT INTO orders (
    site_name,
    router_model,
    ip_address,
    configuration_details,
    router_type,
    number_of_routers,
    address,
    city,
    postcode,
    email,
    phone_number
) VALUES
('Norwich', 'Virtual Access - GW1400M', '192.168.1.250', 'Custom Config', 'Fiber', 20, '89 Virginia Road', 'Surrey', 'CR9 5EJ', 'user1@bt.com', '07951322284'),
('Manchester', 'Cisco ISR 4331', '192.168.2.150', 'Standard Setup', 'Fiber', 15, '123 King Street', 'Manchester', 'M1 1AB', 'user1@bt.com', '07789965432'),
('Liverpool', 'Juniper MX204', '10.0.0.5', 'Advanced Routing', 'DSL', 10, '45 Albert Dock', 'Liverpool', 'L3 4BB', 'user1@bt.com', '07512347856'),
('Birmingham', 'Virtual Access - GW1400M', '192.168.1.100', 'Default Config', 'Fiber', 25, '22 High Street', 'Birmingham', 'B5 6TH', 'user1@bt.com', '07896541236'),
('Leeds', 'Huawei AR169', '10.1.1.1', 'Custom VLAN Setup', 'Cable', 5, '78 Park Row', 'Leeds', 'LS1 5HN', 'user1@bt.com', '07456893211'),
('Glasgow', 'Cisco ISR 4461', '172.16.0.250', 'Enterprise Setup', 'Fiber', 30, '55 Buchanan Street', 'Glasgow', 'G1 2HL', 'user1@bt.com', '07324578965'),
('Edinburgh', 'MikroTik RB4011', '192.168.50.2', 'Wireless Optimization', 'DSL', 8, '33 Princes Street', 'Edinburgh', 'EH2 2BY', 'user1@bt.com', '07011223344'),
('Bristol', 'Ubiquiti EdgeRouter 12', '10.10.10.10', 'Remote VPN Config', 'Cable', 12, '99 Park Avenue', 'Bristol', 'BS1 4DJ', 'user1@bt.com', '07123456789');
