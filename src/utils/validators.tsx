export const isEmptyStr = (str: string | undefined | null): boolean => !str || !str.trim();
export const validateEmail = (email: string | undefined | null): boolean =>
  (email ? (/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(email)) : true);
export const validatePhone = (phone: string | undefined | null): boolean =>
  (phone ? (/^\+?[0-9]+$/i.test(phone)) : true);