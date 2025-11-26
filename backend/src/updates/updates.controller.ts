import { Controller, Get, Post, Body, Delete, Param, Put, HttpCode, HttpStatus } from '@nestjs/common';
import { UpdatesService } from './updates.service';
import { PulseUpdate } from './schemas/update.schema';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from './jwt-auth.guard';


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
   * Delete a user's update
   * DELETE /updates/user/:userId
   */
  @Delete('user/:userId')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteByUserId(@Param('userId') userId: string) {
    const deleted = await this.updatesService.deleteByUserId(userId);
    if (!deleted) {
      return { message: `No update found for user ${userId}` };
    }
    return;
  }

  /**
   * Update a user's update
   * PUT /updates/user/:userId
   */
  @Put('user/:userId')
  async update(
    @Param('userId') userId: string,
    @Body() updateDto: Partial<PulseUpdate>
  ): Promise<PulseUpdate | null> {
    return this.updatesService.updateByUserId(userId, updateDto);
  }
}
