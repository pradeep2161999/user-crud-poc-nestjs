import { Injectable, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaClient } from '@prisma/client';
import { Model } from 'src/configs/constant';

@Injectable()
@Module({
  providers: [PrismaService],
  exports: [PrismaService],
})
export class PrismaService extends PrismaClient {
  constructor(config: ConfigService) {
    super({
      datasources: {
        db: {
          url: config.get('DATABASE_URL'),
        },
      },
    });
    console.log(config.get('DATABASE_URL'));
  }

  async onModuleInit() {
    await this.$connect();
    await this.main();
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
  async main() {
    this.$use(async (params, next) => {
      if (Model.includes(params.model)) {
        if (params.action == 'delete') {
          params.action = 'update';
          params.args['data'] = { deleted_at: new Date() };
        }
        if (params.action == 'deleteMany') {
          params.action = 'updateMany';
          if (params.args.data != undefined) {
            params.args['data'] = { deleted_at: new Date() };
          } else {
            params.args['data'] = { deleted_at: new Date() };
          }
        }
        if (params.action === 'findUnique' || params.action === 'findFirst') {
          params.action = 'findFirst';
          params.args.where['deleted_at'] = null;
        }
        if (params.action === 'aggregate') {
          if (params.args.where) {
            if (params.args.where.deleted == undefined) {
              params.args.where['deleted_at'] = null;
            }
          } else {
            params.args['where'] = { deleted_at: null };
          }
        }
        if (params.action === 'findMany') {
          if (params.args.where) {
            if (params.args.where.deleted == undefined) {
              params.args.where['deleted_at'] = null;
            }
          } else {
            params.args['where'] = { deleted_at: null };
          }
        }
      }
      return next(params);
    });
  }
}
