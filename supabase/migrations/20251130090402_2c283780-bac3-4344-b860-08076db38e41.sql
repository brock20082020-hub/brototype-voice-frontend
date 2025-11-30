-- Enable realtime for complaints table
ALTER PUBLICATION supabase_realtime ADD TABLE public.complaints;

-- Add priority and department fields to complaints
ALTER TABLE public.complaints 
ADD COLUMN IF NOT EXISTS priority text CHECK (priority IN ('low', 'medium', 'high', 'urgent')) DEFAULT 'medium',
ADD COLUMN IF NOT EXISTS department text;

-- Create notifications table
CREATE TABLE IF NOT EXISTS public.notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  complaint_id uuid REFERENCES public.complaints(id) ON DELETE CASCADE,
  title text NOT NULL,
  message text NOT NULL,
  type text NOT NULL CHECK (type IN ('complaint_assigned', 'complaint_updated', 'complaint_resolved', 'new_complaint')),
  read boolean DEFAULT false,
  created_at timestamp with time zone DEFAULT now()
);

-- Enable RLS on notifications
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- Users can view their own notifications
CREATE POLICY "Users can view their own notifications"
ON public.notifications
FOR SELECT
USING (auth.uid() = user_id);

-- Users can update their own notifications (mark as read)
CREATE POLICY "Users can update their own notifications"
ON public.notifications
FOR UPDATE
USING (auth.uid() = user_id);

-- Service role can insert notifications
CREATE POLICY "Service can insert notifications"
ON public.notifications
FOR INSERT
WITH CHECK (true);

-- Enable realtime for notifications
ALTER PUBLICATION supabase_realtime ADD TABLE public.notifications;

-- Secure complaint-screenshots bucket (if exists)
UPDATE storage.buckets 
SET public = true 
WHERE id = 'complaint-screenshots';

-- Create bucket if it doesn't exist
INSERT INTO storage.buckets (id, name, public)
VALUES ('complaint-screenshots', 'complaint-screenshots', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- RLS policies for complaint screenshots
CREATE POLICY "Anyone can view screenshots"
ON storage.objects
FOR SELECT
USING (bucket_id = 'complaint-screenshots');

CREATE POLICY "Authenticated users can upload screenshots"
ON storage.objects
FOR INSERT
WITH CHECK (
  bucket_id = 'complaint-screenshots' 
  AND auth.role() = 'authenticated'
);

CREATE POLICY "Users can update their own screenshots"
ON storage.objects
FOR UPDATE
USING (
  bucket_id = 'complaint-screenshots' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- Function to notify staff of new complaints
CREATE OR REPLACE FUNCTION notify_staff_of_new_complaint()
RETURNS TRIGGER AS $$
DECLARE
  staff_user RECORD;
BEGIN
  -- Notify all staff and admin users
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
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for new complaints
DROP TRIGGER IF EXISTS on_complaint_created ON public.complaints;
CREATE TRIGGER on_complaint_created
  AFTER INSERT ON public.complaints
  FOR EACH ROW
  EXECUTE FUNCTION notify_staff_of_new_complaint();

-- Function to notify student when complaint status changes
CREATE OR REPLACE FUNCTION notify_student_of_status_change()
RETURNS TRIGGER AS $$
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
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for status changes
DROP TRIGGER IF EXISTS on_complaint_status_changed ON public.complaints;
CREATE TRIGGER on_complaint_status_changed
  AFTER UPDATE ON public.complaints
  FOR EACH ROW
  WHEN (OLD.status IS DISTINCT FROM NEW.status)
  EXECUTE FUNCTION notify_student_of_status_change();