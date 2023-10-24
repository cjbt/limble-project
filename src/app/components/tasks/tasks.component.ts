import { Component } from '@angular/core';
import { UserMentionsService } from '../../services/user-mentions/user-mentions.service';
import { User, Users } from 'src/app/models/user.model';

@Component({
  selector: 'app-tasks',
  templateUrl: './tasks.component.html',
  styleUrls: ['./tasks.component.css'],
})
export class TasksComponent {
  showUserList: boolean = false;
  userList: Users = [];
  inputIndex?: number;
  mentionedUsers: Users = [];
  systemMessages: string[] = [];

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
  ];

  constructor(private userMentionsService: UserMentionsService) {
    userMentionsService.initialize(TasksComponent.USERS);
  }

  handleCommentSubmission() {
    this.systemMessages = [];
    const input = document.getElementById('text')!;
    const words = input.textContent!.split(' ');
    const newTextArr = [];

    for (let word of words) {
      if (word.startsWith('@')) {
        newTextArr.push(`<strong>${word}</strong>`);
      } else {
        newTextArr.push(word);
      }
    }
    const newComment = {
      id: this.comments.length + 1,
      text: newTextArr.join(' '),
      timestamp: 'System',
    };
    this.comments.push(newComment);

    input.textContent = '';
    this.mentionedUsers.forEach((user) => {
      this.triggerNotification(user);
    });
    this.mentionedUsers = [];
  }

  onInput(event: any) {
    const text = event.target.textContent;
    const words = text.split(/\s+/);
    let atSymbolFound = false;

    for (let i = 0; i < words.length; i++) {
      const word = words[i];
      if (word.startsWith('@')) {
        const inputAfterAtSymbol = word.substring(1);
        atSymbolFound = true;

        if (/^[a-z0-9_-]*$/i.test(inputAfterAtSymbol)) {
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

    if (!atSymbolFound) {
      this.showUserList = false;
      this.inputIndex = undefined;
      this.userList = [];
    }
  }

  userListKeyboardFocus() {
    if (this.showUserList) {
    }
  }

  onKeyDown(event: any) {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      this.handleCommentSubmission();
    }
  }

  handleClick(user: User) {
    this.mentionedUsers.push(user);

    const textInput: HTMLElement = document.getElementById('text')!;
    const comment = textInput.innerHTML.split(' ');
    comment[this.inputIndex as number] = `@${user.name}`;
    textInput.innerHTML = comment.join(' ');
    this.inputIndex = undefined;
    this.userList = [];
    this.showUserList = false;

    (textInput as HTMLInputElement).focus();
    this.setCaretToEnd(textInput);
  }

  private triggerNotification(user: User) {
    this.systemMessages.push(
      `${user.name} of userID: ${user.userID} has been notified`
    );
  }

  private setCaretToEnd(element: HTMLElement) {
    const range = document.createRange();
    const sel = window.getSelection();
    range.selectNodeContents(element);
    range.collapse(false);
    sel?.removeAllRanges();
    sel?.addRange(range);
  }
}
