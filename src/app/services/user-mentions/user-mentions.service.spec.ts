import { TestBed } from '@angular/core/testing';

import { UserMentionsService } from './user-mentions.service';

describe('UserMentionsServiceService', () => {
  let service: UserMentionsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UserMentionsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
