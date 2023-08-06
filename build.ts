import { appendFileSync, readFileSync } from 'fs';

import { glob } from 'glob';
import { Parser } from 'htmlparser2';
import _ from 'lodash';

const base = 'node_modules/bootstrap-icons/icons';
let svg = '';

const parser = new Parser({
  onopentag(name, attr) {
    if (name === 'path') {
      if (svg.length > 0) svg += ' ';
      svg += attr['d'];
    }
  },
});

for (const file of glob.sync('*.svg', { cwd: base }).reverse()) {
  svg = '';
  parser.write(readFileSync(base + '/' + file, { encoding: 'utf-8' }));

  const filename = file.split('.')[0]!;
  appendFileSync('icons.ts', `export const ${_.camelCase('bi-' + filename)}: string = "${svg}";\n`, {
    encoding: 'utf-8',
  });
}
