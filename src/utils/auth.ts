// Utilitário para gerenciar autenticação JWT
export interface AffiliateAuthData {
  id: string;
  token: string;
}

export interface UserAuthData {
  // Defina a estrutura dos dados do usuário/admin conforme necessário
  id: string;
  token: string;
}

export class AuthService {
  // Métodos para Afiliados
  static setAffiliateAuth(authData: AffiliateAuthData): void {
    localStorage.setItem('affiliate_auth', JSON.stringify(authData));
    localStorage.setItem('affiliate_token', authData.token);
  }

  static getAffiliateAuth(): AffiliateAuthData | null {
    const authData = localStorage.getItem('affiliate_auth');
    return authData ? JSON.parse(authData) : null;
  }

  static getAffiliateToken(): string | null {
    return localStorage.getItem('affiliate_token');
  }

  static clearAffiliateAuth(): void {
    localStorage.removeItem('affiliate_auth');
    localStorage.removeItem('affiliate_token');
    localStorage.removeItem('affiliate'); // Remove dados antigos se existirem
  }

  static isAffiliateAuthenticated(): boolean {
    const token = this.getAffiliateToken();
    return !!token;
  }

  // Métodos para Usuários/Admin
  static setUserAuth(authData: UserAuthData): void {
    localStorage.setItem('user_auth', JSON.stringify(authData));
    localStorage.setItem('user_token', authData.token);
  }

  static getUserAuth(): UserAuthData | null {
    const authData = localStorage.getItem('user_auth');
    return authData ? JSON.parse(authData) : null;
  }

  static getUserToken(): string | null {
    return localStorage.getItem('user_token');
  }

  static clearUserAuth(): void {
    localStorage.removeItem('user_auth');
    localStorage.removeItem('user_token');
  }

  static isUserAuthenticated(): boolean {
    const token = this.getUserToken();
    return !!token;
  }

  // Método para logout geral
  static logout(): void {
    this.clearAffiliateAuth();
    this.clearUserAuth();
  }
}
