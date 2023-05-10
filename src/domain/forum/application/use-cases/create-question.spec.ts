import { UniqueEntityID } from '@/core/entities/value-objects/unique-entity-id'
import { CreateQuestionUseCase } from '@/domain/forum/application/use-cases/create-question'

import { InMemoryQuestionsRepository } from 'tests/repositories/in-memory-questions-repository'

let questionsRepository: InMemoryQuestionsRepository
let sut: CreateQuestionUseCase

describe('Create Question', () => {
  beforeEach(() => {
    questionsRepository = new InMemoryQuestionsRepository()
    sut = new CreateQuestionUseCase(questionsRepository)
  })

  it('should be able to create a question', async () => {
    const { question } = await sut.execute({
      authorId: '1',
      title: 'New Question',
      content: 'Question content',
    })

    expect(question.id).toEqual(expect.any(UniqueEntityID))
    expect(questionsRepository.items[0].id).toEqual(question.id)
  })
})
