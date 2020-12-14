import { Api, TownhubApiResponse } from '../base';
import { Vendor } from '@townhub-libs/vendors';

const VENDORS_ENDPOINT = 'vendors';

export class VendorsApi {
  constructor(private api: Api) {}

  async list() {
    const res = await this.api.get<TownhubApiResponse<Vendor[]>>(
      `${VENDORS_ENDPOINT}`
    );
    return res.data;
  }
}
