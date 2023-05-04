import { AnswersRepository } from '@/domain/forum/application/repositories/answers-repository'

type DeleteAnswerUseCaseRequest = {
  authorId: string
  answerId: string
}

type DeleteAnswerUseCaseResponse = {}

export class DeleteAnswerUseCase {
  constructor(private readonly answersRepository: AnswersRepository) {}

  async execute({
    authorId,
    answerId,
  }: DeleteAnswerUseCaseRequest): Promise<DeleteAnswerUseCaseResponse> {
    const answer = await this.answersRepository.findById(answerId)

    if (!answer) {
      throw new Error('Answer not found')
    }

    if (authorId !== answer.authorId.toString()) {
      throw new Error('Not allowed')
    }

    await this.answersRepository.delete(answer)

    return {}
  }
}
