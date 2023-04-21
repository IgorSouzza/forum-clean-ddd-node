import { Answer } from "@/domain/entities/answer";
import { AnswersRepository } from "@/domain/repositories/answers-repository";

import { UniqueEntityID } from "@/core/entities/value-objects/unique-entity-id";

type AnswerQuestionUseCaseRequest = {
  instructorId: string;
  questionId: string;
  content: string;
};

export class AnswerQuestionUseCase {
  constructor(private readonly answersRepository: AnswersRepository) {}

  async execute({
    instructorId,
    questionId,
    content,
  }: AnswerQuestionUseCaseRequest) {
    const answer = Answer.create({
      content,
      authorId: new UniqueEntityID(instructorId),
      questionId: new UniqueEntityID(questionId),
    });

    await this.answersRepository.create(answer);

    return answer;
  }
}
