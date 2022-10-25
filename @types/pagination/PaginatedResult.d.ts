export interface PaginatedResult {
  data: any[];
  lastPage: number;
  page: number;
  perPage: number;
  total: number;
  sortBy: string[];
  sortDesc: boolean[];
  filters: { [key: string]: any };
}
