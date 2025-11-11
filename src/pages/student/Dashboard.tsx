import { useState } from 'react';
import { Layout } from '@/components/Layout';
import { ComplaintCard } from '@/components/ComplaintCard';
import { mockComplaints } from '@/data/mockComplaints';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, MessageSquare } from 'lucide-react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

export default function Dashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('active');

  const activeComplaints = mockComplaints.filter(c => c.status !== 'resolved');
  const allComplaints = [...mockComplaints].sort((a, b) => 
    b.updatedAt.getTime() - a.updatedAt.getTime()
  );

  const stats = {
    active: activeComplaints.length,
    resolved: mockComplaints.filter(c => c.status === 'resolved').length
  };

  return (
    <Layout>
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 text-center"
        >
          <h1 className="text-4xl font-bold mb-3 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Your Voice, Heard 💬
          </h1>
          <p className="text-muted-foreground text-lg">
            Track, resolve, and keep coding.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-6 flex items-center justify-center gap-6 p-4 bg-card rounded-xl border border-border"
        >
          <div className="text-center">
            <div className="text-3xl font-bold text-warning">{stats.active}</div>
            <div className="text-sm text-muted-foreground">Active</div>
          </div>
          <div className="w-px h-12 bg-border"></div>
          <div className="text-center">
            <div className="text-3xl font-bold text-success">{stats.resolved}</div>
            <div className="text-sm text-muted-foreground">Resolved</div>
          </div>
        </motion.div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="active">Active</TabsTrigger>
            <TabsTrigger value="history">History</TabsTrigger>
          </TabsList>

          <TabsContent value="active" className="mt-6 space-y-4">
            {activeComplaints.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-16"
              >
                <MessageSquare className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-xl font-semibold mb-2">No active complaints</h3>
                <p className="text-muted-foreground mb-6">
                  Everything's good! Hit '+ New' if you need help.
                </p>
              </motion.div>
            ) : (
              activeComplaints.map((complaint, index) => (
                <ComplaintCard key={complaint.id} complaint={complaint} index={index} />
              ))
            )}
          </TabsContent>

          <TabsContent value="history" className="mt-6 space-y-4">
            {allComplaints.map((complaint, index) => (
              <ComplaintCard key={complaint.id} complaint={complaint} index={index} />
            ))}
          </TabsContent>
        </Tabs>

        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          className="fixed bottom-8 right-8"
        >
          <Button
            size="lg"
            onClick={() => navigate('/student/submit')}
            className="rounded-full shadow-lg h-14 px-6 animate-pulse hover:animate-none"
          >
            <Plus className="w-5 h-5 mr-2" />
            New Complaint
          </Button>
        </motion.div>
      </div>
    </Layout>
  );
}
