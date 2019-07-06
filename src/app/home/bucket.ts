import { ItemModel } from './item';

export class BucketModel {
  id: string;
  name: string;
  date_created: string;
  date_modified: string;
  items: ItemModel[];
  created_by: string;

  constructor(id, name, date_created, date_modified, items, created_by) {
    this.id = id;
    this.name = name;
    this.date_created = date_created === '' ? new Date().toLocaleDateString() : date_created;
    this.date_modified = date_modified === '' ? new Date().toLocaleDateString() : date_modified;
    this.items = items;
    this.created_by = created_by;
  }

}
