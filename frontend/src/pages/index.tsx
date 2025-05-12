import { Grid, Paper, Typography } from '@mui/material';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

const data = [
  { name: 'Mon', orders: 4 },
  { name: 'Tue', orders: 3 },
  { name: 'Wed', orders: 5 },
  { name: 'Thu', orders: 2 },
  { name: 'Fri', orders: 6 },
  { name: 'Sat', orders: 8 },
  { name: 'Sun', orders: 7 },
];

export default function Dashboard() {
  return (
    <Grid container spacing={3}>
      <Grid item xs={12} md={6} lg={3}>
        <Paper
          sx={{
            p: 2,
            display: 'flex',
            flexDirection: 'column',
            height: 140,
          }}
        >
          <Typography component="h2" variant="h6" color="primary" gutterBottom>
            Total Restaurants
          </Typography>
          <Typography component="p" variant="h4">
            12
          </Typography>
        </Paper>
      </Grid>
      <Grid item xs={12} md={6} lg={3}>
        <Paper
          sx={{
            p: 2,
            display: 'flex',
            flexDirection: 'column',
            height: 140,
          }}
        >
          <Typography component="h2" variant="h6" color="primary" gutterBottom>
            Active Orders
          </Typography>
          <Typography component="p" variant="h4">
            8
          </Typography>
        </Paper>
      </Grid>
      <Grid item xs={12} md={6} lg={3}>
        <Paper
          sx={{
            p: 2,
            display: 'flex',
            flexDirection: 'column',
            height: 140,
          }}
        >
          <Typography component="h2" variant="h6" color="primary" gutterBottom>
            Menu Items
          </Typography>
          <Typography component="p" variant="h4">
            156
          </Typography>
        </Paper>
      </Grid>
      <Grid item xs={12} md={6} lg={3}>
        <Paper
          sx={{
            p: 2,
            display: 'flex',
            flexDirection: 'column',
            height: 140,
          }}
        >
          <Typography component="h2" variant="h6" color="primary" gutterBottom>
            Total Revenue
          </Typography>
          <Typography component="p" variant="h4">
            $2,450
          </Typography>
        </Paper>
      </Grid>
      <Grid item xs={12}>
        <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column' }}>
          <Typography component="h2" variant="h6" color="primary" gutterBottom>
            Orders This Week
          </Typography>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="orders" fill="#1976d2" />
            </BarChart>
          </ResponsiveContainer>
        </Paper>
      </Grid>
    </Grid>
  );
} 