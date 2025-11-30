-- Add assigned_to column to complaints table
ALTER TABLE public.complaints 
ADD COLUMN assigned_to uuid REFERENCES auth.users(id);

-- Create function to notify when complaint is assigned
CREATE OR REPLACE FUNCTION public.notify_on_complaint_assignment()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Notify the staff member when assigned
  IF NEW.assigned_to IS NOT NULL AND (OLD.assigned_to IS NULL OR OLD.assigned_to != NEW.assigned_to) THEN
    INSERT INTO public.notifications (user_id, complaint_id, title, message, type)
    VALUES (
      NEW.assigned_to,
      NEW.id,
      'Complaint Assigned to You',
      'You have been assigned complaint "' || NEW.title || '"',
      'complaint_assigned'
    );
    
    -- Also notify the student that their complaint has been assigned
    INSERT INTO public.notifications (user_id, complaint_id, title, message, type)
    VALUES (
      NEW.user_id,
      NEW.id,
      'Complaint Assigned',
      'Your complaint "' || NEW.title || '" has been assigned to a staff member',
      'complaint_assigned'
    );
  END IF;
  
  RETURN NEW;
END;
$$;

-- Create trigger for assignment notifications
CREATE TRIGGER on_complaint_assigned
  AFTER UPDATE ON public.complaints
  FOR EACH ROW
  EXECUTE FUNCTION public.notify_on_complaint_assignment();