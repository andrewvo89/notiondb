interface Filter {
  transformToNotionFilter: () => Record<string, any>;
}

export { Filter };
