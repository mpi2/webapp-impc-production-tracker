import { Target } from './gene-result';
import { ProjectByTargetGeneSummary } from '../..';

export class TargetListElement {
    id: number;
    note: string;
    targets: Target[];
    projects: ProjectByTargetGeneSummary[] = [];
}
