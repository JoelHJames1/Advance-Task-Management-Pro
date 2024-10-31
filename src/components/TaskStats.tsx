import React, { useState, useEffect } from 'react';
import { collection, query, where, getDocs, Timestamp } from 'firebase/firestore';
import { db } from '../utils/firebase';
import { useAuth } from '../context/AuthContext';
import { Clock, Calendar, AlertCircle } from 'lucide-react';

interface TaskStats {
  planned: number;
  overdue: number;
  dueToday: number;
  newTasks: number;
  finishedYesterday: number;
  dueThisWeek: number;
}

const TaskStats: React.FC = () => {
  const [stats, setStats] = useState<TaskStats>({
    planned: 0,
    overdue: 0,
    dueToday: 0,
    newTasks: 0,
    finishedYesterday: 0,
    dueThisWeek: 0
  });
  const { user } = useAuth();

  useEffect(() => {
    const fetchTaskStats = async () => {
      if (!user) return;

      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);
      
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);
      
      const weekFromNow = new Date(today);
      weekFromNow.setDate(weekFromNow.getDate() + 7);

      const tasksRef = collection(db, 'tasks');
      
      try {
        // Get all tasks for the current user
        const q = query(tasksRef, where('assignedTo', '==', user.uid));
        const querySnapshot = await getDocs(q);
        
        const tasks = querySnapshot.docs.map(doc => ({
          ...doc.data(),
          id: doc.id
        }));

        const newStats = {
          planned: tasks.filter(task => task.status === 'to-do').length,
          overdue: tasks.filter(task => {
            const dueDate = (task.dueDate as Timestamp).toDate();
            return dueDate < today && task.status !== 'completed';
          }).length,
          dueToday: tasks.filter(task => {
            const dueDate = (task.dueDate as Timestamp).toDate();
            return dueDate >= today && dueDate < tomorrow && task.status !== 'completed';
          }).length,
          newTasks: tasks.filter(task => {
            const createdAt = (task.createdAt as Timestamp).toDate();
            return createdAt >= today;
          }).length,
          finishedYesterday: tasks.filter(task => {
            const completedAt = task.completedAt && (task.completedAt as Timestamp).toDate();
            return completedAt && completedAt >= yesterday && completedAt < today;
          }).length,
          dueThisWeek: tasks.filter(task => {
            const dueDate = (task.dueDate as Timestamp).toDate();
            return dueDate >= today && dueDate <= weekFromNow && task.status !== 'completed';
          }).length
        };

        setStats(newStats);
      } catch (error) {
        console.error('Error fetching task stats:', error);
      }
    };

    fetchTaskStats();
  }, [user]);

  return (
    <div className="grid grid-cols-3 gap-4">
      <div className="bg-pink-50 p-4 rounded-lg">
        <div className="flex justify-between items-center">
          <div>
            <p className="text-2xl font-bold">{stats.planned}</p>
            <p className="text-sm text-gray-600">Planned Today</p>
          </div>
          <div className="text-pink-500">
            <Clock size={24} />
          </div>
        </div>
        <div className="mt-2 text-xs text-gray-500">
          <span className="text-red-500">{stats.overdue} Overdue</span>
          <span className="mx-2">•</span>
          <span>{stats.dueToday} Due Today</span>
          <span className="mx-2">•</span>
          <span>{stats.newTasks} New Tasks</span>
        </div>
      </div>

      <div className="bg-purple-50 p-4 rounded-lg">
        <div className="flex justify-between items-center">
          <div>
            <p className="text-2xl font-bold">{stats.finishedYesterday}</p>
            <p className="text-sm text-gray-600">Finished Yesterday</p>
          </div>
          <div className="text-purple-500">
            <AlertCircle size={24} />
          </div>
        </div>
      </div>

      <div className="bg-teal-50 p-4 rounded-lg">
        <div className="flex justify-between items-center">
          <div>
            <p className="text-2xl font-bold">{stats.dueThisWeek}</p>
            <p className="text-sm text-gray-600">Due This Week</p>
          </div>
          <div className="text-teal-500">
            <Calendar size={24} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskStats;