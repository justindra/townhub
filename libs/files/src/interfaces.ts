import { BaseEntity } from '@townhub-libs/models';

export interface File extends BaseEntity {
  filename: string;
  contentType: string;
}
