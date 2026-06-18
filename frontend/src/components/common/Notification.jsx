import { Snackbar, Alert } from '@mui/material';

const Notification = ({ open, message, severity, onClose }) => (
  <Snackbar
    open={open}
    autoHideDuration={4000}
    onClose={onClose}
    anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
  >
    <Alert onClose={onClose} severity={severity} variant="filled" sx={{ width: '100%', fontWeight: 500 }}>
      {message}
    </Alert>
  </Snackbar>
);

export default Notification;