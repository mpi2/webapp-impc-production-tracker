import { Component, Input, OnInit, forwardRef } from '@angular/core';
import { ControlValueAccessor, FormGroup, FormBuilder, Validators, Validator,
  AbstractControl, ValidationErrors, NG_VALUE_ACCESSOR, NG_VALIDATORS } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { ConfigurationDataService, ConfigurationData, LoggedUserService } from 'src/app/core';
import { NamedValue } from 'src/app/core/model/common/named-value';
import { ChangeResponse } from 'src/app/core/model/history/change-response';
import { PhenotypingStartingPoint } from 'src/app/feature-modules/attempts/model/phenotyping/phenotyping_starting_point';
// eslint-disable-next-line max-len
import { EsCellAlleleModificationStartingPoint } from 'src/app/feature-modules/attempts/model/production/es-cell-allele-modification/starting-point/es-cell-allele-modification-starting-point';
import { CrisprAlleleModificationStartingPoint } from 'src/app/feature-modules/attempts/model/production/crispr-allele-modification/starting-point/crispr-allele-modification-starting-point';
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
  @Input() queryParams: any;

  planTypes: NamedValue[];
  filteredAttemptTypesByPlanType: NamedValue[] = [];
  workUnits: NamedValue[];
  filteredWorkGroupsByWorkUnit: NamedValue[] = [];
  filteredFundersByWorkGroup: NamedValue[] = [];
  workGroupsByWorkGroup = new Map<string, NamedValue[]>();
  attemptTypesByPlanTypes = new Map<string, NamedValue[]>();
  fundersByWorkGroups = new Map<string, NamedValue[]>();
  nucleaseTypes: NamedValue[];
  nucleaseClasses: NamedValue[];

  preSelectedPlanType: string;
  preSelectedAttemptType: string;
  originalProductionAttemptType: string;
  originalProductionWorkUnit: string;
  tpn: string;
  error;
  loading = false;
  planCreation = true;
  esCellAlleleModType = false;
  esCellType = false;
  plan: Plan = new Plan();
  showAllElementsInLists = false;
  configurationData: ConfigurationData;
  loggedUser: User;
  nucleases: Nuclease[];
  startingPoints: ProductionOutcomeSummary[];
  selectType: boolean;
  planCreationForm: FormGroup;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private loggedUserService: LoggedUserService,
    private configurationDataService: ConfigurationDataService,
    private projectService: ProjectService,
    private planService: PlanService
  ) { }

  ngOnInit(): void {
    if (!this.projectCreation) {
      this.tpn = this.route.snapshot.params.id;
      this.plan.tpn = this.tpn;
      this.projectService.getFirstPlan(this.tpn).subscribe(data => {
        this.originalProductionAttemptType = data.attemptTypeName;
        this.originalProductionWorkUnit = data.workUnitName;
        this.loadConfigurationData();
        this.loadOutcomesSummaries(this.tpn);
      }, error => {
        this.error = error;
      });
    } else {
      this.loadConfigurationData();
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
    if (e.value === 'es cell allele modification') {
      this.esCellAlleleModType = true;
    } else {
      this.esCellAlleleModType = false;
    }
    if (e.value === 'es cell') {
      this.esCellType = true;
    } else {
      this.esCellType = false;
    }
  }

  onPlanTypeSelected(e) {
    this.handlePlanTypeSelected(e.value);
  }

  onStartingPointChanged(e) {
    if (this.planCreationForm.get('attemptTypeName').value === 'es cell allele modification') {
      this.plan.esCellAlleleModificationStartingPoint = new EsCellAlleleModificationStartingPoint();
      this.plan.esCellAlleleModificationStartingPoint.outcomeTpo = e.value;
    }

    if (this.planCreationForm.get('attemptTypeName').value === 'crispr allele modification') {
      this.plan.crisprAlleleModificationStartingPoint = new CrisprAlleleModificationStartingPoint();
      this.plan.crisprAlleleModificationStartingPoint.outcomeTpo = e.value;
    }
    if (this.preSelectedPlanType === 'phenotyping') {
      this.plan.phenotypingStartingPoint = new PhenotypingStartingPoint();
      this.plan.phenotypingStartingPoint.outcomeTpo = e.value;
    }
  }

  create() {
    this.plan = Object.assign(this.plan, this.planCreationForm.value);

    if (this.plan.typeName === 'crispr') {
      this.plan.crisprAttempt.nucleases.forEach(x => this.setIdNull(x));
    }

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

  private getAttemptTypeFromUrl(): string {
    const queryParams = this.route.snapshot.queryParams;
    return queryParams.attemptType;
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

  private getValidatedPreSelectedAttemptType(validAttemptTypes: Map<string, NamedValue[]>, selectedValue) {
    if (selectedValue) {
      if (validAttemptTypes.get('production').filter(x => x.name === selectedValue).length === 0) {
        this.error = 'Plan type "' + selectedValue + '" is not valid. The valid options are: ' +
                            validAttemptTypes.get('production').map(x => x.name);
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
                                                      .filter(t => !(t.name === 'es cell allele modification' || t.name === 'crispr allele modification' || t.name === 'breeding'));
      this.attemptTypesByPlanTypes.set('production', prod);
      this.handleAttemptTypeSelected(null, this.attemptTypesByPlanTypes);
    }
  }

  private setAttemptTypesForPlanCreation() {
    if (this.planCreation) {
      this.preSelectedAttemptType = this.getValidatedPreSelectedAttemptType(this.attemptTypesByPlanTypes, this.getAttemptTypeFromUrl());
      let prod = this.attemptTypesByPlanTypes.get('production');
      if (this.preSelectedAttemptType) {
        prod = prod.filter(x => x.name === this.preSelectedAttemptType);
      } else {
        if (this.originalProductionAttemptType === 'crispr') {
          prod = this.attemptTypesByPlanTypes.get('production').filter(t => !(t.name === 'es cell'
                                                      || t.name === 'es cell allele modification' || t.name === 'breeding'));
        } else if (this.originalProductionAttemptType === 'es cell') {
          prod = this.attemptTypesByPlanTypes.get('production').filter(t => !(t.name === 'crispr'
                                                      || t.name === 'crispr allele modification' || t.name === 'haplo-essential crispr' || t.name === 'breeding'));
        }
      }
      this.attemptTypesByPlanTypes.set('production', prod);
      this.handleAttemptTypeSelected(this.preSelectedAttemptType, this.attemptTypesByPlanTypes);
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
    this.filteredAttemptTypesByPlanType = this.attemptTypesByPlanTypes.get(planType);
  }

  private handleAttemptTypeSelected(attemptType: string, types: Map<string, NamedValue[]>) {
    if (attemptType) {
      this.planCreationForm.get('attemptTypeName').patchValue(attemptType);
      this.selectType = false;
    } else {
      this.selectType = true;
    }
    this.filteredAttemptTypesByPlanType = types.get(attemptType);
  }
}
