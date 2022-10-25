export interface PaginationDto {
  page?: number;
  limit?: number;
  sortBy?: string | string[];
  sortDesc?: boolean | boolean[];
  filters?: { [key: string]: any };
}
