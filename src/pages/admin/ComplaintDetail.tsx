import { useParams, useNavigate } from 'react-router-dom';
import { Layout } from '@/components/Layout';
import { StatusBadge } from '@/components/StatusBadge';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { mockComplaints } from '@/data/mockComplaints';
import { ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';
import { format } from 'date-fns';

export default function AdminComplaintDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const complaint = mockComplaints.find(c => c.id === id);

  if (!complaint) {
    return (
      <Layout>
        <div className="text-center py-16">
          <h2 className="text-2xl font-bold mb-4">Complaint not found</h2>
          <Button onClick={() => navigate('/admin/dashboard')}>
            Back to Dashboard
          </Button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Button
            variant="ghost"
            onClick={() => navigate('/admin/dashboard')}
            className="mb-6"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Inbox
          </Button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="p-6 mb-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs font-mono text-muted-foreground bg-muted px-2 py-1 rounded">
                    {complaint.ticketId}
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

              {complaint.screenshotUrl && (
                <div>
                  <h3 className="font-semibold mb-2">Screenshot</h3>
                  <img
                    src={complaint.screenshotUrl}
                    alt="Complaint screenshot"
                    className="w-full max-h-64 object-cover rounded-lg border border-border"
                  />
                </div>
              )}

              <div className="flex flex-col gap-2 text-sm text-muted-foreground pt-4 border-t border-border">
                <div>
                  <span className="font-medium">Student:</span>{' '}
                  {complaint.isAnonymous ? 'Anonymous' : complaint.studentName}
                </div>
                <div>
                  <span className="font-medium">Submitted:</span>{' '}
                  {format(complaint.createdAt, 'MMM d, yyyy h:mm a')}
                </div>
                <div>
                  <span className="font-medium">Last Updated:</span>{' '}
                  {format(complaint.updatedAt, 'MMM d, yyyy h:mm a')}
                </div>
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-muted/50">
            <h2 className="text-lg font-semibold mb-4">Admin Panel (Demo)</h2>
            <div className="space-y-4">
              <div>
                <span className="text-sm font-medium text-muted-foreground">Status:</span>
                <div className="mt-1">
                  <StatusBadge status={complaint.status} />
                </div>
              </div>

              {complaint.internalNotes && (
                <div>
                  <span className="text-sm font-medium text-muted-foreground">Internal Notes:</span>
                  <p className="mt-1 text-sm italic">{complaint.internalNotes}</p>
                </div>
              )}

              {complaint.resolutionNote && (
                <div>
                  <span className="text-sm font-medium text-muted-foreground">Resolution Summary:</span>
                  <p className="mt-1 text-sm">{complaint.resolutionNote}</p>
                </div>
              )}

              {!complaint.resolutionNote && (
                <p className="text-sm text-muted-foreground italic">
                  This is a demo view. In production, staff would see action buttons and assignment options here.
                </p>
              )}
            </div>
          </Card>
        </motion.div>
      </div>
    </Layout>
  );
}
