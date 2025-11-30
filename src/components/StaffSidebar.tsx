import { Home, Inbox, CheckCircle, Bell, LogOut, Users, BarChart3, User } from 'lucide-react';
import { NavLink } from '@/components/NavLink';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';

export function StaffSidebar() {
  const { signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate('/auth');
  };

  const { userRole } = useAuth();
  
  const menuItems = [
    { icon: Home, label: 'Dashboard', path: '/admin/dashboard' },
    { icon: Inbox, label: 'Assigned Complaints', path: '/admin/assigned' },
    { icon: CheckCircle, label: 'Resolved Complaints', path: '/admin/resolved' },
    { icon: BarChart3, label: 'Analytics', path: '/admin/analytics' },
    { icon: Bell, label: 'Notifications', path: '/admin/notifications' },
    { icon: User, label: 'Profile', path: '/admin/profile' },
  ];

  // Add Manage Users only for admins
  if (userRole === 'admin') {
    menuItems.push({ icon: Users, label: 'Manage Users', path: '/admin/manage-users' });
  }

  return (
    <aside className="w-64 min-h-screen bg-card border-r border-border">
      <div className="p-6">
        <h2 className="text-lg font-semibold mb-6 text-foreground">Staff Menu</h2>
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
