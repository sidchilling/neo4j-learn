import graphDB from './neo4jdb.js'
import { v1 as neo4j } from 'neo4j-driver';
import chalk from 'chalk'

class GraphDAO {

  static closeSession(session) {
    const fn = (error, r) => {
      try {
        session.close()
      } catch (e) {
        console.log(chalk.error('[Error while closing session]'), chalk.dim(e))
      }
      if (error) {
        return Promise.reject(r)
      }
      return r
    }
    return [fn.bind(null, false), fn.bind(null, true)]
  }

  static cypher(query, params, sessionOrTx) {
    if (sessionOrTx) {
      return sessionOrTx.run(query, params)
    }
    const session = graphDB.session()
    return session.run(query, params)
    .then(...GraphDAO.closeSession(session));
  }

  static shutdown() {
    console.log(chalk.dim.bold('Shutting down GraphDAO'))
    graphDB.close()
  }

  static session() {
    return graphDB.session()
  }

  static isInt(value) {
    return neo4j.isInt(value)
  }

}

module.exports = GraphDAO
