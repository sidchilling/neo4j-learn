import chalk from 'chalk'
import GraphUtils from '../GraphUtils.js'
import GraphDAO from '../GraphDAO.js'
import DeleteGraph from './delete.js'
import _ from 'lodash'

const createGraph = () => {
  const q = `
    CREATE (anders: GPerson { name: 'Anders' }),
           (dilshad: GPerson { name: 'Dilshad' }),
           (cesar: GPerson { name: 'Cesar' }),
           (becky: GPerson { name: 'Becky' }),
           (filipa: GPerson { name: 'Filipa' }),
           (emil: GPerson { name: 'Emil' }),

           (anders)-[r1: KNOWS]->(dilshad),
           (anders)-[r2: KNOWS]->(cesar),
           (anders)-[r3: KNOWS]->(becky),
           (dilshad)-[r4: KNOWS]->(filipa),
           (cesar)-[r5: KNOWS]->(emil),
           (becky)-[r6: KNOWS]->(emil)
    
    RETURN anders, dilshad, cesar, becky, filipa, emil
  `
  console.log(chalk.dim.magenta('[Q]'), chalk.dim(q))
  return GraphUtils.runQueryAndFetchResult(q)
  .then(result => {
    console.log(chalk.dim.magenta('[Result]'), chalk.dim(JSON.stringify(result)))
    return Promise.resolve()
  })
}

const variableLengthPattern = () => {
  const q = `
    MATCH (filipa)-[:KNOWS*1..2]-(remoteFriend)
    WHERE filipa.name = 'Filipa'
    RETURN remoteFriend
  `
  console.log(chalk.dim.magenta('[Q]'), chalk.dim(q))
  return GraphUtils.runQueryAndFetchResult(q)
  .then(result => {
    console.log(chalk.dim.magenta('[Result]'), chalk.dim(JSON.stringify(result)))
    _.forEach(result, row => {
      const friendName = row.remoteFriend.properties.name
      console.log(chalk.magenta('[Remote Friend]'), chalk.bold(friendName))
    })
    return Promise.resolve()
  })
}

const main = () => {
  console.log(chalk.bold.cyan('[STARTING]'))
  return DeleteGraph.deleteAllFromGraph()
  .then(() => {
    return createGraph()
  })
  .then(() => {
    return variableLengthPattern()
  })
  .then(() => {
    console.log(chalk.bold.cyan('[ENDING]'))
    GraphDAO.shutdown()
  })
}

main()
