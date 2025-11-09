"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import { useTheme } from "@/components/ThemeProvider";
import { useAuth } from "@/components/AuthProvider";
import { Settings as SettingsIcon } from "lucide-react";

export function Navbar() {
  const pathname = usePathname();
  const { theme, toggleTheme } = useTheme();
  const { user, logout, isLoading } = useAuth();
  
  const navLinks = [
    { href: "/dashboard", label: "Dashboard" },
    { href: "/investments", label: "Investments" },
    { href: "/insights", label: "Insights" },
    { href: "/advisor", label: "Advisor" },
  ];
  return (
    <AppBar
      position="sticky"
      color="default"
      elevation={0}
      sx={(theme) => ({
        borderBottom: `1px solid ${theme.palette.divider}`,
        bgcolor: 'background.paper',
        zIndex: 1200,
      })}
    >
      <Toolbar sx={{ maxWidth: 1280, mx: 'auto', width: '100%', display: 'flex', justifyContent: 'space-between', px: { xs: 2, md: 4 }, py: 2 }}>
        <Link href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 8 }}>
          <Box sx={(theme) => ({ width: 40, height: 40, bgcolor: theme.palette.action.hover, borderRadius: 2, display: 'flex', alignItems: 'center', justifyContent: 'center', mr: 1 })}>
            <span style={{ fontSize: 28 }}>💎</span>
          </Box>
          <Typography variant="h6" color="text.primary" fontWeight={700} sx={{ letterSpacing: 0.5 }}>
            FinTrackrX
          </Typography>
        </Link>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          {navLinks.map((link) => (
            <Link key={link.href} href={link.href} style={{ textDecoration: 'none' }}>
              <Button
                variant={pathname === link.href ? 'contained' : 'text'}
                color={pathname === link.href ? 'primary' : 'inherit'}
                sx={{
                  fontWeight: 500,
                  fontSize: 15,
                  borderRadius: 2,
                  px: 2.5,
                  py: 1,
                  boxShadow: 'none',
                  ...(pathname === link.href
                    ? { bgcolor: 'primary.main', color: '#fff', '&:hover': { bgcolor: 'primary.dark' } }
                    : { color: 'text.secondary' }),
                }}
              >
                {link.label}
              </Button>
            </Link>
          ))}
          {user ? (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, ml: 2 }}>
              <Typography variant="body2" color="text.secondary">
                {user.name ?? user.email}
              </Typography>
              <Link href="/settings" style={{ textDecoration: 'none' }}>
                <IconButton aria-label="Settings" color={pathname === '/settings' ? 'primary' : 'default'}>
                  <SettingsIcon size={18} />
                </IconButton>
              </Link>
              <Button variant="outlined" color="inherit" size="small" onClick={logout} sx={{ borderRadius: 2 }}>
                Logout
              </Button>
            </Box>
          ) : isLoading ? (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, ml: 2 }}>
              <Typography variant="body2" color="text.secondary">
                Loading...
              </Typography>
            </Box>
          ) : (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, ml: 2 }}>
              <Link href="/login" style={{ textDecoration: 'none' }}>
                <Button variant="text" color="inherit" size="small" sx={{ borderRadius: 2 }}>
                  Login
                </Button>
              </Link>
              <Link href="/signup" style={{ textDecoration: 'none' }}>
                <Button variant="contained" color="primary" size="small" sx={{ borderRadius: 2 }}>
                  Sign up
                </Button>
              </Link>
            </Box>
          )}
          <IconButton onClick={toggleTheme} sx={{ ml: 1 }} aria-label="Toggle theme">
            <span style={{ fontSize: 16 }}>{theme === 'dark' ? '🌙' : '☀️'}</span>
          </IconButton>
        </Box>
      </Toolbar>
    </AppBar>
  );
}
