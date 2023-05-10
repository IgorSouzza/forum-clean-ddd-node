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
    const { answer } = await sut.execute({
      questionId: '1',
      instructorId: '1',
      content: 'New request',
    })

    expect(answer.content).toEqual('New request')
    expect(answersRepository.items[0].id).toEqual(answer.id)
  })
})
