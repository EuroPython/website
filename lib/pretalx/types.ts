export type Answer = {
  id: number;
  question: Question;
  answer: string;
  answer_file: any;
  submission: string;
  person: any;
  options: any[];
};

export type Question = {
  id: number;
  question: QuestionValue;
  required: boolean;
  target: string;
  options: any[];
};

export type QuestionValue = {
  en: string;
};
