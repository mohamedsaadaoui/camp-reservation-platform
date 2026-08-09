import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { PositionsService } from './positions.service';

describe('PositionsService', () => {
  let service: PositionsService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [PositionsService]
    });
    service = TestBed.inject(PositionsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
