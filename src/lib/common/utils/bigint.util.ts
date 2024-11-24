export class BigIntUtil {
  static toBigInt(value: string | number): bigint {
    if (!value) {
      return BigInt(0);
    }
    return BigInt(value);
  }

  static toNumber(value: bigint): number {
    if (!value) {
      return 0;
    }
    return Number(value);
  }

  static toString(value: bigint): string {
    if (!value) {
      return '0n';
    }
    return value.toString();
  }
}
