import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { StaffLayout } from '@/components/StaffLayout';
import { StatusBadge } from '@/components/StatusBadge';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';
import { format } from 'date-fns';

interface Complaint {
  id: string;
  ticket_id: string;
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

export default function AdminComplaintDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [complaint, setComplaint] = useState<Complaint | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      fetchComplaint();
    }
  }, [id]);

  const fetchComplaint = async () => {
    try {
      const { data, error } = await supabase
        .from('complaints')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      setComplaint(data);
    } catch (error) {
      console.error('Error fetching complaint:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <StaffLayout>
        <div className="flex items-center justify-center min-h-[50vh]">
          <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
        </div>
      </StaffLayout>
    );
  }

  if (!complaint) {
    return (
      <StaffLayout>
        <div className="text-center py-16">
          <h2 className="text-2xl font-bold mb-4">Complaint not found</h2>
          <Button onClick={() => navigate('/admin/dashboard')}>
            Back to Dashboard
          </Button>
        </div>
      </StaffLayout>
    );
  }

  return (
    <StaffLayout>
      <div className="max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Button
            variant="ghost"
            onClick={() => navigate('/admin/dashboard')}
            className="mb-6"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Inbox
          </Button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="p-6 mb-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs font-mono text-muted-foreground bg-muted px-2 py-1 rounded">
                    {complaint.ticket_id}
                  </span>
                  <StatusBadge status={complaint.status} />
                </div>
                <h1 className="text-2xl font-bold mb-2">{complaint.title}</h1>
                <Badge variant="outline">{complaint.category}</Badge>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2">Description</h3>
                <p className="text-muted-foreground leading-relaxed">
                  {complaint.description}
                </p>
              </div>

              {complaint.screenshot_url && (
                <div>
                  <h3 className="font-semibold mb-2">Screenshot</h3>
                  <img
                    src={complaint.screenshot_url}
                    alt="Complaint screenshot"
                    className="w-full max-h-64 object-cover rounded-lg border border-border"
                  />
                </div>
              )}

              <div className="flex flex-col gap-2 text-sm text-muted-foreground pt-4 border-t border-border">
                <div>
                  <span className="font-medium">Student:</span>{' '}
                  {complaint.is_anonymous ? 'Anonymous' : complaint.student_name}
                </div>
                <div>
                  <span className="font-medium">Submitted:</span>{' '}
                  {format(new Date(complaint.created_at), 'MMM d, yyyy h:mm a')}
                </div>
                <div>
                  <span className="font-medium">Last Updated:</span>{' '}
                  {format(new Date(complaint.updated_at), 'MMM d, yyyy h:mm a')}
                </div>
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-muted/50">
            <h2 className="text-lg font-semibold mb-4">Admin Panel (Demo)</h2>
            <div className="space-y-4">
              <div>
                <span className="text-sm font-medium text-muted-foreground">Status:</span>
                <div className="mt-1">
                  <StatusBadge status={complaint.status} />
                </div>
              </div>

              {complaint.internal_notes && (
                <div>
                  <span className="text-sm font-medium text-muted-foreground">Internal Notes:</span>
                  <p className="mt-1 text-sm italic">{complaint.internal_notes}</p>
                </div>
              )}

              {complaint.resolution_note && (
                <div>
                  <span className="text-sm font-medium text-muted-foreground">Resolution Summary:</span>
                  <p className="mt-1 text-sm">{complaint.resolution_note}</p>
                </div>
              )}

              {!complaint.resolution_note && (
                <p className="text-sm text-muted-foreground italic">
                  This is a demo view. In production, staff would see action buttons and assignment options here.
                </p>
              )}
            </div>
          </Card>
        </motion.div>
      </div>
    </StaffLayout>
  );
}
