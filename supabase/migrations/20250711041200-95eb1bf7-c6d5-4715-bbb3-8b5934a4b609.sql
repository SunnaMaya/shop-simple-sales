
-- Add total_spent and total_bills columns to customers table
ALTER TABLE public.customers 
ADD COLUMN total_spent DECIMAL(10,2) DEFAULT 0,
ADD COLUMN total_bills INTEGER DEFAULT 0;
