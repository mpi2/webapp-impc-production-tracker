import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ConfigAssetLoaderService } from '../../../core/services/config-asset-loader.service';
import { Mutation } from '../model/outcomes/mutation';

@Injectable({
    providedIn: 'root'
})
export class MutationService {

    private apiServiceUrl;

    constructor(private http: HttpClient, private configAssetLoaderService: ConfigAssetLoaderService) {
        this.configAssetLoaderService.getConfig().then(data => this.apiServiceUrl = data.appServerUrl);
    }

    /**
     * Converts the characters "<" and ">" in html superscript tags
     * @param symbol Symbol in the mutation
     */
    formatAlleleSymbol(symbol: string) {
        let result = '';
        if (symbol) {
            const splited = symbol.split('');
            splited.forEach(x => {
                if (x === '<') {
                    result += '<sup>';
                } else if (x === '>') {
                    result += '</sup>';
                } else {
                    result += x;
                }
            });
        }

        return result;
    }

    getSuggestedSymbol(pin: string, mutation: Mutation) {
        return this.http.post(this.apiServiceUrl + '/api/plans/' + pin + '/outcomes/suggestedSymbol', mutation,  {responseType: 'text'});
    }

    updateMutation(mutation: Mutation) {
        return this.http.put<any>(
            this.apiServiceUrl + '/api/plans/' + mutation.pin + '/outcomes/' + mutation.tpo + '/mutations/' + mutation.min, mutation);
    }

    createMutation(mutation: Mutation) {
        return this.http.post<any>(
            this.apiServiceUrl + '/api/plans/' + mutation.pin + '/outcomes/' + mutation.tpo + '/mutations/' + mutation.min, mutation);
    }

}
