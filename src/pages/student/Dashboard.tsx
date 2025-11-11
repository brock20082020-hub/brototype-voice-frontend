import { useState, useEffect } from 'react';
import { Layout } from '@/components/Layout';
import { ComplaintCard } from '@/components/ComplaintCard';
import { useComplaints, Complaint as DbComplaint } from '@/hooks/useComplaints';
import { useAuth } from '@/contexts/AuthContext';
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

export default function Dashboard() {
  const navigate = useNavigate();
  const { userRole } = useAuth();
  const [activeTab, setActiveTab] = useState('active');
  const { complaints: dbComplaints, loading } = useComplaints();

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

  return (
    <Layout>
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 text-center"
        >
          <h1 className="text-4xl font-bold mb-3 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Your Voice, Heard 💬
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
