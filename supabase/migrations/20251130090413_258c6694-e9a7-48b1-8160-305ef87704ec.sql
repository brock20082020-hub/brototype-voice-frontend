-- Fix security warnings by setting search_path for all functions

-- Fix notify_staff_of_new_complaint function
CREATE OR REPLACE FUNCTION notify_staff_of_new_complaint()
RETURNS TRIGGER 
LANGUAGE plpgsql 
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  staff_user RECORD;
BEGIN
  FOR staff_user IN 
    SELECT user_id FROM public.user_roles 
    WHERE role IN ('staff', 'admin')
  LOOP
    INSERT INTO public.notifications (user_id, complaint_id, title, message, type)
    VALUES (
      staff_user.user_id,
      NEW.id,
      'New Complaint Received',
      'A new complaint "' || NEW.title || '" has been submitted.',
      'new_complaint'
    );
  END LOOP;
  
  RETURN NEW;
END;
$$;

-- Fix notify_student_of_status_change function
CREATE OR REPLACE FUNCTION notify_student_of_status_change()
RETURNS TRIGGER 
LANGUAGE plpgsql 
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF OLD.status != NEW.status THEN
    INSERT INTO public.notifications (user_id, complaint_id, title, message, type)
    VALUES (
      NEW.user_id,
      NEW.id,
      'Complaint Status Updated',
      'Your complaint "' || NEW.title || '" status changed to ' || NEW.status,
      'complaint_updated'
    );
  END IF;
  
  RETURN NEW;
END;
$$;