import { UniqueEntityID } from '@/core/entities/value-objects/unique-entity-id'
import { EditQuestionUseCase } from '@/domain/forum/application/use-cases/edit-question'
import { NotAllowedError } from './errors/not-allowed-error'

import { makeQuestion } from 'tests/factories/make-question'
import { InMemoryQuestionsRepository } from 'tests/repositories/in-memory-questions-repository'

let questionsRepository: InMemoryQuestionsRepository
let sut: EditQuestionUseCase

describe('Edit Question', () => {
  beforeEach(() => {
    questionsRepository = new InMemoryQuestionsRepository()
    sut = new EditQuestionUseCase(questionsRepository)
  })

  it('should be able to edit a question', async () => {
    const newQuestion = makeQuestion({
      authorId: new UniqueEntityID('author-1'),
    })

    await questionsRepository.create(newQuestion)

    await sut.execute({
      questionId: newQuestion.id.toValue(),
      authorId: 'author-1',
      title: 'New title',
      content: 'New content',
    })

    expect(questionsRepository.items[0]).toMatchObject({
      title: 'New title',
      content: 'New content',
    })
  })

  it('should not be able to edit a question from another user', async () => {
    const newQuestion = makeQuestion({
      authorId: new UniqueEntityID('author-1'),
    })

    await questionsRepository.create(newQuestion)

    const result = await sut.execute({
      questionId: newQuestion.id.toValue(),
      authorId: 'author-2',
      title: 'New title',
      content: 'New content',
    })

    expect(result.isLeft())
    expect(result.value).toBeInstanceOf(NotAllowedError)
  })
})
