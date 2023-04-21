import { Answer } from '@/domain/entities/answer'
import { AnswersRepository } from '@/domain/repositories/answers-repository'
import { AnswerQuestionUseCase } from '@/domain/use-cases/answer-question'

const fakeAnswersRepository: AnswersRepository = {
  create: async (answer: Answer) => {},
}

test('create an answer', async () => {
  const answerQuestion = new AnswerQuestionUseCase(fakeAnswersRepository)
  const answer = await answerQuestion.execute({
    questionId: '1',
    instructorId: '1',
    content: 'New request',
  })

  expect(answer.content).toEqual('New request')
})
