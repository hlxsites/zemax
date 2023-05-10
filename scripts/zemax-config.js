export default function getEnvironmentConfig(environment) {
  const envData = {
    dev: {
      profile: {
        dynamic365domain: 'https://zemaxportalfunctions.azurewebsites.net/api/',
      },
    },
    prod: {
      profile: {
        dynamic365domain: 'https://zemaxportalfunctions.azurewebsites.net/api/',
      },
    },
  };
  return envData[environment];
}
