import * as dayjs from 'dayjs';
import { ValueTransformer } from 'typeorm';
import { DateUtil } from '../utils/date.util';

export class DayjsTransformer implements ValueTransformer {
  to(entityValue: dayjs.Dayjs): Date | null {
    if (!entityValue) {
      return null;
    }
    return DateUtil.toDate(entityValue);
  }
  from(dbValue: Date): dayjs.Dayjs | null {
    if (!dbValue) {
      return null;
    }
    return DateUtil.toDayjs(dbValue);
  }
}
