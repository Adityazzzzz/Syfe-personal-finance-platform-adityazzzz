import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

export interface UserRegisterRequest {
  username: string;
  password: string;
  fullName: string;
  phoneNumber?: string;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface TransactionRequest {
  amount: number;
  date: string;
  category: string;
  description?: string;
}

export interface Transaction {
  id: number;
  amount: number;
  date: string;
  category: string;
  description?: string;
  type: 'INCOME' | 'EXPENSE';
}

export interface Category {
  name: string;
  type: 'INCOME' | 'EXPENSE';
  isCustom: boolean;
}

export interface CategoryRequest {
  name: string;
  type: 'INCOME' | 'EXPENSE';
}

export interface Goal {
  id: number;
  goalName: string;
  targetAmount: number;
  targetDate: string;
  startDate: string;
  currentProgress: number;
  progressPercentage: number;
  remainingAmount: number;
}

export interface GoalRequest {
  goalName: string;
  targetAmount: number;
  targetDate: string;
  startDate?: string;
}

export interface MonthlyReport {
  month: number;
  year: number;
  totalIncome: Record<string, number>;
  totalExpenses: Record<string, number>;
  netSavings: number;
}

export interface YearlyReport {
  year: number;
  totalIncome: Record<string, number>;
  totalExpenses: Record<string, number>;
  netSavings: number;
}

export interface MessageResponse {
  message: string;
}

export interface UserRegisterResponse {
  message: string;
  userId: number;
}

// Auth API
export const authApi = {
  register: (data: UserRegisterRequest) => 
    api.post<UserRegisterResponse>('/auth/register', data),
  login: (data: LoginRequest) => 
    api.post<MessageResponse>('/auth/login', data),
  logout: () => 
    api.post<MessageResponse>('/auth/logout'),
};

// Transaction API
export const transactionApi = {
  getAll: (params?: { startDate?: string; endDate?: string; category?: string }) => 
    api.get<{ transactions: Transaction[] }>('/transactions', { params }),
  create: (data: TransactionRequest) => 
    api.post<Transaction>('/transactions', data),
  update: (id: number, data: TransactionRequest) => 
    api.put<Transaction>(`/transactions/${id}`, data),
  delete: (id: number) => 
    api.delete<MessageResponse>(`/transactions/${id}`),
};

// Category API
export const categoryApi = {
  getAll: () => 
    api.get<{ categories: Category[] }>('/categories'),
  create: (data: CategoryRequest) => 
    api.post<Category>('/categories', data),
  delete: (name: string) => 
    api.delete<MessageResponse>(`/categories/${name}`),
};

// Goal API
export const goalApi = {
  getAll: () => 
    api.get<{ goals: Goal[] }>('/goals'),
  get: (id: number) => 
    api.get<Goal>(`/goals/${id}`),
  create: (data: GoalRequest) => 
    api.post<Goal>('/goals', data),
  update: (id: number, data: GoalRequest) => 
    api.put<Goal>(`/goals/${id}`, data),
  delete: (id: number) => 
    api.delete<MessageResponse>(`/goals/${id}`),
};

// Report API
export const reportApi = {
  getMonthly: (year: number, month: number) => 
    api.get<MonthlyReport>(`/reports/monthly/${year}/${month}`),
  getYearly: (year: number) => 
    api.get<YearlyReport>(`/reports/yearly/${year}`),
};

export default api;
