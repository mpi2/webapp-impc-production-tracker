import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CrisprAttempt } from '../model/crispr/crispr-attempt';

@Injectable({
  providedIn: 'root'
})
export class AttemptServiceService {

  constructor(private http: HttpClient) { }

  /**
   * Gets an attempt using a provided url.
   * @param url Url to get the attempt.
   */
  getAttemptByUrl(url: string) {
    return this.http.get<CrisprAttempt>(url);
  }
}
