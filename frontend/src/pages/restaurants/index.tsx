import { useState } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  CardActions,
  Grid,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
} from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';

interface Restaurant {
  id: string;
  name: string;
  address: string;
  cuisine: string;
  rating: number;
}

const mockRestaurants: Restaurant[] = [
  {
    id: '1',
    name: 'The Gourmet Kitchen',
    address: '123 Main St, City',
    cuisine: 'International',
    rating: 4.5,
  },
  {
    id: '2',
    name: 'Sushi Master',
    address: '456 Oak Ave, Town',
    cuisine: 'Japanese',
    rating: 4.8,
  },
  {
    id: '3',
    name: 'Pasta Paradise',
    address: '789 Pine Rd, Village',
    cuisine: 'Italian',
    rating: 4.2,
  },
];

export default function Restaurants() {
  const [open, setOpen] = useState(false);
  const [restaurants, setRestaurants] = useState<Restaurant[]>(mockRestaurants);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleAddRestaurant = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const newRestaurant: Restaurant = {
      id: Date.now().toString(),
      name: formData.get('name') as string,
      address: formData.get('address') as string,
      cuisine: formData.get('cuisine') as string,
      rating: 0,
    };
    setRestaurants([...restaurants, newRestaurant]);
    handleClose();
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4" component="h1">
          Restaurants
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleClickOpen}
        >
          Add Restaurant
        </Button>
      </Box>

      <Grid container spacing={3}>
        {restaurants.map((restaurant) => (
          <Grid item xs={12} sm={6} md={4} key={restaurant.id}>
            <Card>
              <CardContent>
                <Typography variant="h6" component="div">
                  {restaurant.name}
                </Typography>
                <Typography color="text.secondary" gutterBottom>
                  {restaurant.cuisine}
                </Typography>
                <Typography variant="body2">{restaurant.address}</Typography>
                <Typography variant="body2" color="text.secondary">
                  Rating: {restaurant.rating}/5
                </Typography>
              </CardContent>
              <CardActions>
                <Button size="small">Edit</Button>
                <Button size="small" color="error">
                  Delete
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Dialog open={open} onClose={handleClose}>
        <form onSubmit={handleAddRestaurant}>
          <DialogTitle>Add New Restaurant</DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              name="name"
              label="Restaurant Name"
              type="text"
              fullWidth
              variant="outlined"
              required
            />
            <TextField
              margin="dense"
              name="address"
              label="Address"
              type="text"
              fullWidth
              variant="outlined"
              required
            />
            <TextField
              margin="dense"
              name="cuisine"
              label="Cuisine Type"
              type="text"
              fullWidth
              variant="outlined"
              required
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Cancel</Button>
            <Button type="submit" variant="contained">
              Add
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Box>
  );
} 