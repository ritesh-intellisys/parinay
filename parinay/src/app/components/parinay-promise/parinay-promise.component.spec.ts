import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ParinayPromiseComponent } from './parinay-promise.component';

describe('ParinayPromiseComponent', () => {
  let component: ParinayPromiseComponent;
  let fixture: ComponentFixture<ParinayPromiseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ParinayPromiseComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ParinayPromiseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
