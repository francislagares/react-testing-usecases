import { RouteObject } from 'react-router-dom';

import App from './App';
import AdminHomePage from './pages/admin/AdminHomePage';
import AdminLayout from './pages/admin/AdminLayout';
import EditProductPage from './pages/admin/EditProductPage';
import NewProductPage from './pages/admin/NewProductPage';
import AdminProductListPage from './pages/admin/ProductListPage';
import ErrorPage from './pages/ErrorPage';
import HomePage from './pages/HomePage';
import PlaygroundPage from './pages/PlaygroundPage';
import ProductDetailPage from './pages/ProductDetailPage';
import ProductListPage from './pages/ProductListPage';

const routes: RouteObject[] = [
  {
    path: '/',
    element: <App />,
    errorElement: <ErrorPage />,
    children: [
      { index: true, element: <HomePage /> },
      { path: 'playground', element: <PlaygroundPage /> },
      { path: 'products', element: <ProductListPage /> },
      { path: 'products/:id', element: <ProductDetailPage /> },
      {
        path: 'admin',
        element: <AdminLayout />,
        children: [
          { index: true, element: <AdminHomePage /> },
          { path: 'products', element: <AdminProductListPage /> },
          { path: 'products/new', element: <NewProductPage /> },
          { path: 'products/:id/edit', element: <EditProductPage /> },
        ],
      },
    ],
  },
];

export default routes;
