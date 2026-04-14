import { Controller, Get, Post, Patch, Body, Param } from '@nestjs/common';
import { ProfilesService } from './profiles.service';

@Controller('profiles')
export class ProfilesController {
  constructor(private profilesService: ProfilesService) {}

  @Get()
  async findAll() {
    return this.profilesService.findAll();
  }

  @Post()
  async create(@Body() data: any) {
    return this.profilesService.create(data);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() data: any) {
    await this.profilesService.update(id, data);
    return { message: 'Perfil atualizado com sucesso' };
  }
}
