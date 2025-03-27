import { REGEX } from '@/constants/regex';

export const validateBirthDate = (birthDay: string): boolean => {
  if (!REGEX.BIRTHDAY.test(birthDay)) return false;

  const year = parseInt(birthDay.slice(0, 4), 10);
  const month = parseInt(birthDay.slice(4, 6), 10);
  const day = parseInt(birthDay.slice(6, 8), 10);

  const date = new Date(year, month - 1, day);

  return (
    date.getFullYear() === year &&
    date.getMonth() === month - 1 &&
    date.getDate() === day
  );
};
