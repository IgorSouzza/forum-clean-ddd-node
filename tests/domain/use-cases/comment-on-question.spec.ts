import { CommentOnQuestionUseCase } from '@/domain/forum/application/use-cases/comment-on-question'

import { makeQuestion } from 'tests/factories/make-question'
import { InMemoryQuestionsRepository } from '../repositories/in-memory-questions-repository'
import { InMemoryQuestionCommentRepository } from '../repositories/in-memory-question-comment-repository'

let questionsRepository: InMemoryQuestionsRepository
let questionCommentRepository: InMemoryQuestionCommentRepository
let sut: CommentOnQuestionUseCase

describe('Comment on Question', () => {
  beforeEach(() => {
    questionsRepository = new InMemoryQuestionsRepository()
    questionCommentRepository = new InMemoryQuestionCommentRepository()
    sut = new CommentOnQuestionUseCase(
      questionsRepository,
      questionCommentRepository,
    )
  })

  it('should be able to comment on question', async () => {
    const question = makeQuestion()

    await questionsRepository.create(question)

    await sut.execute({
      authorId: question.authorId.toString(),
      questionId: question.id.toString(),
      content: 'Test comment',
    })

    expect(questionCommentRepository.items[0].content).toEqual('Test comment')
  })
})
