import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { restaurantApi, menuApi, orderApi } from '../services/api';
import { useStore } from '../store';

export const useRestaurants = () => {
  const { restaurants, setRestaurants } = useStore();
  const queryClient = useQueryClient();

  const { data, isLoading, error } = useQuery({
    queryKey: ['restaurants'],
    queryFn: async () => {
      const response = await restaurantApi.getAll();
      setRestaurants(response.data);
      return response.data;
    },
  });

  const createMutation = useMutation({
    mutationFn: restaurantApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['restaurants'] });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) =>
      restaurantApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['restaurants'] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: restaurantApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['restaurants'] });
    },
  });

  return {
    restaurants: data || restaurants,
    isLoading,
    error,
    createRestaurant: createMutation.mutate,
    updateRestaurant: updateMutation.mutate,
    deleteRestaurant: deleteMutation.mutate,
  };
};

export const useMenu = () => {
  const { menuItems, categories, setMenuItems, setCategories } = useStore();
  const queryClient = useQueryClient();

  const { data: itemsData, isLoading: itemsLoading } = useQuery({
    queryKey: ['menuItems'],
    queryFn: async () => {
      const response = await menuApi.getItems();
      setMenuItems(response.data);
      return response.data;
    },
  });

  const { data: categoriesData, isLoading: categoriesLoading } = useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const response = await menuApi.getCategories();
      setCategories(response.data);
      return response.data;
    },
  });

  const createItemMutation = useMutation({
    mutationFn: menuApi.createItem,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['menuItems'] });
    },
  });

  const updateItemMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) =>
      menuApi.updateItem(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['menuItems'] });
    },
  });

  const deleteItemMutation = useMutation({
    mutationFn: menuApi.deleteItem,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['menuItems'] });
    },
  });

  const createCategoryMutation = useMutation({
    mutationFn: menuApi.createCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
    },
  });

  const updateCategoryMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) =>
      menuApi.updateCategory(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
    },
  });

  const deleteCategoryMutation = useMutation({
    mutationFn: menuApi.deleteCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
    },
  });

  return {
    menuItems: itemsData || menuItems,
    categories: categoriesData || categories,
    isLoading: itemsLoading || categoriesLoading,
    createMenuItem: createItemMutation.mutate,
    updateMenuItem: updateItemMutation.mutate,
    deleteMenuItem: deleteItemMutation.mutate,
    createCategory: createCategoryMutation.mutate,
    updateCategory: updateCategoryMutation.mutate,
    deleteCategory: deleteCategoryMutation.mutate,
  };
};

export const useOrders = () => {
  const { orders, setOrders } = useStore();
  const queryClient = useQueryClient();

  const { data, isLoading, error } = useQuery({
    queryKey: ['orders'],
    queryFn: async () => {
      const response = await orderApi.getAll();
      setOrders(response.data);
      return response.data;
    },
  });

  const updateStatusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) =>
      orderApi.updateStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
    },
  });

  return {
    orders: data || orders,
    isLoading,
    error,
    updateOrderStatus: updateStatusMutation.mutate,
  };
}; 