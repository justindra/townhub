import { Api, TownhubApiResponse } from '../base';
import { Vendor } from '@townhub-libs/vendors';

export const VENDORS_ENDPOINT = 'vendors';

export class VendorsApi {
  constructor(private api: Api) {}

  async list() {
    const res = await this.api.get<TownhubApiResponse<Vendor[]>>(
      `${VENDORS_ENDPOINT}`
    );
    return res.data;
  }

  async listByCategory(category: string) {
    const res = await this.api.get<TownhubApiResponse<Vendor[]>>(
      `${VENDORS_ENDPOINT}/categories/${category}`
    );
    return res.data;
  }
}
