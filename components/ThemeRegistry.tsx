"use client";
import * as React from 'react';
import createCache from '@emotion/cache';
import { CacheProvider } from '@emotion/react';
import { useServerInsertedHTML } from 'next/navigation';
import { ThemeProvider as MuiThemeProvider, createTheme, CssBaseline } from '@mui/material';
import { useTheme } from '@/components/ThemeProvider';

// Server-compatible Emotion + MUI registry to avoid hydration mismatches
export default function ThemeRegistry({ children }: { children: React.ReactNode }) {
  const [{ cache, flush }] = React.useState(() => {
    const cache = createCache({ key: 'mui', prepend: true });
    cache.compat = true;
    let inserted: string[] = [];
    const prevInsert = cache.insert;
    cache.insert = (...args: any[]) => {
      const [selector, serialized, sheet, shouldCache] = args as [string, any, any, boolean];
      if (cache.inserted[serialized.name] === undefined) {
        inserted.push(serialized.name);
      }
      // @ts-ignore
      return prevInsert(selector, serialized, sheet, shouldCache);
    };
    const flush = () => {
      const prev = inserted;
      inserted = [];
      return prev;
    };
    return { cache, flush };
  });

  useServerInsertedHTML(() => {
    const names = flush();
    if (names.length === 0) return null;
    let styles = '';
    for (const name of names) {
      styles += cache.inserted[name];
    }
    return (
      <style
        key={cache.key + names.join('-')}
        data-emotion={`${cache.key} ${names.join(' ')}`}
        dangerouslySetInnerHTML={{ __html: styles }}
      />
    );
  });

  const { theme: mode } = useTheme();

  const theme = React.useMemo(() => createTheme({
    palette: {
      mode,
      primary: { main: mode === 'dark' ? '#4dabf7' : '#1976d2' },
      secondary: { main: mode === 'dark' ? '#22d3ee' : '#00bcd4' },
      background: {
        default: mode === 'dark' ? '#0d1117' : '#f5f6fa',
        paper: mode === 'dark' ? '#161b22' : '#ffffff',
      },
      text: {
        primary: mode === 'dark' ? '#e6edf3' : '#222',
        secondary: mode === 'dark' ? '#9ca3af' : '#555',
      },
      divider: mode === 'dark' ? '#30363d' : '#e5e7eb',
    },
    shape: { borderRadius: 12 },
    typography: {
      fontFamily: 'Ubuntu, system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif',
      h1: { fontWeight: 700 }, h2: { fontWeight: 700 }, h3: { fontWeight: 700 },
      h4: { fontWeight: 700 }, h5: { fontWeight: 700 }, h6: { fontWeight: 700 },
      button: { textTransform: 'none', fontWeight: 600 },
    },
    components: {
      MuiCard: {
        styleOverrides: {
          root: {
            boxShadow: mode === 'dark' ? '0 2px 12px 0 rgba(0,0,0,0.4)' : '0 2px 12px 0 rgba(0,0,0,0.04)',
            borderRadius: 16,
            border: mode === 'dark' ? '1px solid #30363d' : '1px solid #e5e7eb',
            backgroundImage: 'none',
          }
        }
      },
      MuiAppBar: {
        styleOverrides: {
          root: {
            backgroundImage: 'none',
            backdropFilter: 'blur(8px)',
            backgroundColor: mode === 'dark' ? 'rgba(13,17,23,0.85)' : 'rgba(255,255,255,0.8)',
            borderBottom: mode === 'dark' ? '1px solid #30363d' : '1px solid #e5e7eb',
          }
        }
      },
      MuiButton: {
        styleOverrides: {
          root: { borderRadius: 8 }
        }
      },
    },
  }), [mode]);

  return (
    <CacheProvider value={cache}>
      <MuiThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </MuiThemeProvider>
    </CacheProvider>
  );
}