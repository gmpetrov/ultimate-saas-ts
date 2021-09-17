export const isSSR = () => typeof window === 'undefined';

export const timestampToDate = (t?: number) => {
  if (!t) {
    return null;
  }
  return new Date(t * 1000);
};
