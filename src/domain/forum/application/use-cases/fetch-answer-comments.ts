import { AnswerComment } from '@/domain/forum/enterprise/entities/answer-comment'
import { AnswerCommentsRepository } from '../repositories/answer-comments-repository'

type FetchAnswerCommentsUseCaseRequest = {
  answerId: string
  page: number
}

type FetchAnswerCommentsUseCaseResponse = {
  answerComments: AnswerComment[]
}

export class FetchAnswerCommentsUseCase {
  constructor(
    private readonly answerCommentsRepository: AnswerCommentsRepository,
  ) {}

  async execute({
    answerId,
    page,
  }: FetchAnswerCommentsUseCaseRequest): Promise<FetchAnswerCommentsUseCaseResponse> {
    const answerComments =
      await this.answerCommentsRepository.findManyByAnswerId(answerId, {
        page,
      })

    return {
      answerComments,
    }
  }
}
