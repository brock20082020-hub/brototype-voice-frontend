import { useState } from 'react';
import { StudentLayout } from '@/components/StudentLayout';
import { ComplaintCard } from '@/components/ComplaintCard';
import { useComplaints, Complaint as DbComplaint } from '@/hooks/useComplaints';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, MessageSquare } from 'lucide-react';
import { motion } from 'framer-motion';

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

export default function StudentComplaints() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'new' | 'in_progress' | 'resolved'>('all');
  const { complaints: dbComplaints, loading } = useComplaints();

  if (loading) {
    return (
      <StudentLayout>
        <div className="flex items-center justify-center min-h-[50vh]">
          <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
        </div>
      </StudentLayout>
    );
  }

  const complaints = dbComplaints.map(convertComplaint);
  
  const filteredComplaints = complaints.filter(complaint => {
    const matchesSearch = 
      complaint.ticketId.toLowerCase().includes(search.toLowerCase()) ||
      complaint.title.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'all' || complaint.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <StudentLayout>
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <h1 className="text-3xl font-bold mb-2">My Complaints</h1>
          <p className="text-muted-foreground">Track all your submitted complaints</p>
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
          <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v as any)}>
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
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-4"
        >
          {filteredComplaints.length === 0 ? (
            <div className="text-center py-16 bg-card rounded-xl border border-border">
              <MessageSquare className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-xl font-semibold mb-2">No complaints found</h3>
              <p className="text-muted-foreground">
                {search || statusFilter !== 'all' 
                  ? 'Try adjusting your filters' 
                  : 'Submit your first complaint to get started'}
              </p>
            </div>
          ) : (
            filteredComplaints.map((complaint, index) => (
              <ComplaintCard key={complaint.id} complaint={complaint} index={index} />
            ))
          )}
        </motion.div>
      </div>
    </StudentLayout>
  );
}
