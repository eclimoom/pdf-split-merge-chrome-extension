import {Component} from '@angular/core';
import * as pdfjs from 'pdfjs-dist';
import pdfjsWorker from 'pdfjs-dist/build/pdf.worker.entry.js';
import {PDFDocumentProxy} from "pdfjs-dist/types/src/display/api";
import {PDFDocument} from 'pdf-lib';


pdfjs.GlobalWorkerOptions.workerSrc = pdfjsWorker;

@Component({
  selector: 'app-file-upload',
  templateUrl: './file-upload.component.html',
  styleUrls: ['./file-upload.component.scss']
})
export class FileUploadComponent {
  fileType: string = '';
  files: File[] = [];
  splitList: any[] = [];

  async onFileSelected(files: any) {
    if (!files[0]) return;

    if (files.length > 0) {
      const file = files[0];
      if (file.type === 'application/pdf') {
        this.fileType = 'pdf';
      } else if (file.type.startsWith('image/')) {
        this.fileType = 'images';
      }
    }
    this.files = this.files.concat([ ...files]);


    // 遍历文件
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      console.log('file', file);
      const arrayBuffer = await file.arrayBuffer();
      const splitFiles = await this.splitPdf(arrayBuffer);

      const name = file.name.replace('.pdf', '');
      splitFiles.forEach((pdf, index) => {
        const newFile = {
          name: `${name}_${pdf.pageNumber}.pdf`,
          // size
          size: pdf.pdfBytes.byteLength,
          type: 'application/pdf',
          // type
        };

        const blob = new Blob([pdf.pdfBytes], {type: newFile.type});
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = newFile.name;
        link.click();
        this.splitList.push(newFile);
      });
    }
  }

  // 分割pdf
// Function to split PDF
  async splitPdf(pdfBytes: Uint8Array | ArrayBuffer) {
    const originalPdf = await PDFDocument.load(pdfBytes);
    const numPages = originalPdf.getPageCount();
    const splitFiles = [];
    for (let i = 0; i < numPages; i++) {
      // Create a new PDF for each page
      const pdfDoc = await PDFDocument.create();
      const [page] = await pdfDoc.copyPages(originalPdf, [i]);
      pdfDoc.addPage(page);
      // Serialize the PDF to bytes
      const pdfBytes = await pdfDoc.save();
      splitFiles.push({
        pageNumber: i + 1,
        pdfBytes,
      });
    }

    return splitFiles;
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
      this.onFileSelected(event.dataTransfer?.files).then();
    }
  }

  removeFile(file: File) {
    console.log('Remove file', file);
    this.files = [...this.files].filter(f => f !== file);

    if(this.files.length === 0){
      this.fileType = '';
      this.splitList = [];
    }
  }

  handleUpload(event: any) {
    const files = event.target.files;
    this.onFileSelected(files).then();
  }
}
