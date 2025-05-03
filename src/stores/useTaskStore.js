import { create } from 'zustand';

// Simple task store implementation
const useTaskStore = create((set) => ({
  tasks: [],
  habitAnswers: {},
  
  setTasks: (tasks) => set({ tasks }),
  setHabitAnswers: (habitAnswers) => set({ habitAnswers }),
  
  resetStore: () => set({ tasks: [], habitAnswers: {} })
}));

export default useTaskStore;