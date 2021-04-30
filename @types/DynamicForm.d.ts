export interface DynamicForm {
  reset(): void;

  validate(scrollTo?: boolean, returnErrors?: boolean): Promise<boolean | any[]>
}
