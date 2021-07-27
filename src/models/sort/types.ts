interface Sort {
  transformToNotionSort: () => Record<string, any>;
}

interface NotionSort {
  property?: string;
  timestamp?: TimestampSortType;
  direction?: SortDirection;
}

type TimestampSortType = 'created_time' | 'last_edited_time';

type SortDirection = 'ascending' | 'descending';

type SortType = 'property' | 'timestamp' | 'property_and_timestamp';

export { Sort, NotionSort, TimestampSortType, SortDirection, SortType };
