import { useQuery } from '@tanstack/react-query';
import axios, { AxiosError } from 'axios';

import { Product } from '../entities';

const useProduct = (productId: number) => {
  return useQuery<Product, Error>({
    queryKey: ['products', productId],
    queryFn: () => fetchProduct(productId),
    staleTime: 0,
  });
};

const fetchProduct = async (id: number) => {
  try {
    if (isNaN(id)) return null;
    const { data } = await axios.get(`/products/${id}`);
    return data;
  } catch (error) {
    if (
      error instanceof AxiosError &&
      error.response &&
      error.response.status === 404
    )
      return null;
    throw error;
  }
};

export default useProduct;
