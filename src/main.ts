//import { enableProdMode, ReflectiveInjector } from '@angular/core';
import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';
import 'hammerjs';
// import { AssetConfiguration } from './app/core/model/conf/asset-configuration';
// import { ConfigAssetLoaderService } from './app/core/services/config-asset-loader.service';
if (environment.production) {
  enableProdMode();
}

platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.error(err));

// const configAssetLoaderService: ConfigAssetLoaderService = new ConfigAssetLoaderService();

/*
configAssetLoaderService.getConfig().then(config => {
  platformBrowserDynamic([ { provide: AssetConfiguration, useValue: config } ])
    .bootstrapModule(AppModule)
    .catch(err => console.log(err));
});

 */
