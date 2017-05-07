import _ from 'lodash'
import GraphDAO from './GraphDAO.js'

class GraphUtils {

  static convertRecursive(value) {
    if (value && value.low) {
      return value.toNumber()
    }
    if (!_.isObject(value)) {
      return value
    }
    _.forEach(value, (v, k) => {
      value[k] = GraphUtils.convertRecursive(v)
    })
    return value
  }
  
  static convertCypherResultToObject(cypherResult) {
    const results = []
    _.forEach(cypherResult.records, record => {
      const properties = {}
      _.forEach(record.keys, f => {
        properties[f] = GraphUtils.convertRecursive(record.get(f));
      })
      results.push(properties)
    })
    return results
  }

  static runQueryAndFetchResult(query) {
    return GraphDAO.cypher(query)
    .then(data => {
      const result = GraphUtils.convertCypherResultToObject(data);
      return result
    })
  }

}

module.exports = GraphUtils
