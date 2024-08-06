import { createSlice } from "@reduxjs/toolkit";

export interface NotificationState {
    countUpdated: boolean;
    enableHighPriorityNotification: boolean; // received high priority notification
    highPriorityNotificationData: {[key: string] : {}};
}

const initialState: NotificationState = {
    countUpdated: false,
    enableHighPriorityNotification:false,
    highPriorityNotificationData:{}
};

const notificationSlice = createSlice({
    name: "notifications",
    initialState,
    reducers: {
        updateCount: (state) => {
            const prevValue = state.countUpdated
            state.countUpdated = !prevValue;
        },
        enableNotificationAlert: (state,action) => {
            state.enableHighPriorityNotification = true;
            
            const id = action.payload._id;
            console.log(id,action.payload,'yashu');
            
            state.highPriorityNotificationData[id] = action.payload;
            
        },
        disableNotificationAlert: (state, action) => {
            const id = action.payload; // Assuming payload is the id
            delete state.highPriorityNotificationData[id];
            state.enableHighPriorityNotification = false;
        },
    },
});

export const { 
    updateCount,
    enableNotificationAlert,
    disableNotificationAlert
} = notificationSlice.actions;

export const NotificationReducer = notificationSlice.reducer;
