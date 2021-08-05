import { Component, Input, OnInit, forwardRef } from '@angular/core';
import { ControlValueAccessor, FormGroup, FormBuilder, Validators, Validator,
  AbstractControl, ValidationErrors, NG_VALUE_ACCESSOR, NG_VALIDATORS } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { ConfigurationDataService, ConfigurationData, LoggedUserService } from 'src/app/core';
import { NamedValue } from 'src/app/core/model/common/named-value';
import { ChangeResponse } from 'src/app/core/model/history/change-response';
import { PhenotypingStartingPoint } from 'src/app/feature-modules/attempts/model/phenotyping/phenotyping_starting_point';
import { CreAlleleModificationStartingPoint } from
        'src/app/feature-modules/attempts/model/production/cre-allele-modification/starting-point/cre-allele-modification-starting-point';
import { ProjectService } from 'src/app/feature-modules/projects';
import { User } from 'src/app/core/model/user/user';
import { Plan } from 'src/app/feature-modules/plans/model/plan';
import { ProductionOutcomeSummary } from 'src/app/feature-modules/plans/model/outcomes/production-outcome-summary';
import { PlanService } from 'src/app/feature-modules/plans';
import { Nuclease } from 'src/app/feature-modules/attempts/model/production/crispr/nuclease';


@Component({
  selector: 'app-plan-creation',
  templateUrl: './plan-creation.component.html',
  styleUrls: ['./plan-creation.component.css'],
  providers: [
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => PlanCreationComponent),
      multi: true
    },
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => PlanCreationComponent),
      multi: true
    }
  ]
})
export class PlanCreationComponent implements OnInit, ControlValueAccessor, Validator {
  @Input() projectCreation: boolean;
  @Input() firstAttemptType: string;

  tpn: string;
  error;
  loading = false;
  planCreation = true;
  creAlleleMod = false;

  plan: Plan = new Plan();
  showAllElementsInLists = false;

  configurationData: ConfigurationData;
  loggedUser: User;

  planTypes: NamedValue[];
  filteredAttemptTypesByPlanType: NamedValue[] = [];
  workUnits: NamedValue[];
  filteredWorkGroupsByWorkUnit: NamedValue[] = [];
  filteredFundersByWorkGroup: NamedValue[] = [];

  startingPoints: ProductionOutcomeSummary[];

  workGroupsByWorkGroup = new Map<string, NamedValue[]>();
  attemptTypesByPlanTypes = new Map<string, NamedValue[]>();
  fundersByWorkGroups = new Map<string, NamedValue[]>();

  preSelectedPlanType: string;

  nucleases: Nuclease[];

  nucleaseTypes: NamedValue[];
  nucleaseClasses: NamedValue[];

  planCreationForm: FormGroup;
  selectType: boolean;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private loggedUserService: LoggedUserService,
    private configurationDataService: ConfigurationDataService,
    private projectService: ProjectService,
    private planService: PlanService
  ) {
    this.loadConfigurationData();
  }

  ngOnInit(): void {
    if (!this.projectCreation) {
      this.tpn = this.route.snapshot.params.id;
      this.plan.tpn = this.tpn;
      this.loadOutcomesSummaries(this.tpn);
    } else {
      this.planCreation = false;
    }
    this.planCreationReactiveForm();
  }

  planCreationReactiveForm() {
    this.planCreationForm = this.fb.group({
      typeName: ['', Validators.required],
      attemptTypeName: ['', Validators.required],
      workUnitName: ['', Validators.required],
      workGroupName: ['', Validators.required],
      funderNames: [[]],
      comment: ['']
    });
  }

  onWorkUnitChanged(e) {
    this.filteredWorkGroupsByWorkUnit = this.workGroupsByWorkGroup.get(e.value);
    this.filteredFundersByWorkGroup = [];
  }

  onWorkGroupChanged(e) {
    this.filteredFundersByWorkGroup = this.fundersByWorkGroups.get(e.value);
  }

  onAttemptTypeSelected(e) {
    if (e.value === 'cre allele modification') {
      this.creAlleleMod = true;
    } else {
      this.creAlleleMod = false;
    }
  }

  onPlanTypeSelected(e) {
    this.handlePlanTypeSelected(e.value);
  }

  onStartingPointChanged(e) {
    if (this.planCreationForm.get('attemptTypeName').value === 'cre allele modification') {
      this.plan.creAlleleModificationStartingPoint = new CreAlleleModificationStartingPoint();
      this.plan.creAlleleModificationStartingPoint.outcomeTpo = e.value;
     }
    else if (this.planCreationForm.get('attemptTypeName').value === 'phenotyping') {
      this.plan.phenotypingStartingPoint = new PhenotypingStartingPoint();
      this.plan.phenotypingStartingPoint.outcomeTpo = e.value;
    }
  }

  create() {
    this.plan = Object.assign(this.plan, this.planCreationForm.value);

    if (this.plan.typeName === 'crispr') {
      this.plan.crisprAttempt.nucleases.forEach(x => this.setIdNull(x));
    }

    console.log('plan after: ', this.plan);
    this.loading = true;
    this.planService.createPlan(this.plan).subscribe((changeResponse: ChangeResponse) => {
      this.loading = false;
      // eslint-disable-next-line no-underscore-dangle
      const link: string = changeResponse._links.self.href;
      const pin = link.substring(link.lastIndexOf('/') + 1);
      this.router.navigate(['/projects/' + this.tpn + '/plan/' + pin]);
    }, error => {
      this.error = error;
      this.loading = false;
    });
  }

  writeValue(obj: any): void {
    if (obj) {
      this.planCreationForm.setValue(obj, { emitEvent: false });
    }
  }

  onTouched = () => void {};
  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  // Disable or enable the form control
  setDisabledState?(isDisabled: boolean): void {
    if (isDisabled) {
      this.planCreationForm.disable();
    } else {
      this.planCreationForm.enable();
    }
  }

  // Received a callback, when ever our form value changes it reports the new value to the parent form
  registerOnChange(fn: any): void {
    this.planCreationForm.valueChanges.subscribe(fn);
  }

  validate(c: AbstractControl): ValidationErrors | null {
    return this.planCreationForm.valid ? null : { invalidForm: {valid: false, message: 'planCreationForm fields are invalid'} };
  }

  private setIdNull(object) {
    object.id = null;
  }

  private getPlanTypeFromUrl(): string {
    const queryParams = this.route.snapshot.queryParams;
    return queryParams.planType;
  }

  private getValidatedPreSelectedPlanType(validPlanTypes: NamedValue[], selectedValue) {
    if (selectedValue) {
      if (validPlanTypes.filter(x => x.name === selectedValue).length === 0) {
        this.error = 'Plan type ' + selectedValue + ' is not valid. The valid options are: ' + validPlanTypes.map(x => x.name);
        return null;
      } else {
        return selectedValue;
      }
    }
  }

  private loadConfigurationData() {
    this.configurationDataService.getConfigurationData().subscribe(data => {
      this.configurationData = data;
      this.planTypes = this.configurationData.planTypes.map(x => ({ name: x }));
      this.workUnits = this.configurationData.workUnits.map(x => ({ name: x }));
      this.nucleaseTypes = this.configurationData.nucleaseTypes.map(x => ({ name: x }));
      this.nucleaseClasses = this.configurationData.nucleaseClasses.map(x => ({ name: x }));

      Object.keys(this.configurationData.workGroupsByWorkUnits).map(key => {
        const list = this.configurationData.workGroupsByWorkUnits[key];
        this.workGroupsByWorkGroup.set(key, list.map(x => ({ name: x })));
      });

      Object.keys(this.configurationData.attemptTypesByPlanTypes).map(key => {
        const list = this.configurationData.attemptTypesByPlanTypes[key];
        this.attemptTypesByPlanTypes.set(key, list.map(x => ({ name: x })));
      });

      Object.keys(this.configurationData.fundersByWorkGroups).map(key => {
        const list = this.configurationData.fundersByWorkGroups[key];
        this.fundersByWorkGroups.set(key, list.map(x => ({ name: x })));
      });

      setTimeout(()=>{ // this will make the execution after the above boolean has changed
        this.filterLists();
        this.setPredefinedValues();
      },0);

    }, error => {
      this.error = error;
    });
  }

  private filterLists() {
    this.loggedUserService.getLoggerUser().subscribe(data => {
      this.loggedUser = data;
      this.showAllElementsInLists = data.isAdmin;
      if (!this.showAllElementsInLists) {
        this.workUnits = this.loggedUser.rolesWorkUnits.map(x => ({ name: x.workUnitName }));
      }

    }, error => {
      this.error = error;
    });
  }

  private setPredefinedValues() {
    if (this.projectCreation) {
      this.preSelectedPlanType = 'production';
      this.setAttemptTypesForProjectCreation();
    } else {
      this.preSelectedPlanType = this.getValidatedPreSelectedPlanType(this.planTypes, this.getPlanTypeFromUrl());
      this.setAttemptTypesForPlanCreation();
    }
    if (this.preSelectedPlanType) {
      this.planTypes = this.planTypes.filter(x => x.name === this.preSelectedPlanType);
      this.handlePlanTypeSelected(this.preSelectedPlanType);
    }
  }

  private setAttemptTypesForProjectCreation() {
    if (this.projectCreation) {
      this.attemptTypesByPlanTypes.delete('phenotyping');
      const prod = this.attemptTypesByPlanTypes.get('production')
                                                      .filter(t => !(t.name === 'cre allele modification' || t.name === 'breeding'));
      this.attemptTypesByPlanTypes.set('production', prod);
    }
  }

  private setAttemptTypesForPlanCreation() {
    if (this.planCreation) {
      const prod = this.attemptTypesByPlanTypes.get('production')
                                                      .filter(t => !(t.name === 'breeding'));
      this.attemptTypesByPlanTypes.set('production', prod);
    }
  }

  private loadOutcomesSummaries(tpn: string) {
    this.projectService.getProductionOutcomesSummariesByProject(tpn).subscribe(data => {
      this.startingPoints = data;
    }, error => {
      this.error = error;
    });
  }

  private handlePlanTypeSelected(planType: string) {
    if (planType) {
      this.planCreationForm.get('typeName').patchValue(planType);
      this.selectType = false;
    } else {
      this.selectType = true;
    }

    if (planType === 'phenotyping') {
      // this.plan.phenotypingStartingPoint = new PhenotypingStartingPoint();
    }
    if (planType === 'crispr') {

    }
    if (planType === 'es cell') {

    }
    this.filteredAttemptTypesByPlanType = this.attemptTypesByPlanTypes.get(planType);
  }

}
