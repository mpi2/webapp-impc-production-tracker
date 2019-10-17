import { Project } from '../../../core/model/bio/project';

export class SearchResult {
    input: string;
    project: Project;
    comment: string;
    searchResultComments: string[];
}
