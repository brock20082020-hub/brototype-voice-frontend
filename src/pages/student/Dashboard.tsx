import { useState, useEffect } from 'react';
import { Layout } from '@/components/Layout';
import { ComplaintCard } from '@/components/ComplaintCard';
import { useComplaints, Complaint as DbComplaint } from '@/hooks/useComplaints';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, MessageSquare } from 'lucide-react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

// Convert DB complaint to display format
const convertComplaint = (c: DbComplaint) => ({
  id: c.id,
  ticketId: c.ticket_id,
  studentName: c.student_name || 'Anonymous',
  title: c.title,
  category: c.category as any,
  description: c.description,
  status: c.status,
  screenshotUrl: c.screenshot_url,
  isAnonymous: c.is_anonymous,
  createdAt: new Date(c.created_at),
  updatedAt: new Date(c.updated_at),
  expectedResolutionTime: c.expected_resolution_time ? new Date(c.expected_resolution_time) : undefined,
  resolutionNote: c.resolution_note || undefined,
  internalNotes: c.internal_notes || undefined,
});

// Helper to get time-based greeting
const getTimeBasedGreeting = () => {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 18) return 'Good afternoon';
  return 'Good evening';
};

export default function Dashboard() {
  const navigate = useNavigate();
  const { userRole, user } = useAuth();
  const [activeTab, setActiveTab] = useState('active');
  const [userName, setUserName] = useState<string>('');
  const { complaints: dbComplaints, loading } = useComplaints();

  // Fetch user profile
  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) return;
      const { data } = await supabase
        .from('profiles')
        .select('full_name')
        .eq('id', user.id)
        .single();
      
      if (data?.full_name) {
        setUserName(data.full_name.split(' ')[0]); // First name only
      }
    };
    fetchProfile();
  }, [user]);

  // Redirect staff/admin to admin dashboard
  useEffect(() => {
    if (userRole && (userRole === 'staff' || userRole === 'admin')) {
      navigate('/admin/dashboard');
    }
  }, [userRole, navigate]);

  const complaints = dbComplaints.map(convertComplaint);
  const activeComplaints = complaints.filter(c => c.status !== 'resolved');
  const allComplaints = complaints;

  const stats = {
    active: activeComplaints.length,
    resolved: complaints.filter(c => c.status === 'resolved').length
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

  // New user welcome state
  const isNewUser = complaints.length === 0;

  if (isNewUser) {
    return (
      <Layout>
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-12"
          >
            <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Welcome to Brototype Voice 👋
            </h1>
            <p className="text-muted-foreground text-xl mb-12">
              Your personal support hub for a smooth learning journey
            </p>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="grid md:grid-cols-3 gap-6 mb-12"
            >
              <div className="p-6 bg-card rounded-xl border border-border">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <MessageSquare className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-semibold mb-2">Report Issues</h3>
                <p className="text-sm text-muted-foreground">
                  Mentor unresponsive? Doubts unclear? Let us know instantly.
                </p>
              </div>

              <div className="p-6 bg-card rounded-xl border border-border">
                <div className="w-12 h-12 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-6 h-6 text-success" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="font-semibold mb-2">Track Progress</h3>
                <p className="text-sm text-muted-foreground">
                  See real-time updates and expected resolution times.
                </p>
              </div>

              <div className="p-6 bg-card rounded-xl border border-border">
                <div className="w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-6 h-6 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <h3 className="font-semibold mb-2">Stay Anonymous</h3>
                <p className="text-sm text-muted-foreground">
                  Submit complaints without revealing your identity.
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <Button
                size="lg"
                onClick={() => navigate('/student/submit')}
                className="h-14 px-8 text-lg"
              >
                <Plus className="w-5 h-5 mr-2" />
                Submit Your First Complaint
              </Button>
              <p className="text-sm text-muted-foreground mt-4">
                We're here to help you succeed. Don't hesitate to reach out! 🚀
              </p>
            </motion.div>
          </motion.div>
        </div>
      </Layout>
    );
  }

  // Regular dashboard for existing users
  const greeting = `${getTimeBasedGreeting()}, ${userName || 'there'}`;
  
  return (
    <Layout>
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 text-center"
        >
          <h1 className="text-4xl font-bold mb-3 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            {greeting} 👋
          </h1>
          <p className="text-muted-foreground text-lg">
            Track, resolve, and keep coding.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-6 flex items-center justify-center gap-6 p-4 bg-card rounded-xl border border-border"
        >
          <div className="text-center">
            <div className="text-3xl font-bold text-warning">{stats.active}</div>
            <div className="text-sm text-muted-foreground">Active</div>
          </div>
          <div className="w-px h-12 bg-border"></div>
          <div className="text-center">
            <div className="text-3xl font-bold text-success">{stats.resolved}</div>
            <div className="text-sm text-muted-foreground">Resolved</div>
          </div>
        </motion.div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="active">Active</TabsTrigger>
            <TabsTrigger value="history">History</TabsTrigger>
          </TabsList>

          <TabsContent value="active" className="mt-6 space-y-4">
            {activeComplaints.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-16"
              >
                <MessageSquare className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-xl font-semibold mb-2">No active complaints</h3>
                <p className="text-muted-foreground mb-6">
                  Everything's good! Hit '+ New' if you need help.
                </p>
              </motion.div>
            ) : (
              activeComplaints.map((complaint, index) => (
                <ComplaintCard key={complaint.id} complaint={complaint} index={index} />
              ))
            )}
          </TabsContent>

          <TabsContent value="history" className="mt-6 space-y-4">
            {allComplaints.map((complaint, index) => (
              <ComplaintCard key={complaint.id} complaint={complaint} index={index} />
            ))}
          </TabsContent>
        </Tabs>

        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          className="fixed bottom-8 right-8"
        >
          <Button
            size="lg"
            onClick={() => navigate('/student/submit')}
            className="rounded-full shadow-lg h-14 px-6 animate-pulse hover:animate-none"
          >
            <Plus className="w-5 h-5 mr-2" />
            New Complaint
          </Button>
        </motion.div>
      </div>
    </Layout>
  );
}
