import { UniqueEntityID } from '@/core/entities/value-objects/unique-entity-id'
import { DeleteQuestionUseCase } from '@/domain/forum/application/use-cases/delete-question'
import { NotAllowedError } from './errors/not-allowed-error'

import { makeQuestion } from 'tests/factories/make-question'
import { InMemoryQuestionsRepository } from 'tests/repositories/in-memory-questions-repository'

let questionsRepository: InMemoryQuestionsRepository
let sut: DeleteQuestionUseCase

describe('Delete Question', () => {
  beforeEach(() => {
    questionsRepository = new InMemoryQuestionsRepository()
    sut = new DeleteQuestionUseCase(questionsRepository)
  })

  it('should be able to delete a question', async () => {
    const newQuestion = makeQuestion(
      {
        authorId: new UniqueEntityID('author-1'),
      },
      new UniqueEntityID('question-1'),
    )

    await questionsRepository.create(newQuestion)

    await sut.execute({
      questionId: 'question-1',
      authorId: 'author-1',
    })

    expect(questionsRepository.items).toHaveLength(0)
  })

  it('should not be able to delete a question from another user', async () => {
    const newQuestion = makeQuestion(
      {
        authorId: new UniqueEntityID('author-1'),
      },
      new UniqueEntityID('question-1'),
    )

    await questionsRepository.create(newQuestion)

    const result = await sut.execute({
      questionId: 'question-1',
      authorId: 'author-2',
    })

    expect(result.isLeft())
    expect(result.value).toBeInstanceOf(NotAllowedError)
    expect(questionsRepository.items).toHaveLength(1)
  })
})
