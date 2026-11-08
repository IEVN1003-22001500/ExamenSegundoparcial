import { TestBed } from '@angular/core/testing';
import { PizzeriaapiService } from './pizzeriaapi.service';

describe('PizzeriaapiService', () => {
  let service: PizzeriaapiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PizzeriaapiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
