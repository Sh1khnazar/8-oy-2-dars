import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './modules/users/users.module';

@Module({
  imports: [
    // 1. .env faylini birinchi bo'lib butun loyiha uchun global yuklaymiz
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    // 2. TypeORM orqali PostgreSQL asinxron ulanishi
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        host: config.get<string>('DB_HOST') || 'postgres-db', // Docker-compose xizmat nomi
        port: config.get<number>('PG_PORT') || 5432,
        username: config.get<string>('POSTGRES_USER'),
        password: config.get<string>('POSTGRES_PASSWORD'),
        database: config.get<string>('POSTGRES_DB'),
        autoLoadEntities: true,
        synchronize: true,
      }),
    }),

    // 3. Mongoose orqali MongoDB Atlas asinxron ulanishi
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        uri: config.get<string>('MONGO_URI'),
      }),
    }),

    UsersModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
