import { useState, useEffect } from 'react';
import {
  Box, Button, Card, CardContent, Typography, MenuItem,
  TextField, Grid, Chip, Alert, CircularProgress, Divider, Paper
} from '@mui/material';
import HowToVoteIcon from '@mui/icons-material/HowToVote';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { votoService, candidatoService, partidoService } from '../services/api';
import PageHeader from '../components/common/PageHeader';
import Notification from '../components/common/Notification';
import useNotification from '../hooks/useNotification';

const RegistrarVoto = () => {
  const [partidos, setPartidos] = useState([]);
  const [candidatos, setCandidatos] = useState([]);
  const [candidatosFiltrados, setCandidatosFiltrados] = useState([]);
  const [form, setForm] = useState({ id_partido: '', id_candidato: '' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(true);
  const [votoRegistrado, setVotoRegistrado] = useState(null);
  const { notification, showNotification, closeNotification } = useNotification();

  useEffect(() => {
    Promise.all([partidoService.getAll(), candidatoService.getAll()])
      .then(([pRes, cRes]) => {
        setPartidos(pRes.data.data);
        setCandidatos(cRes.data.data);
      })
      .catch(() => showNotification('Error al cargar datos', 'error'))
      .finally(() => setLoadingData(false));
  }, []);

  const handlePartidoChange = (e) => {
    const id = e.target.value;
    setForm({ id_partido: id, id_candidato: '' });
    setCandidatosFiltrados(candidatos.filter((c) => c.id_partido === Number(id)));
    if (errors.id_partido) setErrors((p) => ({ ...p, id_partido: '' }));
  };

  const handleCandidatoChange = (e) => {
    setForm((p) => ({ ...p, id_candidato: e.target.value }));
    if (errors.id_candidato) setErrors((p) => ({ ...p, id_candidato: '' }));
  };

  const validate = () => {
    const e = {};
    if (!form.id_partido) e.id_partido = 'Debe seleccionar un partido';
    if (!form.id_candidato) e.id_candidato = 'Debe seleccionar un candidato';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    setLoading(true);
    try {
      const res = await votoService.create({
        id_candidato: Number(form.id_candidato),
        id_partido: Number(form.id_partido),
      });
      setVotoRegistrado(res.data.data);
      setForm({ id_partido: '', id_candidato: '' });
      setCandidatosFiltrados([]);
      showNotification('¡Voto registrado exitosamente!');
    } catch (err) {
      showNotification(err.userMessage || 'Error al registrar el voto', 'error');
    } finally {
      setLoading(false);
    }
  };

  const candidatoSeleccionado = candidatos.find((c) => c.id === Number(form.id_candidato));
  const partidoSeleccionado = partidos.find((p) => p.id === Number(form.id_partido));

  if (loadingData) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <PageHeader
        title="Registrar Voto"
        subtitle="Emite tu voto seleccionando el partido y candidato de tu preferencia"
        breadcrumbs={[{ label: 'Registrar Voto' }]}
      />

      <Grid container spacing={3} justifyContent="center">
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 3 }}>
                <Box sx={{ p: 1.5, borderRadius: 2, backgroundColor: 'rgba(56,189,248,0.12)' }}>
                  <HowToVoteIcon sx={{ color: '#38BDF8', fontSize: 28 }} />
                </Box>
                <Box>
                  <Typography variant="h6" fontWeight={600}>Papeleta Electoral</Typography>
                  <Typography variant="body2" color="text.secondary">Selecciona tu partido y candidato</Typography>
                </Box>
              </Box>

              <Alert severity="info" sx={{ mb: 3, borderRadius: 2 }}>
                Tu voto es secreto y se registra con la fecha y hora actual.
              </Alert>

              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
                <TextField
                  select fullWidth label="Partido Político"
                  value={form.id_partido} onChange={handlePartidoChange}
                  error={!!errors.id_partido} helperText={errors.id_partido}
                >
                  <MenuItem value="" disabled><em>Seleccionar partido</em></MenuItem>
                  {partidos.map((p) => (
                    <MenuItem key={p.id} value={p.id}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Chip label={p.sigla} size="small" color="secondary" sx={{ fontWeight: 700 }} />
                        {p.nombre}
                      </Box>
                    </MenuItem>
                  ))}
                </TextField>

                <TextField
                  select fullWidth label="Candidato"
                  value={form.id_candidato} onChange={handleCandidatoChange}
                  error={!!errors.id_candidato} helperText={errors.id_candidato || (form.id_partido && candidatosFiltrados.length === 0 ? 'No hay candidatos para este partido' : '')}
                  disabled={!form.id_partido}
                >
                  <MenuItem value="" disabled><em>Seleccionar candidato</em></MenuItem>
                  {candidatosFiltrados.map((c) => (
                    <MenuItem key={c.id} value={c.id}>
                      {c.nombre} {c.apellido} — {c.documento}
                    </MenuItem>
                  ))}
                </TextField>

                {candidatoSeleccionado && (
                  <Paper variant="outlined" sx={{ p: 2, borderRadius: 2, borderColor: '#38BDF8', backgroundColor: 'rgba(56,189,248,0.05)' }}>
                    <Typography variant="caption" color="text.secondary" fontWeight={600}>RESUMEN DE TU VOTO</Typography>
                    <Divider sx={{ my: 1 }} />
                    <Typography variant="body2"><strong>Partido:</strong> {partidoSeleccionado?.nombre} ({partidoSeleccionado?.sigla})</Typography>
                    <Typography variant="body2"><strong>Candidato:</strong> {candidatoSeleccionado.nombre} {candidatoSeleccionado.apellido}</Typography>
                    <Typography variant="body2"><strong>Documento:</strong> {candidatoSeleccionado.documento}</Typography>
                  </Paper>
                )}

                <Button
                  variant="contained" size="large" fullWidth
                  onClick={handleSubmit} disabled={loading}
                  startIcon={loading ? <CircularProgress size={18} color="inherit" /> : <HowToVoteIcon />}
                  sx={{ py: 1.5, mt: 1 }}
                >
                  {loading ? 'Registrando...' : 'Emitir Voto'}
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {votoRegistrado && (
          <Grid item xs={12} md={5}>
            <Card sx={{ border: '2px solid #10B981', backgroundColor: 'rgba(16,185,129,0.04)' }}>
              <CardContent sx={{ p: 3, textAlign: 'center' }}>
                <CheckCircleIcon sx={{ fontSize: 64, color: '#10B981', mb: 2 }} />
                <Typography variant="h5" fontWeight={700} color="success.main" gutterBottom>
                  ¡Voto Registrado!
                </Typography>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Tu voto ha sido emitido exitosamente.
                </Typography>
                <Divider sx={{ my: 2 }} />
                <Box sx={{ textAlign: 'left', display: 'flex', flexDirection: 'column', gap: 1 }}>
                  <Typography variant="body2"><strong>ID del Voto:</strong> #{votoRegistrado.id}</Typography>
                  <Typography variant="body2">
                    <strong>Fecha:</strong> {new Date(votoRegistrado.fecha_voto).toLocaleString('es-CO')}
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        )}
      </Grid>

      <Notification {...notification} onClose={closeNotification} />
    </Box>
  );
};

export default RegistrarVoto;