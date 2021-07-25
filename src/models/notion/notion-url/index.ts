class NotionUrl {
  #url: string;
  constructor(url: string) {
    this.#url = url;
  }

  get url() {
    return this.#url;
  }
}

export default NotionUrl;
