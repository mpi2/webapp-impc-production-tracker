import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-large-table-content',
  templateUrl: './large-table-content.component.html',
  styleUrls: ['./large-table-content.component.css']
})
export class LargeTableContentComponent implements OnInit {
  @Input() content: string;

  splittedCollection: string[];
  readonly LENGTH_LIMIT = 100;
  isContentLengthGreaterThanLimit: boolean;
  isContentACollection: boolean;

  constructor() { }

  ngOnInit() {
    this.isContentACollection = this.isTextACollection(this.content);
    if (this.isContentACollection) {
      this.splittedCollection = this.splitCollection(this.content);
    }
  }

  private splitCollection(collection: string): string[] {
    const patt = /\((.*?)(\)[,\]])/g;
    let res = this.getMatches(collection, patt, 1);

    return res;
  }

  private isTextACollection(text: string): boolean {
    const patt = /(\[)(.)*(\])/;
    return patt.test(text);
  }

  private getMatches(string, regex, index) {
    const matches = [];
    let match;
    while (match = regex.exec(string)) {
      matches.push(match[index]);
    }
    return matches;
  }

}
