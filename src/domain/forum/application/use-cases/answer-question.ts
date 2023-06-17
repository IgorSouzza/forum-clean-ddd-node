import { Either, right } from '@/core/either'
import { UniqueEntityID } from '@/core/entities/value-objects/unique-entity-id'

import { Answer } from '@/domain/forum/enterprise/entities/answer'
import { AnswersRepository } from '@/domain/forum/application/repositories/answers-repository'

type AnswerQuestionUseCaseRequest = {
  instructorId: string
  questionId: string
  content: string
}

type AnswerQuestionUseCaseResponse = Either<
  null,
  {
    answer: Answer
  }
>

export class AnswerQuestionUseCase {
  constructor(private readonly answersRepository: AnswersRepository) {}

  async execute({
    instructorId,
    questionId,
    content,
  }: AnswerQuestionUseCaseRequest): Promise<AnswerQuestionUseCaseResponse> {
    const answer = Answer.create({
      content,
      authorId: new UniqueEntityID(instructorId),
      questionId: new UniqueEntityID(questionId),
    })

    await this.answersRepository.create(answer)

    return right({
      answer,
    })
  }
}
