import apiClient from "./client";
import { ApiResponse, User } from "../types";

export const usersApi = {
  getUsers: async () => {
    const { data } = await apiClient.get<ApiResponse<User[]>>("/users");
    return data;
  },

  deleteUser: async (id: string) => {
    const { data } = await apiClient.delete<ApiResponse<null>>(`/users/${id}`);
    return data;
  },
};
