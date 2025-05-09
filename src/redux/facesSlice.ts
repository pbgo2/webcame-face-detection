import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface FaceData {
  age: number;
  gender: string;
  expressions: any;
  box: { x: number; y: number; width: number; height: number };
}

const facesSlice = createSlice({
  name: 'faces',
  initialState: [] as FaceData[],
  reducers: {
    setFaces(state, action: PayloadAction<FaceData[]>) {
      return action.payload;
    },
  },
});

export const { setFaces } = facesSlice.actions;
export default facesSlice.reducer;
