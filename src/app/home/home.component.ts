import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {FormBuilder, FormGroup, AbstractControl, Validators} from '@angular/forms';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import {Observable} from 'rxjs';
import {map, debounceTime, distinctUntilChanged, switchMap} from 'rxjs/operators';

import { AuthService } from '../services/auth.service';
import { BucketListService } from '../services/bucket-list.service';
import { ItemService } from '../services/item.service';
import { MiscService } from '../services/misc.service';
import { ModalService } from '../services/modal.service';

import { faPencilAlt } from '@fortawesome/free-solid-svg-icons';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { faPlusCircle } from '@fortawesome/free-solid-svg-icons';
import {LoaderComponent} from '../loader/loader.component';
import {BucketModel} from './bucket';
import {AllbucketsResponse} from './allbuckets.response';
import {NewBucket} from './new-bucket';
import {ItemModel} from './item';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  pencil = faPencilAlt;
  bin = faTrash;
  add = faPlusCircle;
  updateBucketForm: FormGroup;
  addItemForm: FormGroup;
  searchForm: FormGroup;
  bucketName: AbstractControl;
  itemName: AbstractControl;
  search: AbstractControl;
  done: AbstractControl;
  edit = false;
  addItem = false;
  results: AllbucketsResponse;
  buckets: BucketModel[] = [];
  bucket: BucketModel;
  singleBucket: BucketModel;
  loadMore = false;
  nextPage = 1;
  constructor(
    private auth: AuthService,
    private misc: MiscService,
    private bucketService: BucketListService,
    private router: Router,
    private fb: FormBuilder,
    private modal: ModalService,
    private itemService: ItemService
  ) {}

  static transformBuckets(buckets: BucketModel[]) {
    if (buckets !== null) {
      return buckets.map(bucket => {
        if (bucket.items !== null && bucket.items.indexOf(null) !== -1) {
          bucket.items = null;
        }
        return bucket;
      });
    }
  }

  ngOnInit() {
    this.searchForm = this.fb.group({
      name: ['']
    });
    this.updateBucketForm = this.fb.group({
      name: ['', Validators.compose([Validators.required, Validators.pattern(/[a-zA-Z0-9'-_]+/)])]
    });
    this.addItemForm = this.fb.group({
      name: ['', Validators.compose([Validators.required, Validators.pattern(/[a-zA-Z0-9'_-]+/)])],
      done: [false]
    });
    this.bucketName = this.updateBucketForm.controls.name;
    this.itemName = this.addItemForm.controls.name;
    this.done = this.addItemForm.controls.done;
    this.search = this.searchForm.controls.name;
    this.fetchAllBuckets();
    this.searchBucket();
  }

  logout() {
    this.auth.logout();
    this.router.navigateByUrl('/login');
  }

  goHome() {
    this.router.navigateByUrl('/bucketlists');
  }

  gotoDocs() {
    this.router.navigateByUrl('');
  }

  editBucket(event) {
    this.toggleEdit(event);
    setTimeout(() => {
      document.getElementById('bucket_name').focus();
    }, 300);
  }

  deleteBucket(event) {
    this.misc.showLoader();
    const index = event.target.id;
    const bucketId = this.buckets[index].id;
    this.bucketService.delete(bucketId)
      .subscribe(response => {
        this.misc.removeLoader();
        this.buckets.splice(index, 1);
      }, error => {
        this.misc.removeLoader();
        this.misc.showAlert(error.message);
      });
  }


  toggleEdit(event) {
    const index = event.target.id;
    const formId = `edit_${this.buckets[index].id}`;
    const bucketId = `bucket_${this.buckets[index].id}`;
    const form = document.getElementById(formId);
    const bucket = document.getElementById(bucketId);
    if (!bucket.classList.contains('hidden')) {
      this.misc.hideElement(bucket);
      this.misc.showElement(form);
    } else {
      this.misc.hideElement(form);
      this.misc.showElement(bucket);
    }
  }

  addNewItem(event) {
    this.toggleAddItem(event);
  }

  toggleAddItem(event) {
    const index = event.target.id;
    const formId = `item_form_${this.buckets[index].id}`;
    const actionId = `item_info_${this.buckets[index].id}`;
    const form = document.getElementById(formId);
    const action = document.getElementById(actionId);
    if (!action.classList.contains('hidden')) {
      this.misc.hideElement(action);
      this.misc.showElement(form);
    } else {
      this.misc.hideElement(form);
      this.misc.showElement(action);
    }
    // this.addItem = !this.addItem;
  }

  updateBucket(event) {
    const index = event.target.id;
    const originalBucketName = this.buckets[index].name;
    this.buckets[index].name = this.bucketName.value;
    this.misc.showLoader();
    this.bucketService.update(this.updateBucketForm.value, this.buckets[index].id)
      .subscribe(_ => {
        this.misc.removeLoader();
        this.toggleEdit(event);
      }, error => {
        this.misc.removeLoader();
        this.toggleEdit(event);
        this.buckets[index].name = originalBucketName;
        this.misc.showAlert(error.message + 'Ensure the name of the new bucket is unique.');
      });
  }

  addItemToBucket(event) {
    this.misc.showLoader();
    const bucketId = event.target.id.replace('item_form_', '');
    this.itemService.create(this.addItemForm.value, bucketId)
      .subscribe(result => {
        this.misc.removeLoader();
        this.misc.showAlert('Item Added Successfully');
        const newItem: ItemModel = result.message;
        this.updateBucketItems(newItem, bucketId);
      }, error => {
        this.misc.removeLoader();
        this.misc.showAlert(error.message);
      });
  }

  updateBucketItems(item: ItemModel, bucketId) {
    this.buckets.forEach(bucket => {
      if (bucket.id === bucketId) {
        bucket.items === null ? bucket.items = [item] : bucket.items.push(item);
      }
    });
  }

  fetchAllBuckets() {
    this.singleBucket = null;
    this.misc.showLoader();
    this.bucketService.getAll()
      .subscribe(response => {
        this.misc.removeLoader();
        this.results = response.message;
        this.buckets = this.results.data;
        this.buckets = HomeComponent.transformBuckets(this.buckets);
        if (this.results.next_page_url !== null) {
          this.loadMore = !this.loadMore;
          this.nextPage = this.results.current_page + 1;
        }
      }, error => {
        this.misc.removeLoader();
        this.misc.showAlert(error.message);
      });
  }

  loadMoreBuckets(page) {
    this.misc.showLoader();
    this.bucketService.getAll(page)
      .subscribe(response => {
        this.misc.removeLoader();
        this.results = response.message;
        this.buckets = [...this.buckets, ...this.results.data];
        this.buckets = HomeComponent.transformBuckets(this.buckets);
        if (this.results.next_page_url !== null) {
          this.loadMore = !this.loadMore;
          this.nextPage = this.results.current_page + 1;
        } else {
          this.loadMore = !this.loadMore;
        }
      }, error => {
       this.misc.removeLoader();
       this.misc.showAlert(error.message);
      });
  }

  createBucket() {
    this.bucketService.create(this.searchForm.value)
      .subscribe(response => {
        const newBucket: NewBucket = response.message;
        if (!this.buckets) {
          this.buckets = [];
        }
        // tslint:disable-next-line:max-line-length
        this.buckets.unshift(new BucketModel(newBucket.bucket_id, newBucket.name, newBucket.date_created, newBucket.date_modified, newBucket.items, newBucket.user_id));
        this.misc.removeLoader();
        }, error => {
        this.misc.removeLoader();
        this.misc.showAlert(error.message);
      });
  }

  searchBucket() {
    this.search.valueChanges.pipe(
      debounceTime(1000),
      switchMap(name => {
        this.misc.showLoader();
        if (name === '') {
          return this.bucketService.getAll();
        }
        return this.bucketService.getAll(1, 20, name);
      })
    ).subscribe(result => {
      if (!result.message.data) { // single result
        this.buckets = [];
        this.buckets.push(result.message);
        this.loadMore = false;
      } else { // all buckets
        this.results = result.message;
        this.buckets = this.results.data;
        this.buckets = HomeComponent.transformBuckets(this.buckets);
        if (this.results.next_page_url !== null) {
          this.loadMore = !this.loadMore;
          this.nextPage = this.results.current_page + 1;
        } else {
          this.loadMore = !this.loadMore;
        }
      }
      this.misc.removeLoader();
    }, error => {
      if (error.type === 'NO_BUCKETS_YET') {
        const create = prompt('Bucket doesn\'t exist. Would you like to create the bucket\n(Y) for Yes, (N) for No');
        // create bucket
        create === 'Y' ? this.createBucket() : this.misc.removeLoader();
      } else {
        this.misc.removeLoader();
        this.misc.showAlert(error.message);
      }
    });
  }

  openBucket(event) {
    const index = event.target.id;
    this.singleBucket = this.buckets[index];
  }

}
