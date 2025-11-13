import { StaffLayout } from '@/components/StaffLayout';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Bell, AlertCircle, UserPlus, MessageSquare } from 'lucide-react';
import { motion } from 'framer-motion';

export default function StaffNotifications() {
  // Mock notifications - in production, fetch from database
  const notifications = [
    {
      id: 1,
      type: 'assigned',
      message: 'You have been assigned complaint #BRO-D5F8 (Technical).',
      time: '30 minutes ago',
      read: false
    },
    {
      id: 2,
      type: 'comment',
      message: 'Student Ramesh added a comment to complaint #BRO-E2A9.',
      time: '2 hours ago',
      read: false
    },
    {
      id: 3,
      type: 'new',
      message: 'New complaint submitted in Technical category.',
      time: '4 hours ago',
      read: true
    },
  ];

  const getIcon = (type: string) => {
    switch (type) {
      case 'assigned':
        return <UserPlus className="w-5 h-5 text-primary" />;
      case 'comment':
        return <MessageSquare className="w-5 h-5 text-accent" />;
      case 'new':
        return <AlertCircle className="w-5 h-5 text-warning" />;
      default:
        return <Bell className="w-5 h-5 text-muted-foreground" />;
    }
  };

  return (
    <StaffLayout>
      <div className="max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <h1 className="text-3xl font-bold mb-2">Notifications</h1>
          <p className="text-muted-foreground">Stay updated on complaint assignments and updates</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="space-y-4"
        >
          {notifications.length === 0 ? (
            <Card className="p-12 text-center">
              <Bell className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-xl font-semibold mb-2">No notifications yet</h3>
              <p className="text-muted-foreground">
                You'll see updates about complaint assignments here
              </p>
            </Card>
          ) : (
            notifications.map((notification, index) => (
              <motion.div
                key={notification.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className={`p-4 hover:bg-muted/50 transition-colors cursor-pointer ${
                  !notification.read ? 'border-primary' : ''
                }`}>
                  <div className="flex items-start gap-4">
                    <div className="mt-1">
                      {getIcon(notification.type)}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium mb-1">{notification.message}</p>
                      <p className="text-sm text-muted-foreground">{notification.time}</p>
                    </div>
                    {!notification.read && (
                      <Badge variant="default" className="ml-auto">New</Badge>
                    )}
                  </div>
                </Card>
              </motion.div>
            ))
          )}
        </motion.div>
      </div>
    </StaffLayout>
  );
}
