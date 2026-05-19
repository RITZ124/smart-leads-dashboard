import apiClient from "./client";
import { ApiResponse, User, UserRole } from "../types";

interface AuthResponseData {
  user: User;
  token: string;
}

export const authApi = {
  register: async (
    name: string,
    email: string,
    password: string,
    role: UserRole = "sales"
  ) => {
    const { data } = await apiClient.post<ApiResponse<AuthResponseData>>(
      "/auth/register",
      { name, email, password, role }
    );
    return data;
  },

  login: async (email: string, password: string) => {
    const { data } = await apiClient.post<ApiResponse<AuthResponseData>>(
      "/auth/login",
      { email, password }
    );
    return data;
  },

  getMe: async () => {
    const { data } = await apiClient.get<ApiResponse<User>>("/auth/me");
    return data;
  },
};
