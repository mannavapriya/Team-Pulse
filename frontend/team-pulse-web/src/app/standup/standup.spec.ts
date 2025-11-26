import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StandupComponent } from './standup';

describe('Standup', () => {
  let component: StandupComponent;
  let fixture: ComponentFixture<StandupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StandupComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StandupComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
