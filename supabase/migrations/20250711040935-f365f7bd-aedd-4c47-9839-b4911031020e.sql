
-- Add columns to track customer spending
ALTER TABLE public.customers 
ADD COLUMN IF NOT EXISTS total_spent NUMERIC DEFAULT 0,
ADD COLUMN IF NOT EXISTS total_bills INTEGER DEFAULT 0;

-- Update existing customers to have default values
UPDATE public.customers 
SET total_spent = 0, total_bills = 0 
WHERE total_spent IS NULL OR total_bills IS NULL;
