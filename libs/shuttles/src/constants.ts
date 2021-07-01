export const SHUTTLES_DATABASES = {
  STOP: {
    ENV: 'SHUTTLE_STOPS_DATABASE_NAME',
    CF_OUTPUT: 'StopsTableName',
    ENTITY_TYPE: 'stop',
  },
  ROUTE: {
    ENV: 'SHUTTLE_ROUTES_DATABASE_NAME',
    CF_OUTPUT: 'RoutesTableName',
    ENTITY_TYPE: 'route',
  },
  SCHEDULE: {
    ENV: 'SHUTTLE_SCHEDULES_DATABASE_NAME',
    CF_OUTPUT: 'SchedulesTableName',
    ENTITY_TYPE: 'schedule',
  },
  DAILY_SCHEDULE: {
    ENV: 'SHUTTLE_DAILY_SCHEDULES_DATABASE_NAME',
    CF_OUTPUT: 'DailySchedulesTableName',
    ENTITY_TYPE: 'dailySchedule',
  },
} as const;
