-- Sample data for testing FinTrackrX
-- This inserts test data into the database

-- Note: Run schema.sql first before running this file

-- Insert a test user (password: 'testpass123' - remember to hash in production)
-- Using bcrypt hash for 'testpass123'
INSERT INTO users (id, email, name, password_hash) VALUES
    ('550e8400-e29b-41d4-a716-446655440000', 'demo@fintrackrx.com', 'Demo User', '$2a$10$rKvVXZkqU5h5h5h5h5h5h5h5h5h5h5h5h5h5h5h5h5h5h');

-- Insert sample accounts
INSERT INTO accounts (user_id, name, type, balance, currency) VALUES
    ('550e8400-e29b-41d4-a716-446655440000', 'Main Checking', 'checking', 45000.00, 'INR'),
    ('550e8400-e29b-41d4-a716-446655440000', 'Savings Account', 'savings', 150000.00, 'INR'),
    ('550e8400-e29b-41d4-a716-446655440000', 'Credit Card', 'credit', -8500.00, 'INR');

-- Get IDs for reference (you'll need to adjust these after insert)
DO $$
DECLARE
    checking_id UUID;
    savings_id UUID;
    credit_id UUID;
    salary_cat_id UUID;
    food_cat_id UUID;
    transport_cat_id UUID;
    shopping_cat_id UUID;
BEGIN
    SELECT id INTO checking_id FROM accounts WHERE name = 'Main Checking' LIMIT 1;
    SELECT id INTO savings_id FROM accounts WHERE name = 'Savings Account' LIMIT 1;
    SELECT id INTO credit_id FROM accounts WHERE name = 'Credit Card' LIMIT 1;
    
    SELECT id INTO salary_cat_id FROM categories WHERE name = 'Salary' AND is_system = true LIMIT 1;
    SELECT id INTO food_cat_id FROM categories WHERE name = 'Food & Dining' AND is_system = true LIMIT 1;
    SELECT id INTO transport_cat_id FROM categories WHERE name = 'Transportation' AND is_system = true LIMIT 1;
    SELECT id INTO shopping_cat_id FROM categories WHERE name = 'Shopping' AND is_system = true LIMIT 1;

    -- Insert sample transactions for the last 3 months
    -- Income transactions
    INSERT INTO transactions (user_id, account_id, category_id, type, amount, description, date) VALUES
        ('550e8400-e29b-41d4-a716-446655440000', checking_id, salary_cat_id, 'income', 75000.00, 'Monthly Salary - November', CURRENT_DATE - INTERVAL '5 days'),
        ('550e8400-e29b-41d4-a716-446655440000', checking_id, salary_cat_id, 'income', 75000.00, 'Monthly Salary - October', CURRENT_DATE - INTERVAL '35 days'),
        ('550e8400-e29b-41d4-a716-446655440000', checking_id, salary_cat_id, 'income', 75000.00, 'Monthly Salary - September', CURRENT_DATE - INTERVAL '65 days');

    -- Expense transactions
    INSERT INTO transactions (user_id, account_id, category_id, type, amount, description, date) VALUES
        ('550e8400-e29b-41d4-a716-446655440000', checking_id, food_cat_id, 'expense', 1200.00, 'Grocery shopping', CURRENT_DATE - INTERVAL '2 days'),
        ('550e8400-e29b-41d4-a716-446655440000', credit_id, food_cat_id, 'expense', 850.00, 'Restaurant dinner', CURRENT_DATE - INTERVAL '3 days'),
        ('550e8400-e29b-41d4-a716-446655440000', checking_id, transport_cat_id, 'expense', 500.00, 'Uber rides', CURRENT_DATE - INTERVAL '4 days'),
        ('550e8400-e29b-41d4-a716-446655440000', credit_id, shopping_cat_id, 'expense', 3500.00, 'Online shopping', CURRENT_DATE - INTERVAL '7 days'),
        ('550e8400-e29b-41d4-a716-446655440000', checking_id, food_cat_id, 'expense', 2100.00, 'Monthly groceries', CURRENT_DATE - INTERVAL '15 days'),
        ('550e8400-e29b-41d4-a716-446655440000', credit_id, transport_cat_id, 'expense', 1500.00, 'Fuel', CURRENT_DATE - INTERVAL '10 days');

    -- Insert sample budgets
    INSERT INTO budgets (user_id, category_id, name, amount, period, start_date, is_active) VALUES
        ('550e8400-e29b-41d4-a716-446655440000', food_cat_id, 'Monthly Food Budget', 15000.00, 'monthly', DATE_TRUNC('month', CURRENT_DATE), true),
        ('550e8400-e29b-41d4-a716-446655440000', transport_cat_id, 'Monthly Transport Budget', 5000.00, 'monthly', DATE_TRUNC('month', CURRENT_DATE), true),
        ('550e8400-e29b-41d4-a716-446655440000', shopping_cat_id, 'Monthly Shopping Budget', 10000.00, 'monthly', DATE_TRUNC('month', CURRENT_DATE), true);

    -- Insert sample goals
    INSERT INTO goals (user_id, name, target_amount, current_amount, target_date, description) VALUES
        ('550e8400-e29b-41d4-a716-446655440000', 'Emergency Fund', 500000.00, 150000.00, CURRENT_DATE + INTERVAL '12 months', 'Build 6 months of expenses'),
        ('550e8400-e29b-41d4-a716-446655440000', 'Vacation Fund', 100000.00, 25000.00, CURRENT_DATE + INTERVAL '6 months', 'Trip to Europe'),
        ('550e8400-e29b-41d4-a716-446655440000', 'New Laptop', 80000.00, 45000.00, CURRENT_DATE + INTERVAL '3 months', 'MacBook Pro');

    -- Insert sample recurring transactions
    INSERT INTO recurring_transactions (user_id, account_id, category_id, type, amount, description, frequency, start_date, next_occurrence) VALUES
        ('550e8400-e29b-41d4-a716-446655440000', checking_id, salary_cat_id, 'income', 75000.00, 'Monthly Salary', 'monthly', DATE_TRUNC('month', CURRENT_DATE), DATE_TRUNC('month', CURRENT_DATE) + INTERVAL '1 month');

    -- Insert sample insights
    INSERT INTO insights (user_id, type, title, message, priority, is_read) VALUES
        ('550e8400-e29b-41d4-a716-446655440000', 'spending_pattern', 'High Dining Expenses', 'Your dining expenses are 25% higher than last month. Consider cooking at home more often.', 'medium', false),
        ('550e8400-e29b-41d4-a716-446655440000', 'savings_tip', 'Saving Opportunity', 'You could save ₹5,000 monthly by reducing entertainment expenses by 20%.', 'low', false),
        ('550e8400-e29b-41d4-a716-446655440000', 'budget_alert', 'Budget Alert: Shopping', 'You have used 75% of your monthly shopping budget with 10 days remaining.', 'high', false);
END $$;
