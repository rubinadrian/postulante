import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AreaLaboralComponent } from './area-laboral.component';

describe('AreaLaboralComponent', () => {
  let component: AreaLaboralComponent;
  let fixture: ComponentFixture<AreaLaboralComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AreaLaboralComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AreaLaboralComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
