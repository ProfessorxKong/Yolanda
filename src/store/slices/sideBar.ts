import { createSlice } from '@reduxjs/toolkit';

interface GlobalState {
  inputText?: string; // input text
  sidebarCollapsed?: boolean; // sidebar collapsed state
  collapseCompleted?: boolean; // collapse section completion state
}

const initialState: GlobalState = {
  sidebarCollapsed: false,
  collapseCompleted: false,
};

export const sideBarSlice = createSlice({
  name: 'sideBar',
  initialState,
  reducers: {
    setInputText: (state, action) => {
      state.inputText = action.payload;
    },
    setSidebarCollapsed: (state, action) => {
      state.sidebarCollapsed = action.payload;
    },
    setCollapseCompleted: (state, action) => {
      state.collapseCompleted = action.payload;
    },
  },
});

export const { setInputText, setSidebarCollapsed, setCollapseCompleted } = sideBarSlice.actions;
export default sideBarSlice.reducer;
