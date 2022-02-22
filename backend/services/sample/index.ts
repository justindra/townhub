import { APIGatewayProxyHandlerV2 } from 'aws-lambda';
import { Sample } from '@townhub/core';
import { AgenciesTable, StopsTable } from '@townhub/core/transit';
import { Stop } from 'transit/stops/interfaces';

const AgenciesClient = new AgenciesTable();
const StopsClient = new StopsTable();

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

  // const records = await AgenciesClient.update(
  //   '3d021873-d550-4eb2-9f5d-a6ca560b7ab7',
  //   {
  //     name: 'new name',
  //   },
  //   v4()
  // );

  await StopsClient.create(
    {
      name: 'stop X',
      lat: 0.2,
      lon: 0.3,
    } as Stop,
    '82571933-b93e-4db8-a852-7fefbf2a4ec5'
  );

  const records = await StopsClient.list();

  return {
    statusCode: 200,
    body: JSON.stringify(records),
  };
};
