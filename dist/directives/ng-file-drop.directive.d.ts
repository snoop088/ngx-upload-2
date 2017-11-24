import { ElementRef, EventEmitter, OnInit, OnDestroy } from '@angular/core';
import { UploadOutput, UploadInput, UploaderOptions } from '../classes/interfaces';
import { NgUploaderService } from '../classes/ngx-uploader.class';
import { Subscription } from 'rxjs/Subscription';
export declare class NgFileDropDirective implements OnInit, OnDestroy {
    elementRef: ElementRef;
    options: UploaderOptions;
    uploadInput: EventEmitter<UploadInput>;
    uploadOutput: EventEmitter<UploadOutput>;
    upload: NgUploaderService;
    el: HTMLInputElement;
    _sub: Subscription[];
    constructor(elementRef: ElementRef);
    ngOnInit(): void;
    ngOnDestroy(): void;
    stopEvent: (e: Event) => void;
    onDrop(e: any): void;
    onDragOver(e: Event): void;
    onDragLeave(e: Event): void;
}
