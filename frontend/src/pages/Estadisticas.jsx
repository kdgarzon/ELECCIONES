import { useState, useEffect, useCallback } from 'react';
import {
  Box, Card, CardContent, Typography, Grid, Chip, CircularProgress, Divider
} from '@mui/material';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RTooltip,
  ResponsiveContainer, PieChart, Pie, Cell, Legend
} from 'recharts';
import BarChartIcon from '@mui/icons-material/BarChart';
import PieChartIcon from '@mui/icons-material/PieChart';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import { votoService } from '../services/api';
import PageHeader from '../components/common/PageHeader';

const COLORS = ['#0F172A', '#38BDF8', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899'];

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <Box sx={{ bgcolor: '#0F172A', color: '#fff', p: 1.5, borderRadius: 1.5, fontSize: 13 }}>
      <Typography variant="caption" sx={{ color: '#94A3B8' }}>{label}</Typography>
      <Typography variant="body2" fontWeight={600}>{payload[0]?.value} votos</Typography>
    </Box>
  );
};

const Estadisticas = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchEstadisticas = useCallback(async () => {
    setLoading(true);
    try {
      const res = await votoService.getEstadisticas();
      setData(res.data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchEstadisticas(); }, [fetchEstadisticas]);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 10 }}>
        <CircularProgress size={48} color="secondary" />
      </Box>
    );
  }

  const dataCandidatos = (data?.por_candidato ?? []).map((item) => ({
    name: `${item.candidato?.nombre} ${item.candidato?.apellido}`,
    votos: Number(item.dataValues?.total_votos ?? item.total_votos ?? 0),
    partido: item.candidato?.partido?.sigla,
  }));

  const dataPartidos = (data?.por_partido ?? []).map((item) => ({
    name: item.partido?.nombre ?? 'Desconocido',
    sigla: item.partido?.sigla,
    votos: Number(item.dataValues?.total_votos ?? item.total_votos ?? 0),
  }));

  const ganadorCandidato = dataCandidatos[0];
  const ganadorPartido = dataPartidos[0];

  return (
    <Box>
      <PageHeader
        title="Estadísticas Electorales"
        subtitle={`Total de votos emitidos: ${data?.total_votos ?? 0}`}
        breadcrumbs={[{ label: 'Estadísticas' }]}
      />

      {/* Cards de líderes */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} md={6}>
          <Card sx={{ background: 'linear-gradient(135deg, #0F172A 0%, #1E293B 100%)', color: '#fff' }}>
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                <EmojiEventsIcon sx={{ color: '#F59E0B' }} />
                <Typography variant="subtitle2" sx={{ color: '#94A3B8' }}>Candidato Líder</Typography>
              </Box>
              {ganadorCandidato ? (
                <>
                  <Typography variant="h5" fontWeight={700}>{ganadorCandidato.name}</Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}>
                    <Chip label={ganadorCandidato.partido} size="small" sx={{ bgcolor: '#38BDF8', color: '#0F172A', fontWeight: 700 }} />
                    <Typography variant="h6" sx={{ color: '#38BDF8' }}>{ganadorCandidato.votos} votos</Typography>
                  </Box>
                </>
              ) : (
                <Typography color="#94A3B8">Sin datos aún</Typography>
              )}
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card sx={{ background: 'linear-gradient(135deg, #0EA5E9 0%, #38BDF8 100%)', color: '#0F172A' }}>
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                <EmojiEventsIcon sx={{ color: '#0F172A' }} />
                <Typography variant="subtitle2" sx={{ color: '#0F172A', opacity: 0.7 }}>Partido Líder</Typography>
              </Box>
              {ganadorPartido ? (
                <>
                  <Typography variant="h5" fontWeight={700}>{ganadorPartido.name}</Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}>
                    <Chip label={ganadorPartido.sigla} size="small" sx={{ bgcolor: '#0F172A', color: '#fff', fontWeight: 700 }} />
                    <Typography variant="h6">{ganadorPartido.votos} votos</Typography>
                  </Box>
                </>
              ) : (
                <Typography>Sin datos aún</Typography>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Gráficas */}
      <Grid container spacing={3}>
        <Grid item xs={12} lg={7}>
          <Card>
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
                <BarChartIcon color="secondary" />
                <Typography variant="h6" fontWeight={600}>Votos por Candidato</Typography>
              </Box>
              {dataCandidatos.length === 0 ? (
                <Box sx={{ textAlign: 'center', py: 6, color: 'text.secondary' }}>
                  <Typography>No hay votos registrados aún</Typography>
                </Box>
              ) : (
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={dataCandidatos} margin={{ top: 5, right: 20, left: 0, bottom: 60 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                    <XAxis dataKey="name" tick={{ fontSize: 11 }} angle={-35} textAnchor="end" interval={0} />
                    <YAxis tick={{ fontSize: 12 }} allowDecimals={false} />
                    <RTooltip content={<CustomTooltip />} />
                    <Bar dataKey="votos" fill="#38BDF8" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} lg={5}>
          <Card>
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
                <PieChartIcon color="primary" />
                <Typography variant="h6" fontWeight={600}>Distribución por Partido</Typography>
              </Box>
              {dataPartidos.length === 0 ? (
                <Box sx={{ textAlign: 'center', py: 6, color: 'text.secondary' }}>
                  <Typography>No hay votos registrados aún</Typography>
                </Box>
              ) : (
                <>
                  <ResponsiveContainer width="100%" height={240}>
                    <PieChart>
                      <Pie
                        data={dataPartidos} dataKey="votos" nameKey="name"
                        cx="50%" cy="50%" outerRadius={90} paddingAngle={3}
                      >
                        {dataPartidos.map((_, i) => (
                          <Cell key={i} fill={COLORS[i % COLORS.length]} />
                        ))}
                      </Pie>
                      <RTooltip formatter={(v, n) => [`${v} votos`, n]} />
                    </PieChart>
                  </ResponsiveContainer>
                  <Divider sx={{ my: 2 }} />
                  {dataPartidos.map((p, i) => (
                    <Box key={p.name} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', py: 0.5 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Box sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: COLORS[i % COLORS.length] }} />
                        <Typography variant="body2">{p.name}</Typography>
                        <Chip label={p.sigla} size="small" sx={{ fontSize: '0.65rem', height: 18 }} />
                      </Box>
                      <Typography variant="body2" fontWeight={600}>{p.votos}</Typography>
                    </Box>
                  ))}
                </>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Tabla ranking candidatos */}
        <Grid item xs={12}>
          <Card>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" fontWeight={600} sx={{ mb: 2 }}>Ranking Completo de Candidatos</Typography>
              {dataCandidatos.length === 0 ? (
                <Typography color="text.secondary">No hay votos registrados</Typography>
              ) : (
                dataCandidatos.map((c, i) => (
                  <Box key={c.name} sx={{ display: 'flex', alignItems: 'center', gap: 2, py: 1.5, borderBottom: i < dataCandidatos.length - 1 ? '1px solid #F1F5F9' : 'none' }}>
                    <Typography variant="h5" fontWeight={700} sx={{ color: i === 0 ? '#F59E0B' : '#CBD5E1', minWidth: 32 }}>
                      {i + 1}
                    </Typography>
                    <Box sx={{ flexGrow: 1 }}>
                      <Typography variant="body1" fontWeight={600}>{c.name}</Typography>
                      <Chip label={c.partido} size="small" color="secondary" sx={{ fontWeight: 700 }} />
                    </Box>
                    <Box sx={{ textAlign: 'right' }}>
                      <Typography variant="h6" fontWeight={700} color="primary">{c.votos}</Typography>
                      <Typography variant="caption" color="text.secondary">votos</Typography>
                    </Box>
                    <Box sx={{ width: 120 }}>
                      <Box sx={{ height: 6, bgcolor: '#F1F5F9', borderRadius: 3, overflow: 'hidden' }}>
                        <Box sx={{
                          height: '100%', borderRadius: 3, bgcolor: COLORS[i % COLORS.length],
                          width: `${dataCandidatos[0]?.votos ? (c.votos / dataCandidatos[0].votos) * 100 : 0}%`,
                          transition: 'width 0.6s ease',
                        }} />
                      </Box>
                    </Box>
                  </Box>
                ))
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Estadisticas;