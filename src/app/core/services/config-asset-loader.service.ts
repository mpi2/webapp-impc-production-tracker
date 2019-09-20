import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { shareReplay } from 'rxjs/operators';

interface AssetConfiguration {
  appServerUrl: string;
}

@Injectable({
  providedIn: 'root'
})
export class ConfigAssetLoaderService {

  private readonly CONFIG_URL = 'assets/config/config.json';
  private configuration$: Observable<AssetConfiguration>;

  constructor(private http: HttpClient) {
  }

  public loadConfigurations(): any {
    console.log('A CONFIGURATION WAS CALLED!!!');
    
    if (!this.configuration$) {
      this.configuration$ = this.http.get<AssetConfiguration>(this.CONFIG_URL).pipe(
        shareReplay(1)
      );
    }
    console.log('the configuration:', this.configuration$);
    
    return this.configuration$;
  }
}
