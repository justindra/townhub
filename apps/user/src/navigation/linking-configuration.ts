import * as Linking from 'expo-linking';
import { LinkingOptions } from '@react-navigation/native';

export const LinkingConfiguration: LinkingOptions =  {
  prefixes: [Linking.makeUrl('/')],
  config: {
    screens: {
      root: '',
      shuttles: 'shuttles',
      notFound: '*',
    },
  },
};