import { Complaint } from '@/data/mockComplaints';
import { StatusBadge } from './StatusBadge';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { formatDistanceToNow } from 'date-fns';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Image } from 'lucide-react';

interface ComplaintCardProps {
  complaint: Complaint;
  index: number;
}

export function ComplaintCard({ complaint, index }: ComplaintCardProps) {
  const navigate = useNavigate();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
    >
      <Card
        onClick={() => navigate(`/student/${complaint.id}`)}
        className="p-4 hover:shadow-lg transition-all duration-200 cursor-pointer hover:border-primary/50 group"
      >
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs font-mono text-muted-foreground bg-muted px-2 py-0.5 rounded">
                {complaint.ticketId}
              </span>
              <StatusBadge status={complaint.status} />
            </div>
            <h3 className="font-semibold text-lg mb-1 group-hover:text-primary transition-colors">
              {complaint.title}
            </h3>
            <Badge variant="outline" className="text-xs">
              {complaint.category}
            </Badge>
          </div>

          {complaint.screenshotUrl && (
            <div className="ml-4 flex-shrink-0">
              <div className="w-16 h-16 rounded-lg overflow-hidden bg-muted flex items-center justify-center">
                <Image className="w-6 h-6 text-muted-foreground" />
              </div>
            </div>
          )}
        </div>

        <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
          {complaint.description}
        </p>

        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>
            {formatDistanceToNow(complaint.createdAt, { addSuffix: true })}
          </span>
          {!complaint.isAnonymous && (
            <span className="font-medium">{complaint.studentName}</span>
          )}
        </div>
      </Card>
    </motion.div>
  );
}
