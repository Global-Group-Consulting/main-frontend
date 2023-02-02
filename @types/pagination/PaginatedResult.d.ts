export interface PaginatedResult<T=any> {
  data: T[];
  lastPage: number;
  page: number;
  perPage: number;
  total: number;
  sortBy: string[];
  sortDesc: boolean[];
  filters: { [key: string]: any };
}
