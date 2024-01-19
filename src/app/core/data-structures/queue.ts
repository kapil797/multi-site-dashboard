interface Foo {
  [key: string]: unknown;
}

export class Queue {
  items: Foo;
  headIdx: number;
  tailIdx: number;

  constructor() {
    this.items = {};
    this.headIdx = 0;
    this.tailIdx = 0;
  }

  public enqueue(item: unknown) {
    this.items[this.tailIdx] = item;
    this.tailIdx++;
  }

  public dequeue() {
    const item = this.items[this.headIdx];
    delete this.items[this.headIdx];
    this.headIdx++;
    return item;
  }

  public peek() {
    return this.items[this.headIdx];
  }

  public get printQueue() {
    return this.items;
  }

  public get size() {
    return this.tailIdx - this.headIdx;
  }

  public get isEmpty() {
    return this.size === 0;
  }
}
