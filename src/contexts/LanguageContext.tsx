// Language support removed. This file is retained as a minimal stub to
// avoid import errors in case any references remain. Use plain English
// strings across the app instead of translations.

export const useLang = () => {
  return {
    t: (k: string) => k,
    locale: 'en',
    setLocale: (_: string) => {},
  } as const;
};

export default useLang;
