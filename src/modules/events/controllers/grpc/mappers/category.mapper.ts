// category.mapper.ts
import { Category as ProtoCategory } from '@/protogen/event.pb';
import { Category as PrismaCategory } from '@prisma/client';

export class CategoryMapper {
  private static protoToPrismaMap = new Map<ProtoCategory, PrismaCategory>([
    [ProtoCategory.CATEGORY_MUSIC, PrismaCategory.MUSIC],
    [ProtoCategory.CATEGORY_SPORT, PrismaCategory.SPORT],
    [ProtoCategory.CATEGORY_THEATERS_AND_ART, PrismaCategory.THEATERS_AND_ART],
    [ProtoCategory.CATEGORY_OTHER, PrismaCategory.OTHER],
  ]);

  private static prismaToProtoMap = new Map<PrismaCategory, ProtoCategory>([
    [PrismaCategory.MUSIC, ProtoCategory.CATEGORY_MUSIC],
    [PrismaCategory.SPORT, ProtoCategory.CATEGORY_SPORT],
    [PrismaCategory.THEATERS_AND_ART, ProtoCategory.CATEGORY_THEATERS_AND_ART],
    [PrismaCategory.OTHER, ProtoCategory.CATEGORY_OTHER],
  ]);

  static toProto(prismaCategory: PrismaCategory): ProtoCategory {
    const protoCategory = this.prismaToProtoMap.get(prismaCategory);
    if (!protoCategory) {
      throw new Error(`Unknown Prisma category: ${prismaCategory}`);
    }
    return protoCategory;
  }

  static toPrisma(protoCategory: ProtoCategory): PrismaCategory {
    const prismaCategory = this.protoToPrismaMap.get(protoCategory);
    if (!prismaCategory) {
      throw new Error(`Unknown or unsupported Proto category: ${protoCategory}`);
    }
    return prismaCategory;
  }

  static toProtoArray(prismaCategories: PrismaCategory[]): ProtoCategory[] {
    return prismaCategories.map((cat) => this.toProto(cat));
  }

  static toPrismaArray(protoCategories: ProtoCategory[]): PrismaCategory[] {
    return protoCategories.map((cat) => this.toPrisma(cat));
  }
}
