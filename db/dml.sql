-- Genesis Financial System Seed Data
-- DML (Data Manipulation Language)

USE genesis_financial;

-- Insert sample client (matching mockup: Eddy Cusuma)
INSERT INTO clients (first_name, last_name, email, dpi, birth_date, address, department, municipality, avatar_url) VALUES
('Eddy', 'Cusuma', 'eddy.cusuma@gmail.com', '1234567890123', '1990-05-15', 'Zona 10', 'Guatemala', 'Guatemala', 'https://randomuser.me/api/portraits/women/44.jpg'),
('Juan', 'Perez', 'juan.perez@gmail.com', '9876543210123', '1985-03-22', 'Zona 14', 'Guatemala', 'Guatemala', 'https://randomuser.me/api/portraits/men/32.jpg'),
('Maria', 'Garcia', 'maria.garcia@gmail.com', '5678901234567', '1992-11-08', 'Zona 15', 'Guatemala', 'Mixco', 'https://randomuser.me/api/portraits/women/68.jpg');

-- Insert accounts (matching mockup: card ending in 1234, balance $5,756)
INSERT INTO accounts (client_id, card_number, balance, holder_name, expiration_date, card_type) VALUES
(1, '3778123456781234', 5756.00, 'Eddy Cusuma', '12/22', 'debit'),
(1, '4532987654321098', 3200.00, 'Eddy Cusuma', '06/25', 'credit'),
(2, '5234567890123456', 12750.00, 'Juan Perez', '03/24', 'debit'),
(3, '6789012345678901', 8500.00, 'Maria Garcia', '09/26', 'credit');

-- Insert transactions (matching mockup data)
-- Recent transactions for Eddy Cusuma
INSERT INTO transactions (account_id, description, type, category, amount, status, transaction_date) VALUES
-- Deposito Tarjeta - $850
(1, 'Deposito Tarjeta', 'deposit', 'income', 850.00, 'completed', '2026-01-28 10:30:00'),
-- Deposito Paypal - $2,500
(1, 'Deposito Paypal', 'deposit', 'income', 2500.00, 'completed', '2026-01-25 14:15:00'),
-- Joan Arango transfer - $5,400
(1, 'Joan Arango', 'transfer', 'other', 5400.00, 'completed', '2026-01-21 09:45:00'),

-- Transactions for "Cuentas" page
(1, 'Spotify Subscription', 'purchase', 'entertainment', 150.00, 'pending', '2026-01-25 08:00:00'),
(1, 'Mobile Service', 'service', 'bills', 340.00, 'completed', '2026-01-25 11:30:00'),
(1, 'Emilly Wilson', 'transfer', 'other', 780.00, 'completed', '2026-01-25 16:00:00'),

-- More transactions for weekly activity chart
(1, 'Grocery Store', 'purchase', 'other', 125.00, 'completed', '2026-03-03 12:00:00'),
(1, 'Electric Bill', 'service', 'bills', 85.00, 'completed', '2026-03-04 09:00:00'),
(1, 'Salary Deposit', 'deposit', 'income', 3500.00, 'completed', '2026-03-05 08:00:00'),
(1, 'Netflix', 'purchase', 'entertainment', 15.99, 'completed', '2026-03-05 10:00:00'),
(1, 'Restaurant', 'purchase', 'entertainment', 45.00, 'completed', '2026-03-06 19:30:00'),
(1, 'ATM Withdrawal', 'withdrawal', 'other', 200.00, 'completed', '2026-03-07 14:00:00'),
(1, 'Investment Fund', 'withdrawal', 'investment', 500.00, 'completed', '2026-03-07 16:00:00'),

-- Historical transactions (for balance history chart)
(1, 'January Salary', 'deposit', 'income', 3500.00, 'completed', '2025-09-01 08:00:00'),
(1, 'Rent Payment', 'withdrawal', 'bills', 800.00, 'completed', '2025-09-05 10:00:00'),
(1, 'October Salary', 'deposit', 'income', 3500.00, 'completed', '2025-10-01 08:00:00'),
(1, 'Car Insurance', 'service', 'bills', 250.00, 'completed', '2025-10-15 11:00:00'),
(1, 'November Salary', 'deposit', 'income', 3500.00, 'completed', '2025-11-01 08:00:00'),
(1, 'Black Friday Shopping', 'purchase', 'entertainment', 450.00, 'completed', '2025-11-29 14:00:00'),
(1, 'December Salary', 'deposit', 'income', 3500.00, 'completed', '2025-12-01 08:00:00'),
(1, 'Christmas Shopping', 'purchase', 'other', 600.00, 'completed', '2025-12-20 16:00:00'),
(1, 'Year-end Bonus', 'deposit', 'income', 2000.00, 'completed', '2025-12-24 08:00:00'),
(1, 'January Salary 2026', 'deposit', 'income', 3500.00, 'completed', '2026-01-02 08:00:00'),
(1, 'New Year Shopping', 'purchase', 'entertainment', 300.00, 'completed', '2026-01-03 12:00:00'),
(1, 'February Salary', 'deposit', 'income', 3500.00, 'completed', '2026-02-01 08:00:00'),
(1, 'Valentine Gift', 'purchase', 'other', 150.00, 'completed', '2026-02-14 18:00:00');

-- Insert scheduled payments (matching mockup)
INSERT INTO scheduled_payments (account_id, description, amount, scheduled_date, icon) VALUES
(1, 'Apple Store', 450.00, '2026-03-09 05:00:00', 'apple'),
(1, 'Michael', 160.00, '2026-03-07 00:00:00', 'user'),
(1, 'Playstation', 1085.00, '2026-03-04 00:00:00', 'gamepad'),
(1, 'William', 90.00, '2026-02-27 00:00:00', 'user');

-- Insert contacts for quick transfer (matching mockup)
INSERT INTO contacts (client_id, name, relationship, avatar_url, account_number) VALUES
(1, 'Victoria', 'Amiga', 'https://randomuser.me/api/portraits/women/32.jpg', '1234567890123456'),
(1, 'Raúl', 'Hermano', 'https://randomuser.me/api/portraits/men/45.jpg', '2345678901234567'),
(1, 'José', 'Primo', 'https://randomuser.me/api/portraits/men/67.jpg', '3456789012345678'),
(1, 'Ana', 'Madre', 'https://randomuser.me/api/portraits/women/55.jpg', '4567890123456789');

-- Additional transactions for Juan Perez (client 2)
INSERT INTO transactions (account_id, description, type, category, amount, status, transaction_date) VALUES
(3, 'Salary', 'deposit', 'income', 5600.00, 'completed', '2026-03-01 08:00:00'),
(3, 'Rent', 'withdrawal', 'bills', 1200.00, 'completed', '2026-03-02 10:00:00'),
(3, 'Freelance Project', 'deposit', 'income', 2500.00, 'completed', '2026-03-03 15:00:00'),
(3, 'Utilities', 'service', 'bills', 180.00, 'completed', '2026-03-04 09:00:00');
