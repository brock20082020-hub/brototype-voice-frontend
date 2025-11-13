import { useEffect } from 'react';
import { StaffLayout } from '@/components/StaffLayout';
import { Card } from '@/components/ui/card';
import { useComplaints } from '@/hooks/useComplaints';
import { useAuth } from '@/contexts/AuthContext';
import { Inbox, Clock, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const { userRole } = useAuth();
  const { complaints: dbComplaints, loading } = useComplaints();

  // Redirect students to student dashboard
  useEffect(() => {
    if (userRole && userRole === 'student') {
      navigate('/student/dashboard');
    }
  }, [userRole, navigate]);

  if (loading) {
    return (
      <StaffLayout>
        <div className="flex items-center justify-center min-h-[50vh]">
          <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
        </div>
      </StaffLayout>
    );
  }

  const stats = {
    assigned: dbComplaints.filter(c => c.status !== 'resolved').length,
    inProgress: dbComplaints.filter(c => c.status === 'in_progress').length,
    resolved: dbComplaints.filter(c => c.status === 'resolved').length
  };

  return (
    <StaffLayout>
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold mb-6">Staff Dashboard Overview</h1>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="p-6 hover:shadow-lg transition-shadow border-warning/50">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-medium text-muted-foreground">Assigned Complaints</h3>
                <Inbox className="w-5 h-5 text-warning" />
              </div>
              <div className="text-3xl font-bold text-warning">{stats.assigned}</div>
              <p className="text-xs text-muted-foreground mt-2">Pending your attention</p>
            </Card>

            <Card className="p-6 hover:shadow-lg transition-shadow border-primary/50">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-medium text-muted-foreground">In Progress</h3>
                <Clock className="w-5 h-5 text-primary" />
              </div>
              <div className="text-3xl font-bold text-primary">{stats.inProgress}</div>
              <p className="text-xs text-muted-foreground mt-2">Currently being handled</p>
            </Card>

            <Card className="p-6 hover:shadow-lg transition-shadow border-success/50">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-medium text-muted-foreground">Resolved</h3>
                <CheckCircle className="w-5 h-5 text-success" />
              </div>
              <div className="text-3xl font-bold text-success">{stats.resolved}</div>
              <p className="text-xs text-muted-foreground mt-2">Successfully completed</p>
            </Card>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          <Card
            className="p-8 cursor-pointer hover:shadow-lg hover:border-primary transition-all group"
            onClick={() => navigate('/admin/assigned')}
          >
            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 bg-warning/10 rounded-lg flex items-center justify-center group-hover:bg-warning group-hover:text-warning-foreground transition-colors">
                <Inbox className="w-6 h-6" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-lg mb-2">View Assigned Complaints</h3>
                <p className="text-sm text-muted-foreground">
                  Manage and update complaints assigned to you
                </p>
              </div>
            </div>
          </Card>

          <Card
            className="p-8 cursor-pointer hover:shadow-lg hover:border-primary transition-all group"
            onClick={() => navigate('/admin/resolved')}
          >
            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 bg-success/10 rounded-lg flex items-center justify-center group-hover:bg-success group-hover:text-success-foreground transition-colors">
                <CheckCircle className="w-6 h-6" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-lg mb-2">Resolved Complaints</h3>
                <p className="text-sm text-muted-foreground">
                  Review your completed complaint resolutions
                </p>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>
    </StaffLayout>
  );
}
