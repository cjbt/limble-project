import { Component } from '@angular/core';
import { UserMentionsService } from 'src/app/services/user-mentions/user-mentions.service';

@Component({
  selector: 'app-task-comment-form',
  templateUrl: './task-comment-form.component.html',
  styleUrls: ['./task-comment-form.component.css'],
})
export class TaskCommentFormComponent {
  static readonly USERS_DATA = [
    { userID: 1, name: 'Kevin' },
    { userID: 2, name: 'Jeff' },
    { userID: 3, name: 'Bryan' },
    { userID: 4, name: 'Gabbey' },
  ];

  constructor(private userMentionService: UserMentionsService) {
    userMentionService.initialize(TaskCommentFormComponent.USERS_DATA);
  }
}
