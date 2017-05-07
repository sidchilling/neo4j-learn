import { v1 as neo4j } from 'neo4j-driver'
import config from './config.js'

if (neo4j && config.neo4j) {
    module.exports = new neo4j.driver(config.neo4j.boltUrl,
                                      neo4j.auth.basic(config.neo4j.username, config.neo4j.password));
} else {
    module.exports = {}
}