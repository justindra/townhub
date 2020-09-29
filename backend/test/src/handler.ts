import { HELLO_CAMEL, YAY, HELLO_SENTENCE } from '@townhub-libs/core';

class TestClass {
  magic: string;
  constructor() {
    this.magic = `magic = ${HELLO_CAMEL}`;
  }
}

export const hello = async (event) => {
  const a = new TestClass();
  return {
    statusCode: 200,
    body: JSON.stringify(
      {
        message: 'Go Serverless v1.0! Your function executed successfully!',
        test: `${HELLO_CAMEL}, ${HELLO_SENTENCE}, ${YAY}, ${a.magic}`,
        input: event,
      },
      null,
      2
    ),
  };
};
