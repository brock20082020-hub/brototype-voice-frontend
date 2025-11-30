import { Home, FileText, List, Bell, LogOut, User } from 'lucide-react';
import { NavLink } from '@/components/NavLink';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';

export function StudentSidebar() {
  const { signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate('/auth');
  };

  const menuItems = [
    { icon: Home, label: 'Dashboard', path: '/student/dashboard' },
    { icon: FileText, label: 'Raise Complaint', path: '/student/submit' },
    { icon: List, label: 'My Complaints', path: '/student/complaints' },
    { icon: Bell, label: 'Notifications', path: '/student/notifications' },
    { icon: User, label: 'Profile', path: '/student/profile' },
  ];

  return (
    <aside className="w-64 min-h-screen bg-card border-r border-border">
      <div className="p-6">
        <h2 className="text-lg font-semibold mb-6 text-foreground">Menu</h2>
        <nav className="space-y-2">
          {menuItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className="flex items-center space-x-3 px-4 py-3 rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground transition-all"
              activeClassName="bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground font-medium"
            >
              <item.icon className="w-5 h-5" />
              <span>{item.label}</span>
            </NavLink>
          ))}
          <Button
            variant="ghost"
            className="w-full justify-start space-x-3 px-4 py-3 text-muted-foreground hover:bg-muted hover:text-destructive"
            onClick={handleSignOut}
          >
            <LogOut className="w-5 h-5" />
            <span>Logout</span>
          </Button>
        </nav>
      </div>
    </aside>
  );
}
