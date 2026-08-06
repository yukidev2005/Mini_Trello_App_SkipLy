import fs from 'fs'
import path from 'path'
import yaml from 'yaml'

const swaggerPath = path.resolve(__dirname, '../swagger/swagger.yaml')
const swaggerDocument = yaml.parse(fs.readFileSync(swaggerPath, 'utf8'))

export { swaggerDocument }
