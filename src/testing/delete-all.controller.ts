import { Controller, Delete, HttpCode } from '@nestjs/common';
import { DeleteAllRepository } from './delete-all.repository';

@Controller('testing/all-data')
export class DeleteAllController {
  constructor(public deleteAllRepostory: DeleteAllRepository) {}
  @Delete()
  @HttpCode(204)
  async deleteAll() {
    return this.deleteAllRepostory.deleteAll();
  }
}
