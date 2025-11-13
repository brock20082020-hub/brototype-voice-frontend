import { useState, useEffect } from 'react';
import { StudentLayout } from '@/components/StudentLayout';
import { Card } from '@/components/ui/card';
import { useComplaints, Complaint as DbComplaint } from '@/hooks/useComplaints';
import { useAuth } from '@/contexts/AuthContext';
import { Plus, MessageSquare, FileText, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';


export default function Dashboard() {
  const navigate = useNavigate();
  const { userRole } = useAuth();
  const { complaints: dbComplaints, loading } = useComplaints();

  // Redirect staff/admin to admin dashboard
  useEffect(() => {
    if (userRole && (userRole === 'staff' || userRole === 'admin')) {
      navigate('/admin/dashboard');
    }
  }, [userRole, navigate]);

  const stats = {
    total: dbComplaints.length,
    pending: dbComplaints.filter(c => c.status === 'new' || c.status === 'in_progress').length,
    resolved: dbComplaints.filter(c => c.status === 'resolved').length
  };

  if (loading) {
    return (
      <StudentLayout>
        <div className="flex items-center justify-center min-h-[50vh]">
          <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
        </div>
      </StudentLayout>
    );
  }

  // New user welcome state
  const isNewUser = dbComplaints.length === 0;

  if (isNewUser) {
    return (
      <StudentLayout>
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
                  <CheckCircle className="w-6 h-6 text-success" />
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
      </StudentLayout>
    );
  }

  // Dashboard overview for existing users
  return (
    <StudentLayout>
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold mb-6">Dashboard Overview</h1>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-medium text-muted-foreground">Total Complaints</h3>
                <FileText className="w-5 h-5 text-primary" />
              </div>
              <div className="text-3xl font-bold">{stats.total}</div>
            </Card>

            <Card className="p-6 hover:shadow-lg transition-shadow border-warning/50">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-medium text-muted-foreground">Pending</h3>
                <MessageSquare className="w-5 h-5 text-warning" />
              </div>
              <div className="text-3xl font-bold text-warning">{stats.pending}</div>
            </Card>

            <Card className="p-6 hover:shadow-lg transition-shadow border-success/50">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-medium text-muted-foreground">Resolved</h3>
                <CheckCircle className="w-5 h-5 text-success" />
              </div>
              <div className="text-3xl font-bold text-success">{stats.resolved}</div>
            </Card>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex items-center justify-between mb-6"
        >
          <div>
            <h2 className="text-2xl font-semibold">Quick Actions</h2>
            <p className="text-muted-foreground">Get started with these shortcuts</p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          <Card
            className="p-8 cursor-pointer hover:shadow-lg hover:border-primary transition-all group"
            onClick={() => navigate('/student/submit')}
          >
            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                <Plus className="w-6 h-6" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-lg mb-2">Raise New Complaint</h3>
                <p className="text-sm text-muted-foreground">
                  Submit a new issue or concern for quick resolution
                </p>
              </div>
            </div>
          </Card>

          <Card
            className="p-8 cursor-pointer hover:shadow-lg hover:border-primary transition-all group"
            onClick={() => navigate('/student/complaints')}
          >
            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center group-hover:bg-accent group-hover:text-accent-foreground transition-colors">
                <FileText className="w-6 h-6" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-lg mb-2">View My Complaints</h3>
                <p className="text-sm text-muted-foreground">
                  Track the status and progress of all your submissions
                </p>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>
    </StudentLayout>
  );
}
