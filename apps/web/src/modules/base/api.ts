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
  private townId: string = '';
  private jwt: string = '';

  constructor() {
    this.api = axios.create({
      baseURL: API_ENDPOINT,
      timeout: API_TIMEOUT,
      headers: defaultHeaders,
    });

    this.api.interceptors.request.use(async (config) => {
      if (this.townId) {
        config.headers['Town-Id'] = this.townId;
      }
      if (this.jwt) {
        config.headers['Authorization'] = `Bearer ${this.jwt}`;
      }
      return config;
    });
  }

  /**
   * Update the town we are making the api calls as
   * @param townId The new town id to use
   */
  updateTownId(townId: string) {
    this.townId = townId;
  }

  /**
   * Update the jwt for all calls, this should allow for authenticated
   * calls for the admin portal side
   * @param jwt The new jwt to use
   */
  updateJWT(jwt: string) {
    this.jwt = jwt;
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
