import { TestBed } from '@angular/core/testing';

import { EncounterMapService } from './map-encounter.service';

describe('EncounterMapService', () => {
  let service: EncounterMapService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EncounterMapService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
