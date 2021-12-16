export enum TransitDatabaseEnv {
  Agencies = 'AGENCIES_TABLE_NAME',
  DailyData = 'DAILY_DATA_TABLE_NAME',
  Routes = 'ROUTES_TABLE_NAME',
  Services = 'SERVICES_TABLE_NAME',
  Stops = 'STOPS_TABLE_NAME',
  Trips = 'TRIPS_TABLE_NAME',
}

export const DDB_INDEX_NAMES = {
  SERVICES: {
    /**
     * * PartitionKey: agency_id
     * * SortKey:      end_date
     */
    AGENCY_ID_END_DATE: 'agency_id-end_date-index',
  },
  TRIPS: {
    /**
     * * PartitionKey: agency_id
     * * SortKey:      service_id
     */
    AGENCY_ID_SERVICE_ID: 'agency_id-service_id-index',
  },
};
