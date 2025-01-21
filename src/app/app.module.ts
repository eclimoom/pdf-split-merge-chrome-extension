import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FileUploadComponent } from './features/file-upload/file-upload.component';
import { HomeComponent } from './features/home/home.component';
import { FileSizePipe } from './pipes/file-size.pipe';
import {NgxSortableModule} from "ngx-sortable";
import { FileCanvasComponent } from './features/file-canvas/file-canvas.component';

@NgModule({
  declarations: [
    AppComponent,
    FileUploadComponent,
    HomeComponent,
    FileSizePipe,
    FileCanvasComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    NgxSortableModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
