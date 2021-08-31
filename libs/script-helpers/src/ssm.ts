import { SSM } from 'aws-sdk';

interface ParameterDetail {
  /** The parameter name in SSM */
  name: string;
  /** The environment variable that we want to set */
  ENV: string;
  /** Whether or not its encrypted */
  encrypted?: boolean;
}

export const setEnvFromSSMParameters = async (
  parameters: ParameterDetail[]
) => {
  const SSMClient = new SSM();

  await Promise.all(
    parameters.map(async (param) => {
      const value = await SSMClient.getParameter({
        Name: param.name,
        WithDecryption: param.encrypted,
      }).promise();

      if (!value || !value.Parameter || !value.Parameter.Value) {
        console.log(`Unable to set ${param.ENV} using ${param.name}`);
        return;
      }

      process.env[param.ENV] = value.Parameter.Value;
    })
  );
};
