import axios, { AxiosRequestConfig } from "axios";

const BASE_URL = "https://51.210.241.174.nip.io"; // Replace with your actual axios URL

export const get = async (
  url: string,
  config?: AxiosRequestConfig
): Promise<any> => {
  try {
    const response = await axios.get(`${BASE_URL}/${url}`, config);
    return response.data;
  } catch (error: any) {
    throw new Error(error.message); // Handle errors appropriately
  }
};

export const post = async (
  url: string,
  data: any,
  config?: AxiosRequestConfig
): Promise<any> => {
  try {
    const response = await axios.post(`${BASE_URL}/${url}`, data, config);
    console.log("Response", response.data);
    return response.data;
  } catch (error: any) {
    throw new Error(error.message); // Handle errors appropriately
  }
};

export const put = async (
  url: string,
  data: any,
  config?: AxiosRequestConfig
): Promise<any> => {
  try {
    const response = await axios.put(`${BASE_URL}/${url}`, data, config);
    return response.data;
  } catch (error: any) {
    throw new Error(error.message); // Handle errors appropriately
  }
};

export const patch = async (
  url: string,
  data: any,
  config?: AxiosRequestConfig
): Promise<any> => {
  try {
    const response = await axios.patch(`${BASE_URL}/${url}`, data, config);
    return response.data;
  } catch (error: any) {
    throw new Error(error.message); // Handle errors appropriately
  }
};

export const del = async (
  url: string,
  config?: AxiosRequestConfig
): Promise<any> => {
  try {
    const response = await axios.delete(`${BASE_URL}/${url}`, config);
    return response.data;
  } catch (error: any) {
    throw new Error(error.message); // Handle errors appropriately
  }
};
