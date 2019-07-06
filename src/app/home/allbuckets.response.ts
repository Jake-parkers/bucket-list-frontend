import {BucketModel} from "./bucket";

export class AllbucketsResponse {
  current_page: number;
  data: BucketModel[];
  first_page_url: string;
  last_page: number;
  last_page_url: string;
  next_page_url: string;
  path: string;
  per_page: number;
  prev_page_url: string;
  total: number;
}
