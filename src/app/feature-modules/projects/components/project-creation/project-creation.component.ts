import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import { ConfigurationData, ConfigurationDataService, LoggedUserService, GeneService, Gene } from 'src/app/core';
import { NamedValue } from 'src/app/core/model/common/named-value';
import { User } from 'src/app/core/model/user/user';
import { InstitutesConsortium, MutationCategorization } from 'src/app/model';
import { ProjectService } from '../../services/project.service';
import { MatDialog } from '@angular/material/dialog';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { ProjectCreation } from '../../model/project-creation';
import { ChangeResponse } from 'src/app/core/model/history/change-response';
import { Plan } from 'src/app/feature-modules/plans/model/plan';
import { ProjectIntention } from '../../model/project-intention';

@Component({
  selector: 'app-project-creation',
  templateUrl: './project-creation.component.html',
  styleUrls: ['./project-creation.component.css'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class ProjectCreationComponent implements OnInit {
  error;
  loading = false;

  projectCreation: ProjectCreation = new ProjectCreation();
  plan: Plan = new Plan();
  projectIntention: ProjectIntention = new ProjectIntention();
  mutationCategorizations: MutationCategorization[] = [];
  showAllElementsInLists = false;

  configurationData: ConfigurationData;
  loggedUser: User;

  privacies: NamedValue[];
  allSpecies: NamedValue[];
  allMutationCategorizations: NamedValue[];
  molecularMutationTypes: NamedValue[];

  constructor(
    private router: Router,
    private configurationDataService: ConfigurationDataService,
    private projectService: ProjectService,
    public dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.loadConfigurationData();
  }

  loadConfigurationData() {
    this.configurationDataService.getConfigurationData().subscribe(data => {
      this.configurationData = data;
      this.privacies = this.configurationData.privacies.map(x => ({ name: x }));
      this.allSpecies = this.configurationData.species.map(x => ({ name: x }));
      this.allMutationCategorizations = this.configurationData.mutationCategorizations.map(x => ({ name: x }));
      this.molecularMutationTypes = this.configurationData.molecularMutationTypes.map(x => ({ name: x }));
    }, error => {
      this.error = error;
    });
  }

  addConsortiumInstitutes(): void {
    const institutesConsortium: InstitutesConsortium = new InstitutesConsortium();
    this.projectCreation.consortia.push(institutesConsortium);
  }

  onConsortiumChanged(e) {
  }

  onInstitutesChanged(e) {
  }

  create() {
    this.loading = true;
    // console.log('projectCreation => ' + JSON.stringify(this.projectCreation));

    this.projectService.createProject(this.projectCreation).subscribe((changeResponse: ChangeResponse) => {
      this.loading = false;
      // eslint-disable-next-line no-underscore-dangle
      const link: string = changeResponse._links.self.href;
      const tpn = link.substring(link.lastIndexOf('/') + 1);
      this.router.navigate(['/projects/' + tpn]);
    }, error => {
      this.error = error;
      this.loading = false;
    });
  }

}
