import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HaupstadtComponent } from './haupstadt.component';

describe('HaupstadtComponent', () => {
  let component: HaupstadtComponent;
  let fixture: ComponentFixture<HaupstadtComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HaupstadtComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HaupstadtComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
