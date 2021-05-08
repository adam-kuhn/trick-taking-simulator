import { TestBed } from '@angular/core/testing';

import { SharedGameStateService } from './shared-game-state.service';

describe('SharedGameStateService', () => {
  let service: SharedGameStateService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SharedGameStateService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
