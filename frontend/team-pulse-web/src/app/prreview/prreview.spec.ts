import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PRReviewComponent } from './prreview';


describe('PRReview', () => {
  let component: PRReviewComponent;
  let fixture: ComponentFixture<PRReviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PRReviewComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PRReviewComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
