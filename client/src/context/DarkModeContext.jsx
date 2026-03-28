import { createContext, useContext, useEffect, useState } from 'react';

const DarkModeContext = createContext();

export const useDarkMode = () => useContext(DarkModeContext);

export const DarkModeProvider = ({ children }) => {
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem('darkMode') === 'true';
  });

  useEffect(() => {
    const root = document.documentElement;
    if (darkMode) {
      root.classList.add('dark');
      root.style.setProperty('background-color', '#111827');
      root.style.setProperty('color', '#f3f4f6');
      document.body.style.setProperty('background-color', '#111827');
      document.body.style.setProperty('color', '#f3f4f6');
    } else {
      root.classList.remove('dark');
      root.style.removeProperty('background-color');
      root.style.removeProperty('color');
      document.body.style.removeProperty('background-color');
      document.body.style.removeProperty('color');
    }
    localStorage.setItem('darkMode', darkMode);
  }, [darkMode]);

  const toggleDarkMode = () => setDarkMode(prev => !prev);

  return (
    <DarkModeContext.Provider value={{ darkMode, toggleDarkMode }}>
      {children}
    </DarkModeContext.Provider>
  );
};