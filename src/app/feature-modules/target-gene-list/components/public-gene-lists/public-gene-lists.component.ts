import { Component, OnInit } from '@angular/core';
import { GeneListDescription } from 'src/app/model/bio/target_gene_list/gene-list-description';
import { TargetGeneListService } from '../../services/target-gene-list.service';

@Component({
  selector: 'app-public-gene-lists',
  templateUrl: './public-gene-lists.component.html',
  styleUrls: ['./public-gene-lists.component.css']
})
export class PublicGeneListsComponent implements OnInit {
  isLoading = false;
  error;

  geneListDescriptions: GeneListDescription[] = [];

  selectedConsortium: string;

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
    console.log(consortiumName);
    this.selectedConsortium = consortiumName;
  }

}
