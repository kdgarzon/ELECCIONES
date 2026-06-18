import { useState, useEffect, useCallback } from 'react';
import {
  Box, Button, Card, CardContent, Dialog, DialogTitle, DialogContent,
  DialogActions, TextField, Typography, MenuItem, Chip, Tooltip, IconButton, Avatar
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import PeopleIcon from '@mui/icons-material/People';
import { candidatoService, partidoService } from '../services/api';
import PageHeader from '../components/common/PageHeader';
import ConfirmDialog from '../components/common/ConfirmDialog';
import Notification from '../components/common/Notification';
import useNotification from '../hooks/useNotification';

const EMPTY_FORM = { nombre: '', apellido: '', documento: '', correo: '', id_partido: '' };

const CandidatoFormDialog = ({ open, candidato, partidos, onClose, onSave }) => {
  const [form, setForm] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (open) {
      setForm(candidato
        ? { nombre: candidato.nombre, apellido: candidato.apellido, documento: candidato.documento, correo: candidato.correo, id_partido: candidato.id_partido }
        : EMPTY_FORM
      );
      setErrors({});
    }
  }, [open, candidato]);

  const validate = () => {
    const e = {};
    if (!form.nombre.trim()) e.nombre = 'El nombre es obligatorio';
    if (!form.apellido.trim()) e.apellido = 'El apellido es obligatorio';
    if (!form.documento.trim()) e.documento = 'El documento es obligatorio';
    else if (form.documento.trim().length < 5) e.documento = 'Mínimo 5 caracteres';
    if (!form.correo.trim()) e.correo = 'El correo es obligatorio';
    else if (!/\S+@\S+\.\S+/.test(form.correo)) e.correo = 'Formato de correo inválido';
    if (!form.id_partido) e.id_partido = 'El partido es obligatorio';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
    if (errors[name]) setErrors((p) => ({ ...p, [name]: '' }));
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    setSaving(true);
    try {
      await onSave({ ...form, id_partido: Number(form.id_partido) });
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: 2 } }}>
      <DialogTitle sx={{ pb: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
        <PeopleIcon color="secondary" />
        <Typography variant="h6" fontWeight={600}>{candidato ? 'Editar Candidato' : 'Nuevo Candidato'}</Typography>
      </DialogTitle>
      <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 2 }}>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <TextField label="Nombre" name="nombre" value={form.nombre} onChange={handleChange}
            error={!!errors.nombre} helperText={errors.nombre} fullWidth autoFocus />
          <TextField label="Apellido" name="apellido" value={form.apellido} onChange={handleChange}
            error={!!errors.apellido} helperText={errors.apellido} fullWidth />
        </Box>
        <TextField label="Número de Documento" name="documento" value={form.documento} onChange={handleChange}
          error={!!errors.documento} helperText={errors.documento} fullWidth inputProps={{ maxLength: 20 }} />
        <TextField label="Correo Electrónico" name="correo" type="email" value={form.correo} onChange={handleChange}
          error={!!errors.correo} helperText={errors.correo} fullWidth />
        <TextField
          select label="Partido Político" name="id_partido" value={form.id_partido} onChange={handleChange}
          error={!!errors.id_partido} helperText={errors.id_partido} fullWidth
        >
          <MenuItem value="" disabled><em>Seleccionar partido</em></MenuItem>
          {partidos.map((p) => (
            <MenuItem key={p.id} value={p.id}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Chip label={p.sigla} size="small" color="secondary" sx={{ fontWeight: 700, minWidth: 40 }} />
                {p.nombre}
              </Box>
            </MenuItem>
          ))}
        </TextField>
      </DialogContent>
      <DialogActions sx={{ p: 2.5, pt: 1 }}>
        <Button onClick={onClose} variant="outlined" disabled={saving}>Cancelar</Button>
        <Button onClick={handleSubmit} variant="contained" color="secondary" disabled={saving}>
          {saving ? 'Guardando...' : candidato ? 'Actualizar' : 'Crear Candidato'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

const GestionCandidatos = () => {
  const [rows, setRows] = useState([]);
  const [partidos, setPartidos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selected, setSelected] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const { notification, showNotification, closeNotification } = useNotification();

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [canRes, parRes] = await Promise.all([candidatoService.getAll(), partidoService.getAll()]);
      setRows(canRes.data.data);
      setPartidos(parRes.data.data);
    } catch {
      showNotification('Error al cargar los datos', 'error');
    } finally {
      setLoading(false);
    }
  }, [showNotification]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const handleOpenCreate = () => { setSelected(null); setDialogOpen(true); };
  const handleOpenEdit = (row) => { setSelected(row); setDialogOpen(true); };
  const handleClose = () => { setDialogOpen(false); setSelected(null); };

  const handleSave = async (form) => {
    try {
      if (selected) {
        await candidatoService.update(selected.id, form);
        showNotification('Candidato actualizado exitosamente');
      } else {
        await candidatoService.create(form);
        showNotification('Candidato creado exitosamente');
      }
      handleClose();
      fetchData();
    } catch (err) {
      showNotification(err.userMessage || 'Error al guardar', 'error');
      throw err;
    }
  };

  const handleDelete = async () => {
    try {
      await candidatoService.delete(deleteId);
      showNotification('Candidato eliminado exitosamente');
      setDeleteId(null);
      fetchData();
    } catch (err) {
      showNotification(err.userMessage || 'No se pudo eliminar el candidato', 'error');
      setDeleteId(null);
    }
  };

  const columns = [
    { field: 'id', headerName: 'ID', width: 65 },
    {
      field: 'nombreCompleto', headerName: 'Candidato', flex: 1, minWidth: 180,
      valueGetter: (_, row) => `${row.nombre} ${row.apellido}`,
      renderCell: ({ row }) => (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Avatar sx={{ width: 30, height: 30, bgcolor: '#38BDF8', color: '#0F172A', fontSize: 12, fontWeight: 700 }}>
            {row.nombre[0]}{row.apellido[0]}
          </Avatar>
          <Box>
            <Typography variant="body2" fontWeight={600}>{row.nombre} {row.apellido}</Typography>
            <Typography variant="caption" color="text.secondary">{row.correo}</Typography>
          </Box>
        </Box>
      ),
    },
    { field: 'documento', headerName: 'Documento', width: 130 },
    {
      field: 'partido', headerName: 'Partido', width: 160,
      renderCell: ({ row }) => row.partido
        ? <Chip label={`${row.partido.sigla} · ${row.partido.nombre}`} size="small" variant="outlined" color="primary" />
        : '-',
    },
    {
      field: 'acciones', headerName: 'Acciones', width: 120, sortable: false,
      renderCell: ({ row }) => (
        <Box>
          <Tooltip title="Editar">
            <IconButton size="small" onClick={() => handleOpenEdit(row)} color="primary">
              <EditIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Eliminar">
            <IconButton size="small" onClick={() => setDeleteId(row.id)} color="error">
              <DeleteIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>
      ),
    },
  ];

  return (
    <Box>
      <PageHeader
        title="Gestión de Candidatos"
        subtitle="Administra los candidatos inscritos por partido"
        breadcrumbs={[{ label: 'Candidatos' }]}
        action={
          <Button variant="contained" color="secondary" startIcon={<AddIcon />} onClick={handleOpenCreate}>
            Nuevo Candidato
          </Button>
        }
      />

      <Card>
        <CardContent sx={{ p: 0 }}>
          <DataGrid
            rows={rows}
            columns={columns}
            loading={loading}
            autoHeight
            pageSizeOptions={[10, 25, 50]}
            initialState={{ pagination: { paginationModel: { pageSize: 10 } } }}
            disableRowSelectionOnClick
            sx={{ border: 'none', minHeight: 400 }}
            localeText={{ noRowsLabel: 'No hay candidatos registrados' }}
          />
        </CardContent>
      </Card>

      <CandidatoFormDialog open={dialogOpen} candidato={selected} partidos={partidos} onClose={handleClose} onSave={handleSave} />
      <ConfirmDialog open={!!deleteId} title="Eliminar Candidato"
        message="¿Estás seguro de que deseas eliminar este candidato?"
        onConfirm={handleDelete} onCancel={() => setDeleteId(null)} />
      <Notification {...notification} onClose={closeNotification} />
    </Box>
  );
};

export default GestionCandidatos;