import { Either, left, right } from '@/core/either'

import { QuestionCommentsRepository } from '@/domain/forum/application/repositories/question-comments-repository'

import { NotAllowedError } from './errors/not-allowed-error'
import { ResourceNotFoundError } from './errors/resource-not-found-error'

type DeleteQuestionCommentUseCaseRequest = {
  authorId: string
  questionCommentId: string
}

type DeleteQuestionCommentUseCaseResponse = Either<
  ResourceNotFoundError | NotAllowedError,
  {}
>

export class DeleteQuestionCommentUseCase {
  constructor(
    private readonly questionCommentRepository: QuestionCommentsRepository,
  ) {}

  async execute({
    authorId,
    questionCommentId,
  }: DeleteQuestionCommentUseCaseRequest): Promise<DeleteQuestionCommentUseCaseResponse> {
    const questionComment = await this.questionCommentRepository.findById(
      questionCommentId,
    )

    if (!questionComment) {
      return left(new ResourceNotFoundError())
    }

    if (questionComment.authorId.toString() !== authorId) {
      return left(new NotAllowedError())
    }

    await this.questionCommentRepository.delete(questionComment)

    return right({})
  }
}
