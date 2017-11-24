import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { NgFileDropDirective } from './directives/ng-file-drop.directive';
import { NgFileSelectDirective } from './directives/ng-file-select.directive';

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
