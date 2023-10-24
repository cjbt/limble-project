import { TestBed } from '@angular/core/testing';

import { UserMentionsService } from './user-mentions.service';
import { Users } from 'src/app/models/user.model';

describe('UserMentionsServiceService', () => {
  let service: UserMentionsService;
  let sampleUsers: Users = [
    { userID: 1, name: 'John Doe' },
    { userID: 2, name: 'Jane Smith' },
  ];

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UserMentionsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should initialize with users and find them with search', () => {
    service.initialize(sampleUsers);

    let results = service.search('John');
    expect(results.length).toBe(1);
    expect(results[0].name).toBe('John Doe');

    results = service.search('Jane');
    expect(results.length).toBe(1);
    expect(results[0].name).toBe('Jane Smith');
  });

  it('should return all users for empty search', () => {
    service.initialize(sampleUsers);

    const results = service.search('');
    expect(results.length).toBe(2);
  });

  it('should cache search results', () => {
    service.initialize(sampleUsers);

    service.search('John');

    const spy = spyOn((service as any).trie, 'find').and.callThrough();

    service.search('John');

    expect(spy).not.toHaveBeenCalled();
  });
});
