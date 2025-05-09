import { configureStore } from '@reduxjs/toolkit';
import facesReducer from './facesSlice';
import cameraReducer from './cameraSlice';

export const store = configureStore({
  reducer: {
    faces: facesReducer,
    camera: cameraReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;



