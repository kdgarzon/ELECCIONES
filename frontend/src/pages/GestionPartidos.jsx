import { useState, useEffect, useCallback } from 'react';
import {
  Box, Button, Card, CardContent, Dialog, DialogTitle, DialogContent,
  DialogActions, TextField, Typography, Chip, Tooltip, IconButton
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import { partidoService } from '../services/api';
import PageHeader from '../components/common/PageHeader';
import ConfirmDialog from '../components/common/ConfirmDialog';
import Notification from '../components/common/Notification';
import useNotification from '../hooks/useNotification';

const EMPTY_FORM = { nombre: '', sigla: '', descripcion: '' };

const PartidoFormDialog = ({ open, partido, onClose, onSave }) => {
  const [form, setForm] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (open) {
      setForm(partido ? { nombre: partido.nombre, sigla: partido.sigla, descripcion: partido.descripcion } : EMPTY_FORM);
      setErrors({});
    }
  }, [open, partido]);

  const validate = () => {
    const e = {};
    if (!form.nombre.trim()) e.nombre = 'El nombre es obligatorio';
    else if (form.nombre.trim().length < 2) e.nombre = 'Mínimo 2 caracteres';
    if (!form.sigla.trim()) e.sigla = 'La sigla es obligatoria';
    if (!form.descripcion.trim()) e.descripcion = 'La descripción es obligatoria';
    else if (form.descripcion.trim().length < 10) e.descripcion = 'Mínimo 10 caracteres';
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
      await onSave(form);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: 2 } }}>
      <DialogTitle sx={{ pb: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
        <AccountBalanceIcon color="primary" />
        <Typography variant="h6" fontWeight={600}>{partido ? 'Editar Partido' : 'Nuevo Partido'}</Typography>
      </DialogTitle>
      <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 2 }}>
        <TextField
          label="Nombre del Partido"
          name="nombre"
          value={form.nombre}
          onChange={handleChange}
          error={!!errors.nombre}
          helperText={errors.nombre}
          fullWidth
          autoFocus
          inputProps={{ maxLength: 100 }}
        />
        <TextField
          label="Sigla"
          name="sigla"
          value={form.sigla}
          onChange={handleChange}
          error={!!errors.sigla}
          helperText={errors.sigla}
          fullWidth
          inputProps={{ maxLength: 20 }}
        />
        <TextField
          label="Descripción"
          name="descripcion"
          value={form.descripcion}
          onChange={handleChange}
          error={!!errors.descripcion}
          helperText={errors.descripcion}
          fullWidth
          multiline
          rows={3}
        />
      </DialogContent>
      <DialogActions sx={{ p: 2.5, pt: 1 }}>
        <Button onClick={onClose} variant="outlined" disabled={saving}>Cancelar</Button>
        <Button onClick={handleSubmit} variant="contained" disabled={saving}>
          {saving ? 'Guardando...' : partido ? 'Actualizar' : 'Crear Partido'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

const GestionPartidos = () => {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selected, setSelected] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const { notification, showNotification, closeNotification } = useNotification();

  const fetchPartidos = useCallback(async () => {
    setLoading(true);
    try {
      const res = await partidoService.getAll();
      setRows(res.data.data);
    } catch {
      showNotification('Error al cargar los partidos', 'error');
    } finally {
      setLoading(false);
    }
  }, [showNotification]);

  useEffect(() => { fetchPartidos(); }, [fetchPartidos]);

  const handleOpenCreate = () => { setSelected(null); setDialogOpen(true); };
  const handleOpenEdit = (row) => { setSelected(row); setDialogOpen(true); };
  const handleClose = () => { setDialogOpen(false); setSelected(null); };

  const handleSave = async (form) => {
    try {
      if (selected) {
        await partidoService.update(selected.id, form);
        showNotification('Partido actualizado exitosamente');
      } else {
        await partidoService.create(form);
        showNotification('Partido creado exitosamente');
      }
      handleClose();
      fetchPartidos();
    } catch (err) {
      showNotification(err.userMessage || 'Error al guardar', 'error');
      throw err;
    }
  };

  const handleDelete = async () => {
    try {
      await partidoService.delete(deleteId);
      showNotification('Partido eliminado exitosamente');
      setDeleteId(null);
      fetchPartidos();
    } catch (err) {
      showNotification(err.userMessage || 'No se pudo eliminar el partido', 'error');
      setDeleteId(null);
    }
  };

  const columns = [
    { field: 'id', headerName: 'ID', width: 70 },
    { field: 'nombre', headerName: 'Nombre', flex: 1, minWidth: 180 },
    {
      field: 'sigla', headerName: 'Sigla', width: 100,
      renderCell: ({ value }) => <Chip label={value} size="small" color="secondary" sx={{ fontWeight: 700 }} />,
    },
    { field: 'descripcion', headerName: 'Descripción', flex: 2, minWidth: 200 },
    {
      field: 'candidatos', headerName: 'Candidatos', width: 110,
      renderCell: ({ value }) => (
        <Chip label={value?.length ?? 0} size="small" variant="outlined" color="primary" />
      ),
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
        title="Gestión de Partidos"
        subtitle="Administra los partidos políticos del sistema"
        breadcrumbs={[{ label: 'Partidos' }]}
        action={
          <Button variant="contained" startIcon={<AddIcon />} onClick={handleOpenCreate}>
            Nuevo Partido
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
            localeText={{
              noRowsLabel: 'No hay partidos registrados',
              MuiTablePagination: { labelRowsPerPage: 'Filas por página' },
            }}
          />
        </CardContent>
      </Card>

      <PartidoFormDialog open={dialogOpen} partido={selected} onClose={handleClose} onSave={handleSave} />

      <ConfirmDialog
        open={!!deleteId}
        title="Eliminar Partido"
        message="¿Estás seguro de que deseas eliminar este partido? Esta acción no se puede deshacer."
        onConfirm={handleDelete}
        onCancel={() => setDeleteId(null)}
      />

      <Notification {...notification} onClose={closeNotification} />
    </Box>
  );
};

export default GestionPartidos;