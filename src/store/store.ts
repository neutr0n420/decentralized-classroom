import { create } from "zustand";

interface ClassroomDetail {
  name: string;
  symbol: string;
  price: string;
}
interface StoreState {
  classroomDetails: Record<string, ClassroomDetail>;
  setClassroomDetails: (details: Record<string, ClassroomDetail>) => void;
}

export const useStore = create<StoreState>((set) => ({
  classroomDetails: {},

  setClassroomDetails: (details: Record<string, ClassroomDetail>) =>
    set((state) => ({ ...state, classroomDetails: details })),
}));
