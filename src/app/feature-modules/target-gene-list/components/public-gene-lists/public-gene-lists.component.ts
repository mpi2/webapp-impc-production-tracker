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
  styleUrls: ['./public-gene-lists.component.css']
})
export class PublicGeneListsComponent implements OnInit {
  dataSource: GeneListRecord[] = [];

  isLoading = false;
  error;

  sort: Sort = { property: 'id', direction: 'ASC' };
  page: Page = { number: 0, size: 20, sorts: [this.sort] };

  geneListDescriptions: GeneListDescription[] = [];

  currentConsortium: string;

  @ViewChild(MatPaginator) paginator: MatPaginator;

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

  private clearDataSet() {
    this.dataSource = [];
  }

  private extractDataFromServerResponse(data) {
    if (data) {
      /* tslint:disable:no-string-literal */
      if (data['_embedded']) {
        this.dataSource = data['_embedded'].records;
        this.page = data['page'];
        /* tslint:enable:no-string-literal */

      }
    }
  }

  public getGenesSymbols(geneListRecord: GeneListRecord): string[] {
    return geneListRecord.genes.map(x => x.symbol);
  }

  public onPaginatorChanged(paginator: MatPaginator) {
    this.page.number = paginator.pageIndex;
    this.page.size = paginator.pageSize;
    this.getPage(this.page);
  }

  private resetPage() {
    this.page.number = 0;
    if (this.paginator) {
      this.paginator.pageIndex = 0;
    }
  }

}
