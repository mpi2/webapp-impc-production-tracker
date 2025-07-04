import { Component, Inject, Optional, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormControl } from '@angular/forms';
import { debounceTime, tap, switchMap, finalize } from 'rxjs/operators';

import { Gene, GeneService } from 'src/app/core';
import { AttemptServiceService } from 'src/app/feature-modules/attempts/services/attempt-service.service';


export interface ESCellData {
  id: number;
  name: string;
  markerSymbol: string;
  pipeline: string;
  mutationSubtype: string;
  loxPScreen: string;
}

@Component({
    selector: 'app-es-cell-dialog-box',
    templateUrl: './es-cell-dialog-box.component.html',
    styleUrls: ['./es-cell-dialog-box.component.css'],
    standalone: false
})
export class EsCellDialogBoxComponent implements OnInit {
  action: string;
  searchGene = new FormControl();
  filteredGenes: any;
  isLoading = false;
  errorMsg: string;
  errorSymbol: string;
  geneSymbol: any;
  isLoadingEsCellName = false;
  esCells: ESCellData[];
  esCellSelected: ESCellData;
  displayedEsCellColumns = ['es_cell_name'];
  highlightedRows = [];
  searchTypeSelected = 'geneSymbol';
  searchTypes = [
    {
      name: 'geneSymbol',
      placeholder: 'Search by marker symbol'
    },
    {
      name: 'esCellName',
      placeholder: 'Search by ES Cell name'
    }
  ];
  markerSymbol = '';
  esCellName = '';

  constructor(
    private geneService: GeneService,
    private attemptService: AttemptServiceService,
    public dialogRef: MatDialogRef<EsCellDialogBoxComponent>,
    // @Optional() is used to prevent error if no data is passed
    @Optional() @Inject(MAT_DIALOG_DATA) public data: Gene)
  {
    this.geneSymbol = {...data};
    this.action = this.geneSymbol.action;
  }

  ngOnInit() {
    this.searchGene.valueChanges
      .pipe(
        debounceTime(500),
        tap(() => {
          this.errorMsg = '';
          this.filteredGenes = [];
          this.isLoading = true;
        }),
        switchMap(value => this.geneService.findGenesExternalDataBySymbol(value)
          .pipe(
            finalize(() => {
              this.isLoading = false;
            }),
          )
        )
      )
      .subscribe(data => {
        if (data.length === 0) {
          const key = 'Error';
          this.errorMsg = data[key];
          this.filteredGenes = [];
        } else {
          this.errorMsg = '';
          this.filteredGenes = data;
        }
      });

  }

  searchByGene() {
    if (this.markerSymbol === undefined || this.markerSymbol === '') {
      this.errorSymbol = 'Enter a valid gene symbol.';
      console.log('error => ', this.errorSymbol);
    } else {
      this.isLoadingEsCellName = true;
      this.attemptService.getEsCellsByGeneSymbol(this.markerSymbol).subscribe(data => {
        this.esCells = data;
        this.errorSymbol = '';
        this.isLoadingEsCellName = false;
      }, error => {
        this.errorSymbol = error;
        this.isLoadingEsCellName = false;
      });
    }
  }

  searchByEsCellName() {
    if (this.esCellName === undefined || this.esCellName === '') {
      this.errorSymbol = 'Enter a valid gene symbol.';
      console.log('error => ', this.errorSymbol);
    } else {
      this.isLoadingEsCellName = true;
      this.attemptService.getEsCellsByName(this.esCellName).subscribe(data => {
        this.esCells = [data];
        this.errorSymbol = '';
        this.isLoadingEsCellName = false;
      }, error => {
        this.errorSymbol = error;
        this.isLoadingEsCellName = false;
      });
    }
  }

  radioChange() {
    this.markerSymbol = '';
    this.esCells = [];
    this.esCellName = '';
  }

  highlightEsCell(row) {
    if (this.highlightedRows.indexOf(row) > -1) {
      this.highlightedRows.splice(this.highlightedRows.indexOf(row), 1);
    } else {
      this.highlightedRows = [];
      this.highlightedRows.push(row);
    }
  }

  esCellSelectedInfo(esCell: ESCellData) {
    this.esCellSelected = esCell;
  }

  doAction() {
    this.dialogRef.close({ event: this.action, data: this.esCellSelected });
  }

  closeDialog() {
    this.dialogRef.close({ event: 'Cancel' });
  }

}
