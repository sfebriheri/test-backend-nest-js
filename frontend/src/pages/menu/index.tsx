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
  Tabs,
  Tab,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material';

interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
}

interface Category {
  id: string;
  name: string;
}

const mockCategories: Category[] = [
  { id: '1', name: 'Appetizers' },
  { id: '2', name: 'Main Courses' },
  { id: '3', name: 'Desserts' },
  { id: '4', name: 'Beverages' },
];

const mockMenuItems: MenuItem[] = [
  {
    id: '1',
    name: 'Spring Rolls',
    description: 'Fresh vegetables wrapped in rice paper',
    price: 6.99,
    category: '1',
  },
  {
    id: '2',
    name: 'Pad Thai',
    description: 'Stir-fried rice noodles with tofu and peanuts',
    price: 12.99,
    category: '2',
  },
  {
    id: '3',
    name: 'Mango Sticky Rice',
    description: 'Sweet sticky rice with fresh mango',
    price: 7.99,
    category: '3',
  },
];

export default function MenuManagement() {
  const [selectedCategory, setSelectedCategory] = useState('1');
  const [openItemDialog, setOpenItemDialog] = useState(false);
  const [openCategoryDialog, setOpenCategoryDialog] = useState(false);
  const [categories, setCategories] = useState<Category[]>(mockCategories);
  const [menuItems, setMenuItems] = useState<MenuItem[]>(mockMenuItems);

  const handleCategoryChange = (event: React.SyntheticEvent, newValue: string) => {
    setSelectedCategory(newValue);
  };

  const handleAddItem = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const newItem: MenuItem = {
      id: Date.now().toString(),
      name: formData.get('name') as string,
      description: formData.get('description') as string,
      price: parseFloat(formData.get('price') as string),
      category: selectedCategory,
    };
    setMenuItems([...menuItems, newItem]);
    setOpenItemDialog(false);
  };

  const handleAddCategory = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const newCategory: Category = {
      id: Date.now().toString(),
      name: formData.get('name') as string,
    };
    setCategories([...categories, newCategory]);
    setOpenCategoryDialog(false);
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4" component="h1">
          Menu Management
        </Typography>
        <Box>
          <Button
            variant="outlined"
            startIcon={<AddIcon />}
            onClick={() => setOpenCategoryDialog(true)}
            sx={{ mr: 1 }}
          >
            Add Category
          </Button>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setOpenItemDialog(true)}
          >
            Add Item
          </Button>
        </Box>
      </Box>

      <Card sx={{ mb: 3 }}>
        <Tabs
          value={selectedCategory}
          onChange={handleCategoryChange}
          variant="scrollable"
          scrollButtons="auto"
        >
          {categories.map((category) => (
            <Tab key={category.id} value={category.id} label={category.name} />
          ))}
        </Tabs>
      </Card>

      <Grid container spacing={3}>
        {menuItems
          .filter((item) => item.category === selectedCategory)
          .map((item) => (
            <Grid item xs={12} sm={6} md={4} key={item.id}>
              <Card>
                <CardContent>
                  <Typography variant="h6" component="div">
                    {item.name}
                  </Typography>
                  <Typography color="text.secondary" gutterBottom>
                    ${item.price.toFixed(2)}
                  </Typography>
                  <Typography variant="body2">{item.description}</Typography>
                </CardContent>
                <CardActions>
                  <IconButton size="small">
                    <EditIcon />
                  </IconButton>
                  <IconButton size="small" color="error">
                    <DeleteIcon />
                  </IconButton>
                </CardActions>
              </Card>
            </Grid>
          ))}
      </Grid>

      <Dialog open={openItemDialog} onClose={() => setOpenItemDialog(false)}>
        <form onSubmit={handleAddItem}>
          <DialogTitle>Add Menu Item</DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              name="name"
              label="Item Name"
              type="text"
              fullWidth
              variant="outlined"
              required
            />
            <TextField
              margin="dense"
              name="description"
              label="Description"
              type="text"
              fullWidth
              variant="outlined"
              required
            />
            <TextField
              margin="dense"
              name="price"
              label="Price"
              type="number"
              fullWidth
              variant="outlined"
              required
              inputProps={{ step: '0.01' }}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenItemDialog(false)}>Cancel</Button>
            <Button type="submit" variant="contained">
              Add
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      <Dialog
        open={openCategoryDialog}
        onClose={() => setOpenCategoryDialog(false)}
      >
        <form onSubmit={handleAddCategory}>
          <DialogTitle>Add Category</DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              name="name"
              label="Category Name"
              type="text"
              fullWidth
              variant="outlined"
              required
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenCategoryDialog(false)}>Cancel</Button>
            <Button type="submit" variant="contained">
              Add
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Box>
  );
} 