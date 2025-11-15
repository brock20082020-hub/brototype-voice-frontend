import { useEffect, useState } from 'react';
import { StaffLayout } from '@/components/StaffLayout';
import { Card } from '@/components/ui/card';
import { useComplaints } from '@/hooks/useComplaints';
import { useAuth } from '@/contexts/AuthContext';
import { Inbox, Clock, CheckCircle, TrendingUp, Users, AlertTriangle } from 'lucide-react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const { user, userRole } = useAuth();
  const { complaints: dbComplaints, loading } = useComplaints();
  const [staffProfile, setStaffProfile] = useState<{ full_name: string; email: string } | null>(null);

  // Redirect students to student dashboard
  useEffect(() => {
    if (userRole && userRole === 'student') {
      navigate('/student/dashboard');
    }
  }, [userRole, navigate]);

  // Fetch staff profile
  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) return;
      const { data } = await supabase
        .from('profiles')
        .select('full_name')
        .eq('id', user.id)
        .single();
      
      if (data) {
        setStaffProfile({
          full_name: data.full_name || 'Staff Member',
          email: user.email || ''
        });
      }
    };
    fetchProfile();
  }, [user]);

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
    total: dbComplaints.length,
    assigned: dbComplaints.filter(c => c.status !== 'resolved').length,
    inProgress: dbComplaints.filter(c => c.status === 'in_progress').length,
    resolved: dbComplaints.filter(c => c.status === 'resolved').length,
    new: dbComplaints.filter(c => c.status === 'new').length,
    urgent: dbComplaints.filter(c => c.status === 'new' && !c.expected_resolution_time).length
  };

  // Get recent complaints (last 5)
  const recentComplaints = dbComplaints.slice(0, 5);

  return (
    <StaffLayout>
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Staff Profile Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card className="p-6">
            <div className="flex items-center space-x-4">
              <Avatar className="w-16 h-16">
                <AvatarFallback className="text-2xl bg-primary text-primary-foreground">
                  {staffProfile?.full_name?.charAt(0).toUpperCase() || 'S'}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <h2 className="text-2xl font-bold">{staffProfile?.full_name || 'Staff Member'}</h2>
                <p className="text-muted-foreground">{staffProfile?.email}</p>
                <Badge variant="secondary" className="mt-2">
                  {userRole === 'admin' ? 'Administrator' : 'Staff'}
                </Badge>
              </div>
              <div className="text-right">
                <p className="text-sm text-muted-foreground">Total Complaints</p>
                <p className="text-3xl font-bold text-primary">{stats.total}</p>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Statistics Overview */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <h1 className="text-2xl font-bold mb-6">Dashboard Overview</h1>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card className="p-6 hover:shadow-lg transition-shadow border-destructive/50">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-medium text-muted-foreground">New Complaints</h3>
                <AlertTriangle className="w-5 h-5 text-destructive" />
              </div>
              <div className="text-3xl font-bold text-destructive">{stats.new}</div>
              <p className="text-xs text-muted-foreground mt-2">Requires immediate attention</p>
            </Card>

            <Card className="p-6 hover:shadow-lg transition-shadow border-warning/50">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-medium text-muted-foreground">Pending</h3>
                <Inbox className="w-5 h-5 text-warning" />
              </div>
              <div className="text-3xl font-bold text-warning">{stats.assigned}</div>
              <p className="text-xs text-muted-foreground mt-2">All unresolved complaints</p>
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

        {/* Quick Actions */}
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
                <p className="text-sm text-muted-foreground mb-4">
                  Review and respond to complaints that need your attention
                </p>
                <div className="flex items-center text-primary text-sm font-medium">
                  Go to Assigned <span className="ml-1">→</span>
                </div>
              </div>
            </div>
          </Card>

          <Card
            className="p-8 cursor-pointer hover:shadow-lg hover:border-success transition-all group"
            onClick={() => navigate('/admin/resolved')}
          >
            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 bg-success/10 rounded-lg flex items-center justify-center group-hover:bg-success group-hover:text-success-foreground transition-colors">
                <CheckCircle className="w-6 h-6" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-lg mb-2">Resolved Complaints</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  View the history of successfully resolved complaints
                </p>
                <div className="flex items-center text-success text-sm font-medium">
                  View History <span className="ml-1">→</span>
                </div>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Recent Complaints */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <h2 className="text-xl font-bold mb-4">Recent Complaints</h2>
          <Card className="p-6">
            {recentComplaints.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Users className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>No complaints yet. All clear!</p>
              </div>
            ) : (
              <div className="space-y-4">
                {recentComplaints.map((complaint) => (
                  <div
                    key={complaint.id}
                    className="flex items-center justify-between p-4 rounded-lg border border-border hover:bg-muted/50 cursor-pointer transition-colors"
                    onClick={() => navigate(`/admin/${complaint.id}`)}
                  >
                    <div className="flex-1">
                      <div className="flex items-center space-x-3">
                        <h4 className="font-semibold">{complaint.title}</h4>
                        <Badge variant={
                          complaint.status === 'new' ? 'destructive' :
                          complaint.status === 'in_progress' ? 'default' :
                          'secondary'
                        }>
                          {complaint.status.replace('_', ' ')}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">
                        Ticket: {complaint.ticket_id} • Category: {complaint.category}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {format(new Date(complaint.created_at), 'PPp')}
                      </p>
                    </div>
                    <div className="text-primary text-sm font-medium">
                      View →
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </motion.div>

        {/* Performance Insights */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <h2 className="text-xl font-bold mb-4">Performance Insights</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="p-6">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-medium text-muted-foreground">Resolution Rate</h3>
                <TrendingUp className="w-5 h-5 text-success" />
              </div>
              <div className="text-2xl font-bold">
                {stats.total > 0 ? Math.round((stats.resolved / stats.total) * 100) : 0}%
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                {stats.resolved} of {stats.total} resolved
              </p>
            </Card>

            <Card className="p-6">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-medium text-muted-foreground">Active Cases</h3>
                <Clock className="w-5 h-5 text-primary" />
              </div>
              <div className="text-2xl font-bold">{stats.inProgress}</div>
              <p className="text-xs text-muted-foreground mt-2">
                Currently being worked on
              </p>
            </Card>

            <Card className="p-6">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-medium text-muted-foreground">Urgent Items</h3>
                <AlertTriangle className="w-5 h-5 text-destructive" />
              </div>
              <div className="text-2xl font-bold">{stats.urgent}</div>
              <p className="text-xs text-muted-foreground mt-2">
                Needs immediate attention
              </p>
            </Card>
          </div>
        </motion.div>
      </div>
    </StaffLayout>
  );
}
