import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AreaCoopunionComponent } from './area-coopunion.component';

describe('AreaCoopunionComponent', () => {
  let component: AreaCoopunionComponent;
  let fixture: ComponentFixture<AreaCoopunionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AreaCoopunionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AreaCoopunionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
