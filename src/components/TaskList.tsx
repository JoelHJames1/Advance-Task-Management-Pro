import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Task, subscribeToTasks, subscribeToUserTasks } from '../utils/firebase';

const TaskList: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const { user, userRole } = useAuth();

  useEffect(() => {
    if (!user) return;

    const unsubscribe = userRole === 'admin'
      ? subscribeToTasks(setTasks)
      : subscribeToUserTasks(user.uid, setTasks);

    return () => unsubscribe();
  }, [user, userRole]);

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'in-progress':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority.toLowerCase()) {
      case 'high':
        return 'text-red-500';
      case 'medium':
        return 'text-yellow-500';
      default:
        return 'text-green-500';
    }
  };

  return (
    <div className="space-y-4">
      {tasks.map((task) => (
        <div
          key={task.id}
          className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className={`w-2 h-2 rounded-full ${getPriorityColor(task.priority)}`} />
              <h3 className="font-medium">{task.title}</h3>
            </div>
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(task.status)}`}>
              {task.status}
            </span>
          </div>
          <p className="mt-2 text-sm text-gray-600">{task.description}</p>
          <div className="mt-4 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="flex -space-x-2">
                {task.assignedTo && (
                  <div className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center text-white text-xs">
                    {task.assignedTo.charAt(0).toUpperCase()}
                  </div>
                )}
              </div>
            </div>
            <div className="text-sm text-gray-500">
              Due {new Date(task.dueDate).toLocaleDateString()}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default TaskList;