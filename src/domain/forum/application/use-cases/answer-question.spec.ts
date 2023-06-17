import { AnswerQuestionUseCase } from '@/domain/forum/application/use-cases/answer-question'

import { InMemoryAnswersRepository } from 'tests/repositories/in-memory-answers-repository'

let answersRepository: InMemoryAnswersRepository
let sut: AnswerQuestionUseCase

describe('Create Answer', () => {
  beforeEach(() => {
    answersRepository = new InMemoryAnswersRepository()
    sut = new AnswerQuestionUseCase(answersRepository)
  })

  it('should be able to create an answer', async () => {
    const result = await sut.execute({
      questionId: '1',
      instructorId: '1',
      content: 'New request',
    })

    expect(result.isRight()).toBe(true)
    expect(result.value?.answer.content).toEqual('New request')
    expect(answersRepository.items[0]).toEqual(result.value?.answer)
  })
})
