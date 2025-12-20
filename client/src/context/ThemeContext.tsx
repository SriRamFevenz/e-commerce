import React, { createContext, useContext, useEffect, useState } from 'react';
import api from '../services/api';
import { useAuth } from './AuthContext';

type Theme = 'light' | 'dark' | 'system';

interface ThemeContextType {
    theme: Theme;
    setTheme: (theme: Theme) => void;
    resolvedTheme: 'light' | 'dark';
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { user } = useAuth();
    const [theme, setThemeState] = useState<Theme>(() => {
        const savedTheme = localStorage.getItem('theme');
        return (savedTheme as Theme) || 'system';
    });
    const [resolvedTheme, setResolvedTheme] = useState<'light' | 'dark'>('light');

    // Sync with user preference from DB when user logs in
    useEffect(() => {
        if (user?.themePreference) {
            setThemeState(user.themePreference as Theme);
        }
    }, [user]);

    // Resolve system theme and apply styles
    useEffect(() => {
        const applyTheme = () => {
            let targetTheme = theme;
            if (theme === 'system') {
                targetTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
            }

            setResolvedTheme(targetTheme as 'light' | 'dark');
            document.documentElement.setAttribute('data-theme', targetTheme);

            if (targetTheme === 'dark') {
                document.documentElement.classList.add('dark');
            } else {
                document.documentElement.classList.remove('dark');
            }
        };

        applyTheme();

        // Listen for system changes if theme is 'system'
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        const handleChange = () => {
            if (theme === 'system') applyTheme();
        };

        mediaQuery.addEventListener('change', handleChange);
        return () => mediaQuery.removeEventListener('change', handleChange);
    }, [theme]);

    const setTheme = async (newTheme: Theme) => {
        setThemeState(newTheme);
        localStorage.setItem('theme', newTheme);

        if (user) {
            try {
                await api.put('/users/profile/theme', { theme: newTheme });
            } catch (error) {
                console.error('Failed to save theme preference', error);
            }
        }
    };

    return (
        <ThemeContext.Provider value={{ theme, setTheme, resolvedTheme }}>
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (context === undefined) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
};
