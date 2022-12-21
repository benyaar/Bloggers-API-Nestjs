import { Body, Controller, NotFoundException, Post } from '@nestjs/common';
import { PostsService } from './posts.service';
import { InputPostDTO } from './dto/input-post.dto';
import { PostQueryRepository } from './post.query-repository';

@Controller('posts')
export class PostsController {
  constructor(
    public postsService: PostsService,
    public postQueryRepository: PostQueryRepository,
  ) {}
  @Post()
  async createPost(@Body() inputPostDTO: InputPostDTO) {
    const findBlogById = await this.postQueryRepository.findBlogById(
      inputPostDTO.blogId,
    );

    if (!findBlogById)
      throw new NotFoundException([
        { message: 'blogId undefined', field: 'createNewPost' },
      ]);

    return { ok: 'ok' };
  }
}
