import { Either, right } from '@/core/either'
import { UniqueEntityID } from '@/core/entities/value-objects/unique-entity-id'

import { Question } from '@/domain/forum/enterprise/entities/question'
import { QuestionsRepository } from '@/domain/forum/application/repositories/questions-repository'

type CreateQuestionUseCaseRequest = {
  authorId: string
  title: string
  content: string
}

type CreateQuestionUseCaseResponse = Either<
  null,
  {
    question: Question
  }
>

export class CreateQuestionUseCase {
  constructor(private readonly questionsRepository: QuestionsRepository) {}

  async execute({
    authorId,
    title,
    content,
  }: CreateQuestionUseCaseRequest): Promise<CreateQuestionUseCaseResponse> {
    const question = Question.create({
      authorId: new UniqueEntityID(authorId),
      title,
      content,
    })

    await this.questionsRepository.create(question)

    return right({
      question,
    })
  }
}
