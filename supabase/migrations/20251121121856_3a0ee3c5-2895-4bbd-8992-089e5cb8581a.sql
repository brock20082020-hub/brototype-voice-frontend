-- Create security definer function for role assignment with verification
CREATE OR REPLACE FUNCTION public.assign_role_with_verification(
  _user_id uuid,
  _requested_role app_role,
  _verification_code text DEFAULT NULL
)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  staff_code text := 'STAFF2024';
BEGIN
  -- If requesting staff role, verify the code
  IF _requested_role IN ('staff', 'admin') THEN
    IF _verification_code IS NULL OR _verification_code != staff_code THEN
      RETURN false;
    END IF;
  END IF;
  
  -- Update the role
  UPDATE public.user_roles
  SET role = _requested_role
  WHERE user_id = _user_id;
  
  RETURN true;
END;
$$;

-- Modify the trigger to check for role request in user metadata
CREATE OR REPLACE FUNCTION public.handle_new_user_role()
RETURNS TRIGGER
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql
AS $$
DECLARE
  requested_role text;
  verification_code text;
  assigned_role app_role;
BEGIN
  -- Get metadata from auth.users
  SELECT raw_user_meta_data->>'requested_role',
         raw_user_meta_data->>'verification_code'
  INTO requested_role, verification_code
  FROM auth.users
  WHERE id = NEW.id;
  
  -- Default to student
  assigned_role := 'student';
  
  -- If staff role requested with valid code, assign it
  IF requested_role = 'staff' AND verification_code = 'STAFF2024' THEN
    assigned_role := 'staff';
  END IF;
  
  -- Insert the determined role
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, assigned_role);
  
  RETURN NEW;
EXCEPTION
  WHEN others THEN
    RAISE LOG 'Error in handle_new_user_role: %', SQLERRM;
    -- Fallback to student role
    INSERT INTO public.user_roles (user_id, role)
    VALUES (NEW.id, 'student')
    ON CONFLICT DO NOTHING;
    RETURN NEW;
END;
$$;