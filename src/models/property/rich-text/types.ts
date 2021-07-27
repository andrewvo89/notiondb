interface RichTextNotionValue {
  rich_text: {
    type: 'text';
    text: {
      content: string;
    };
  }[];
}

interface RichTextPropertyObject {
  rich_text: {};
}

export { RichTextNotionValue, RichTextPropertyObject };
