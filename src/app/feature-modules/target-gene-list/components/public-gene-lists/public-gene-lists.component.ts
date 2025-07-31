import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { GeneListRecord } from 'src/app/model';
import { GeneListDescription } from 'src/app/model/bio/target_gene_list/gene-list-description';
import { Page } from 'src/app/model/page_structure/page';
import { Sort } from 'src/app/model/page_structure/sort';
import { TargetGeneListService } from '../../services/target-gene-list.service';

@Component({
    selector: 'app-public-gene-lists',
    templateUrl: './public-gene-lists.component.html',
    styleUrls: ['./public-gene-lists.component.css'],
    standalone: false
})
export class PublicGeneListsComponent implements OnInit {
  @ViewChild(MatPaginator) paginator: MatPaginator;

  dataSource: GeneListRecord[] = [];
  isLoading = false;
  isDownloading;
  error;

  sort: Sort = { property: 'id', direction: 'ASC' };
  // eslint-disable-next-line id-blacklist
  page: Page = { number: 0, size: 20, sorts: [this.sort] };

  geneListDescriptions: GeneListDescription[] = [];
  currentConsortium: string;

  constructor(private targetGeneListService: TargetGeneListService) { }

  ngOnInit(): void {
    this.loadGeneListsDescriptions();
  }

  loadGeneListsDescriptions() {
    this.targetGeneListService.getAllListsDescriptions().subscribe(
      data => {
        this.geneListDescriptions = data;
      },
      error => {
        this.error = error;
      });
  }

  consortiumClicked(consortiumName: string) {
    this.currentConsortium = consortiumName;
    this.getPage(this.page);
  }

  public getPage(page: Page) {
    this.isLoading = true;
    this.clearDataSet();
    if (this.currentConsortium) {
      this.targetGeneListService.getPublicListByConsortium(page, this.currentConsortium, null).subscribe(data => {
        this.isLoading = false;
        this.extractDataFromServerResponse(data);
      }, error => {
        this.isLoading = false;
        this.error = error;
      });
    }
  }

  public getGenesSymbols(geneListRecord: GeneListRecord): string[] {
    return geneListRecord.genes.map(x => x.symbol);
  }

  public onPaginatorChanged(paginator: MatPaginator) {
    // eslint-disable-next-line id-blacklist
    this.page.number = paginator.pageIndex;
    this.page.size = paginator.pageSize;
    this.getPage(this.page);
  }


  onDownloadClicked() {
    this.isDownloading = true;
    this.targetGeneListService.exportPublicRecordsCsv(this.currentConsortium, null)
      .subscribe(data => {
        this.download('gene_list_' + this.currentConsortium + '.csv', data);
        this.isDownloading = false;
      }, error => {
        console.error(error);
        this.isDownloading = false;
      });
  }

  download(filename, text) {
    const element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
    element.setAttribute('download', filename);
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  }

  private clearDataSet() {
    this.dataSource = [];
  }

  private extractDataFromServerResponse(data) {
    if (data) {
      if (data['_embedded']) {
        this.dataSource = data['_embedded'].records;
        this.page = data['page'];

      }
    }
  }

  private resetPage() {
    // eslint-disable-next-line id-blacklist
    this.page.number = 0;
    if (this.paginator) {
      this.paginator.pageIndex = 0;
    }
  }

}
