import {Component, Input, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, AbstractControl, Validators} from '@angular/forms';

import { faPencilAlt } from '@fortawesome/free-solid-svg-icons';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import {BucketModel} from '../home/bucket';
import { MiscService } from '../services/misc.service';
import { ItemService } from '../services/item.service';

@Component({
  selector: 'app-bucket',
  templateUrl: './bucket.component.html',
  styleUrls: ['./bucket.component.scss']
})
export class BucketComponent implements OnInit {
  @Input() bucket: BucketModel;
  updateItemForm: FormGroup;
  name: AbstractControl;
  done: AbstractControl;
  pencil = faPencilAlt;
  bin = faTrash;
  constructor(
    private fb: FormBuilder,
    private misc: MiscService,
    private itemService: ItemService,
  ) { }

  ngOnInit() {
    this.updateItemForm = this.fb.group({
      name: ['', Validators.compose([Validators.required, Validators.pattern(/[a-zA-Z0-9'-_]+/)])],
      done: []
    });
    this.name = this.updateItemForm.controls.name;
    this.done = this.updateItemForm.controls.done;
  }

  toggleEdit(event) {
    const id = event.target.id;
    const formId = `edit_${id}`;
    const itemId = `item_${id}`;
    const form = document.getElementById(formId);
    const item = document.getElementById(itemId);
    if (!item.classList.contains('hidden')) {
      this.misc.hideElement(item);
      this.misc.showElement(form);
    } else {
      this.misc.hideElement(form);
      this.misc.showElement(item);
    }
  }

  editItem(event) {
    this.toggleEdit(event);
    setTimeout(() => {
      document.getElementById('item_name').focus();
    }, 300);
  }

  getItem(id) {
    const itemArray = this.bucket.items.filter(data => {
      if (data.id === id) {
        return data;
      }
    });
    return itemArray[0];
  }

  updateItem(event) {
    this.misc.showLoader();
    const item = this.getItem(event.target.id);
    const originalItemName = item.name;
    item.name = this.name.value;
    this.itemService.update(this.updateItemForm.value, this.bucket.id, item.id)
      .subscribe(_ => {
        this.misc.removeLoader();
        this.toggleEdit(event);
      }, error => {
        this.misc.removeLoader();
        this.toggleEdit(event);
        item.name = originalItemName;
        this.misc.showAlert('Ensure the name of the new item is unique.');
      });
  }

  deleteItem(event) {
    this.misc.showLoader();
    const item = this.getItem(event.target.id);
    this.itemService.delete(this.bucket.id, item.id)
      .subscribe(result => {
        this.misc.removeLoader();
        this.bucket.items.splice(this.bucket.items.indexOf(item), 1);
      }, error => {
        this.misc.removeLoader();
        this.misc.showAlert(error.message);
      });
  }

}
