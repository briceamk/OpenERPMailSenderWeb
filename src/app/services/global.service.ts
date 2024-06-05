import {HttpClient, HttpErrorResponse} from "@angular/common/http";
import {Observable, throwError} from "rxjs";
import {Injectable} from "@angular/core";
import {environment} from "../../environments/environment.production";

@Injectable({
  providedIn: 'root'
})
export class GlobalService {

  protected readonly server: string = environment.API_BASE_URL;

  constructor(protected _http: HttpClient) { }
  handleError(error: HttpErrorResponse): Observable<any> {
    let errorMessage: any;
    console.log(error)
    if(error.error instanceof ErrorEvent) {
      errorMessage = `A client error occurred - ${error.error}`;
    } else {
      if(error.error && error.error.error) {
        errorMessage = error.error.error;
      } else if(error.error && error.error.reason) {
        errorMessage = error.error.reason;
      } else  {
        errorMessage = `An error occurred - Error status ${error.status}`;
      }
    }
    return throwError(() => errorMessage);
  }
}
