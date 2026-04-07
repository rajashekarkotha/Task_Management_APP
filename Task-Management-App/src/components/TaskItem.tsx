
import { Button } from 'react-bootstrap';
import type { TaskList } from '../models/TaskList';
import { useDispatch } from 'react-redux';
import { deleteTaskList } from "../state/TaskTrackingSlice"
import type { AppDispatch } from "../state/AppStore";
import { useNavigate } from 'react-router';
const TaskItem = ({ tasks }: { tasks: TaskList[] }) => {
    const navigate = useNavigate();
    const dispatch: AppDispatch = useDispatch();
   
    const handleDelete = (id: number) => {
        if (window.confirm('Delete task?')) {
            dispatch(deleteTaskList(id));
        }
    };
    const handleEdit = (id:number)=>{
        navigate(`edit/${id}`)
    }
    return (
        <>
            {tasks.map((task: TaskList) => (
                <tr key={task.id}>
                    <td>{task.id}</td>
                    <td>{task.description}</td>
                    <td>{task.priority}</td>
                    <td>{task.status}</td>
                    <td>
                        <Button
                            onClick={() => handleEdit(task.id)}
                            className="delete-btn m-1"
                            variant="outline-primary"
                        >
                            Edit
                        </Button>
                        <Button
                            onClick={() => handleDelete(task.id)}
                            className="delete-btn m-1"
                            variant="danger"
                        >
                            Delete
                        </Button>
                    </td>
                </tr>
            ))}
        </>
    );
}

export default TaskItem;