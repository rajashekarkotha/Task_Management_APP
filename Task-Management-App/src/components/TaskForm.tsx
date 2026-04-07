import { useState, useEffect } from 'react';
import { z } from 'zod';
import { Button } from 'react-bootstrap';
import { useParams, useNavigate } from 'react-router';
import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch, RootState } from "../state/AppStore";
import { addTaskList, updateTaskList } from "../state/TaskTrackingSlice";

const TaskFormSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required'),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH']),
  status: z.enum(['TODO', 'IN_PROGRESS', 'DONE'])
});

type TaskFormData = z.infer<typeof TaskFormSchema>;

const TaskForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  const taskList = useSelector(
    (state: RootState) => state.taskTrackingSlice.taksListSummary
  );

  const isEditMode = Boolean(id);

  const existingTask = taskList.find(
    task => task.id === Number(id)
  );

  const [formData, setFormData] = useState<TaskFormData>({
    title: '',
    description: '',
    priority: 'MEDIUM',
    status: 'TODO'
  });

  const [errors, setErrors] = useState<
    Partial<Record<keyof TaskFormData, string>>
  >({});

  const [loading, setLoading] = useState(false);

  const validateForm = (): boolean => {
    const result = TaskFormSchema.safeParse(formData);

    if (!result.success) {
      const fieldErrors: Partial<Record<keyof TaskFormData, string>> = {};

      result.error.issues.forEach(issue => {
        const field = issue.path[0] as keyof TaskFormData;
        fieldErrors[field] = issue.message;
      });

      setErrors(fieldErrors);
      return false;
    }

    setErrors({});
    return true;
  };


  useEffect(() => {
    if (isEditMode && existingTask) {
      setFormData({
        title: existingTask.title,
        description: existingTask.description ?? '',
        priority: existingTask.priority,
        status: existingTask.status
      });
    }
  }, [isEditMode, existingTask]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;

    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    setErrors(prev => ({
      ...prev,
      [name]: undefined
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    if (isEditMode && existingTask) {
      dispatch(
        updateTaskList({
          ...existingTask,
          ...formData
        })
      );
    } else {
      const storedId = localStorage.getItem('id');
      const nextId = storedId ? Number(storedId) + 1 : 1;
      localStorage.setItem('id', String(nextId));

      dispatch(
        addTaskList({
          id: nextId,
          ...formData
        })
      );
    }

    setLoading(false);
    navigate('/');
  };

  return (
    <form onSubmit={handleSubmit} className="task-form col-sm-7">
      <h2>{isEditMode ? 'Edit Task' : 'Create Task'}</h2>

      <div className="form-group mb-2">
        <label>Title *</label>
        <input
          name="title"
          value={formData.title}
          onChange={handleChange}
          className={`form-control ${errors.title ? 'is-invalid' : ''}`}
        />

        {errors.title && (
          <div className="invalid-feedback">{errors.title}</div>
        )}

      </div>

      <div className="form-group mb-2">
        <label>Description</label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          className={`form-control ${errors.description ? 'is-invalid' : ''}`}
        />
        {errors.description && (
          <div className="invalid-feedback">{errors.description}</div>
        )}
      </div>

      <div className="form-group mb-4">
        <label>Priority</label>
        <select
          name="priority"
          value={formData.priority}
          onChange={handleChange}
          className={`form-control ${errors.priority ? 'is-invalid' : ''}`}
        >
          <option value="LOW">Low</option>
          <option value="MEDIUM">Medium</option>
          <option value="HIGH">High</option>
        </select>
      </div>

      {errors.priority && (
        <div className="invalid-feedback">{errors.priority}</div>
      )
      }

      {isEditMode && (
        <div className="form-group mb-4">
          <label>Status</label>
          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
            className={`form-control ${errors.status ? 'is-invalid' : ''}`}
          >
            <option value="TODO">TODO</option>
            <option value="IN_PROGRESS">IN_PROGRESS</option>
            <option value="DONE">DONE</option>
          </select>

          {errors.status && (
            <div className="invalid-feedback">{errors.status}</div>
          )}
        </div>
      )}

      <Button type="submit" disabled={loading}>
        {loading
          ? isEditMode ? 'Updating...' : 'Creating...'
          : isEditMode ? 'Update Task' : 'Add Task'}
      </Button>
    </form>
  );
};

export default TaskForm;