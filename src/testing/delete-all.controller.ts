import { Controller, Delete, HttpCode } from '@nestjs/common';
import { DeleteAllRepository } from './delete-all.repository';

@Controller('testing')
export class DeleteAllController {
  constructor(public deleteAllRepository: DeleteAllRepository) {}
  @Delete('all-data')
  @HttpCode(204)
  async deleteAll() {
    return this.deleteAllRepository.deleteAll();
  }
}
