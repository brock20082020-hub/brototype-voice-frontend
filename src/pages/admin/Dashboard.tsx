import { useState, useEffect } from 'react';
import { Layout } from '@/components/Layout';
import { StatusBadge } from '@/components/StatusBadge';
import { useComplaints, Complaint as DbComplaint } from '@/hooks/useComplaints';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Search } from 'lucide-react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';

type ComplaintStatus = 'new' | 'in_progress' | 'resolved';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const { userRole, user } = useAuth();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<ComplaintStatus | 'all'>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
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
        setUserName(data.full_name);
      }
    };
    fetchProfile();
  }, [user]);

  // Redirect students to student dashboard
  useEffect(() => {
    if (userRole && userRole === 'student') {
      navigate('/student/dashboard');
    }
  }, [userRole, navigate]);

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[50vh]">
          <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
        </div>
      </Layout>
    );
  }

  const complaints = dbComplaints.map((c: DbComplaint) => ({
    ...c,
    createdAt: new Date(c.created_at)
  }));

  const categories = Array.from(new Set(complaints.map(c => c.category)));

  const filteredComplaints = complaints.filter(complaint => {
    const matchesSearch = 
      complaint.ticket_id.toLowerCase().includes(search.toLowerCase()) ||
      complaint.title.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'all' || complaint.status === statusFilter;
    const matchesCategory = categoryFilter === 'all' || complaint.category === categoryFilter;
    return matchesSearch && matchesStatus && matchesCategory;
  });

  const activeCount = complaints.filter(c => c.status !== 'resolved').length;

  const greeting = userName ? `Welcome back, ${userName}` : 'Welcome back';

  return (
    <Layout>
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold mb-2">{greeting} 👋</h1>
          <p className="text-muted-foreground">
            <span className="font-semibold text-warning">{activeCount}</span> Active Complaints
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-6 flex flex-col sm:flex-row gap-4"
        >
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search by ID or title..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v as ComplaintStatus | 'all')}>
            <SelectTrigger className="w-full sm:w-48">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="new">New</SelectItem>
              <SelectItem value="in_progress">In Progress</SelectItem>
              <SelectItem value="resolved">Resolved</SelectItem>
            </SelectContent>
          </Select>
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-full sm:w-48">
              <SelectValue placeholder="Filter by category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map(cat => (
                <SelectItem key={cat} value={cat}>{cat}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-card rounded-lg border border-border overflow-hidden"
        >
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Student</TableHead>
                <TableHead>Title</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredComplaints.map((complaint) => (
                <TableRow
                  key={complaint.id}
                  onClick={() => navigate(`/admin/${complaint.id}`)}
                  className="cursor-pointer hover:bg-muted/50"
                >
                  <TableCell className="font-mono text-sm">{complaint.ticket_id}</TableCell>
                  <TableCell>
                    {complaint.is_anonymous ? (
                      <Badge variant="outline">Anonymous</Badge>
                    ) : (
                      complaint.student_name
                    )}
                  </TableCell>
                  <TableCell className="font-medium">{complaint.title}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="text-xs">{complaint.category}</Badge>
                  </TableCell>
                  <TableCell>
                    <StatusBadge status={complaint.status} />
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {formatDistanceToNow(complaint.createdAt, { addSuffix: true })}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </motion.div>
      </div>
    </Layout>
  );
}
