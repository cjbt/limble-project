import { Injectable } from '@angular/core';
import { TNode, Trie } from './trie';
import { Users } from 'src/app/models/user.model';

@Injectable({
  providedIn: 'root',
})
export class UserMentionsServiceService {
  private trie: Trie;
  private usersMapper: Record<number, string>;
  private cache: Map<string, number[]>;

  constructor() {
    this.trie = new Trie();
    this.cache = new Map();
    this.usersMapper = {};
  }

  public initialize(users: Users) {
    this.addUsers(users);
  }

  public addUsers(users: Users) {
    const newUsers = users.reduce((acc, curr) => {
      acc[curr.userID] = curr.name;
      return acc;
    }, {} as Record<number, string>);

    this.usersMapper = { ...this.usersMapper, ...newUsers };

    for (const user of users) {
      this.trie.insert(user.name.toLocaleLowerCase(), user.userID);
    }

    this.invalidateCache();
  }

  public search(chars: string) {
    if (chars.trim() === '') return Object.values(this.usersMapper).sort();

    const lowerCasedChar = chars.toLocaleLowerCase();
    if (this.cache.has(lowerCasedChar)) {
      return this.cache.get(lowerCasedChar)?.map((id) => this.usersMapper[id]);
    }

    const node = this.trie.find(lowerCasedChar);
    if (!node) return [];

    const userIds: number[] = this.getUserIds(node);
    this.cache.set(lowerCasedChar, userIds);

    return userIds.map((id) => this.usersMapper[id]);
  }

  private getUserIds(node: TNode, userIds: number[] = []) {
    if (node.isWord && node.id !== undefined) {
      userIds.push(node.id);
    }

    node.children.forEach((childNode) => this.getUserIds(childNode, userIds));

    return userIds;
  }

  private invalidateCache() {
    this.cache = new Map();
  }
}
