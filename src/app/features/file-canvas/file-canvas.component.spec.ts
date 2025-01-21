import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FileCanvasComponent } from './file-canvas.component';

describe('FileCanvasComponent', () => {
  let component: FileCanvasComponent;
  let fixture: ComponentFixture<FileCanvasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FileCanvasComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FileCanvasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
