import { useState, useEffect, useCallback } from 'react';
import {
  Box, Card, CardContent, Typography, Chip, IconButton, Tooltip, TextField, InputAdornment
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import SearchIcon from '@mui/icons-material/Search';
import RefreshIcon from '@mui/icons-material/Refresh';
import { votoService } from '../services/api';
import PageHeader from '../components/common/PageHeader';
import Notification from '../components/common/Notification';
import useNotification from '../hooks/useNotification';

const ConsultaVotos = () => {
  const [rows, setRows] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const { notification, showNotification, closeNotification } = useNotification();

  const fetchVotos = useCallback(async () => {
    setLoading(true);
    try {
      const res = await votoService.getAll();
      setRows(res.data.data);
      setFiltered(res.data.data);
    } catch {
      showNotification('Error al cargar los votos', 'error');
    } finally {
      setLoading(false);
    }
  }, [showNotification]);

  useEffect(() => { fetchVotos(); }, [fetchVotos]);

  useEffect(() => {
    const q = search.toLowerCase();
    setFiltered(
      rows.filter((v) =>
        `${v.candidato?.nombre} ${v.candidato?.apellido}`.toLowerCase().includes(q) ||
        v.candidato?.documento?.toLowerCase().includes(q) ||
        v.partido?.nombre?.toLowerCase().includes(q) ||
        v.partido?.sigla?.toLowerCase().includes(q)
      )
    );
  }, [search, rows]);

  const columns = [
    { field: 'id', headerName: 'ID Voto', width: 90 },
    {
      field: 'candidato', headerName: 'Candidato', flex: 1, minWidth: 180,
      valueGetter: (_, row) => `${row.candidato?.nombre ?? ''} ${row.candidato?.apellido ?? ''}`,
      renderCell: ({ row }) => (
        <Box>
          <Typography variant="body2" fontWeight={600}>
            {row.candidato?.nombre} {row.candidato?.apellido}
          </Typography>
          <Typography variant="caption" color="text.secondary">{row.candidato?.documento}</Typography>
        </Box>
      ),
    },
    {
      field: 'partido', headerName: 'Partido', width: 200,
      renderCell: ({ row }) => row.partido ? (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Chip label={row.partido.sigla} size="small" color="secondary" sx={{ fontWeight: 700 }} />
          <Typography variant="body2">{row.partido.nombre}</Typography>
        </Box>
      ) : '-',
    },
    {
      field: 'fecha_voto', headerName: 'Fecha y Hora', width: 180,
      renderCell: ({ value }) => (
        <Typography variant="body2">{new Date(value).toLocaleString('es-CO')}</Typography>
      ),
    },
  ];

  return (
    <Box>
      <PageHeader
        title="Consulta de Votos"
        subtitle={`${rows.length} votos registrados en el sistema`}
        breadcrumbs={[{ label: 'Votos' }]}
        action={
          <Tooltip title="Actualizar">
            <IconButton onClick={fetchVotos} color="primary" sx={{ border: '1px solid #E2E8F0' }}>
              <RefreshIcon />
            </IconButton>
          </Tooltip>
        }
      />

      <Card>
        <CardContent>
          <TextField
            placeholder="Buscar por candidato, documento o partido..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            size="small"
            sx={{ mb: 2, width: 360 }}
            InputProps={{
              startAdornment: <InputAdornment position="start"><SearchIcon fontSize="small" /></InputAdornment>,
            }}
          />
          <DataGrid
            rows={filtered}
            columns={columns}
            loading={loading}
            autoHeight
            pageSizeOptions={[10, 25, 50]}
            initialState={{ pagination: { paginationModel: { pageSize: 10 } } }}
            disableRowSelectionOnClick
            sx={{ border: 'none' }}
            localeText={{ noRowsLabel: 'No hay votos registrados' }}
          />
        </CardContent>
      </Card>

      <Notification {...notification} onClose={closeNotification} />
    </Box>
  );
};

export default ConsultaVotos;