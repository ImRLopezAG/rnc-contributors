import { rncService } from '@services/rnc-service';
import { readFile } from 'node:fs/promises'

const file = await readFile('data.csv', 'utf-8');

const contributors = rncService().getContributors(file);

console.log(contributors.get('101591315'));

