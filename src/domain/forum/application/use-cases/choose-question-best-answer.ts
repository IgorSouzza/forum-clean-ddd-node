import { Either, left, right } from '@/core/either'

import { Question } from '@/domain/forum/enterprise/entities/question'

import { AnswersRepository } from '../repositories/answers-repository'
import { QuestionsRepository } from '../repositories/questions-repository'

import { ResourceNotFoundError } from './errors/resource-not-found-error'
import { NotAllowedError } from './errors/not-allowed-error'

type ChooseQuestionBestAnswerUseCaseRequest = {
  answerId: string
  authorId: string
}

type ChooseQuestionBestAnswerUseCaseResponse = Either<
  ResourceNotFoundError | NotAllowedError,
  {
    question: Question
  }
>

export class ChooseQuestionBestAnswerUseCase {
  constructor(
    private readonly questionsRepository: QuestionsRepository,
    private readonly answersRepository: AnswersRepository,
  ) {}

  async execute({
    answerId,
    authorId,
  }: ChooseQuestionBestAnswerUseCaseRequest): Promise<ChooseQuestionBestAnswerUseCaseResponse> {
    const answer = await this.answersRepository.findById(answerId)

    if (!answer) {
      return left(new ResourceNotFoundError())
    }

    const question = await this.questionsRepository.findById(
      answer.questionId.toString(),
    )

    if (!question) {
      return left(new ResourceNotFoundError())
    }

    if (authorId !== question.authorId.toString()) {
      return left(new NotAllowedError())
    }

    question.bestAnswerId = answer.id

    await this.questionsRepository.save(question)

    return right({
      question,
    })
  }
}
