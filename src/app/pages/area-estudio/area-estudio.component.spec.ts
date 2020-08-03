import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AreaEstudioComponent } from './area-estudio.component';

describe('AreaEstudioComponent', () => {
  let component: AreaEstudioComponent;
  let fixture: ComponentFixture<AreaEstudioComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AreaEstudioComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AreaEstudioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
