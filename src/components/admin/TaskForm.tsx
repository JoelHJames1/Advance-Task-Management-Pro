import React from 'react';
import { Plus } from 'lucide-react';
import { FormField } from './FormField';
import { SelectField } from './SelectField';
import { TaskPriority, priorityOptions } from '../../types/task';
import { Worker } from '../../types/worker';

export interface TaskFormData {
  title: string;
  description: string;
  assignedTo: string;
  priority: TaskPriority;
  dueDate: string;
}

interface TaskFormProps {
  task: TaskFormData;
  workers: Worker[];
  loading: boolean;
  error: string;
  onSubmit: () => void;
  onChange: (task: TaskFormData) => void;
}

const inputClasses = "w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500";

export const TaskForm: React.FC<TaskFormProps> = ({
  task,
  workers,
  loading,
  error,
  onSubmit,
  onChange
}) => {
  const handleChange = (field: keyof TaskFormData, value: string) => {
    onChange({ ...task, [field]: value });
  };

  const workerOptions = [
    { id: 'default', value: '', label: 'Select a worker' },
    ...workers.map(worker => ({
      id: worker.uid,
      value: worker.uid,
      label: worker.email
    }))
  ];

  return (
    <div className="space-y-4">
      <FormField label="Task Title" required>
        <input
          type="text"
          value={task.title}
          onChange={(e) => handleChange('title', e.target.value)}
          className={inputClasses}
          placeholder="Enter task title"
        />
      </FormField>

      <FormField label="Description">
        <textarea
          value={task.description}
          onChange={(e) => handleChange('description', e.target.value)}
          className={inputClasses}
          rows={3}
          placeholder="Enter task description"
        />
      </FormField>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <SelectField
          label="Assign To"
          value={task.assignedTo}
          onChange={(value) => handleChange('assignedTo', value)}
          required
          options={workerOptions}
        />

        <SelectField
          label="Priority"
          value={task.priority}
          onChange={(value) => handleChange('priority', value)}
          options={priorityOptions.map(option => ({
            id: option.value,
            value: option.value,
            label: option.label
          }))}
        />

        <FormField label="Due Date">
          <input
            type="date"
            value={task.dueDate}
            onChange={(e) => handleChange('dueDate', e.target.value)}
            className={inputClasses}
            min={new Date().toISOString().split('T')[0]}
          />
        </FormField>
      </div>

      {error && (
        <p className="text-red-500 text-sm">{error}</p>
      )}

      <button
        onClick={onSubmit}
        disabled={loading}
        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <Plus className="mr-2 h-4 w-4" />
        {loading ? 'Adding...' : 'Add Task'}
      </button>
    </div>
  );
};