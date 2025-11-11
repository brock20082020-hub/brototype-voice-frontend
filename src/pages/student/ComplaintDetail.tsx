import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Layout } from '@/components/Layout';
import { StatusBadge } from '@/components/StatusBadge';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { ArrowLeft, ThumbsUp, ThumbsDown, CheckCircle2, Clock } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
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

export default function ComplaintDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [complaint, setComplaint] = useState<Complaint | null>(null);
  const [loading, setLoading] = useState(true);
  const [showConfetti, setShowConfetti] = useState(false);
  const [feedbackGiven, setFeedbackGiven] = useState<'up' | 'down' | null>(null);

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
      
      if (data.status === 'resolved' && !sessionStorage.getItem(`seen-${id}`)) {
        setShowConfetti(true);
        sessionStorage.setItem(`seen-${id}`, 'true');
        setTimeout(() => setShowConfetti(false), 1000);
      }
    } catch (error) {
      console.error('Error fetching complaint:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[50vh]">
          <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
        </div>
      </Layout>
    );
  }

  if (!complaint) {
    return (
      <Layout>
        <div className="text-center py-16">
          <h2 className="text-2xl font-bold mb-4">Complaint not found</h2>
          <Button onClick={() => navigate('/student/dashboard')}>
            Back to Dashboard
          </Button>
        </div>
      </Layout>
    );
  }

  const timelineSteps = [
    { label: 'Submitted', status: 'completed', icon: CheckCircle2 },
    { label: 'Under Review', status: complaint.status === 'new' ? 'current' : 'completed', icon: Clock },
    { label: 'Resolved', status: complaint.status === 'resolved' ? 'completed' : 'pending', icon: CheckCircle2 }
  ];

  const daysSinceResolution = complaint.status === 'resolved' && complaint.updated_at
    ? Math.floor((Date.now() - new Date(complaint.updated_at).getTime()) / (1000 * 60 * 60 * 24))
    : 0;

  return (
    <Layout>
      <div className="max-w-3xl mx-auto">
        <AnimatePresence>
          {showConfetti && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 pointer-events-none z-50 flex items-center justify-center"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: [0, 1.2, 1] }}
                transition={{ duration: 0.5 }}
                className="text-6xl"
              >
                🎉
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Button
            variant="ghost"
            onClick={() => navigate('/student/dashboard')}
            className="mb-6"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <div className="flex items-center justify-center gap-4 mb-8">
            {timelineSteps.map((step, index) => (
              <div key={step.label} className="flex items-center">
                <div className="flex flex-col items-center">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: index * 0.1 }}
                    className={`w-12 h-12 rounded-full flex items-center justify-center border-2 transition-colors ${
                      step.status === 'completed'
                        ? 'bg-success border-success text-success-foreground'
                        : step.status === 'current'
                        ? 'bg-primary border-primary text-primary-foreground animate-pulse'
                        : 'bg-muted border-border text-muted-foreground'
                    }`}
                  >
                    <step.icon className="w-5 h-5" />
                  </motion.div>
                  <span className="text-xs mt-2 font-medium">{step.label}</span>
                </div>
                {index < timelineSteps.length - 1 && (
                  <div className={`w-16 h-0.5 mx-2 transition-colors ${
                    timelineSteps[index + 1].status === 'completed' ? 'bg-success' : 'bg-border'
                  }`} />
                )}
              </div>
            ))}
          </div>

          {complaint.status === 'in_progress' && complaint.expected_resolution_time && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center mb-6"
            >
              <p className="text-sm text-muted-foreground">
                Expected by{' '}
                <span className="font-medium text-primary">
                  {format(new Date(complaint.expected_resolution_time), 'MMM d, h:mm a')}
                </span>
              </p>
            </motion.div>
          )}
        </motion.div>

        {complaint.status === 'resolved' && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mb-6"
          >
            <Card className="p-6 bg-success/5 border-success/20">
              <div className="flex items-center gap-3 mb-2">
                <CheckCircle2 className="w-6 h-6 text-success" />
                <h3 className="text-xl font-bold text-success">Problem Solved!</h3>
              </div>
              <p className="text-muted-foreground">
                Glad we could help! Keep coding 💻
              </p>
              {complaint.resolution_note && (
                <p className="mt-3 text-sm font-medium">{complaint.resolution_note}</p>
              )}
            </Card>
          </motion.div>
        )}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="p-6">
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

              <div className="flex items-center gap-6 text-sm text-muted-foreground pt-4 border-t border-border">
                <div>
                  <span className="font-medium">Submitted:</span>{' '}
                  {format(new Date(complaint.created_at), 'MMM d, yyyy h:mm a')}
                </div>
                {!complaint.is_anonymous && (
                  <div>
                    <span className="font-medium">Student:</span> {complaint.student_name}
                  </div>
                )}
              </div>
            </div>
          </Card>
        </motion.div>

        {complaint.status === 'resolved' && daysSinceResolution > 2 && !feedbackGiven && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-6"
          >
            <Card className="p-6">
              <h3 className="font-semibold mb-4 text-center">All good?</h3>
              <div className="flex items-center justify-center gap-4">
                <Button
                  variant="outline"
                  size="lg"
                  onClick={() => setFeedbackGiven('up')}
                  className="hover:bg-success/10 hover:border-success"
                >
                  <ThumbsUp className="w-5 h-5" />
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  onClick={() => setFeedbackGiven('down')}
                  className="hover:bg-destructive/10 hover:border-destructive"
                >
                  <ThumbsDown className="w-5 h-5" />
                </Button>
              </div>
            </Card>
          </motion.div>
        )}
      </div>
    </Layout>
  );
}
