import { TestBed } from '@angular/core/testing';

import { BucketListService } from './bucket-list.service';

describe('BucketListService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: BucketListService = TestBed.get(BucketListService);
    expect(service).toBeTruthy();
  });
});
