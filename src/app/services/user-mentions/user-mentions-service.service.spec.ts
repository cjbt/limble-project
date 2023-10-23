import { TestBed } from '@angular/core/testing';

import { UserMentionsServiceService } from './user-mentions-service.service';

describe('UserMentionsServiceService', () => {
  let service: UserMentionsServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UserMentionsServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
