import { Box, AppBar, Toolbar, Typography, IconButton, Avatar } from '@mui/material';
import { Outlet } from 'react-router-dom';
import HowToVoteIcon from '@mui/icons-material/HowToVote';
import Sidebar, { DRAWER_WIDTH } from './Sidebar';

const Layout = () => (
  <Box sx={{ display: 'flex', minHeight: '100vh' }}>
    <Sidebar />
    <Box
      component="main"
      sx={{
        flexGrow: 1,
        ml: `${DRAWER_WIDTH}px`,
        backgroundColor: '#F8FAFC',
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <AppBar position="static" elevation={0} sx={{ backgroundColor: '#FFFFFF', borderBottom: '1px solid #E2E8F0' }}>
        <Toolbar>
          <Box sx={{ flexGrow: 1 }}>
            <Typography variant="subtitle2" color="text.secondary" fontWeight={400}>
              Sistema de Gestión Electoral
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography variant="body2" color="text.secondary">OATI - UD</Typography>
            <Avatar sx={{ width: 32, height: 32, bgcolor: '#38BDF8', color: '#0F172A', fontSize: 14, fontWeight: 700 }}>
              UD
            </Avatar>
          </Box>
        </Toolbar>
      </AppBar>
      <Box sx={{ flexGrow: 1, p: 3 }}>
        <Outlet />
      </Box>
    </Box>
  </Box>
);

export default Layout;
