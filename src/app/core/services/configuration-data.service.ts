import { Injectable } from '@angular/core';
import { BasicDataService } from './basic-data.service';
import { ConfigurationData } from '../model/configuration-data';

/**
 * Class to keep information about configuration information in the application. Configuration information includes
 * data that is more or less static, like plan types, work units, work gropus, etc.
 */
@Injectable()
export class ConfigurationDataService {

    constructor(private basicDataService: BasicDataService) { }

    readonly CONFIGURATIONKEY = 'conf';

    writeConfiguration() {
        this.basicDataService.getConfiguration().subscribe(data => {
            if (data) {
                sessionStorage.setItem(this.CONFIGURATIONKEY, JSON.stringify(data));
            }
        });
    }

    getConfigurationInfo(): ConfigurationData {
        const configurationData: ConfigurationData = JSON.parse(sessionStorage.getItem(this.CONFIGURATIONKEY));
        return configurationData;
    }
}