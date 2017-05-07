import chalk from 'chalk'
import GraphUtils from '../GraphUtils.js'
import GraphDAO from '../GraphDAO.js'
import DeleteGraph from './delete.js'
import _ from 'lodash'

const createGraph = () => {
  const q = `
    CREATE (alice: GPerson { name: 'Alice', age: 38, eyes: 'brown' }),
           (charlie: GPerson { name: 'Charlie', age: 53, eyes: 'green' }),
           (bob: GPerson { name: 'Bob', age: 25, eyes: 'blue' }),
           (daniel: GPerson { name: 'Daniel', age: 54, eyes: 'brown' }),
           (eskil: GPerson { name: 'Eskil', age: 41, eyes: 'blue', array: ['one', 'two', 'three'] }),

           (alice)-[r1: KNOWS]->(charlie),
           (alice)-[r2: KNOWS]->(bob),
           (charlie)-[r3: KNOWS]->(daniel),
           (bob)-[r4: KNOWS]->(daniel),
           (bob)-[r5: MARRIED]->(eskil)
    
    RETURN alice, charlie, bob, daniel, eskil, r1, r2, r3, r4, r5
  `
  console.log(chalk.dim.magenta('[Q]'), chalk.dim(q));
  return GraphUtils.runQueryAndFetchResult(q)
  .then(result => {
    console.log(chalk.dim.magenta('[Result]'), chalk.dim(JSON.stringify(result)))
    return Promise.resolve()
  })
}

const simpleCase = () => {
  const q = `
    MATCH (n)
    RETURN
      CASE n.eyes
        WHEN 'blue' THEN 1
        WHEN 'brown' THEN 2
        ELSE 3
      END
      AS eyeColorInt,
      n
  `
  console.log(chalk.dim.magenta('[Q'), chalk.dim(q))
  return GraphUtils.runQueryAndFetchResult(q)
  .then(result => {
    console.log(chalk.dim.magenta('[Result]'), chalk.dim(JSON.stringify(result)))
    _.forEach(result, row => {
      const eyeColor = row.n.properties.eyes
      const eyeColorInt = row.eyeColorInt
      console.log(chalk.magenta('[Eye Color]'), chalk.bold(eyeColor),
          chalk.magenta('[Eye Color Int]'), chalk.bold(eyeColorInt))
    })
    return Promise.resolve()
  })
}

const genericCaseStatement = () => {
  const q = `
    MATCH (n: GPerson)
    RETURN
      CASE
        WHEN n.eyes = 'blue' THEN 1
        WHEN n.age < 40 THEN 2
        ELSE 3
      END
    AS result,
    n AS person
  `
  console.log(chalk.dim.magenta('[Q]'), chalk.dim(q))
  return GraphUtils.runQueryAndFetchResult(q)
  .then(result => {
    console.log(chalk.dim.magenta('[Result]'), chalk.dim(JSON.stringify(result)))
    _.forEach(result, row => {
      const personName = row.person.properties.name
      const eyes = row.person.properties.eyes
      const age = row.person.properties.age
      const result = row.result
      console.log(chalk.magenta('[Person Name]'), chalk.bold(personName),
          chalk.magenta('[Eyes]'), chalk.bold(eyes),
          chalk.magenta('[Age]'), chalk.bold(age),
          chalk.magenta('[Result]'), chalk.bold(result))
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
    return simpleCase()
  })
  .then(() => {
    return genericCaseStatement()
  })
  .then(() => {
    console.log(chalk.bold.cyan('[ENDING]'))
    GraphDAO.shutdown()
  })
}

main()