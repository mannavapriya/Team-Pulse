import { Controller, Get, Post, Body, Delete, Param, Put, HttpCode, HttpStatus } from '@nestjs/common';
import { UpdatesService } from './updates.service';
import { PulseUpdate } from './schemas/update.schema';

@Controller('updates')
export class UpdatesController {
  constructor(private readonly updatesService: UpdatesService) {}

  /**
   * Create a new update
   * POST /updates
   */
  @Post()
  async create(@Body() updateDto: Partial<PulseUpdate>): Promise<PulseUpdate> {
    return this.updatesService.create(updateDto);
  }

  /**
   * Get all updates for today
   * GET /updates/today
   */
  @Get('today')
  async findToday(): Promise<PulseUpdate[]> {
    return this.updatesService.findTodayTeam();
  }

  /**
   * Delete an update by MongoDB _id
   * DELETE /updates/:id
   */
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param('id') id: string) {
    const result = await this.updatesService.deleteById(id);
    if (!result || result.deletedCount === 0) {
      return { message: `No update found with id ${id}` };
    }
    return;
  }

  /**
   * Update an update by MongoDB _id
   * PUT /updates/:id
   */
  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateDto: Partial<PulseUpdate>
  ): Promise<PulseUpdate | null> {
    return this.updatesService.updateById(id, updateDto);
  }
}
