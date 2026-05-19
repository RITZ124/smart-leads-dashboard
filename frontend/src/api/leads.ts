import apiClient from "./client";
import { ApiResponse, Lead, LeadFilters, LeadFormData } from "../types";

export const leadsApi = {
  getLeads: async (filters: Partial<LeadFilters>) => {
    const params = new URLSearchParams();
    if (filters.status) params.set("status", filters.status);
    if (filters.source) params.set("source", filters.source);
    if (filters.search) params.set("search", filters.search);
    if (filters.sort) params.set("sort", filters.sort);
    if (filters.page) params.set("page", String(filters.page));
    params.set("limit", "10");

    const { data } = await apiClient.get<ApiResponse<Lead[]>>(
      `/leads?${params.toString()}`
    );
    return data;
  },

  getLead: async (id: string) => {
    const { data } = await apiClient.get<ApiResponse<Lead>>(`/leads/${id}`);
    return data;
  },

  createLead: async (payload: LeadFormData) => {
    const { data } = await apiClient.post<ApiResponse<Lead>>("/leads", payload);
    return data;
  },

  updateLead: async (id: string, payload: Partial<LeadFormData>) => {
    const { data } = await apiClient.put<ApiResponse<Lead>>(
      `/leads/${id}`,
      payload
    );
    return data;
  },

  deleteLead: async (id: string) => {
    const { data } = await apiClient.delete<ApiResponse<null>>(
      `/leads/${id}`
    );
    return data;
  },

  exportCSV: async (filters: Partial<LeadFilters>) => {
    const params = new URLSearchParams();
    if (filters.status) params.set("status", filters.status);
    if (filters.source) params.set("source", filters.source);
    if (filters.search) params.set("search", filters.search);

    const response = await apiClient.get(`/leads/export?${params.toString()}`, {
      responseType: "blob",
    });

    const url = window.URL.createObjectURL(new Blob([response.data as BlobPart]));
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "leads-export.csv");
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
  },
};
