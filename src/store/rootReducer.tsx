// RootState.ts
import { NotificationReducer } from "./notification";
import { SearchReducer } from "./searchSlice";
import { combineReducers } from "@reduxjs/toolkit";

const rootReducer = combineReducers({
  search: SearchReducer,
  notification: NotificationReducer
  // Add other slices if you have them
});

export type RootState = ReturnType<typeof rootReducer>;
export default rootReducer;
