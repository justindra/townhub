import { sentenceCase } from 'change-case';
import { YAY } from './another';

export const HELLO_CAMEL = 'helloWorld';
export const HELLO_SENTENCE = sentenceCase(HELLO_CAMEL);

export class HELLOCLASS {
  constructor() {
    console.log('yay');
  }

  getSome() {
    return 'asdasd';
  }
}

export type TEST = string;

export { YAY };
