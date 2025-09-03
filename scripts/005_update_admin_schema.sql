-- Update subscription_tier to include admin role
ALTER TABLE public.profiles DROP CONSTRAINT IF EXISTS profiles_subscription_tier_check;
ALTER TABLE public.profiles ADD CONSTRAINT profiles_subscription_tier_check 
  CHECK (subscription_tier IN ('free', 'premium', 'annual', 'admin'));

-- Create admin utility function
CREATE OR REPLACE FUNCTION public.is_admin(user_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = user_id AND subscription_tier = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
