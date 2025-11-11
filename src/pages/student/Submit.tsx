import { useState } from 'react';
import { Layout } from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Card } from '@/components/ui/card';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Upload, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';

const categories = [
  'Mentor Unresponsive',
  'Doubt Not Cleared',
  'Project Feedback Delay',
  'Platform Bug',
  'Other'
] as const;

const categoryHints: Record<string, string> = {
  'Mentor Unresponsive': 'Include mentor name, batch, and last contact date.',
  'Doubt Not Cleared': 'Mention module, video timestamp, and your attempt.',
  'Project Feedback Delay': 'Specify project name, submission date, and expected timeline.',
  'Platform Bug': 'Describe the error message, browser used, and steps to reproduce.',
  'Other': 'Provide as much context as possible for faster resolution.'
};

export default function Submit() {
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [screenshot, setScreenshot] = useState<File | null>(null);
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [newTicketId] = useState(`BRO-${Math.random().toString(36).substr(2, 4).toUpperCase()}`);

  const isValid = title.length > 0 && category && description.length >= 30;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isValid) {
      setShowSuccess(true);
      setTimeout(() => {
        navigate('/student/dashboard');
      }, 1500);
    }
  };

  return (
    <Layout>
      <div className="max-w-2xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Button
            variant="ghost"
            onClick={() => navigate('/student/dashboard')}
            className="mb-6"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>

          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Report an Issue</h1>
            <p className="text-muted-foreground">We'll get you unblocked ASAP.</p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  placeholder="e.g., Mentor not reviewing my project"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  autoFocus
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Select value={category} onValueChange={setCategory}>
                  <SelectTrigger id="category">
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat} value={cat}>
                        {cat}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Describe your issue in detail..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={6}
                  className="resize-none"
                />
                <div className="flex items-center justify-between text-xs">
                  <AnimatePresence mode="wait">
                    {category && categoryHints[category] && (
                      <motion.span
                        key={category}
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="text-primary"
                      >
                        💡 {categoryHints[category]}
                      </motion.span>
                    )}
                  </AnimatePresence>
                  <span className={description.length < 30 ? 'text-destructive' : 'text-success'}>
                    {description.length}/30 chars minimum
                  </span>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Screenshot (optional)</Label>
                <div className="relative">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setScreenshot(e.target.files?.[0] || null)}
                    className="hidden"
                    id="screenshot"
                  />
                  <label
                    htmlFor="screenshot"
                    className="flex items-center justify-center w-full h-32 border-2 border-dashed border-border rounded-lg hover:border-primary cursor-pointer transition-colors"
                  >
                    {screenshot ? (
                      <div className="flex items-center gap-2 text-success">
                        <CheckCircle className="w-5 h-5" />
                        <span className="font-medium">{screenshot.name}</span>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center gap-2 text-muted-foreground">
                        <Upload className="w-6 h-6" />
                        <span className="text-sm">Click to upload</span>
                      </div>
                    )}
                  </label>
                </div>
              </div>

              <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
                <div className="space-y-0.5">
                  <Label htmlFor="anonymous">Submit anonymously</Label>
                  <p className="text-xs text-muted-foreground">
                    Your name/email won't be shared with staff.
                  </p>
                </div>
                <Switch
                  id="anonymous"
                  checked={isAnonymous}
                  onCheckedChange={setIsAnonymous}
                />
              </div>

              <Button type="submit" className="w-full" disabled={!isValid}>
                Send Complaint
              </Button>
            </form>
          </Card>
        </motion.div>

        <Dialog open={showSuccess} onOpenChange={setShowSuccess}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 text-success">
                <CheckCircle className="w-6 h-6" />
                Submitted!
              </DialogTitle>
              <DialogDescription className="pt-4">
                Your complaint has been received.
                <div className="mt-3 p-3 bg-success/10 rounded-lg">
                  <div className="text-sm font-medium text-success">
                    Ticket ID: <span className="font-mono">{newTicketId}</span>
                  </div>
                </div>
              </DialogDescription>
            </DialogHeader>
          </DialogContent>
        </Dialog>
      </div>
    </Layout>
  );
}
