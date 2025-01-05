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
interface AccessStoreState {
  accessToken: string;
  setAccessToken: (token: string) => void;
}

export const useStore = create<StoreState>((set) => ({
  classroomDetails: {},

  setClassroomDetails: (details: Record<string, ClassroomDetail>) =>
    set((state) => ({ ...state, classroomDetails: details })),
}));

export const useAccessStore = create<AccessStoreState>((set) => ({
  accessToken: "test",
  setAccessToken: (token: string) => set({ accessToken: token }),
}))