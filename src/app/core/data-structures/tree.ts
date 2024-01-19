export class TreeNode<Type> {
  _key: string;
  _metadata: Type;
  _parent: TreeNode<Type> | null;
  _children: TreeNode<Type>[];

  constructor(key: string, metadata: Type, parent: TreeNode<Type> | null = null) {
    this._key = key;
    this._metadata = metadata;
    this._parent = parent;
    this._children = [];
  }

  public get key() {
    return this._key;
  }

  public get metadata() {
    return this._metadata;
  }

  public get isLeaf() {
    return this._children.length === 0;
  }

  public get hasChildren() {
    return !this.isLeaf;
  }

  public get children() {
    return this._children;
  }

  public set parent(p: TreeNode<Type>) {
    this._parent = p;
  }

  public addChild(child: TreeNode<Type>) {
    this._children.push(child);
  }
}
