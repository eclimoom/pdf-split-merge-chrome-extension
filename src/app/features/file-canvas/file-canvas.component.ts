import {Component, ElementRef, EventEmitter, Input, OnChanges, Output, SimpleChanges, ViewChild} from '@angular/core';

@Component({
  selector: 'app-file-canvas',
  templateUrl: './file-canvas.component.html',
  styleUrls: ['./file-canvas.component.scss']
})
export class FileCanvasComponent implements OnChanges {
  @Input() file: File | any;
  @ViewChild('canvas', { static: true }) canvasRef!: ElementRef<HTMLCanvasElement>;
  @Output() removeFile = new EventEmitter<any>();

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['file'] && this.file) {
      this.renderImage();
    }
  }

  private renderImage(): void {
    const canvas: any = this.canvasRef.nativeElement;
    const context = canvas.getContext('2d');
    if (context && this.file) {
      const render = (src: string) => {
        const img = new Image();
        img.onload = () => {
          canvas.width = canvas.parentElement.clientWidth;
          canvas.height = canvas.parentElement.clientHeight;

          // Scale the image to fit the canvas
          const scale = Math.min(canvas.width / img.width, canvas.height / img.height);
          const x = (canvas.width / 2) - (img.width / 2) * scale;
          const y = (canvas.height / 2) - (img.height / 2) * scale;
          context.drawImage(img, x, y, img.width * scale, img.height * scale);
        };
        // console.log('src》》》', src);
        img.src = src;
      };

      if (this.file.base64) {
        render(this.file.base64);
      } else {
        const reader = new FileReader();
        reader.onload = (event: any) => {
          render(event.target.result);
        };
        reader.readAsDataURL(this.file);
      }
    }
  }
}
