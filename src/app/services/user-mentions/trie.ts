export class TNode {
  public children: Map<string, TNode>;
  public isWord: boolean;
  public id?: number;

  constructor() {
    this.children = new Map();
    this.isWord = false;
    this.id = undefined;
  }
}

export class Trie {
  public root?: TNode;

  constructor() {
    this.root = undefined;
  }

  public insert(str: string, id: number) {
    if (!this.root) {
      this.root = new TNode();
    }

    let current = this.root;
    for (let i = 0; i < str.length; i++) {
      const char = str[i];
      if (!current.children.has(char)) {
        current.children.set(char, new TNode());
      }
      current = current.children.get(char)!;
    }

    current.isWord = true;
    current.id = id;
  }

  public delete(chars: string) {
    const node = this.find(chars);
    if (!node) return;

    node.id = undefined;
    node.isWord = false;
  }

  public find(chars: string) {
    let node = this.root;
    for (let char of chars) {
      if (!node || !node.children.has(char)) return undefined;
      node = node.children.get(char);
    }
    return node;
  }
}
