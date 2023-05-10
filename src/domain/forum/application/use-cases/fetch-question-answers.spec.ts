import { FetchQuestionAnswersUseCase } from '@/domain/forum/application/use-cases/fetch-question-answers'
import { UniqueEntityID } from '@/core/entities/value-objects/unique-entity-id'

import { makeAnswer } from 'tests/factories/make-answer'
import { InMemoryAnswersRepository } from 'tests/repositories/in-memory-answers-repository'

let answersRepository: InMemoryAnswersRepository
let sut: FetchQuestionAnswersUseCase

describe('Fetch Question Answers', () => {
  beforeEach(() => {
    answersRepository = new InMemoryAnswersRepository()
    sut = new FetchQuestionAnswersUseCase(answersRepository)
  })

  it('should be able to fetch question answers', async () => {
    await answersRepository.create(
      makeAnswer({ questionId: new UniqueEntityID('question-1') }),
    )
    await answersRepository.create(
      makeAnswer({ questionId: new UniqueEntityID('question-1') }),
    )
    await answersRepository.create(
      makeAnswer({ questionId: new UniqueEntityID('question-1') }),
    )

    const { answers } = await sut.execute({ questionId: 'question-1', page: 1 })

    expect(answers).toHaveLength(3)
  })

  it('should be able to fetch paginated question answers', async () => {
    for (let i = 1; i <= 22; i++) {
      await answersRepository.create(
        makeAnswer({ questionId: new UniqueEntityID('question-1') }),
      )
    }

    const { answers } = await sut.execute({
      questionId: 'question-1',
      page: 2,
    })

    expect(answers).toHaveLength(2)
  })
})
