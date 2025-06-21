import jsdomGlobal from 'jsdom-global'
import { use } from 'chai'
import sinonChai from 'sinon-chai'
import { register } from 'node:module'
import { pathToFileURL } from 'node:url'

register('@your-riot/register', pathToFileURL('./'))

use(sinonChai)

jsdomGlobal()
