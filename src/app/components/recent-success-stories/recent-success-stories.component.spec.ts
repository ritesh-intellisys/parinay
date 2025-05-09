import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecentSuccessStoriesComponent } from './recent-success-stories.component';

describe('RecentSuccessStoriesComponent', () => {
  let component: RecentSuccessStoriesComponent;
  let fixture: ComponentFixture<RecentSuccessStoriesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RecentSuccessStoriesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RecentSuccessStoriesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
