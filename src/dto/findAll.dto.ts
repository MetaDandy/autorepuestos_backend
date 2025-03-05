import { Type } from 'class-transformer';
import { IsInt, Min, IsOptional, IsString } from 'class-validator';
import { FindOptionsOrderValue } from 'typeorm';

export class FindAllDto<T> {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  limit?: number = 10;

  @IsOptional()
  @IsString()
  orderBy?: keyof T | string = 'createdAt';

  @IsOptional()
  orderDirection?: FindOptionsOrderValue = 'ASC';

  @IsOptional()
  @IsString()
  search?: string;
}
