import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';

// AWS Configurations
const API_ENDPOINT = process.env.REACT_APP_TOWNHUB_API_ENDPOINT;
const API_TIMEOUT = 10000;

// Default headers
const defaultHeaders = {
  'Content-Type': 'application/json',
};

export type TownhubApiResponse<TData = any> = {
  message: string;
  data: TData;
};

export class Api {
  private api: AxiosInstance;

  constructor() {
    this.api = axios.create({
      baseURL: API_ENDPOINT,
      timeout: API_TIMEOUT,
      headers: defaultHeaders,
    });
  }

  /**
   * Update the town we are making the api calls as
   * @param townId The new town id to use
   */
  updateTownId(townId: string) {
    this.api.interceptors.request.use(async (config) => {
      config.headers['Town-Id'] = townId;
      return config;
    });
  }

  async get<TResponse = TownhubApiResponse>(url: string) {
    const res = await this.api.get<TResponse>(url);
    return res.data;
  }

  async post<TBody = any, TResponse = TownhubApiResponse>(
    url: string,
    body: TBody
  ) {
    const res = await this.api.post<TBody, AxiosResponse<TResponse>>(url, body);
    return res.data;
  }

  async delete<TResponse = TownhubApiResponse>(url: string) {
    const res = await this.api.delete<TResponse>(url);
    return res.data;
  }
}
