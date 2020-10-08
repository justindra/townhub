import {
  HELLO_CAMEL,
  HELLO_SENTENCE,
  HELLOCLASS,
  TEST,
} from '@townhub-libs/core';

class TestClass {
  magic: TEST;
  constructor() {
    this.magic = `magic = ${HELLO_CAMEL}`;
  }
}

export const hello = async (event) => {
  const a = new TestClass();
  const b = new HELLOCLASS();
  return {
    statusCode: 200,
    body: JSON.stringify(
      {
        message: 'Go Serverless v1.0! Your function executed successfully!',
        test: `${HELLO_CAMEL}, ${HELLO_SENTENCE}, ${a.magic}, ${b.getSome()}`,
        input: event,
      },
      null,
      2
    ),
  };
};
