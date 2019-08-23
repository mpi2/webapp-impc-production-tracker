import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-expandable-content',
  templateUrl: './expandable-content.component.html',
  styleUrls: ['./expandable-content.component.css']
})
export class ExpandableContentComponent implements OnInit {

  @Input() content: string;

  private title: string;

  private readonly TITLE_LENGTH_LIMIT = 35;

  constructor() { }

  ngOnInit() {
    this.title = this.getTruncatedTitle(this.content);
  }

  private getTruncatedTitle(text: string): string {
    return text.substr(0, this.TITLE_LENGTH_LIMIT) + " ...";
  }
}
