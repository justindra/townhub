import { setup } from 'jest-dynalite';
import { tableConfigurations } from './jest-dynalite-config';

// You must give it a config directory
setup(__dirname);

// Then setup the environment variables as required
tableConfigurations.forEach((table) => {
  process.env[table.EnvVariableName] = table.TableName;
});
