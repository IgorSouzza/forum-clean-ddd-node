import { ChooseQuestionBestAnswerUseCase } from '@/domain/forum/application/use-cases/choose-question-best-answer'
import { UniqueEntityID } from '@/core/entities/value-objects/unique-entity-id'

import { makeQuestion } from 'tests/factories/make-question'
import { makeAnswer } from 'tests/factories/make-answer'
import { InMemoryAnswersRepository } from 'tests/repositories/in-memory-answers-repository'
import { InMemoryQuestionsRepository } from 'tests/repositories/in-memory-questions-repository'
import { NotAllowedError } from './errors/not-allowed-error'

let questionsRepository: InMemoryQuestionsRepository
let answersRepository: InMemoryAnswersRepository
let sut: ChooseQuestionBestAnswerUseCase

describe('Choose Question Best Answer', () => {
  beforeEach(() => {
    answersRepository = new InMemoryAnswersRepository()
    questionsRepository = new InMemoryQuestionsRepository()

    sut = new ChooseQuestionBestAnswerUseCase(
      questionsRepository,
      answersRepository,
    )
  })

  it('should be able to choose the question best answer', async () => {
    const question = makeQuestion()
    const answer = makeAnswer({
      questionId: question.id,
    })

    await questionsRepository.create(question)
    await answersRepository.create(answer)

    const result = await sut.execute({
      answerId: answer.id.toString(),
      authorId: question.authorId.toString(),
    })

    expect(result.isRight()).toBe(true)
    expect(questionsRepository.items[0].bestAnswerId).toEqual(answer.id)
  })

  it('should not be able to choose another user question best answer', async () => {
    const question = makeQuestion({
      authorId: new UniqueEntityID('author-1'),
    })
    const answer = makeAnswer({
      questionId: question.id,
    })

    await questionsRepository.create(question)
    await answersRepository.create(answer)

    const result = await sut.execute({
      answerId: answer.id.toString(),
      authorId: 'author-2',
    })

    expect(result.isLeft())
    expect(result.value).toBeInstanceOf(NotAllowedError)
  })
})
