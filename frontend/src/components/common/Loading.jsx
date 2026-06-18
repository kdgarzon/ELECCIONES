import { Box, CircularProgress, Typography } from '@mui/material';

const Loading = ({ message = 'Cargando...' }) => (
  <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', py: 8, gap: 2 }}>
    <CircularProgress color="secondary" size={48} />
    <Typography color="text.secondary" variant="body2">{message}</Typography>
  </Box>
);

export default Loading;