import { Component, OnInit, Input } from '@angular/core';

@Component({
    selector: 'app-expandable-content',
    templateUrl: './expandable-content.component.html',
    styleUrls: ['./expandable-content.component.css'],
    standalone: false
})
export class ExpandableContentComponent {

  @Input() title: string;
  @Input() content: string;

  private readonly TITLE_LENGTH_LIMIT = 35;

  private getTruncatedTitle(text: string): string {
    return text.substr(0, this.TITLE_LENGTH_LIMIT) + ' ...';
  }

}
