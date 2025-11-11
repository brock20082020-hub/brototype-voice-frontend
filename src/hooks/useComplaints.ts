import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export interface Complaint {
  id: string;
  ticket_id: string;
  user_id: string;
  student_name: string | null;
  title: string;
  category: string;
  description: string;
  status: 'new' | 'in_progress' | 'resolved';
  screenshot_url: string | null;
  is_anonymous: boolean;
  expected_resolution_time: string | null;
  resolution_note: string | null;
  internal_notes: string | null;
  created_at: string;
  updated_at: string;
}

export function useComplaints() {
  const { user, userRole } = useAuth();
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchComplaints = async () => {
    if (!user) return;
    
    setLoading(true);
    setError(null);

    try {
      let query = supabase
        .from('complaints')
        .select('*')
        .order('created_at', { ascending: false });

      // Students only see their own complaints
      if (userRole === 'student') {
        query = query.eq('user_id', user.id);
      }
      // Staff and admin see all complaints

      const { data, error: fetchError } = await query;

      if (fetchError) throw fetchError;
      setComplaints(data || []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComplaints();
  }, [user, userRole]);

  return { complaints, loading, error, refetch: fetchComplaints };
}
