import { ValueTransformer } from 'typeorm';

export class DecimalTransformer implements ValueTransformer {
  from(value: string | null): number {
    return value === null ? 0 : Number(value);
  }

  to(value: number | null): string {
    return (value === null ? 0 : value).toString();
  }
}
