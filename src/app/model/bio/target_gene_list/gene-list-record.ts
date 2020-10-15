import { Gene, ProjectByTargetGeneSummary } from 'src/app/model';

export class GeneListRecord {
    id: number;
    tmpId: number;
    note: string;
    recordTypes: string[];
    genes: Gene[];
    projects: ProjectByTargetGeneSummary[] = [];
}
