interface TitleNotionValue {
  title: {
    type: 'text';
    text: {
      content: string;
    };
  }[];
}

interface TitlePropertyObject {
  title: {};
}

export { TitleNotionValue, TitlePropertyObject };
