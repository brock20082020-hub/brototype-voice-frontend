import { ComplaintStatus } from '@/data/mockComplaints';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, Clock, AlertCircle } from 'lucide-react';

interface StatusBadgeProps {
  status: ComplaintStatus;
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const config = {
    new: {
      label: 'New',
      variant: 'warning' as const,
      icon: AlertCircle,
      className: 'bg-warning/10 text-warning border-warning/20'
    },
    in_progress: {
      label: 'In Progress',
      variant: 'default' as const,
      icon: Clock,
      className: 'bg-primary/10 text-primary border-primary/20'
    },
    resolved: {
      label: 'Resolved',
      variant: 'success' as const,
      icon: CheckCircle2,
      className: 'bg-success/10 text-success border-success/20'
    }
  };

  const { label, icon: Icon, className } = config[status];

  return (
    <Badge variant="outline" className={className}>
      <Icon className="w-3 h-3 mr-1" />
      {label}
    </Badge>
  );
}
