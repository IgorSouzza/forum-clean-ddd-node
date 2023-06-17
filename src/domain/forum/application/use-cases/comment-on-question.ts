import { Either, left, right } from '@/core/either'
import { UniqueEntityID } from '@/core/entities/value-objects/unique-entity-id'

import { QuestionComment } from '@/domain/forum/enterprise/entities/question-comment'
import { QuestionsRepository } from '@/domain/forum/application/repositories/questions-repository'
import { QuestionCommentsRepository } from '@/domain/forum/application/repositories/question-comments-repository'

import { ResourceNotFoundError } from './errors/resource-not-found-error'

type CommentOnQuestionUseCaseRequest = {
  authorId: string
  questionId: string
  content: string
}

type CommentOnQuestionUseCaseResponse = Either<
  ResourceNotFoundError,
  {
    questionComment: QuestionComment
  }
>

export class CommentOnQuestionUseCase {
  constructor(
    private readonly questionsRepository: QuestionsRepository,
    private readonly questionCommentRepository: QuestionCommentsRepository,
  ) {}

  async execute({
    authorId,
    questionId,
    content,
  }: CommentOnQuestionUseCaseRequest): Promise<CommentOnQuestionUseCaseResponse> {
    const question = await this.questionsRepository.findById(questionId)

    if (!question) {
      return left(new ResourceNotFoundError())
    }

    const questionComment = QuestionComment.create({
      authorId: new UniqueEntityID(authorId),
      questionId: new UniqueEntityID(questionId),
      content,
    })

    await this.questionCommentRepository.create(questionComment)

    return right({
      questionComment,
    })
  }
}
