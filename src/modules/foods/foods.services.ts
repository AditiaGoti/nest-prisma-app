import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { CreateFoodsDto } from './dto/create-foods.dto';
import { UpdateFoodsDto } from './dto/update-foods.dto';
import { PrismaService } from '../../prisma/prisma.service';
import { NotFoundException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { FilterFoodDto } from './dto/filter-foods.dto';
import { Prisma } from '@prisma/client';

type CreateFoodWithImage = CreateFoodsDto & {
    imageUrl: string;
};
@Injectable()
export class FoodsService {
    constructor(private prisma: PrismaService) { }
    async create(data: CreateFoodWithImage) {
        try {
            const food = await this.prisma.food.create({
                data,
            });

            return {
                message: 'Food berhasil dibuat',
                data: food,
            };

        } catch (error: unknown) {
            console.error(error);
            if (error instanceof Prisma.PrismaClientKnownRequestError) {

                if (error.code === 'P2002') {
                    throw new BadRequestException('Data sudah ada (duplicate)');
                }

                throw new InternalServerErrorException(
                    error.message || 'Terjadi kesalahan saat membuat food'
                );
            }
        }
    }
    async findAll(query: FilterFoodDto) {
        const { title, minPrice, maxPrice, page = 1, limit = 10 } = query
        const skip = (page - 1) * limit
        const where = {
            ...(title && {
                title: {
                    contains: title,
                    mode: Prisma.QueryMode.insensitive,
                },
            }),

            ...((minPrice !== undefined || maxPrice !== undefined) && {
                price: {
                    ...(minPrice !== undefined && { gte: minPrice }),
                    ...(maxPrice !== undefined && { lte: maxPrice }),
                },
            }),
        }
        const [data, total] = await Promise.all([
            this.prisma.food.findMany({
                where,
                skip,
                take: limit,
                orderBy: { createdAt: 'asc' },
            }),
            this.prisma.food.count({ where }),
        ])

        return {
            message: 'Berhasil ambil data foods',
            data,
            meta: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit),
            },
        }
    }

    async findOne(id: number) {

        const food = await this.prisma.food.findUnique({
            where: { id },
        });

        if (!food) {
            throw new NotFoundException('food tidak ditemukan');
        }

        return food;
    }

    async update(id: number, updateFoodsDto: UpdateFoodsDto) {
        try {
            const food = await this.prisma.food.update({
                where: { id },
                data: updateFoodsDto,
            });

            return {
                message: 'Food berhasil diupdate',
                data: food,
            };
        } catch (error: unknown) {
            if (error instanceof Prisma.PrismaClientKnownRequestError) {
                if (error.code === 'P2025') {
                    throw new NotFoundException('Food tidak ditemukan');
                }
            }

            throw new InternalServerErrorException(
                error instanceof Error ? error.message : 'Terjadi kesalahan',
            );
        }
    }

    async remove(id: number) {
        try {
            const food = await this.prisma.food.delete({
                where: { id },
            });
            return {
                message: 'Data Berhasil Di Hapus',
                data: food,
            }
        } catch (error: unknown) {
            if (error instanceof Prisma.PrismaClientKnownRequestError) {
                if (error.code === 'P2025') {
                    throw new NotFoundException('Food tidak ditemukan');
                }
            }

            throw new InternalServerErrorException(
                error instanceof Error ? error.message : 'Terjadi kesalahan',
            )
        }
    }
}