import { ValueTransformer } from 'typeorm';
import { BigIntUtil } from '../utils/bigint.util';

BigInt.prototype.toJSON = function () {
  return this.toString();
};

export class BigIntTransformer implements ValueTransformer {
  to(entityValue: bigint): string | null {
    if (!entityValue) return null;
    return BigIntUtil.toString(entityValue);
  }
  from(dbValue: string): bigint {
    return BigIntUtil.toBigInt(dbValue);
  }
}
