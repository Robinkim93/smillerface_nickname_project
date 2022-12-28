import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModuleAsyncOptions } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

export const typeORMConfig: TypeOrmModuleAsyncOptions = {
  imports: [ConfigModule],
  inject: [ConfigService],
  useFactory: (configService: ConfigService) => ({
    type: 'mariadb',
    url: configService.get('DB_URL'),
    host: configService.get('DB_HOST'),
    password: configService.get('DB_PASSWORD'),
    entities: [__dirname + '**/*.entity.{.js,.ts}'],
    synchronize: true,
  }),
  dataSourceFactory: async (options) => {
    const dataSource = await new DataSource(options).initialize();
    return dataSource;
  },
};