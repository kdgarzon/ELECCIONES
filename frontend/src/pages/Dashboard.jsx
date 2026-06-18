import { useState, useEffect } from 'react';
import { Grid, Card, CardContent, Typography, Box, Chip, CircularProgress } from '@mui/material';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import PeopleIcon from '@mui/icons-material/People';
import HowToVoteIcon from '@mui/icons-material/HowToVote';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import { dashboardService } from '../services/api';
import PageHeader from '../components/common/PageHeader';

const StatCard = ({ title, value, icon, color, subtitle }) => (
  <Card sx={{ height: '100%', position: 'relative', overflow: 'hidden' }}>
    <CardContent sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
        <Box>
          <Typography variant="body2" color="text.secondary" fontWeight={500} sx={{ mb: 1 }}>
            {title}
          </Typography>
          <Typography variant="h3" fontWeight={700} color="primary.main" sx={{ mb: 0.5 }}>
            {value ?? <CircularProgress size={24} />}
          </Typography>
          {subtitle && (
            <Chip label={subtitle} size="small" sx={{ backgroundColor: `${color}18`, color: color, fontWeight: 600, fontSize: '0.7rem' }} />
          )}
        </Box>
        <Box sx={{ p: 1.5, borderRadius: 2, backgroundColor: `${color}15` }}>
          <Box sx={{ color, '& svg': { fontSize: 28 } }}>{icon}</Box>
        </Box>
      </Box>
      <Box
        sx={{
          position: 'absolute', bottom: 0, right: 0, width: 80, height: 80,
          borderRadius: '50%', backgroundColor: `${color}08`, transform: 'translate(20px, 20px)',
        }}
      />
    </CardContent>
  </Card>
);

const Dashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    dashboardService.getResumen()
      .then((res) => setData(res.data.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <Box>
      <PageHeader
        title="Dashboard"
        subtitle="Resumen general del sistema electoral"
        breadcrumbs={[{ label: 'Dashboard' }]}
      />

      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={4}>
          <StatCard
            title="Total Partidos"
            value={loading ? null : data?.totalPartidos ?? 0}
            icon={<AccountBalanceIcon />}
            color="#0F172A"
            subtitle="Partidos registrados"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <StatCard
            title="Total Candidatos"
            value={loading ? null : data?.totalCandidatos ?? 0}
            icon={<PeopleIcon />}
            color="#38BDF8"
            subtitle="Candidatos activos"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <StatCard
            title="Total Votos"
            value={loading ? null : data?.totalVotos ?? 0}
            icon={<HowToVoteIcon />}
            color="#10B981"
            subtitle="Votos emitidos"
          />
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                <TrendingUpIcon color="secondary" />
                <Typography variant="h6" fontWeight={600}>Acerca del Sistema</Typography>
              </Box>
              <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.8 }}>
                El <strong>Sistema de Gestión Electoral</strong> de la OATI - Universidad Distrital
                permite administrar de manera integral el proceso electoral: registro de partidos
                políticos, gestión de candidatos y emisión de votos de forma segura y transparente.
              </Typography>
              <Box sx={{ mt: 2, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                {['Node.js', 'React', 'PostgreSQL', 'Express', 'Material UI'].map((tech) => (
                  <Chip key={tech} label={tech} size="small" variant="outlined" color="primary" />
                ))}
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card sx={{ backgroundColor: '#0F172A', color: '#FFFFFF', height: '100%' }}>
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                <HowToVoteIcon sx={{ color: '#38BDF8' }} />
                <Typography variant="h6" fontWeight={600} color="#FFFFFF">
                  Accesos Rápidos
                </Typography>
              </Box>
              {[
                { label: 'Nuevo Partido', path: '/partidos' },
                { label: 'Nuevo Candidato', path: '/candidatos' },
                { label: 'Registrar Voto', path: '/votos/registrar' },
                { label: 'Ver Estadísticas', path: '/estadisticas' },
              ].map((item) => (
                <Box
                  key={item.label}
                  component="a"
                  href={item.path}
                  sx={{
                    display: 'block', py: 0.75, color: '#94A3B8',
                    textDecoration: 'none', fontSize: '0.875rem',
                    borderBottom: '1px solid #1E293B',
                    '&:hover': { color: '#38BDF8' },
                    '&:last-child': { borderBottom: 'none' },
                  }}
                >
                  → {item.label}
                </Box>
              ))}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;
