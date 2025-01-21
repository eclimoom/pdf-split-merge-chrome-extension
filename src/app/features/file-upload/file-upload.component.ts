import {Component} from '@angular/core';
import {PDFDocument} from 'pdf-lib';

import * as pdfjsLib from 'pdfjs-dist';


@Component({
  selector: 'app-file-upload',
  templateUrl: './file-upload.component.html',
  styleUrls: ['./file-upload.component.scss']
})
export class FileUploadComponent {
  fileType: string = '';
  files: File[] | any = [];
  splitList: any[] = [];

  // 模式
  isSplit: boolean = false;

  constructor() {
    // todo get pdf.worker.js from assets by environment
    pdfjsLib.GlobalWorkerOptions.workerSrc = '/assets/pdf.worker.js';
  }


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

    let list: any = [];
    for (const file of files) {
      console.log('file', file.type);
      if (file.type.includes('pdf')) {
        const arrayBuffer = await file.arrayBuffer();
        const splitFiles = await this.splitPdf(arrayBuffer);
        // console.log(splitFiles, 'splitFiles');
        splitFiles.forEach((pdf, index) => {
          const newFile = {
            name: `${file.name}_${pdf.pageNumber}.pdf`,
            size: pdf.pdfBytes.byteLength,
            type: 'application/pdf',
            base64: pdf.base64
          };
          list.push(newFile);
        });
      } else if (file.type.startsWith('image/')) {
        list.push(file);
      } else {
        alert('不支持的文件类型'+file.type);
      }

    }
    // 如果是pdf文件，直接分割


    this.files = this.files.concat(list);
    // console.log(this.files)

    // Start processing files recursively
    // await this.processFile(0, files);
  }

  async processFile(index: number, files: File[]) {
    if (index >= files.length) return;

    const file = files[index];
    console.log('file', file);
    const arrayBuffer = await file.arrayBuffer();
    const splitFiles = await this.splitPdf(arrayBuffer);

    const name = file.name.replace('.pdf', '');
    splitFiles.forEach((pdf, index) => {
      const newFile = {
        name: `${name}_${pdf.pageNumber}.pdf`,
        size: pdf.pdfBytes.byteLength,
        type: 'application/pdf',
      };

      const blob = new Blob([pdf.pdfBytes], {type: newFile.type});
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = newFile.name;
      link.click();
      this.splitList.push(newFile);
    });

    // Process the next file
    await this.processFile(index + 1, files);
  }

  // 分割pdf
// Function to split PDF
  async splitPdf(pdfBytes: Uint8Array | ArrayBuffer) {
    const originalPdf = await PDFDocument.load(pdfBytes, {ignoreEncryption: true});
    const numPages = originalPdf.getPageCount();
    const splitFiles = [];
    for (let i = 0; i < numPages; i++) {
      // Create a new PDF for each page
      const pdfDoc = await PDFDocument.create();
      let page: any;
      [page] = await pdfDoc.copyPages(originalPdf, [i]);
      pdfDoc.addPage(page);
      // console.log(`Page ${i + 1} content:`, page.doc);
      // Serialize the PDF to bytes
      const pdfBytes = await pdfDoc.save();
      console.log(`Page ${i + 1} extracted, size: ${pdfBytes.byteLength} bytes`);


      let pdf = await pdfjsLib.getDocument(pdfBytes).promise;

      const basePage = await pdf.getPage(1);
      const viewport = basePage.getViewport({scale: 1});
      //
      const canvas = document.createElement('canvas');
      canvas.width = viewport.width;
      canvas.height = viewport.height;
      const context = canvas.getContext('2d');

      if (context) {
        const renderContext = {
          canvasContext: context,
          viewport: viewport
        };
        await basePage.render(renderContext).promise;
      }
      let base64 = canvas.toDataURL('image/png');
      // console.log('base64====', base64);
      splitFiles.push({
        pageNumber: i + 1,
        pdfBytes,
        base64
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
    this.files = [...this.files].filter(f => f !== file);

    if (this.files.length === 0) {
      this.fileType = '';
      this.splitList = [];
    }
  }

  handleUpload(event: any) {
    const input = event.target as HTMLInputElement;
    const files = input.files;
    this.onFileSelected(files).then(() => {
      input.value = '';
    });
  }

  handleModel() {
    this.isSplit = !this.isSplit;
  }

  listOrderChanged($event: any) {
    console.log('listOrderChanged', $event);
  }
}
