import { Component, OnInit } from '@angular/core';
import { FileLoaderService } from 'src/app/core/services/file-loader.service';
import { Gene, TargetListElement, ConsortiumList, ProjectByTargetGeneSummary } from 'src/app/model';
import { TargetGeneListService } from '../../services/target-gene-list.service';
import { Target } from 'src/app/model/bio/target_gene_list/gene-result';

export class TargetListTableRecord {
  consortiumName: string;
  targetListElement: TargetListElement;
}

@Component({
  selector: 'app-list-management',
  templateUrl: './list-management.component.html',
  styleUrls: ['./list-management.component.css']
})
export class ListManagementComponent implements OnInit {

  public dataSource: TargetListTableRecord[] = [];
  consortiumLists: ConsortiumList[];

  constructor(private fileLoaderService: FileLoaderService, private targetGeneListService: TargetGeneListService) { }

  ngOnInit() {
    this.targetGeneListService.getAll().subscribe(data => {
      /* tslint:disable:no-string-literal */
      const lists = data['_embedded'].listsByConsortium;
      /* tslint:enable:no-string-literal */

      this.consortiumLists = lists;
      this.getDataSource(this.consortiumLists);
    });
  }

  private getDataSource(consortiumLists: ConsortiumList[]) {
    if (consortiumLists) {
      consortiumLists.forEach(x => {
        const consortiumName = x.consortiumName;
        const list = x.list;
        if (list) {
          list.forEach(element => {
            const targetListTableRecord: TargetListTableRecord = new TargetListTableRecord();
            targetListTableRecord.consortiumName = consortiumName;
            targetListTableRecord.targetListElement = element;
            this.dataSource.push(targetListTableRecord);
          });
        }
      });
    }
  }

  changeLists(csvRecords) {
    const mappedData = this.buildDataSourceByCsvRecords(csvRecords);
    const consortiumLists = this.buildConsortiumLists(mappedData);
    this.consortiumLists = [...consortiumLists];
    this.getDataSource(this.consortiumLists);
  }

  buildDataSourceByCsvRecords(csvRecords): Map<string, TargetListElement[]> {
    const consortiaNames = this.fileLoaderService.getRecordsByColumn(csvRecords, 'consortium');
    const targets = this.fileLoaderService.getRecordsByColumn(csvRecords, 'target(s)');
    const notes = this.fileLoaderService.getRecordsByColumn(csvRecords, 'note');

    const mappedData: Map<string, TargetListElement[]> = new Map();
    targets.forEach((item, index) => {
      const consortiumName = consortiaNames[index];
      const geneSymbols = item.split(',');
      const note = notes[index];
      const targetListElement = this.buildTargetListElement(geneSymbols, note);

      if (mappedData.get(consortiumName)) {
        const consortiumData = mappedData.get(consortiumName);
        consortiumData.push(targetListElement);
      } else {
        mappedData.set(consortiumName, [targetListElement]);
      }
    });
    return mappedData;
  }

  buildTargetListElement(geneSymbols: string[], note) {
    const targetListElement: TargetListElement = new TargetListElement();
    const genes: Gene[] = [];
    if (geneSymbols) {
      geneSymbols.map(x => {
        const gene = new Gene();
        gene.symbol = x;
        genes.push(gene);
      });
    }
    const genesResults: Target[] = genes.map(x => ({gene: x}));
    targetListElement.targets = genesResults;
    targetListElement.note = note;
    return targetListElement;
  }

  buildConsortiumLists(mappedData: Map<string, TargetListElement[]>): ConsortiumList[] {
    const consortiumLists: ConsortiumList[] = [];
    mappedData.forEach((value, key) => {
      const consortiumList: ConsortiumList = new ConsortiumList();
      consortiumList.consortiumName = key;
      consortiumList.list = value;
      consortiumLists.push(consortiumList);
    });
    return consortiumLists;
  }

  public getGenesSymbols(targetListTableRecord: TargetListTableRecord): string[] {
    const targetsByRecord: Target[] = targetListTableRecord.targetListElement.targets;
    return targetsByRecord.map(x => x.gene.symbol);
  }

  updateLists() {
    console.log('to be implemented');
  }

}
