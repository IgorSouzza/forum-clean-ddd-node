import { UniqueEntityID } from '@/core/entities/value-objects/unique-entity-id'
import { DeleteAnswerCommentUseCase } from '@/domain/forum/application/use-cases/delete-answer-comment'

import { makeAnswerComment } from 'tests/factories/make-answer-comment'
import { InMemoryAnswerCommentsRepository } from 'tests/repositories/in-memory-answer-comments-repository'

let answerCommentRepository: InMemoryAnswerCommentsRepository
let sut: DeleteAnswerCommentUseCase

describe('Delete Answer Comment', () => {
  beforeEach(() => {
    answerCommentRepository = new InMemoryAnswerCommentsRepository()
    sut = new DeleteAnswerCommentUseCase(answerCommentRepository)
  })

  it('should be able to delete a answer comment', async () => {
    const answerComment = makeAnswerComment()

    await answerCommentRepository.create(answerComment)

    await sut.execute({
      authorId: answerComment.authorId.toString(),
      answerCommentId: answerComment.id.toString(),
    })

    expect(answerCommentRepository.items).toHaveLength(0)
  })

  it('should not be able to delete another user answer comment', async () => {
    const answerComment = makeAnswerComment({
      authorId: new UniqueEntityID('author-1'),
    })

    await answerCommentRepository.create(answerComment)

    await expect(() => {
      return sut.execute({
        answerCommentId: answerComment.id.toString(),
        authorId: 'author-2',
      })
    }).rejects.toBeInstanceOf(Error)

    expect(answerCommentRepository.items).toHaveLength(1)
  })
})
