-- Create payment_gateways table for Super Admin management
CREATE TABLE IF NOT EXISTS public.payment_gateways (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  provider TEXT NOT NULL, -- 'razorpay', 'phonepe', etc.
  is_active BOOLEAN DEFAULT false,
  api_key TEXT,
  api_secret TEXT,
  merchant_id TEXT,
  webhook_secret TEXT,
  test_mode BOOLEAN DEFAULT true,
  config JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.payment_gateways ENABLE ROW LEVEL SECURITY;

-- Only super admins can manage payment gateways
CREATE POLICY "payment_gateways_super_admin_only" ON public.payment_gateways
  FOR ALL USING (auth.jwt() ->> 'email' = 'superadmin@testcraft.in');

-- Insert default Razorpay gateway
INSERT INTO public.payment_gateways (name, provider, is_active, test_mode)
VALUES ('Razorpay', 'razorpay', true, true)
ON CONFLICT (name) DO NOTHING;

-- Insert PhonePe gateway
INSERT INTO public.payment_gateways (name, provider, is_active, test_mode)
VALUES ('PhonePe', 'phonepe', false, true)
ON CONFLICT (name) DO NOTHING;
