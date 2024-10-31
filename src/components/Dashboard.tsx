import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import {
  LogOut, Search, Bell, Menu, X, Users, MessageSquare,
  Calendar as CalendarIcon, Settings, PieChart, Layout,
  ChevronDown, Plus, Filter
} from 'lucide-react';
import UserList from './UserList';
import AdminDashboard from './AdminDashboard';
import WorkerDashboard from './WorkerDashboard';
import KanbanBoard from './KanbanBoard';
import CalendarView from './CalendarView';
import TaskStats from './TaskStats';
import { subscribeToUserStatus, getTasks, Task } from '../utils/firebase';

const Dashboard: React.FC = () => {
  const { user, logout, userRole } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [currentView, setCurrentView] = useState<'overview' | 'kanban' | 'calendar' | 'messages'>('overview');
  const [showNotifications, setShowNotifications] = useState(false);
  const [onlineUsers, setOnlineUsers] = useState<any[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    // Subscribe to online users
    const unsubscribeUsers = subscribeToUserStatus((users) => {
      setOnlineUsers(users.filter(u => u.isOnline && u.id !== user.uid));
    });

    // Fetch tasks
    const fetchTasks = async () => {
      try {
        const fetchedTasks = await getTasks(userRole === 'admin' ? '' : user.uid);
        setTasks(fetchedTasks as Task[]);
      } catch (error) {
        console.error('Error fetching tasks:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
    return () => unsubscribeUsers();
  }, [user, userRole]);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-200 ease-in-out ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className="h-full flex flex-col">
          {/* Logo */}
          <div className="p-6 border-b">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-teal-400 bg-clip-text text-transparent">
                TaskFlow Pro
              </h1>
              <button 
                onClick={() => setSidebarOpen(false)}
                className="lg:hidden text-gray-500 hover:text-gray-700"
              >
                <X size={20} />
              </button>
            </div>
          </div>

          {/* User Profile */}
          <div className="p-4 border-b">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-teal-400 flex items-center justify-center text-white font-semibold">
                {user?.email?.[0].toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {user?.email}
                </p>
                <p className="text-xs text-gray-500 capitalize">
                  {userRole}
                </p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-2">
            <button
              onClick={() => setCurrentView('overview')}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                currentView === 'overview'
                  ? 'bg-gradient-to-r from-blue-50 to-teal-50 text-blue-600'
                  : 'hover:bg-gray-100'
              }`}
            >
              <PieChart size={20} />
              <span>Overview</span>
            </button>

            <button
              onClick={() => setCurrentView('kanban')}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                currentView === 'kanban'
                  ? 'bg-gradient-to-r from-blue-50 to-teal-50 text-blue-600'
                  : 'hover:bg-gray-100'
              }`}
            >
              <Layout size={20} />
              <span>Kanban Board</span>
            </button>

            <button
              onClick={() => setCurrentView('calendar')}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                currentView === 'calendar'
                  ? 'bg-gradient-to-r from-blue-50 to-teal-50 text-blue-600'
                  : 'hover:bg-gray-100'
              }`}
            >
              <CalendarIcon size={20} />
              <span>Calendar</span>
            </button>

            <button
              onClick={() => setCurrentView('messages')}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                currentView === 'messages'
                  ? 'bg-gradient-to-r from-blue-50 to-teal-50 text-blue-600'
                  : 'hover:bg-gray-100'
              }`}
            >
              <MessageSquare size={20} />
              <span>Messages</span>
              {onlineUsers.length > 0 && (
                <span className="ml-auto bg-green-500 text-white text-xs px-2 py-1 rounded-full">
                  {onlineUsers.length}
                </span>
              )}
            </button>
          </nav>

          {/* Logout Button */}
          <div className="p-4 border-t">
            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-center space-x-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            >
              <LogOut size={18} />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className={`flex-1 ${sidebarOpen ? 'ml-64' : 'ml-0'}`}>
        {/* Header */}
        <header className="bg-white shadow-sm">
          <div className="flex items-center justify-between px-6 py-4">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="text-gray-500 hover:text-gray-700"
              >
                <Menu size={24} />
              </button>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search..."
                  className="w-64 pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative p-2 text-gray-500 hover:text-gray-700 rounded-lg hover:bg-gray-100"
              >
                <Bell size={20} />
                {tasks.some(task => 
                  new Date(task.dueDate) <= new Date() && task.status !== 'completed'
                ) && (
                  <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
                )}
              </button>
              {showNotifications && (
                <div className="absolute top-16 right-4 w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                  <div className="p-4 border-b">
                    <h3 className="font-semibold">Notifications</h3>
                  </div>
                  <div className="max-h-96 overflow-y-auto">
                    {tasks
                      .filter(task => new Date(task.dueDate) <= new Date() && task.status !== 'completed')
                      .map(task => (
                        <div key={task.id} className="p-4 border-b hover:bg-gray-50">
                          <p className="font-medium text-red-600">Task Overdue</p>
                          <p className="text-sm text-gray-600">{task.title}</p>
                        </div>
                      ))
                    }
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="p-6">
          <div className="max-w-7xl mx-auto">
            {currentView === 'overview' && (
              <div className="space-y-6">
                <TaskStats />
                {userRole === 'admin' ? <AdminDashboard /> : <WorkerDashboard />}
              </div>
            )}
            {currentView === 'kanban' && <KanbanBoard />}
            {currentView === 'calendar' && <CalendarView />}
            {currentView === 'messages' && <UserList />}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;