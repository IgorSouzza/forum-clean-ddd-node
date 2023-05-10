import { AnswerCommentsRepository } from '@/domain/forum/application/repositories/answer-comments-repository'

type DeleteAnswerCommentUseCaseRequest = {
  authorId: string
  answerCommentId: string
}

type DeleteAnswerCommentUseCaseResponse = void

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
      throw new Error('Answer not found')
    }

    if (answerComment.authorId.toString() !== authorId) {
      throw new Error('Not allowed')
    }

    await this.answerCommentRepository.delete(answerComment)
  }
}
