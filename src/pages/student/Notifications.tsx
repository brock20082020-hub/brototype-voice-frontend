import { StudentLayout } from '@/components/StudentLayout';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Bell, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';

export default function StudentNotifications() {
  // Mock notifications - in production, fetch from database
  const notifications = [
    {
      id: 1,
      type: 'resolved',
      message: 'Your complaint #BRO-A3F2 has been marked as Resolved.',
      time: '2 hours ago',
      read: false
    },
    {
      id: 2,
      type: 'update',
      message: 'Staff replied to your complaint #BRO-B7E1.',
      time: '5 hours ago',
      read: false
    },
    {
      id: 3,
      type: 'status',
      message: 'Your complaint #BRO-C9D4 status changed to In Progress.',
      time: '1 day ago',
      read: true
    },
  ];

  const getIcon = (type: string) => {
    switch (type) {
      case 'resolved':
        return <CheckCircle className="w-5 h-5 text-success" />;
      case 'update':
        return <AlertCircle className="w-5 h-5 text-primary" />;
      case 'status':
        return <Clock className="w-5 h-5 text-warning" />;
      default:
        return <Bell className="w-5 h-5 text-muted-foreground" />;
    }
  };

  return (
    <StudentLayout>
      <div className="max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <h1 className="text-3xl font-bold mb-2">Notifications</h1>
          <p className="text-muted-foreground">Stay updated on your complaints</p>
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
                You'll see updates about your complaints here
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
    </StudentLayout>
  );
}
