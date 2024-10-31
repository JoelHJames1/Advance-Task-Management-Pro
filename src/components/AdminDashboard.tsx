import React, { useState, useEffect } from 'react';
import { TaskForm, TaskFormData } from './admin/TaskForm';
import { FileUploader } from './admin/FileUploader';
import {
  getTasks,
  addTask,
  getWorkers,
  uploadFile,
} from '../utils/firebase';

interface Worker {
  id: string;
  email: string;
  uid: string;
}

const AdminDashboard: React.FC = () => {
  const [tasks, setTasks] = useState<any[]>([]);
  const [workers, setWorkers] = useState<Worker[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [taskLoading, setTaskLoading] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [uploadError, setUploadError] = useState('');
  const [uploadSuccess, setUploadSuccess] = useState('');
  const [newTask, setNewTask] = useState<TaskFormData>({
    title: '',
    description: '',
    assignedTo: '',
    priority: 'medium',
    dueDate: new Date().toISOString().split('T')[0]
  });

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const fetchedTasks = await getTasks('');
        const fetchedWorkers = await getWorkers();
        setTasks(fetchedTasks);
        setWorkers(fetchedWorkers);
      } catch (error) {
        console.error('Error fetching data:', error);
        setError('Failed to load data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleAddTask = async () => {
    if (!newTask.title || !newTask.assignedTo) {
      setError('Please fill out all required fields');
      return;
    }

    setTaskLoading(true);
    setError('');

    try {
      await addTask({
        ...newTask,
        status: 'to-do',
        createdAt: new Date().toISOString()
      });

      setNewTask({
        title: '',
        description: '',
        assignedTo: '',
        priority: 'medium',
        dueDate: new Date().toISOString().split('T')[0]
      });

      const updatedTasks = await getTasks('');
      setTasks(updatedTasks);
    } catch (error) {
      console.error('Error adding task:', error);
      setError('Failed to add task. Please try again.');
    } finally {
      setTaskLoading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
    }
  };

  const handleFileUpload = async () => {
    if (!file) {
      setUploadError('Please select a file to upload.');
      return;
    }

    try {
      const downloadURL = await uploadFile(file, `uploads/${file.name}`);
      setUploadSuccess(`File uploaded successfully. Download URL: ${downloadURL}`);
      setUploadError('');
    } catch (error) {
      console.error('Error uploading file:', error);
      setUploadError('Failed to upload file. Please try again.');
      setUploadSuccess('');
    }
  };

  if (loading) {
    return <div className="p-4">Loading dashboard...</div>;
  }

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h2 className="text-2xl font-bold mb-6">Admin Controls</h2>

      <div className="mb-8">
        <h3 className="text-lg font-semibold mb-4">Create New Task</h3>
        <TaskForm
          task={newTask}
          workers={workers}
          loading={taskLoading}
          error={error}
          onSubmit={handleAddTask}
          onChange={setNewTask}
        />
      </div>

      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-4">File Upload</h3>
        <FileUploader
          onFileChange={handleFileChange}
          onUpload={handleFileUpload}
          error={uploadError}
          success={uploadSuccess}
        />
      </div>
    </div>
  );
};

export default AdminDashboard;