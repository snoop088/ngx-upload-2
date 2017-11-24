import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { NgFileDropDirective } from './directives/ng-file-drop.directive';
import { NgFileSelectDirective } from './directives/ng-file-select.directive';

export * from './classes/interfaces';
export * from './classes/ngx-uploader.class';
export * from './directives/ng-file-drop.directive';
export * from './directives/ng-file-select.directive';
export * from './sample.service';
@NgModule({
  declarations: [
    NgFileSelectDirective,
    NgFileDropDirective
  ],
  exports: [
    NgFileSelectDirective,
    NgFileDropDirective
  ]
})
export class NgUploaderModule {}
