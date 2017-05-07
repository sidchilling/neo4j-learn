import chalk from 'chalk'
import GraphUtils from '../GraphUtils.js'
import GraphDAO from '../GraphDAO.js'
import DeleteGraph from './delete.js'
import _ from 'lodash'

const createGraph = () => {
  const q = `
    CREATE (martin: Person { name: 'Martin Sheen' }),
           (charlie: Person { name: 'Charlie Sheen', realName: 'Carlos Irwin Estevez' }),

           (wallstreet: Movie { title: 'Wallstreet', year: 1987 }),
           (apocalypse: Movie { title: 'Apocalpse Now', year: 1979 }),
           (redDawn: Movie { title: 'Red Dawn', year: 1984 }),

           (martin)-[:ACTED_IN]->(wallstreet),
           (martin)-[:ACTED_IN]->(apocalypse),

           (charlie)-[:ACTED_IN]->(wallstreet),
           (charlie)-[:ACTED_IN]->(apocalypse),
           (charlie)-[:ACTED_IN]->(redDawn)
    RETURN martin, charlie
  `
  console.log(chalk.dim.magenta('[Q]'), chalk.dim(q))
  return GraphUtils.runQueryAndFetchResult(q)
  .then(result => {
    console.log(chalk.dim.magenta('[Result]'), chalk.dim(JSON.stringify(result)))
    return Promise.resolve()
  })
}

const patternComprehension = () => {
  const q = `
    MATCH (a: Person { name: 'Charlie Sheen' })
    RETURN [(a)-->(b) WHERE b:Movie | b.year] AS years
  `
  console.log(chalk.dim.magenta('[Q]'), chalk.dim(q))
  return GraphUtils.runQueryAndFetchResult(q)
  .then(result => {
    console.log(chalk.dim.magenta('[Result]'), chalk.dim(JSON.stringify(result)))
    const years = result[0].years
    console.log(chalk.magenta('[Years]'), chalk.bold(JSON.stringify(years)))
    return Promise.resolve()
  })
}

const mapProjection = () => {
  const q = `
    MATCH (actor: Person { name: 'Charlie Sheen' })-[:ACTED_IN]->(movie: Movie)
    RETURN actor { .name, .realName, movies: COLLECT(movie { .title, .year }) }
  `
  console.log(chalk.dim.magenta('[Q]'), chalk.dim(q))
  return GraphUtils.runQueryAndFetchResult(q)
  .then(result => {
    console.log(chalk.dim.magenta('[Result]'), chalk.dim(JSON.stringify(result)))
    return Promise.resolve()
  })
}

const verboseMapProjection = () => {
  const q = `
    MATCH (actor: Person { name: 'Charlie Sheen' })-[:ACTED_IN]->(movie: Movie)
    RETURN actor {
      name: actor.name,
      realName: actor.realName,
      movies: COLLECT(movie { title: movie.title, year: movie.year })
    }
  `
  console.log(chalk.dim.magenta('[Q]'), chalk.dim(q))
  return GraphUtils.runQueryAndFetchResult(q)
  .then(result => {
    console.log(chalk.dim.magenta('[Result]'), chalk.dim(JSON.stringify(result)))
    const firstResult = result[0]
    const actorName = firstResult.actor.name
    const actorRealName = firstResult.actor.realName
    _.forEach(firstResult.actor.movies, movie => {
      const movieTitle = movie.title
      const movieYear = movie.year
      console.log(chalk.magenta('[Actor Name]'), chalk.bold(actorName),
          chalk.magenta('[Actor Real Name]'), chalk.bold(actorRealName),
          chalk.magenta('[Movie Title]'), chalk.bold(movieTitle),
          chalk.magenta('[Movie Year]'), chalk.bold(movieYear))
    })
    return Promise.resolve()
  })
}

const personsActedInMoviesWithNumbers = () => {
  // Find all actors who have acted in a movie and the number of each
  const q = `
    MATCH (actor: Person)-[:ACTED_IN]->(movie: Movie)

    WITH actor, COUNT(movie) AS movieCount
    RETURN actor, movieCount
  `
  console.log(chalk.dim.magenta('[Q]'), chalk.dim(q))
  return GraphUtils.runQueryAndFetchResult(q)
  .then(result => {
    console.log(chalk.dim.magenta('[Result]'), chalk.dim(JSON.stringify(result)))
    _.forEach(result, row => {
      const actorName = row.actor.properties.name
      const movieCount = row.movieCount
      console.log(chalk.magenta('[Actor]'), chalk.bold(actorName),
          chalk.magenta('[#Movies]'), chalk.bold(movieCount))
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
    return patternComprehension()
  })
  .then(() => {
    return mapProjection()
  })
  .then(() => {
    return verboseMapProjection()
  })
  .then(() => {
    return personsActedInMoviesWithNumbers()
  })
  .then(() => {
    console.log(chalk.bold.cyan('[ENDING]'))
    GraphDAO.shutdown()
  })
}

main()
