import { configureStore } from "@reduxjs/toolkit";
import TaskTrackingReducer from "./TaskTrackingSlice";

export const appStore = configureStore({
    reducer : {
        taskTrackingSlice : TaskTrackingReducer
    }
});

export type RootState = ReturnType<typeof appStore.getState>;
export type AppDispatch = typeof appStore.dispatch;