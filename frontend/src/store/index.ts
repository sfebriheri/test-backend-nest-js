import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

interface Order {
  id: string;
  restaurantName: string;
  customerName: string;
  items: Array<{
    id: string;
    name: string;
    quantity: number;
    price: number;
  }>;
  total: number;
  status: 'pending' | 'preparing' | 'ready' | 'delivered' | 'cancelled';
  createdAt: string;
}

interface Restaurant {
  id: string;
  name: string;
  address: string;
  cuisine: string;
  rating: number;
}

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

interface AppState {
  orders: Order[];
  restaurants: Restaurant[];
  menuItems: MenuItem[];
  categories: Category[];
  setOrders: (orders: Order[]) => void;
  setRestaurants: (restaurants: Restaurant[]) => void;
  setMenuItems: (menuItems: MenuItem[]) => void;
  setCategories: (categories: Category[]) => void;
  addOrder: (order: Order) => void;
  updateOrderStatus: (orderId: string, status: Order['status']) => void;
  addRestaurant: (restaurant: Restaurant) => void;
  updateRestaurant: (id: string, restaurant: Partial<Restaurant>) => void;
  deleteRestaurant: (id: string) => void;
  addMenuItem: (menuItem: MenuItem) => void;
  updateMenuItem: (id: string, menuItem: Partial<MenuItem>) => void;
  deleteMenuItem: (id: string) => void;
  addCategory: (category: Category) => void;
  updateCategory: (id: string, category: Partial<Category>) => void;
  deleteCategory: (id: string) => void;
}

export const useStore = create<AppState>()(
  devtools(
    persist(
      (set) => ({
        orders: [],
        restaurants: [],
        menuItems: [],
        categories: [],
        setOrders: (orders) => set({ orders }),
        setRestaurants: (restaurants) => set({ restaurants }),
        setMenuItems: (menuItems) => set({ menuItems }),
        setCategories: (categories) => set({ categories }),
        addOrder: (order) =>
          set((state) => ({ orders: [...state.orders, order] })),
        updateOrderStatus: (orderId, status) =>
          set((state) => ({
            orders: state.orders.map((order) =>
              order.id === orderId ? { ...order, status } : order
            ),
          })),
        addRestaurant: (restaurant) =>
          set((state) => ({ restaurants: [...state.restaurants, restaurant] })),
        updateRestaurant: (id, restaurant) =>
          set((state) => ({
            restaurants: state.restaurants.map((r) =>
              r.id === id ? { ...r, ...restaurant } : r
            ),
          })),
        deleteRestaurant: (id) =>
          set((state) => ({
            restaurants: state.restaurants.filter((r) => r.id !== id),
          })),
        addMenuItem: (menuItem) =>
          set((state) => ({ menuItems: [...state.menuItems, menuItem] })),
        updateMenuItem: (id, menuItem) =>
          set((state) => ({
            menuItems: state.menuItems.map((item) =>
              item.id === id ? { ...item, ...menuItem } : item
            ),
          })),
        deleteMenuItem: (id) =>
          set((state) => ({
            menuItems: state.menuItems.filter((item) => item.id !== id),
          })),
        addCategory: (category) =>
          set((state) => ({ categories: [...state.categories, category] })),
        updateCategory: (id, category) =>
          set((state) => ({
            categories: state.categories.map((c) =>
              c.id === id ? { ...c, ...category } : c
            ),
          })),
        deleteCategory: (id) =>
          set((state) => ({
            categories: state.categories.filter((c) => c.id !== id),
          })),
      }),
      {
        name: 'f-and-b-admin-storage',
      }
    )
  )
); 