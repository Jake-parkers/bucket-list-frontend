import { ItemModel } from './item';

export class NewBucket {
  bucket_id: string;
  name: string;
  date_created: string;
  date_modified: string;
  items: ItemModel[];
  user_id: string;
}
