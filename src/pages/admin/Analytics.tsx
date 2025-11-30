import { StaffLayout } from '@/components/StaffLayout';
import { Card } from '@/components/ui/card';
import { useComplaints } from '@/hooks/useComplaints';
import { motion } from 'framer-motion';
import { BarChart3, TrendingUp, Clock, CheckCircle, Users, AlertTriangle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { format, subDays, isAfter } from 'date-fns';

export default function Analytics() {
  const { complaints } = useComplaints();

  // Calculate statistics
  const stats = {
    total: complaints.length,
    new: complaints.filter(c => c.status === 'new').length,
    inProgress: complaints.filter(c => c.status === 'in_progress').length,
    resolved: complaints.filter(c => c.status === 'resolved').length,
    resolutionRate: complaints.length > 0 
      ? Math.round((complaints.filter(c => c.status === 'resolved').length / complaints.length) * 100)
      : 0,
  };

  // Calculate trends (last 7 days)
  const last7Days = subDays(new Date(), 7);
  const recentComplaints = complaints.filter(c => 
    isAfter(new Date(c.created_at), last7Days)
  );

  // Group by category
  const categoryStats = complaints.reduce((acc, complaint) => {
    acc[complaint.category] = (acc[complaint.category] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const categoryData = Object.entries(categoryStats)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  // Group by priority
  const priorityStats = complaints.reduce((acc, complaint) => {
    const priority = (complaint as any).priority || 'medium';
    acc[priority] = (acc[priority] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // Average resolution time (simplified - hours from creation to update)
  const resolvedComplaints = complaints.filter(c => c.status === 'resolved');
  const avgResolutionTime = resolvedComplaints.length > 0
    ? Math.round(
        resolvedComplaints.reduce((acc, c) => {
          const hours = (new Date(c.updated_at).getTime() - new Date(c.created_at).getTime()) / (1000 * 60 * 60);
          return acc + hours;
        }, 0) / resolvedComplaints.length
      )
    : 0;

  return (
    <StaffLayout>
      <div className="max-w-6xl mx-auto space-y-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
              <BarChart3 className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Analytics Dashboard</h1>
              <p className="text-muted-foreground">Track performance and identify trends</p>
            </div>
          </div>
        </motion.div>

        {/* Key Metrics */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card className="p-6 border-primary/50">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-medium text-muted-foreground">Total Complaints</h3>
                <Users className="w-5 h-5 text-primary" />
              </div>
              <div className="text-3xl font-bold">{stats.total}</div>
              <p className="text-xs text-muted-foreground mt-2">
                {recentComplaints.length} in last 7 days
              </p>
            </Card>

            <Card className="p-6 border-success/50">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-medium text-muted-foreground">Resolution Rate</h3>
                <CheckCircle className="w-5 h-5 text-success" />
              </div>
              <div className="text-3xl font-bold">{stats.resolutionRate}%</div>
              <p className="text-xs text-muted-foreground mt-2">
                {stats.resolved} complaints resolved
              </p>
            </Card>

            <Card className="p-6 border-warning/50">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-medium text-muted-foreground">Avg Resolution Time</h3>
                <Clock className="w-5 h-5 text-warning" />
              </div>
              <div className="text-3xl font-bold">{avgResolutionTime}h</div>
              <p className="text-xs text-muted-foreground mt-2">
                Average time to resolve
              </p>
            </Card>

            <Card className="p-6 border-destructive/50">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-medium text-muted-foreground">Pending</h3>
                <AlertTriangle className="w-5 h-5 text-destructive" />
              </div>
              <div className="text-3xl font-bold">{stats.new + stats.inProgress}</div>
              <p className="text-xs text-muted-foreground mt-2">
                Requires attention
              </p>
            </Card>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Category Breakdown */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="p-6">
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-primary" />
                Top Categories
              </h2>
              <div className="space-y-4">
                {categoryData.map(([category, count]) => {
                  const percentage = Math.round((count / stats.total) * 100);
                  return (
                    <div key={category} className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="font-medium">{category}</span>
                        <span className="text-muted-foreground">{count} ({percentage}%)</span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2">
                        <div
                          className="bg-primary h-2 rounded-full transition-all"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </Card>
          </motion.div>

          {/* Status Distribution */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="p-6">
              <h2 className="text-xl font-bold mb-4">Status Distribution</h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-destructive/10 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 bg-destructive rounded-full" />
                    <span className="font-medium">New</span>
                  </div>
                  <Badge variant="destructive">{stats.new}</Badge>
                </div>
                <div className="flex items-center justify-between p-4 bg-warning/10 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 bg-warning rounded-full" />
                    <span className="font-medium">In Progress</span>
                  </div>
                  <Badge variant="default">{stats.inProgress}</Badge>
                </div>
                <div className="flex items-center justify-between p-4 bg-success/10 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 bg-success rounded-full" />
                    <span className="font-medium">Resolved</span>
                  </div>
                  <Badge variant="secondary">{stats.resolved}</Badge>
                </div>
              </div>
            </Card>
          </motion.div>
        </div>

        {/* Priority Distribution */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="p-6">
            <h2 className="text-xl font-bold mb-4">Priority Distribution</h2>
            <div className="grid grid-cols-4 gap-4">
              {Object.entries(priorityStats).map(([priority, count]) => (
                <div key={priority} className="text-center">
                  <div className={`text-3xl font-bold mb-2 ${
                    priority === 'urgent' ? 'text-destructive' :
                    priority === 'high' ? 'text-warning' :
                    priority === 'medium' ? 'text-primary' :
                    'text-muted-foreground'
                  }`}>
                    {count}
                  </div>
                  <div className="text-sm text-muted-foreground capitalize">{priority}</div>
                </div>
              ))}
            </div>
          </Card>
        </motion.div>
      </div>
    </StaffLayout>
  );
}
