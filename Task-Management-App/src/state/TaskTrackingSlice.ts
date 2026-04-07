import { createAsyncThunk, createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { TaskList } from "../models/TaskList";
import axios from "axios";

interface TaskSummaryState {
    taksListSummary: TaskList[];
    selectedTaksSummary: TaskList | null;
    inProgress?: boolean;
    errMsg?: string;
}

const initialState: TaskSummaryState = {
    taksListSummary: [],
    selectedTaksSummary: null
};

const apiUrl = "http://localhost:9999";

export const loadTaskList = createAsyncThunk<TaskList[], void>(
    'TaskTrackingSlice/loadTaskList',
    async () => {
        let data: TaskList[] = [];
        try {
            data = (await axios.get(apiUrl+"/taskListSummary")).data;
        } catch (err) {
            throw new Error('Failed to fetch data');
        }   
        return data;
    }
);

export const addTaskList = createAsyncThunk<TaskList, TaskList>(
    'TaskTrackingSlice/addTaskList',
    async (task, { rejectWithValue }) => {
        try {
            const response = await axios.post(
                `${apiUrl}/taskListSummary`,
             {
          ...task,
          status: "TODO"
        }
            );
            return response.data;
        } catch (err) {
            return rejectWithValue('Failed to add task');
        }
    }
);

export const updateTaskList = createAsyncThunk<
  TaskList,
  TaskList
>(
  'TaskTrackingSlice/updateTaskList',
  async (task, { rejectWithValue }) => {
    try {
      const response = await axios.put(
        `${apiUrl}/taskListSummary/${task.id}`,
        task
      );
      return response.data;
    } catch {
      return rejectWithValue('Failed to update task');
    }
  }
);

export const deleteTaskList = createAsyncThunk<
  number,  
  number  
>(
  'TaskTrackingSlice/deleteTaskList',
  async (taskId, { rejectWithValue }) => {
    try {
      await axios.delete(`${apiUrl}/taskListSummary/${taskId}`);
      return taskId;
    } catch {
      return rejectWithValue('Failed to delete task');
    }
  }
);


const TaskTrackingSlice = createSlice({
    name: "TaskListTrackingSlice",
    initialState,
    reducers: {
        selectTask: (state, action: PayloadAction<Number>) => {
            // state.selectedTask = state.task.find(cx => cx.id === action.payload);
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(loadTaskList.pending, (state) => {
                state.inProgress = true;
                state.errMsg = undefined;
            })
            .addCase(loadTaskList.fulfilled, (state, action: PayloadAction<TaskList[]>) => {
                state.inProgress = false;
                state.taksListSummary = action.payload;
            })
            .addCase(loadTaskList.rejected, (state, action) => {
                state.inProgress = false;
                state.errMsg = action.error.message || 'An error occurred';
            })
           .addCase(addTaskList.pending, (state) => {
                state.inProgress = true;
                state.errMsg = undefined;
            })
            .addCase(addTaskList.fulfilled, (state, action) => {
                state.inProgress = false;
                state.taksListSummary.push(action.payload);
            })
            .addCase(addTaskList.rejected, (state, action) => {
                state.inProgress = false;
                state.errMsg = action.error.message || 'Failed to add task';
            })
            .addCase(deleteTaskList.pending, (state) => {
                state.inProgress = true;
                state.errMsg = undefined;
            })
            .addCase(deleteTaskList.fulfilled, (state, action) => {
                state.inProgress = false;
                state.taksListSummary = state.taksListSummary.filter(
                  task => task.id !== action.payload
                );
            })
            .addCase(deleteTaskList.rejected, (state, action) => {
                state.inProgress = false;
                state.errMsg = action.error.message || 'Failed to add task';
            })
            .addCase(updateTaskList.pending, (state) => {
                state.inProgress = true;
                state.errMsg = undefined;
            })
            .addCase(updateTaskList.fulfilled, (state, action) => {
              const index = state.taksListSummary.findIndex(
                t => t.id === action.payload.id
              );
              if (index !== -1) {
                state.taksListSummary[index] = action.payload;
              }
            })
            .addCase(updateTaskList.rejected, (state, action) => {
                state.inProgress = false;
                state.errMsg = action.error.message || 'Failed to add task';
            })
            
    }
});

const TaskTrackingReducer = TaskTrackingSlice.reducer;
export default TaskTrackingReducer;

export const { selectTask } = TaskTrackingSlice.actions;