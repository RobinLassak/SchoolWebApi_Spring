import {DOCUMENT} from '@angular/common';
import {Inject, Injectable} from '@angular/core';
import {HttpClient, HttpResponse} from '@angular/common/http';
import {firstValueFrom, map, Observable} from 'rxjs';

@Injectable()
export class ApiService {
  private _apiUrl: string = null;

  constructor(@Inject(DOCUMENT) private _document: any, private _http: HttpClient) {

      //Poskladani api URL
      this._apiUrl = [
        _document.location.protocol,
        "//",
        _document.location.hostname,
        ":",
        _document.location.port,
        "/schoolapi"
      ].join('');
  }

  //Poskladani URL pro api requesty
  createUrl(path: string): string{
    if(!path){
      throw new Error("Nelze volat API bez zadane cesty")
    }
    if(path[0] != "/"){
      path = "/" + path
    }
    return this._apiUrl + path
  }
  //Convert Observable to Promise
  private toPromise<T>(observable: Observable<T>): Promise<T> {
    return firstValueFrom(observable);
  }

  //GET
  get<T>(path: string, options?: any): Promise<T>{
    let promise: Promise<T> = this.toPromise<T>(
      this._http.get<T>(this.createUrl(path))
    )
    return promise
  }
}
