import {Component} from '@angular/core';

@Component({
  selector: 'app-file-upload',
  templateUrl: './file-upload.component.html',
  styleUrls: ['./file-upload.component.scss']
})
export class FileUploadComponent {
  fileType: string = '';

  onFileSelected(event: any) {
    const files = event.target.files;
    if (files.length > 0) {
      const file = files[0];
      if (file.type === 'application/pdf') {
        this.fileType = 'pdf';
      } else if (file.type.startsWith('image/')) {
        this.fileType = 'images';
      }
    }
    console.log(files);
  }


  openUrlModal() {

  }


  onDragOver(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    // Add a class to change the style when dragging over
    const uploadContainer = event.currentTarget as HTMLElement;
    uploadContainer.classList.add('drag-over');
  }

  onDragLeave(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    // Remove the class when dragging leaves
    const uploadContainer = event.currentTarget as HTMLElement;
    uploadContainer.classList.remove('drag-over');
  }

  onDrop(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    // Remove the class when file is dropped
    const uploadContainer = event.currentTarget as HTMLElement;
    uploadContainer.classList.remove('drag-over');

    if (event.dataTransfer?.files.length) {
      this.handleFiles(event.dataTransfer.files);
    }
  }


  handleFiles(files: FileList) {
    if (files.length > 0) {
      const file = files[0];
      if (file.type === 'application/pdf') {
        this.fileType = 'pdf';
      } else if (file.type.startsWith('image/')) {
        this.fileType = 'images';
      }
    }
  }

}
