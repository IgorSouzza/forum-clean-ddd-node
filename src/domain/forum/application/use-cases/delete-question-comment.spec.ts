import { UniqueEntityID } from '@/core/entities/value-objects/unique-entity-id'
import { DeleteQuestionCommentUseCase } from '@/domain/forum/application/use-cases/delete-question-comment'
import { NotAllowedError } from './errors/not-allowed-error'

import { makeQuestionComment } from 'tests/factories/make-question-comment'
import { InMemoryQuestionCommentsRepository } from 'tests/repositories/in-memory-question-comments-repository'

let questionCommentsRepository: InMemoryQuestionCommentsRepository
let sut: DeleteQuestionCommentUseCase

describe('Delete Question Comment', () => {
  beforeEach(() => {
    questionCommentsRepository = new InMemoryQuestionCommentsRepository()
    sut = new DeleteQuestionCommentUseCase(questionCommentsRepository)
  })

  it('should be able to delete a question comment', async () => {
    const questionComment = makeQuestionComment()

    await questionCommentsRepository.create(questionComment)

    await sut.execute({
      authorId: questionComment.authorId.toString(),
      questionCommentId: questionComment.id.toString(),
    })

    expect(questionCommentsRepository.items).toHaveLength(0)
  })

  it('should not be able to delete another user question comment', async () => {
    const questionComment = makeQuestionComment({
      authorId: new UniqueEntityID('author-1'),
    })

    await questionCommentsRepository.create(questionComment)

    const result = await sut.execute({
      questionCommentId: questionComment.id.toString(),
      authorId: 'author-2',
    })

    expect(result.isLeft())
    expect(result.value).toBeInstanceOf(NotAllowedError)
    expect(questionCommentsRepository.items).toHaveLength(1)
  })
})
