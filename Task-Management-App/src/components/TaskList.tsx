import { useEffect, useMemo, useState } from 'react';
import { Table } from 'react-bootstrap';
import TaskItem from './TaskItem';
import TaskSearch from './TaskSearch';
import { useSelector, useDispatch } from 'react-redux';
import type { AppDispatch, RootState } from "../state/AppStore";
import type { TaskList as Task } from '../models/TaskList';
import { loadTaskList } from '../state/TaskTrackingSlice';

export default function TaskList() {
  const dispatch = useDispatch<AppDispatch>();

  const taskList: Task[] = useSelector(
    (state: RootState) => state.taskTrackingSlice.taksListSummary
  );

  const loading = useSelector(
    (state: RootState) => state.taskTrackingSlice.inProgress
  );

  const error = useSelector(
    (state: RootState) => state.taskTrackingSlice.errMsg
  );

  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    dispatch(loadTaskList());
  }, [dispatch]);

  const filteredTasks = useMemo(() => {
    if (!searchTerm) return taskList;

    const lowerSearch = searchTerm.toLowerCase();

    return taskList.filter(task =>
      task.id.toString().includes(lowerSearch) ||
      task.description?.toLowerCase().includes(lowerSearch) ||
      task.status.toLowerCase().includes(lowerSearch)
    );
  }, [taskList, searchTerm]);

  if (loading) return <p>Loading tasks...</p>;
  if (error) return <p className="error">{error}</p>;

  return (
    <div className="task-list">
      <h2>Task List</h2>

      <TaskSearch onSearch={setSearchTerm} />

      {!filteredTasks.length ? (
        <p>No matching tasks found</p>
      ) : (
        <Table bordered hover>
          <thead className="table-dark">
            <tr>
              <th>ID</th>
              <th>Description</th>
              <th>Priority</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            <TaskItem tasks={filteredTasks} />
          </tbody>
        </Table>
      )}
    </div>
  );
}