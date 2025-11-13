import { useState } from 'react';
import { StaffLayout } from '@/components/StaffLayout';
import { StatusBadge } from '@/components/StatusBadge';
import { useComplaints, Complaint as DbComplaint } from '@/hooks/useComplaints';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Search, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';

export default function ResolvedComplaints() {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const { complaints: dbComplaints, loading } = useComplaints();

  if (loading) {
    return (
      <StaffLayout>
        <div className="flex items-center justify-center min-h-[50vh]">
          <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
        </div>
      </StaffLayout>
    );
  }

  const complaints = dbComplaints
    .map((c: DbComplaint) => ({
      ...c,
      createdAt: new Date(c.created_at)
    }))
    .filter(c => c.status === 'resolved');

  const filteredComplaints = complaints.filter(complaint => {
    const matchesSearch = 
      complaint.ticket_id.toLowerCase().includes(search.toLowerCase()) ||
      complaint.title.toLowerCase().includes(search.toLowerCase());
    return matchesSearch;
  });

  return (
    <StaffLayout>
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <h1 className="text-3xl font-bold mb-2">Resolved Complaints</h1>
          <p className="text-muted-foreground">
            <span className="font-semibold text-success">{filteredComplaints.length}</span> complaints resolved
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-6"
        >
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search by ID or title..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
            />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-card rounded-lg border border-border overflow-hidden"
        >
          {filteredComplaints.length === 0 ? (
            <div className="p-12 text-center">
              <CheckCircle className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-xl font-semibold mb-2">No resolved complaints yet</h3>
              <p className="text-muted-foreground">Resolved complaints will appear here for reference.</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Student</TableHead>
                  <TableHead>Title</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Resolved</TableHead>
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
          )}
        </motion.div>
      </div>
    </StaffLayout>
  );
}
