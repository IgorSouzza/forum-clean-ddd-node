import { FetchAnswerCommentsUseCase } from '@/domain/forum/application/use-cases/fetch-answer-comments'
import { UniqueEntityID } from '@/core/entities/value-objects/unique-entity-id'

import { makeAnswerComment } from 'tests/factories/make-answer-comment'
import { InMemoryAnswerCommentsRepository } from 'tests/repositories/in-memory-answer-comments-repository'

let answerCommentsRepository: InMemoryAnswerCommentsRepository
let sut: FetchAnswerCommentsUseCase

describe('Fetch Answer Comments', () => {
  beforeEach(() => {
    answerCommentsRepository = new InMemoryAnswerCommentsRepository()
    sut = new FetchAnswerCommentsUseCase(answerCommentsRepository)
  })

  it('should be able to fetch answer comments', async () => {
    await answerCommentsRepository.create(
      makeAnswerComment({ answerId: new UniqueEntityID('answer-1') }),
    )
    await answerCommentsRepository.create(
      makeAnswerComment({ answerId: new UniqueEntityID('answer-1') }),
    )
    await answerCommentsRepository.create(
      makeAnswerComment({ answerId: new UniqueEntityID('answer-1') }),
    )

    const result = await sut.execute({
      answerId: 'answer-1',
      page: 1,
    })

    expect(result.value?.answerComments).toHaveLength(3)
  })

  it('should be able to fetch paginated answer comments', async () => {
    for (let i = 1; i <= 22; i++) {
      await answerCommentsRepository.create(
        makeAnswerComment({ answerId: new UniqueEntityID('answer-1') }),
      )
    }

    const result = await sut.execute({
      answerId: 'answer-1',
      page: 2,
    })

    expect(result.value?.answerComments).toHaveLength(2)
  })
})
