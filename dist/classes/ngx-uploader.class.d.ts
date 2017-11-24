import { EventEmitter } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { Subscription } from 'rxjs/Subscription';
import 'rxjs/add/operator/mergeMap';
import { UploadFile, UploadOutput, UploadInput } from './interfaces';
export declare function humanizeBytes(bytes: number): string;
export declare class NgUploaderService {
    queue: UploadFile[];
    serviceEvents: EventEmitter<UploadOutput>;
    uploadScheduler: Subject<{
        file: UploadFile;
        event: UploadInput;
    }>;
    subs: {
        id: string;
        sub: Subscription;
    }[];
    contentTypes: string[];
    allowFile: (file: UploadFile) => boolean;
    constructor(concurrency?: number, contentTypes?: string[], allowFile?: (file: any) => boolean);
    handleFiles(incomingFiles: FileList): void;
    initInputEvents(input: EventEmitter<UploadInput>): Subscription;
    startUpload(upload: {
        file: UploadFile;
        event: UploadInput;
    }): Observable<UploadOutput>;
    uploadFile(file: UploadFile, event: UploadInput): Observable<UploadOutput>;
    secondsToHuman(sec: number): string;
    generateId(): string;
    setContentTypes(contentTypes: string[]): void;
    allContentTypesAllowed(): boolean;
    isContentTypeAllowed(mimetype: string): boolean;
    makeUploadFile(file: File, index: number): UploadFile;
}
