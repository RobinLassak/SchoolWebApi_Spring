import {DOCUMENT} from '@angular/common';
import {Inject, Injectable} from '@angular/core';

@Injectable()
export class ApiService {
  private _apiUrl: string = null;

  constructor(@Inject(DOCUMENT) private _document: any) {
      this._apiUrl = [
        _document.location.protocol,
        "//",
        _document.location.hostname,
        ":",
        _document.location.port,
        "/schoolapi"
      ].join('');
  }
}
