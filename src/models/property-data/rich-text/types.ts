interface RichTextNotionValue {
  rich_text: {
    type: 'text';
    text: {
      content: string;
    };
  }[];
}

export { RichTextNotionValue };
