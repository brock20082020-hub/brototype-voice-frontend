-- Fix function search path for generate_ticket_id
CREATE OR REPLACE FUNCTION public.generate_ticket_id()
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  new_ticket_id text;
BEGIN
  new_ticket_id := 'BRO-' || upper(substring(md5(random()::text) from 1 for 4));
  RETURN new_ticket_id;
END;
$$;

-- Fix function search path for set_ticket_id
CREATE OR REPLACE FUNCTION public.set_ticket_id()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF new.ticket_id IS NULL THEN
    new.ticket_id := public.generate_ticket_id();
  END IF;
  RETURN new;
END;
$$;

-- Fix function search path for update_updated_at
CREATE OR REPLACE FUNCTION public.update_updated_at()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  new.updated_at = now();
  RETURN new;
END;
$$;