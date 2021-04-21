import { generateConfigFromPackageJson } from '../../build/rollup.config';
import packageDetails from './package.json';

export default generateConfigFromPackageJson(packageDetails);
