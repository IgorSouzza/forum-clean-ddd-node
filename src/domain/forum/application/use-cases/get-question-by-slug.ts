import { Either, left, right } from '@/core/either'

import { Question } from '@/domain/forum/enterprise/entities/question'
import { QuestionsRepository } from '@/domain/forum/application/repositories/questions-repository'

import { ResourceNotFoundError } from './errors/resource-not-found-error'

type GetQuestionBySlugUseCaseRequest = {
  slug: string
}

type GetQuestionBySlugUseCaseResponse = Either<
  ResourceNotFoundError,
  {
    question: Question
  }
>

export class GetQuestionBySlugUseCase {
  constructor(private readonly questionsRepository: QuestionsRepository) {}

  async execute({
    slug,
  }: GetQuestionBySlugUseCaseRequest): Promise<GetQuestionBySlugUseCaseResponse> {
    const question = await this.questionsRepository.findBySlug(slug)

    if (!question) {
      return left(new ResourceNotFoundError())
    }

    return right({
      question,
    })
  }
}
