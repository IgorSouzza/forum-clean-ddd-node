import { Either, left, right } from '@/core/either'

import { AnswersRepository } from '@/domain/forum/application/repositories/answers-repository'
import { ResourceNotFoundError } from './errors/resource-not-found-error'

type DeleteAnswerUseCaseRequest = {
  authorId: string
  answerId: string
}

type DeleteAnswerUseCaseResponse = Either<ResourceNotFoundError, {}>

export class DeleteAnswerUseCase {
  constructor(private readonly answersRepository: AnswersRepository) {}

  async execute({
    authorId,
    answerId,
  }: DeleteAnswerUseCaseRequest): Promise<DeleteAnswerUseCaseResponse> {
    const answer = await this.answersRepository.findById(answerId)

    if (!answer) {
      return left(new ResourceNotFoundError())
    }

    if (authorId !== answer.authorId.toString()) {
      return left(new ResourceNotFoundError())
    }

    await this.answersRepository.delete(answer)

    return right({})
  }
}
