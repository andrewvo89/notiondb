interface Sort {
  transformToNotionSort: () => Record<string, any>;
}

type TimestampSortType = 'created_time' | 'last_edited_time';

type SortDirection = 'ascending' | 'descending';

type SortType = 'property' | 'timestamp' | 'property_and_timestamp';

export { Sort, TimestampSortType, SortDirection, SortType };
