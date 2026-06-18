import { Box, Typography, Breadcrumbs, Link } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';

const PageHeader = ({ title, subtitle, breadcrumbs = [], action }) => (
  <Box sx={{ mb: 3 }}>
    {breadcrumbs.length > 0 && (
      <Breadcrumbs separator={<NavigateNextIcon fontSize="small" />} sx={{ mb: 1 }}>
        <Link component={RouterLink} to="/" color="inherit" underline="hover" sx={{ fontSize: '0.8rem' }}>
          Inicio
        </Link>
        {breadcrumbs.map((b, i) =>
          b.href ? (
            <Link key={i} component={RouterLink} to={b.href} color="inherit" underline="hover" sx={{ fontSize: '0.8rem' }}>
              {b.label}
            </Link>
          ) : (
            <Typography key={i} color="text.primary" sx={{ fontSize: '0.8rem' }}>
              {b.label}
            </Typography>
          )
        )}
      </Breadcrumbs>
    )}
    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
      <Box>
        <Typography variant="h4" fontWeight={700} color="primary.main">{title}</Typography>
        {subtitle && (
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
            {subtitle}
          </Typography>
        )}
      </Box>
      {action && <Box>{action}</Box>}
    </Box>
  </Box>
);

export default PageHeader;
