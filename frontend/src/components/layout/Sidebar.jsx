import { useState } from 'react';
import {
  Drawer, List, ListItem, ListItemButton, ListItemIcon,
  ListItemText, Toolbar, Box, Typography, Divider, Chip
} from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import DashboardIcon from '@mui/icons-material/Dashboard';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import PeopleIcon from '@mui/icons-material/People';
import HowToVoteIcon from '@mui/icons-material/HowToVote';
import ListAltIcon from '@mui/icons-material/ListAlt';
import BarChartIcon from '@mui/icons-material/BarChart';

const DRAWER_WIDTH = 240;

const navItems = [
  { label: 'Dashboard', path: '/', icon: <DashboardIcon /> },
  { label: 'Partidos', path: '/partidos', icon: <AccountBalanceIcon /> },
  { label: 'Candidatos', path: '/candidatos', icon: <PeopleIcon /> },
  { divider: true },
  { label: 'Registrar Voto', path: '/votos/registrar', icon: <HowToVoteIcon /> },
  { label: 'Consultar Votos', path: '/votos', icon: <ListAltIcon /> },
  { label: 'Estadísticas', path: '/estadisticas', icon: <BarChartIcon /> },
];

const Sidebar = () => {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: DRAWER_WIDTH,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: DRAWER_WIDTH,
          boxSizing: 'border-box',
          backgroundColor: '#0F172A',
          color: '#FFFFFF',
          borderRight: 'none',
        },
      }}
    >
      <Toolbar sx={{ py: 2, flexDirection: 'column', alignItems: 'flex-start', gap: 0.5 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <HowToVoteIcon sx={{ color: '#38BDF8', fontSize: 28 }} />
          <Typography variant="h6" fontWeight={700} sx={{ color: '#FFFFFF', lineHeight: 1.2 }}>
            Electoral
          </Typography>
        </Box>
        <Typography variant="caption" sx={{ color: '#94A3B8', fontSize: '0.7rem' }}>
          Karen Daniela Garzon Gordillo
        </Typography>
      </Toolbar>
      <Divider sx={{ borderColor: '#1E293B' }} />
      <Box sx={{ px: 1, py: 2 }}>
        <Typography variant="caption" sx={{ color: '#475569', px: 1, fontWeight: 600, letterSpacing: 1, textTransform: 'uppercase', fontSize: '0.65rem' }}>
          Menú Principal
        </Typography>
      </Box>
      <List sx={{ px: 1 }}>
        {navItems.map((item, idx) => {
          if (item.divider) {
            return (
              <Box key={idx}>
                <Divider sx={{ borderColor: '#1E293B', my: 1 }} />
                <Typography variant="caption" sx={{ color: '#475569', px: 1, fontWeight: 600, letterSpacing: 1, textTransform: 'uppercase', fontSize: '0.65rem' }}>
                  Votación
                </Typography>
              </Box>
            );
          }
          const isActive = pathname === item.path;
          return (
            <ListItem key={item.path} disablePadding sx={{ mb: 0.5 }}>
              <ListItemButton
                onClick={() => navigate(item.path)}
                selected={isActive}
                sx={{
                  borderRadius: 2,
                  color: isActive ? '#38BDF8' : '#94A3B8',
                  backgroundColor: isActive ? 'rgba(56, 189, 248, 0.1)' : 'transparent',
                  '&:hover': { backgroundColor: 'rgba(255,255,255,0.05)', color: '#FFFFFF' },
                  '&.Mui-selected': {
                    backgroundColor: 'rgba(56, 189, 248, 0.12)',
                    '&:hover': { backgroundColor: 'rgba(56, 189, 248, 0.18)' },
                  },
                }}
              >
                <ListItemIcon sx={{ color: 'inherit', minWidth: 36, '& svg': { fontSize: 20 } }}>
                  {item.icon}
                </ListItemIcon>
                <ListItemText
                  primary={item.label}
                  primaryTypographyProps={{ fontSize: '0.875rem', fontWeight: isActive ? 600 : 400 }}
                />
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>
      <Box sx={{ mt: 'auto', p: 2 }}>
        <Chip
          label="v1.0.0"
          size="small"
          sx={{ backgroundColor: '#1E293B', color: '#475569', fontSize: '0.7rem' }}
        />
      </Box>
    </Drawer>
  );
};

export { DRAWER_WIDTH };
export default Sidebar;
