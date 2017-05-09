import chalk from 'chalk'
import GraphUtils from '../GraphUtils.js'
import GraphDAO from '../GraphDAO.js'
import DeleteGraph from './delete.js'
import _ from 'lodash'

const createGraph = () => {
  const q = `
    CREATE (oliver: Person { name: 'Oliver Stone' }),
           (michael: Person { name: 'Michael Douglas' }),
           (charlie: Person { name: 'Charlie Sheen' }),
           (martin: Person { name: 'Martin Sheen' }),
           (rob: Person { name: 'Rob Reiner' }),

           (wallstreet: Movie { name: 'Wallstreet' }),
           (president: Movie { name: 'The American President' }),

           (oliver)-[:DIRECTED]->(wallstreet),
           (michael)-[:ACTED_IN { role: 'Gordon Gekko' }]->(wallstreet),
           (charlie)-[:ACTED_IN { role: 'Bud Fox' }]->(wallstreet),
           (michael)-[:ACTED_IN { role: 'President Andrew Shepherd' }]->(president),
           (martin)-[:ACTED_IN { role: 'Carl Fox' }]->(wallstreet),
           (martin)-[:ACTED_IN { role: 'A.J.MacInerney' }]->(president),
           (rob)-[:DIRECTED]->(president)
    RETURN oliver
  `
  console.log(chalk.dim.magenta('[Q]'), chalk.dim(q))
  return GraphUtils.runQueryAndFetchResult(q)
  .then(result => {
    console.log(chalk.dim.magenta('[Result]'), chalk.dim(JSON.stringify(result)))
    return Promise.resolve()
  })
}

const allNodes = () => {
  const q = `
    MATCH (n)
    RETURN n
  `
  console.log(chalk.dim.magenta('[Q]'), chalk.dim(q))
  return GraphUtils.runQueryAndFetchResult(q)
  .then(result => {
    console.log(chalk.dim.magenta('[Result]'), chalk.dim(JSON.stringify(result)))
    return Promise.resolve()
  })
}

const multipleRelationshipTypes = () => {
  const q = `
    MATCH (wallstreet: Movie { name: 'Wallstreet' })<-[r:ACTED_IN|DIRECTED]-(p: Person)
    RETURN p AS person, r AS relationship
  `
  console.log(chalk.dim.magenta('[Q]'), chalk.dim(q))
  return GraphUtils.runQueryAndFetchResult(q)
  .then(result => {
    console.log(chalk.dim.magenta('[Result]'), chalk.dim(JSON.stringify(result)))
    _.forEach(result, row => {
      const personName = row.person.properties.name
      const relationship = row.relationship.type
      console.log(chalk.magenta('[Person]'), chalk.bold(personName),
          chalk.magenta('[Relationship]'), chalk.bold(relationship))
    })
    return Promise.resolve()
  })
}

const addSpaceRelationship = () => {
  const q = `
    MATCH (rob :Person { name: 'Rob Reiner' }), (charlie :Person { name: 'Charlie Sheen' })
    CREATE (rob)-[r :\`TYPE WITH SPACE\`]->(charlie)
    RETURN r
  `
  console.log(chalk.dim.magenta('[Q]'), chalk.dim(q))
  return GraphUtils.runQueryAndFetchResult(q)
  .then(result => {
    console.log(chalk.dim.magenta('[Result]'), chalk.dim(JSON.stringify(result)))
    return Promise.resolve()
  })
}

const multipleRelationships = () => {
  // Find the movie in which Charlie Sheen acted and the director of those movies
  const q = `
    MATCH (charlie :Person { name: 'Charlie Sheen' })-[:ACTED_IN]->(movie :Movie)<-[:DIRECTED]-(director :Person)
    RETURN movie, director
  `
  console.log(chalk.dim.magenta('[Q]'), chalk.dim(q))
  return GraphUtils.runQueryAndFetchResult(q)
  .then(result => {
    console.log(chalk.dim.magenta('[Result]'), chalk.dim(JSON.stringify(result)))
    _.forEach(result, row => {
      const movieName = row.movie.properties.name
      const directorName = row.director.properties.name
      console.log(chalk.magenta('[Movie]'), chalk.bold(movieName),
          chalk.magenta('[Director]'), chalk.bold(directorName))
    })
    return Promise.resolve()
  })
}

const variableLengthRelationship = () => {
  const q = `
    MATCH (martin :Person { name: 'Martin Sheen' })-[:ACTED_IN*1..3]->(movie :Movie)
    RETURN movie
  `
  console.log(chalk.dim.magenta('[Q]'), chalk.dim(q))
  return GraphUtils.runQueryAndFetchResult(q)
  .then(result => {
    console.log(chalk.dim.magenta('[Result]'), chalk.dim(JSON.stringify(result)))
    _.forEach(result, row => {
      const movieName = row.movie.properties.name
      console.log(chalk.magenta('[Movie]'), chalk.bold(movieName))
    })
    return Promise.resolve()
  })
}

const coActors = () => {
  // Find Martin Sheen's coactors in movies
  const q = `
    MATCH (martin :Person { name: 'Martin Sheen' })-[:ACTED_IN]->(movie :Movie)<-[:ACTED_IN]-(actor :Person)
    RETURN actor, movie
  `
  console.log(chalk.dim.magenta('[Q]'), chalk.dim(q))
  return GraphUtils.runQueryAndFetchResult(q)
  .then(result => {
    console.log(chalk.dim.magenta('[Result]'), chalk.dim(JSON.stringify(result)))
    _.forEach(result, row => {
      const movieName = row.movie.properties.name
      const actorName = row.actor.properties.name
      console.log(chalk.magenta('[Movie]'), chalk.bold(movieName),
          chalk.magenta('[Actor]'), chalk.bold(actorName)) 
    })
    return Promise.resolve()
  })
}

const namedPath = () => {
  const q = `
    MATCH p = (mike :Person { name: 'Michael Douglas' })-->()
    RETURN p
  `
  console.log(chalk.dim.magenta('[Q]'), chalk.dim(q))
  return GraphUtils.runQueryAndFetchResult(q)
  .then(result => {
    console.log(chalk.dim.magenta('[Result]'), chalk.dim(JSON.stringify(result)))
    return Promise.resolve()
  })
}

const singleShortestPath = () => {
  const q = `
    MATCH (martin :Person { name: 'Martin Sheen' }), (oliver :Person { name: 'Oliver Stone' }),
      p = shortestPath((martin)-[*0..15]-(oliver))
    RETURN p
  `
  console.log(chalk.dim.magenta('[Q]'), chalk.dim(q))
  return GraphUtils.runQueryAndFetchResult(q)
  .then(result => {
    console.log(chalk.dim.magenta('[Result]'), chalk.dim(JSON.stringify(result)))
    _.forEach(result[0].p.segments, segment => {
      let pathString = ''
      pathString += `(${segment.start.properties.name} :${segment.start.labels[0]})`
      pathString += `-[:${segment.relationship.type}]-`
      pathString += `(${segment.end.properties.name} :${segment.end.labels[0]})`
      console.log(chalk.green(pathString))
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
    return allNodes()
  })
  .then(() => {
    return multipleRelationshipTypes()
  })
  .then(() => {
    return addSpaceRelationship()
  })
  .then(() => {
    return multipleRelationships()
  })
  .then(() => {
    return variableLengthRelationship()
  })
  .then(() => {
    return coActors()
  })
  .then(() => {
    return namedPath()
  })
  .then(() => {
    return singleShortestPath()
  })
  .then(() => {
    console.log(chalk.bold.cyan('[ENDING]'))
    GraphDAO.shutdown()
  })
}

main()