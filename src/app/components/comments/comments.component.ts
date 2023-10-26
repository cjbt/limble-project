import { Component, ElementRef, ViewChild } from '@angular/core';

import { UserMentionsService } from 'src/app/services/user-mentions/user-mentions.service';
import { User, Users } from 'src/app/models/user.model';

@Component({
  selector: 'app-comments',
  templateUrl: './comments.component.html',
  styleUrls: ['./comments.component.css'],
})
export class CommentsComponent {
  @ViewChild('editableDiv') editableDiv!: ElementRef;

  showUserList: boolean = false;
  userList: Users = [];
  atLocationIdx: number | null = null;
  mentionedUsers: Map<number, User> = new Map();
  systemMessages: string[] = [];
  content: string = '';

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

  static readonly USERS = [
    { userID: 1, name: 'Kevin' },
    { userID: 2, name: 'Jeff' },
    { userID: 3, name: 'Bryan' },
    { userID: 4, name: 'Gabbey' },
  ];

  static readonly REGEX_WHITESPACES = /\s|&nbsp;|\n|\r\n?/;

  constructor(private userMentionsService: UserMentionsService) {
    userMentionsService.initialize(CommentsComponent.USERS);
  }

  onInput(event: Event) {
    this.content = (event.target as HTMLElement).innerHTML;

    const words = this.content.split(CommentsComponent.REGEX_WHITESPACES);
    let atSymbolFound = false;

    words.forEach((word, i) => {
      if (word.startsWith('@')) {
        const inputAfterAtSymbol = word.substring(1);
        atSymbolFound = true;
        if (
          inputAfterAtSymbol === '' ||
          /^[a-z0-9_-]+$/i.test(inputAfterAtSymbol)
        ) {
          this.showUserList = true;
          this.atLocationIdx = i;
          this.userList = this.userMentionsService.search(inputAfterAtSymbol);
        } else {
          this.resetUserList();
        }
      } else {
        this.resetUserList();
      }
    });

    if (!atSymbolFound) {
      this.resetUserList();
    }
    this.setCaretToEnd();
  }

  onKeyDown(event: KeyboardEvent) {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      this.handleCommentSubmission();
    }
  }

  handleCommentSubmission() {
    if (!this.content.length) return;

    this.systemMessages = [];

    // Process new comment
    const words = this.content.split(CommentsComponent.REGEX_WHITESPACES);
    const commentText = words.map((word, i) => {
      if (!this.mentionedUsers.has(i)) return word;

      const user = this.mentionedUsers.get(i);
      if (!user) return word;

      return `<strong>@${user.name}</strong>`;
    });

    // Add new Comment
    this.comments.push({
      id: this.comments.length + 1,
      text: commentText.join(' '),
      timestamp: 'System',
    });

    // Trigger "external" notification
    this.mentionedUsers.forEach((user) => {
      this.triggerNotification(user);
    });

    // Reset contentEditable content
    this.content = '';
    this.mentionedUsers.clear();
  }

  handleClick(user: User) {
    if (this.atLocationIdx === null) {
      throw new Error('At location index is undefined');
    }
    this.mentionedUsers.set(this.atLocationIdx, user);

    this.appendAtToAtLocation(user.name);
    this.setCaretAfterStrongTag();

    this.resetUserList();
  }

  private resetUserList() {
    this.atLocationIdx = null;
    this.userList = [];
    this.showUserList = false;
  }

  private appendAtToAtLocation(name: string) {
    const commentWords = this.content.split(
      CommentsComponent.REGEX_WHITESPACES
    );

    commentWords[
      this.atLocationIdx as number
    ] = `<strong>@${name}</strong>&nbsp;`;
    this.content = commentWords.join(' ');
  }

  private setCaretToEnd() {
    setTimeout(() => {
      const element = this.editableDiv.nativeElement;
      const range = document.createRange();
      const selection = window.getSelection()!;

      range.selectNodeContents(element);
      range.collapse(false);
      selection.removeAllRanges();
      selection.addRange(range);
    }, 0);
  }

  private setCaretAfterStrongTag() {
    setTimeout(() => {
      const editableDiv = this.editableDiv.nativeElement;

      const lastNode =
        editableDiv.childNodes[editableDiv.childNodes.length - 1];

      if (lastNode) {
        const range = document.createRange();
        const selection = window.getSelection()!;

        range.setStartAfter(lastNode);
        range.collapse(true);
        selection.removeAllRanges();
        selection.addRange(range);
      }

      editableDiv.focus();
    }, 0);
  }

  private triggerNotification(user: User) {
    this.systemMessages.push(
      `${user.name} of userID: ${user.userID} has been notified`
    );
  }
}
