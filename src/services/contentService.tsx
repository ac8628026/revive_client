import axios from "axios";
import api from "./axios";
import type { ApiErrorResponse } from "./authService";

export type Content = {
  _id: string;
  link: string;
  title: string;
  type: string;
  userId: string;
  createdAt:string;
  tags?:string[];
};

export type ContentResponse = {
  contents: Content[];
};

export const getContentService = async (): Promise<ContentResponse> => {
  try {
    const { data } = await api.get<ContentResponse>("/contents");
    console.log(data)
    return data;
  } catch (err) {
    if (axios.isAxiosError<ApiErrorResponse>(err)) {
      throw new Error(err.response?.data.message || "failed to fetch content");
    }
    throw new Error("Unexpected Error");
  }
};

export type ContentPayload = {
  link: string;
  title: string;
  type: string;
  tags?: string[];
};

export const addContentService = async (
  payload: ContentPayload
): Promise<ContentResponse> => {
  try {
    const { data } = await api.post<ContentResponse>("/contents", payload);
    return data;
  } catch (err) {
    if (axios.isAxiosError<ApiErrorResponse>(err)) {
      throw new Error(
        err.response?.data.message || "failed to add new content"
      );
    }

    throw new Error("Unexpected Error");
  }
};

export type MessageResponse = {
  message: string;
};

export const deleteContentService = async (
  id: string
): Promise<MessageResponse> => {
  try {
    const { data } = await api.delete<MessageResponse>(`/contents/${id}`);
    return data;
  } catch (err) {
    if (axios.isAxiosError<ApiErrorResponse>(err)) {
      throw new Error(err.response?.data.message || "Failed to Delete Content");
    }
    throw new Error("Unexpected Error");
  }
};

export type ShareContentPayload = {
  isShare: boolean;
};

export type ShareContentResposne = {
  shareId: string;
  shared:boolean;
};

export const updateShareService = async (
  payload: ShareContentPayload
): Promise<ShareContentResposne> => {
  try {
    const { data } = await api.post<ShareContentResposne>(
      "/contents/share",
      payload
    );
    return data;
  } catch (err) {
    if (axios.isAxiosError<ApiErrorResponse>(err)) {
      throw new Error(err.response?.data.message);
    }
    throw new Error("Unexpected Error");
  }
};

export const getSharedService = async (
  contentId: string
): Promise<ContentResponse> => {
  try {
    const { data } = await api.get<ContentResponse>(
      `/contents/share/${contentId}`
    );
    return data;
  } catch (err) {
    if (axios.isAxiosError<ApiErrorResponse>(err)) {
      throw new Error(err.response?.data.message || "failed to fetch content");
    }
    throw new Error("Unexpected Error");
  }
};

export const getShareStatusService = async (): Promise<ShareContentResposne> => {
  try {
    const { data } = await api.get<ShareContentResposne>(
      `/contents/share`
    );
    return data;
  } catch (err) {
    if (axios.isAxiosError<ApiErrorResponse>(err)) {
      throw new Error(err.response?.data.message || "failed to fetch content");
    }
    throw new Error("Unexpected Error");
  }
};

