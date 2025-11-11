export type ComplaintStatus = 'new' | 'in_progress' | 'resolved';

export interface Complaint {
  id: string;
  ticketId: string;
  studentName: string;
  title: string;
  category: 'Mentor Unresponsive' | 'Doubt Not Cleared' | 'Project Feedback Delay' | 'Platform Bug' | 'Other';
  description: string;
  status: ComplaintStatus;
  screenshotUrl?: string;
  isAnonymous: boolean;
  createdAt: Date;
  updatedAt: Date;
  expectedResolutionTime?: Date;
  resolutionNote?: string;
  internalNotes?: string;
}

export const mockComplaints: Complaint[] = [
  {
    id: '1',
    ticketId: 'BRO-A2F9',
    studentName: 'Rahul Sharma',
    title: 'Mentor not responding to code review requests',
    category: 'Mentor Unresponsive',
    description: 'I have been waiting for my React project review for 3 days. My mentor hasn\'t responded to my messages on Slack or email. This is blocking my progress to the next module.',
    status: 'in_progress',
    screenshotUrl: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400',
    isAnonymous: false,
    createdAt: new Date('2025-11-09T10:30:00'),
    updatedAt: new Date('2025-11-10T14:20:00'),
    expectedResolutionTime: new Date('2025-11-13T18:00:00'),
    internalNotes: 'Assigned to Rajesh. Mentor contacted on Nov 10.'
  },
  {
    id: '2',
    ticketId: 'BRO-X8Y2',
    studentName: 'Priya Menon',
    title: 'JavaScript closure concept not clear after session',
    category: 'Doubt Not Cleared',
    description: 'During yesterday\'s live session on closures (Module 4, Video 23, timestamp 14:30), I asked about lexical scope with nested functions. The explanation was too quick and I\'m still confused.',
    status: 'new',
    screenshotUrl: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=400',
    isAnonymous: false,
    createdAt: new Date('2025-11-10T16:45:00'),
    updatedAt: new Date('2025-11-10T16:45:00')
  },
  {
    id: '3',
    ticketId: 'BRO-K3L7',
    studentName: 'Anonymous',
    title: 'Project submission portal showing error',
    category: 'Platform Bug',
    description: 'When I try to submit my final project for Week 12, I get a "Network Error" message. I\'ve tried different browsers and cleared cache. The deadline is tomorrow.',
    status: 'resolved',
    screenshotUrl: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=400',
    isAnonymous: true,
    createdAt: new Date('2025-11-08T09:15:00'),
    updatedAt: new Date('2025-11-09T11:30:00'),
    resolutionNote: 'Server issue fixed. Submission portal is now working. Deadline extended by 24 hours for affected students.'
  },
  {
    id: '4',
    ticketId: 'BRO-P9Q1',
    studentName: 'Arjun Nair',
    title: 'Waiting 5 days for Node.js project feedback',
    category: 'Project Feedback Delay',
    description: 'I submitted my Express REST API project on Nov 5th. Still haven\'t received any feedback or review. Other students in my batch got theirs within 2 days.',
    status: 'in_progress',
    isAnonymous: false,
    createdAt: new Date('2025-11-07T11:20:00'),
    updatedAt: new Date('2025-11-09T09:10:00'),
    expectedResolutionTime: new Date('2025-11-12T17:00:00'),
    internalNotes: 'Backlog cleared. Review scheduled for Nov 12.'
  },
  {
    id: '5',
    ticketId: 'BRO-T4R8',
    studentName: 'Sneha Kumar',
    title: 'MongoDB connection string not working',
    category: 'Doubt Not Cleared',
    description: 'I\'ve followed the Module 8 tutorial exactly, but my MongoDB Atlas connection keeps failing with "Authentication failed" error. I\'ve triple-checked my credentials.',
    status: 'resolved',
    isAnonymous: false,
    createdAt: new Date('2025-11-06T14:30:00'),
    updatedAt: new Date('2025-11-07T10:15:00'),
    resolutionNote: 'Issue was whitelist IP address. Added 0.0.0.0/0 to MongoDB Atlas Network Access. Student confirmed it\'s working now.'
  },
  {
    id: '6',
    ticketId: 'BRO-M5N2',
    studentName: 'Vikram Singh',
    title: 'Git merge conflict resolution not explained properly',
    category: 'Doubt Not Cleared',
    description: 'The Git workshop covered basic branching but skipped merge conflict resolution. Now I\'m stuck with conflicts in my team project.',
    status: 'resolved',
    isAnonymous: false,
    createdAt: new Date('2025-11-05T13:00:00'),
    updatedAt: new Date('2025-11-06T16:45:00'),
    resolutionNote: 'Conducted 1-on-1 session on Git conflicts. Shared video resource and practice repository.'
  },
  {
    id: '7',
    ticketId: 'BRO-Z7W3',
    studentName: 'Anonymous',
    title: 'Mentor dismissed my question as "too basic"',
    category: 'Other',
    description: 'During office hours, I asked about the difference between let and var. My mentor said "You should know this by now" without explaining. This made me feel embarrassed to ask more questions.',
    status: 'in_progress',
    isAnonymous: true,
    createdAt: new Date('2025-11-09T15:30:00'),
    updatedAt: new Date('2025-11-10T10:00:00'),
    internalNotes: 'Escalated to program manager. Mentor coaching scheduled.'
  },
  {
    id: '8',
    ticketId: 'BRO-H6J9',
    studentName: 'Anjali Reddy',
    title: 'Live class video not available on LMS',
    category: 'Platform Bug',
    description: 'Yesterday\'s React Hooks live session (Nov 9, 7 PM) is not uploaded to the LMS. Other students in different batches can see their recordings.',
    status: 'resolved',
    isAnonymous: false,
    createdAt: new Date('2025-11-10T08:00:00'),
    updatedAt: new Date('2025-11-10T12:30:00'),
    resolutionNote: 'Recording was processed with delay due to server load. Now available on LMS under Module 6.'
  },
  {
    id: '9',
    ticketId: 'BRO-C2V4',
    studentName: 'Karthik Pillai',
    title: 'Mentor changed without prior notice',
    category: 'Other',
    description: 'My original mentor (Suresh) was helping me with my capstone project. Today I was assigned a new mentor (Pradeep) without any transition meeting. All my project context is lost.',
    status: 'new',
    isAnonymous: false,
    createdAt: new Date('2025-11-11T09:00:00'),
    updatedAt: new Date('2025-11-11T09:00:00')
  },
  {
    id: '10',
    ticketId: 'BRO-L8B5',
    studentName: 'Divya Krishnan',
    title: 'TypeScript doubt from Module 10 assignment',
    category: 'Doubt Not Cleared',
    description: 'I\'m stuck on the generics assignment (Module 10, Task 3). I don\'t understand how to constrain type parameters. I\'ve rewatched the video twice but need a live explanation with examples.',
    status: 'resolved',
    isAnonymous: false,
    createdAt: new Date('2025-11-04T17:20:00'),
    updatedAt: new Date('2025-11-05T14:00:00'),
    resolutionNote: 'Zoom call conducted. Explained generic constraints with real-world examples. Student completed assignment successfully.'
  }
];
