import { createSlice } from '@reduxjs/toolkit';

const cameraSlice = createSlice({
  name: 'camera',
  initialState: { isCameraOn: false },
  reducers: {
    startCamera(state) {
      state.isCameraOn = true;
    },
    stopCamera(state) {
      state.isCameraOn = false;
    },
  },
});

export const { startCamera, stopCamera } = cameraSlice.actions;
export default cameraSlice.reducer;
