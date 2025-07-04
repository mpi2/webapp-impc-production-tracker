import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';

import { ConfigurationData, ConfigurationDataService, LoggedUserService, GeneService, Gene } from 'src/app/core';
import { NamedValue } from 'src/app/core/model/common/named-value';
import { User } from 'src/app/core/model/user/user';
import { InstitutesConsortium, IntentionByGene, MutationCategorization } from 'src/app/model';
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
            state('collapsed', style({ height: '0px', minHeight: '0' })),
            state('expanded', style({ height: '*' })),
            transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
        ]),
    ],
    standalone: false
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
  projectCreationForm: FormGroup;
  loggedUser: User;

  privacies: NamedValue[];
  allMutationCategorizations: NamedValue[];
  molecularMutationTypes: NamedValue[];

  constructor(
    private router: Router,
    private configurationDataService: ConfigurationDataService,
    private projectService: ProjectService,
    public dialog: MatDialog,
    private fb: FormBuilder
  ) { }

  ngOnInit(): void {
    this.loadConfigurationData();
    this.projectCreationReactiveForm();
  }

  projectCreationReactiveForm() {
    this.projectCreationForm = this.fb.group({
      comment: [''],
      consortiaNames: [''],
      planDetails:[''],
      privacyName: ['', Validators.required],
      projectIntentions: [''],
      recovery: [false]
    });
  }

  loadConfigurationData() {
    this.configurationDataService.getConfigurationData().subscribe(data => {
      this.configurationData = data;
      this.privacies = this.configurationData.privacies.map(x => ({ name: x }));
      this.allMutationCategorizations = this.configurationData.mutationCategorizations.map(x => ({ name: x }));
      this.molecularMutationTypes = this.configurationData.molecularMutationTypes.map(x => ({ name: x }));
    }, error => {
      this.error = error;
    });
  }

  createProject() {
    this.projectCreation = Object.assign(this.projectCreation, this.projectCreationForm.value);

    this.projectCreation.consortia = new Array<InstitutesConsortium>();
    this.projectCreationForm.get('consortiaNames').value.consortiumName.forEach(name => {
      const consortium = new InstitutesConsortium();
      consortium.consortiumName = name;
      this.projectCreation.consortia.push(consortium);
    });

    this.projectCreation.projectIntentions = new Array<ProjectIntention>();
    this.projectCreationForm.get('projectIntentions').value.intentions.forEach(element => {
      const intention = new ProjectIntention();
      intention.molecularMutationTypeName = element.molecularMutationType;

      const gene = new Gene();
      gene.symbol = element.geneSymbol;
      const geneIntention = new IntentionByGene();
      geneIntention.gene = gene;
      intention.intentionByGene = geneIntention;

      intention.mutationCategorizations = new Array<MutationCategorization>();
      for(const x of element.mutationCategorizations) {
        const mutationCategorization = new MutationCategorization();
        mutationCategorization.name = x;
        intention.mutationCategorizations.push(mutationCategorization);
      }
      this.projectCreation.projectIntentions.push(intention);
    });

    this.loading = true;
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
