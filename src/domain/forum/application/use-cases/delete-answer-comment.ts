import { Either, left, right } from '@/core/either'
import { AnswerCommentsRepository } from '@/domain/forum/application/repositories/answer-comments-repository'
import { ResourceNotFoundError } from './errors/resource-not-found-error'
import { NotAllowedError } from './errors/not-allowed-error'

type DeleteAnswerCommentUseCaseRequest = {
  authorId: string
  answerCommentId: string
}

type DeleteAnswerCommentUseCaseResponse = Either<
  ResourceNotFoundError | NotAllowedError,
  {}
>

export class DeleteAnswerCommentUseCase {
  constructor(
    private readonly answerCommentRepository: AnswerCommentsRepository,
  ) {}

  async execute({
    authorId,
    answerCommentId,
  }: DeleteAnswerCommentUseCaseRequest): Promise<DeleteAnswerCommentUseCaseResponse> {
    const answerComment = await this.answerCommentRepository.findById(
      answerCommentId,
    )

    if (!answerComment) {
      return left(new ResourceNotFoundError())
    }

    if (answerComment.authorId.toString() !== authorId) {
      return left(new NotAllowedError())
    }

    await this.answerCommentRepository.delete(answerComment)

    return right({})
  }
}
