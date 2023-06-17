import { Either, left, right } from '@/core/either'

import { Question } from '@/domain/forum/enterprise/entities/question'
import { QuestionsRepository } from '@/domain/forum/application/repositories/questions-repository'

import { NotAllowedError } from './errors/not-allowed-error'
import { ResourceNotFoundError } from './errors/resource-not-found-error'

type EditQuestionUseCaseRequest = {
  authorId: string
  questionId: string
  title: string
  content: string
}

type EditQuestionUseCaseResponse = Either<
  ResourceNotFoundError | NotAllowedError,
  {
    question: Question
  }
>

export class EditQuestionUseCase {
  constructor(private readonly questionsRepository: QuestionsRepository) {}

  async execute({
    authorId,
    questionId,
    title,
    content,
  }: EditQuestionUseCaseRequest): Promise<EditQuestionUseCaseResponse> {
    const question = await this.questionsRepository.findById(questionId)

    if (!question) {
      return left(new ResourceNotFoundError())
    }

    if (authorId !== question.authorId.toString()) {
      return left(new NotAllowedError())
    }

    question.title = title
    question.content = content

    await this.questionsRepository.save(question)

    return right({
      question,
    })
  }
}
