import { Gene, ProjectByTargetGeneSummary } from 'src/app/model';

export class GeneListRecord {
    id: number;
    note: string;
    genes: Gene[];
    projects: ProjectByTargetGeneSummary[] = [];
}
