import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { StaffLayout } from '@/components/StaffLayout';
import { StatusBadge } from '@/components/StatusBadge';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import { ArrowLeft, Save } from 'lucide-react';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { useToast } from '@/hooks/use-toast';

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
  const { toast } = useToast();
  const [complaint, setComplaint] = useState<Complaint | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [status, setStatus] = useState<'new' | 'in_progress' | 'resolved'>('new');
  const [internalNotes, setInternalNotes] = useState('');
  const [resolutionNote, setResolutionNote] = useState('');

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
      setStatus(data.status);
      setInternalNotes(data.internal_notes || '');
      setResolutionNote(data.resolution_note || '');
    } catch (error) {
      console.error('Error fetching complaint:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateComplaint = async () => {
    if (!complaint) return;
    
    setUpdating(true);
    try {
      const { error } = await supabase
        .from('complaints')
        .update({
          status,
          internal_notes: internalNotes,
          resolution_note: resolutionNote,
        })
        .eq('id', complaint.id);

      if (error) throw error;

      toast({
        title: 'Success',
        description: 'Complaint updated successfully',
      });

      // Refresh complaint data
      await fetchComplaint();
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to update complaint',
        variant: 'destructive',
      });
    } finally {
      setUpdating(false);
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

          <Card className="p-6">
            <h2 className="text-lg font-semibold mb-6">Staff Actions</h2>
            <div className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="status">Update Status</Label>
                <Select value={status} onValueChange={(v) => setStatus(v as any)}>
                  <SelectTrigger id="status">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="new">New</SelectItem>
                    <SelectItem value="in_progress">In Progress</SelectItem>
                    <SelectItem value="resolved">Resolved</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="internalNotes">Internal Notes (Staff Only)</Label>
                <Textarea
                  id="internalNotes"
                  placeholder="Add notes for other staff members..."
                  value={internalNotes}
                  onChange={(e) => setInternalNotes(e.target.value)}
                  rows={4}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="resolutionNote">Resolution Summary (Visible to Student)</Label>
                <Textarea
                  id="resolutionNote"
                  placeholder="Describe how the issue was resolved..."
                  value={resolutionNote}
                  onChange={(e) => setResolutionNote(e.target.value)}
                  rows={4}
                />
              </div>

              <Button 
                onClick={handleUpdateComplaint} 
                disabled={updating}
                className="w-full"
              >
                <Save className="w-4 h-4 mr-2" />
                {updating ? 'Saving...' : 'Save Changes'}
              </Button>
            </div>
          </Card>
        </motion.div>
      </div>
    </StaffLayout>
  );
}
