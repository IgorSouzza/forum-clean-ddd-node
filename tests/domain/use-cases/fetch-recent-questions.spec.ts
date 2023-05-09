import { FetchRecentQuestionsUseCase } from '@/domain/forum/application/use-cases/fetch-recent-questions'

import { makeQuestion } from 'tests/factories/make-question'
import { InMemoryQuestionsRepository } from '../repositories/in-memory-questions-repository'

let questionsRepository: InMemoryQuestionsRepository
let sut: FetchRecentQuestionsUseCase

describe('Fetch Recents Questions', () => {
  beforeEach(() => {
    questionsRepository = new InMemoryQuestionsRepository()
    sut = new FetchRecentQuestionsUseCase(questionsRepository)
  })

  it('should be able to fetch recent questions', async () => {
    await questionsRepository.create(
      makeQuestion({ createdAt: new Date(2022, 0, 20) }),
    )
    await questionsRepository.create(
      makeQuestion({ createdAt: new Date(2022, 0, 18) }),
    )
    await questionsRepository.create(
      makeQuestion({ createdAt: new Date(2022, 0, 23) }),
    )

    const { questions } = await sut.execute({ page: 1 })

    expect(questions).toEqual([
      expect.objectContaining({ createdAt: new Date(2022, 0, 23) }),
      expect.objectContaining({ createdAt: new Date(2022, 0, 20) }),
      expect.objectContaining({ createdAt: new Date(2022, 0, 18) }),
    ])
  })

  it('should be able to fetch paginated recent questions', async () => {
    for (let i = 1; i <= 22; i++) {
      await questionsRepository.create(makeQuestion())
    }

    const { questions } = await sut.execute({ page: 2 })

    expect(questions).toHaveLength(2)
  })
})
