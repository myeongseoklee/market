import {
  PipeTransform,
  Injectable,
  ArgumentMetadata,
  BadRequestException,
} from '@nestjs/common';

@Injectable()
export class ParseBigIntPipe implements PipeTransform {
  transform(value: string | number, metadata: ArgumentMetadata) {
    try {
      return BigInt(value);
    } catch (e) {
      throw new BadRequestException(e);
    }
  }
}
