import * as dayjs from 'dayjs';

export class DateUtil {
  static toDate(dayjs: dayjs.Dayjs): Date | null {
    if (!dayjs) {
      return new Date();
    }
    return dayjs.toDate();
  }

  static toDayjs(date: Date): dayjs.Dayjs | null {
    if (!date) {
      return dayjs();
    }
    return dayjs(date);
  }
}
