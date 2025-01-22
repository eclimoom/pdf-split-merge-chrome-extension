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
  isSplit: boolean = true;
  showSpinner: boolean = false;

  constructor() {
    // todo get pdf.worker.js from assets by environment
    pdfjsLib.GlobalWorkerOptions.workerSrc = './assets/pdf.worker.js';
  }


  init() {
    this.files = [];
    this.splitList = [];
    this.fileType = '';
  }

  async onFileSelected(files: any) {
    if (!files[0]) return;

    this.showSpinner = true;
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
      const arrayBuffer = await file.arrayBuffer();
      if (file.type.includes('pdf')) {
        const splitFiles = await this.splitPdf(arrayBuffer);
        splitFiles.forEach((pdf, index) => {
          const newFile =  {
            name: `${file.name}_${pdf.pageNumber}.pdf`,
            size: pdf.pdfBytes.byteLength,
            type: 'application/pdf',
            base64: pdf.base64,
            arrayBuffer: () => pdf.pdfBytes
          };
          list.push(newFile);
        });
      } else if (file.type.startsWith('image/')) {
        // get image base64
        file.base64 = await this.readFileAsBase64(file);
        // console.log(file.base64)
        list.push(file);
      } else {
        alert('不支持的文件类型' + file.type);
      }
    }
    // 如果是pdf文件，直接分割
    this.showSpinner = false;

    this.files = this.files.concat(list);
    // console.log('files>>>>>>', this.files);
  }

  readFileAsBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        let base64 = reader.result as string;
        // to png
        if (file.type !== 'image/png') {
          const canvas = document.createElement('canvas');
          const img = new Image();
          img.src = base64;
          img.onload = () => {
            canvas.width = img.width;
            canvas.height = img.height;
            const ctx = canvas.getContext('2d');
            if (ctx) {
              ctx.drawImage(img, 0, 0);
              base64 = canvas.toDataURL('image/png');
              resolve(base64);
            } else {
              reject('canvas error');
            }
          };
        } else {
          resolve(base64);
        }
      };
      reader.onerror = error => reject(error);
      reader.readAsDataURL(file);
    });
  }

  async processFile(index: number, files: File[]) {
    if (index >= files.length) return;
    const file = files[index];
    const arrayBuffer = await file.arrayBuffer();
    const splitFiles = await this.splitPdf(arrayBuffer);

    const name = file.name.slice(0, file.name.lastIndexOf('.'));
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
      // console.log('pdfBytes>>>>>>11111', pdfBytes);
      // console.log(`Page ${i + 1} extracted, size: ${pdfBytes.byteLength} bytes`);


      let pdf = await pdfjsLib.getDocument(new Uint8Array(pdfBytes)).promise;

      const basePage = await pdf.getPage(1);
      const view = basePage.view;
      let originWidth = view[2] - view[0];
      const scale = 1122 / originWidth;
      const viewport = basePage.getViewport({scale});

      const canvas = document.createElement('canvas');
      canvas.width = Math.floor(viewport.width);
      canvas.height = Math.floor(viewport.height);
      const context = canvas.getContext('2d');

      if (context) {
        const renderContext = {
          canvasContext: context,
          viewport: viewport
        };
        await basePage.render(renderContext).promise;
      }
      let base64 = canvas.toDataURL('image/png');
      // console.log('base64========', pdfBytes, base64.length);
      splitFiles.push({
        pageNumber: i + 1,
        pdfBytes: new Uint8Array(await pdf.getData()),
        base64
      });
    }

    return splitFiles;
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


  listOrderChanged($event: any) {
    console.log('listOrderChanged', $event);
  }

  async splitPdfAll() {
    // Start processing files recursively
    await this.processFile(0, this.files);
  }

  async mergeFiles() {
    const pdfDoc = await PDFDocument.create();

    // 获取当前时间 MMDD_HHmm
    const firstName = this.files[0].name;
    const name = firstName.slice(0, firstName.lastIndexOf('.'))
    let fileName = `${name}_合并`;

    // const pdfjs = pdfjsLib.getDocument(this.files[0]);
    for (const file of this.files) {
      let pngImage = await pdfDoc.embedPng(file.base64);
      const pngDims = pngImage.scale(1);
      const page = pdfDoc.addPage();
      const pageWidth = page.getWidth();
      const pageHeight = page.getHeight();
      const aspectRatio = pngDims.width / pngDims.height;

      let width, height;
      if (pageWidth / aspectRatio <= pageHeight) {
        width = pageWidth;
        height = pageWidth / aspectRatio;
      } else {
        width = pageHeight * aspectRatio;
        height = pageHeight;
      }
      page.drawImage(pngImage, {
        x: 0,
        y: pageHeight - height,
        width: width,
        height: height,
      });
    }
    const mergedPdfBytes = await pdfDoc.save();
    const blob = new Blob([mergedPdfBytes], {type: 'application/pdf'});
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `${fileName}.pdf`;
    link.click();
  }


  handleModel(flag: boolean) {
    // this.init();
    this.isSplit = flag;
  }

  handleByModel() {

    if (this.isSplit) {
      this.splitPdfAll().then();
    } else {
      this.mergeFiles().then();
    }
  }
}
