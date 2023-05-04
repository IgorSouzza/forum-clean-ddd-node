import { QuestionsRepository } from '@/domain/forum/application/repositories/questions-repository'

type DeleteQuestionUseCaseRequest = {
  authorId: string
  questionId: string
}

type DeleteQuestionUseCaseResponse = {}

export class DeleteQuestionUseCase {
  constructor(private readonly questionsRepository: QuestionsRepository) {}

  async execute({
    authorId,
    questionId,
  }: DeleteQuestionUseCaseRequest): Promise<DeleteQuestionUseCaseResponse> {
    const question = await this.questionsRepository.findById(questionId)

    if (!question) {
      throw new Error('Question not found')
    }

    if (authorId !== question.authorId.toString()) {
      throw new Error('Not allowed')
    }

    await this.questionsRepository.delete(question)

    return {}
  }
}
