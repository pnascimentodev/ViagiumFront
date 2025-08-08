import axios from 'axios';
import { AuthService } from './auth';

// Configuração base do axios
const apiClient = axios.create({
  baseURL: 'https://viagium.azurewebsites.net/api',
});

// Interceptor para incluir automaticamente o token Bearer nas requisições
apiClient.interceptors.request.use(
  (config) => {
    // Primeiro verifica se é uma requisição de afiliado
    const affiliateToken = AuthService.getAffiliateToken();
    if (affiliateToken && (config.url?.includes('/Affiliate/') || config.url?.includes('/Hotel/'))) {
      config.headers.Authorization = `Bearer ${affiliateToken}`;
    }

    // Senão, verifica se é uma requisição de usuário/admin
    const userToken = AuthService.getUserToken();
    if (userToken && config.url?.includes('/User/')) {
      config.headers.Authorization = `Bearer ${userToken}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para lidar com respostas e erros de autenticação
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Se receber erro 401 (não autorizado), limpa os dados de autenticação
    if (error.response?.status === 401) {
      AuthService.logout();
      // Redireciona para login baseado na URL atual
      if (window.location.pathname.includes('affiliate')) {
        window.location.href = '/affiliate';
      } else if (window.location.pathname.includes('admin')) {
        window.location.href = '/loginadmin';
      } else {
        window.location.href = '/loginclient';
      }
    }
    return Promise.reject(error);
  }
);

export default apiClient;
