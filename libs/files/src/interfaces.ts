import { BaseEntity } from "@townhub-libs/core";

export interface File extends BaseEntity {
  filename: string;
  contentType: string;
}
