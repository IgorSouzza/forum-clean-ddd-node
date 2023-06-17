import { UniqueEntityID } from '@/core/entities/value-objects/unique-entity-id'
import { EditAnswerUseCase } from '@/domain/forum/application/use-cases/edit-answer'
import { NotAllowedError } from './errors/not-allowed-error'

import { makeAnswer } from 'tests/factories/make-answer'
import { InMemoryAnswersRepository } from 'tests/repositories/in-memory-answers-repository'

let answersRepository: InMemoryAnswersRepository
let sut: EditAnswerUseCase

describe('Edit Answer', () => {
  beforeEach(() => {
    answersRepository = new InMemoryAnswersRepository()
    sut = new EditAnswerUseCase(answersRepository)
  })

  it('should be able to edit a answer', async () => {
    const newAnswer = makeAnswer({
      authorId: new UniqueEntityID('author-1'),
    })

    await answersRepository.create(newAnswer)

    await sut.execute({
      answerId: newAnswer.id.toValue(),
      authorId: 'author-1',
      content: 'New content',
    })

    expect(answersRepository.items[0]).toMatchObject({
      content: 'New content',
    })
  })

  it('should not be able to edit a answer from another user', async () => {
    const newAnswer = makeAnswer({
      authorId: new UniqueEntityID('author-1'),
    })

    await answersRepository.create(newAnswer)

    const result = await sut.execute({
      answerId: newAnswer.id.toValue(),
      authorId: 'author-2',
      content: 'New content',
    })

    expect(result.isLeft())
    expect(result.value).toBeInstanceOf(NotAllowedError)
  })
})
