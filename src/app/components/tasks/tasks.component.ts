import { Component, OnDestroy } from '@angular/core';
import { UserMentionsService } from '../../services/user-mentions/user-mentions.service';
import { FormControl, FormGroup } from '@angular/forms';
import { Subscription } from 'rxjs';
import { User, Users } from 'src/app/models/user.model';

@Component({
  selector: 'app-tasks',
  templateUrl: './tasks.component.html',
  styleUrls: ['./tasks.component.css'],
})
export class TasksComponent implements OnDestroy {
  private commentChangeSubscription: Subscription = new Subscription();
  showUserList: boolean = false;
  userList: Users = [];
  inputIndex?: number;

  static readonly USERS = [
    { userID: 1, name: 'Kevin' },
    { userID: 2, name: 'Jeff' },
    { userID: 3, name: 'Bryan' },
    { userID: 4, name: 'Gabbey' },
  ];

  comments = [
    {
      text: 'This Task was assigned to Daryl Babb',
      id: 1,
      timestamp: 'System',
    },
    {
      text: 'Waiting on Parts',
      id: 2,
      timestamp: 'System',
    },
    {
      text: 'Waiting on Parts',
      id: 3,
      timestamp: 'System',
    },
  ];
  commentForm = new FormGroup({
    text: new FormControl(''),
  });

  constructor(private userMentionsService: UserMentionsService) {
    userMentionsService.initialize(TasksComponent.USERS);

    this.onCommentChanges();
  }

  onCommentSubmit() {
    const newComment = {
      id: this.comments.length + 1,
      text: this.commentForm.value.text ?? '',
      timestamp: 'System',
    };
    this.comments.push(newComment);
    this.commentForm.reset();
  }

  onCommentChanges() {
    this.commentForm.valueChanges.subscribe(({ text }) => {
      this.handleUserInput(text ?? '');
    });
  }

  handleClick(user: User) {
    const comment = this.commentForm.value.text!.split(' ');
    comment[this.inputIndex as number] = `@${user.name}`;
    this.commentForm.get('text')!.setValue(comment.join(' '));
    this.showUserList = false;
  }

  private handleUserInput(text: string) {
    const words = text.split(' ');
    this.showUserList = false;

    for (let i = 0; i < words.length; i++) {
      const word = words[i];
      if (word.startsWith('@')) {
        const inputAfterAtSymbol = word.substring(1);

        if (/^[a-z0-9]*$/i.test(inputAfterAtSymbol)) {
          this.showUserList = true;
          this.inputIndex = i;
          this.userList = this.userMentionsService.search(inputAfterAtSymbol);
        } else {
          this.showUserList = false;
          this.inputIndex = undefined;
          this.userList = [];
        }
      }
    }
  }

  ngOnDestroy(): void {
    if (this.commentChangeSubscription) {
      this.commentChangeSubscription.unsubscribe();
    }
  }
}
