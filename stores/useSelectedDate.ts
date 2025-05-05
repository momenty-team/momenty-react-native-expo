import { create } from 'zustand';

interface SelectedDateState {
  selectedDate: Date;
  setSelectedDate: (date: Date) => void;
  day: number;
  month: number;
  year: number;
}

const useSelectedDate = create<SelectedDateState>((set, get) => ({
  selectedDate: new Date(),
  setSelectedDate: (date: Date) =>
    set({
      selectedDate: date,
      day: date.getDate(),
      month: date.getMonth() + 1,
      year: date.getFullYear(),
    }),
  day: new Date().getDate(),
  month: new Date().getMonth() + 1,
  year: new Date().getFullYear(),
}));

export default useSelectedDate;
