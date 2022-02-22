import { APIGatewayProxyHandlerV2 } from 'aws-lambda';
import { Sample } from '@townhub/core';
import { AgenciesTable } from '@townhub/core/transit';
import { v4 } from 'uuid';

const AgenciesClient = new AgenciesTable();

export const handler: APIGatewayProxyHandlerV2 = async () => {
  const result = Sample.foo();
  // const records = await AgenciesClient.create(
  //   {
  //     name: 'test',
  //     url: 'https://google.com',
  //     imported_id: null,
  //     timezone: 'America/Los_Angeles',
  //     lang: 'en',
  //     phone: null,
  //     fare_url: null,
  //     email: null,
  //   },
  //   v4()
  // );

  const records = await AgenciesClient.update(
    '3d021873-d550-4eb2-9f5d-a6ca560b7ab7',
    {
      name: 'new name',
    },
    v4()
  );
  return {
    statusCode: 200,
    body: JSON.stringify({ result, records }),
  };
};
