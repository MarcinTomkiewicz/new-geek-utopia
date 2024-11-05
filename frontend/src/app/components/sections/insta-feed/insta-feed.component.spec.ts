import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InstaFeedComponent } from './insta-feed.component';

describe('InstaFeedComponent', () => {
  let component: InstaFeedComponent;
  let fixture: ComponentFixture<InstaFeedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InstaFeedComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InstaFeedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
