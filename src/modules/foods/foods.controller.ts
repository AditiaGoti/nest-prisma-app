import {
    Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query, UploadedFile,
    UseInterceptors,
    BadRequestException,
    ParseIntPipe
} from '@nestjs/common';
import { FoodsService } from './foods.services';
import { CreateFoodsDto } from './dto/create-foods.dto';
import { UpdateFoodsDto } from './dto/update-foods.dto';
import { AccessJwtGuard } from 'src/common/guards/access.jwt.guard';
import { FilterFoodDto } from './dto/filter-foods.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import * as fs from 'fs';

@Controller('foods')
export class FoodsController {
    constructor(private readonly foodService: FoodsService) { }

    @Post()
    @UseInterceptors(
        FileInterceptor('image', {
            storage: diskStorage({
                destination: './uploads',
                filename: (req, file, callback) => {
                    const uniqueName =
                        Date.now() + '-' + Math.round(Math.random() * 1e9);
                    callback(null, uniqueName + extname(file.originalname));
                },
            }),

            // 🔥 VALIDASI FILE
            fileFilter: (req, file, callback) => {
                const allowedTypes = /jpg|jpeg|png|webp/;
                const ext = extname(file.originalname).toLowerCase();

                if (!allowedTypes.test(ext)) {
                    return callback(
                        new BadRequestException('File harus berupa gambar (jpg/png/webp)'),
                        false,
                    );
                }

                callback(null, true);
            },

            limits: {
                fileSize: 20 * 1024 * 1024, // max 2MB
            },
        }),
    )

    async create(
        @UploadedFile() file: Express.Multer.File,
        @Body() createFoodDto: CreateFoodsDto,
    ) {
        if (!file) {
            throw new BadRequestException('Image wajib diupload');
        }

        // 🔥 simpan full URL biar enak dipakai frontend
        const imageUrl = `http://localhost:3000/uploads/${file.filename}`;

        return this.foodService.create({
            ...createFoodDto,
            imageUrl,
        });
    }

    @Get()
    // @UseGuards(AccessJwtGuard)
    findAll(@Query() query: FilterFoodDto) {
        return this.foodService.findAll(query);
    }

    @Get(':id')
    // @UseGuards(AccessJwtGuard)
    findOne(@Param('id') id: number) {
        return this.foodService.findOne(id);
    }

    @Patch(':id')
    @UseInterceptors(
        FileInterceptor('image', {
            storage: diskStorage({
                destination: './uploads',
                filename: (req, file, cb) => {
                    const unique =
                        Date.now() + '-' + Math.round(Math.random() * 1e9);
                    cb(null, unique + extname(file.originalname));
                },
            }),
        }),
    )
    async update(
        @Param('id', ParseIntPipe) id: number,
        @UploadedFile() file: Express.Multer.File,
        @Body() updateFoodDto: UpdateFoodsDto,
    ) {
        let imageUrl: string | undefined;

        if (file) {
            imageUrl = `http://localhost:3000/uploads/${file.filename}`;

            // 🔥 hapus image lama (optional tapi recommended)
            const existing = await this.foodService.findOne(+id);
            if (existing?.imageUrl) {
                const oldPath = existing.imageUrl.replace(
                    'http://localhost:3000',
                    '.',
                );
                if (fs.existsSync(oldPath)) {
                    fs.unlinkSync(oldPath);
                }
            }
        }

        return this.foodService.update(+id, {
            ...updateFoodDto,
            ...(imageUrl && { imageUrl }),
        });
    }

    @Delete(':id')
    remove(@Param('id') id: number) {
        return this.foodService.remove(id);
    }

}
