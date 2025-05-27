import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-recent-success-stories',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './recent-success-stories.component.html',
  styleUrl: './recent-success-stories.component.css'
})


export class RecentSuccessStoriesComponent {

  @Input() stories: any[] = [];

get latestStories() {
  return this.stories.slice(0, 4);
}

}
