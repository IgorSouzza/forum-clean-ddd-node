import { CommentOnAnswerUseCase } from '@/domain/forum/application/use-cases/comment-on-answer'

import { makeAnswer } from 'tests/factories/make-answer'
import { InMemoryAnswersRepository } from 'tests/repositories/in-memory-answers-repository'
import { InMemoryAnswerCommentRepository } from 'tests/repositories/in-memory-answer-comments-repository'

let answersRepository: InMemoryAnswersRepository
let answerCommentRepository: InMemoryAnswerCommentRepository
let sut: CommentOnAnswerUseCase

describe('Comment on Answer', () => {
  beforeEach(() => {
    answersRepository = new InMemoryAnswersRepository()
    answerCommentRepository = new InMemoryAnswerCommentRepository()
    sut = new CommentOnAnswerUseCase(answersRepository, answerCommentRepository)
  })

  it('should be able to comment on answer', async () => {
    const answer = makeAnswer()

    await answersRepository.create(answer)

    await sut.execute({
      authorId: answer.authorId.toString(),
      answerId: answer.id.toString(),
      content: 'Test comment',
    })

    expect(answerCommentRepository.items[0].content).toEqual('Test comment')
  })
})
