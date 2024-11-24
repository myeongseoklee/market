export interface IPasswordPolicy {
  validate(value: string): void;
}
