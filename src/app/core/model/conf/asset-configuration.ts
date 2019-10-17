export class AssetConfiguration {

  appServerUrl: string;
  baseUrl: string;
  constructor(configuration) {
    if (configuration) {
      this.appServerUrl = configuration.appServerUrl;
      this.baseUrl = configuration.baseUrl;
    }
  }
}
