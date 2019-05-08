import { MicroInjectionDetails } from './microInjectionDetails';
import { F1ColonyDetails } from './f1ColonyDetails';

export class ProductionPlanSummary {
    microInjectionDetails: MicroInjectionDetails = new MicroInjectionDetails();
    f1ColonyDetails: F1ColonyDetails = new F1ColonyDetails();
}