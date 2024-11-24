import { registerAs } from '@nestjs/config';
import { DatabaseType } from 'typeorm';
import { MysqlConnectionOptions } from 'typeorm/driver/mysql/MysqlConnectionOptions';

export default registerAs(
  'orm',
  () =>
    ({
      type: 'mysql' as DatabaseType,
      port: +process.env.MYSQL_PORT!,
      username: process.env.MYSQL_USERNAME!,
      host: process.env.MYSQL_HOST!,
      password: process.env.MYSQL_ROOT_PASSWORD!,
      database: process.env.MYSQL_DATABASE!,
      logging: process.env.NODE_ENV === 'production' ? false : true,
      entities: [`${__dirname}/../module/**/*.entity.{ts,js}`],
      charset: 'utf8mb4',
      extra: {
        charset: 'utf8mb4_unicode_ci',
      },
    }) as MysqlConnectionOptions,
);
