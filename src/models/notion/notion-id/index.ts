class NotionId {
  #id: string;
  constructor(id: string) {
    this.#id = id;
  }

  get id() {
    return this.#id;
  }
}

export default NotionId;
