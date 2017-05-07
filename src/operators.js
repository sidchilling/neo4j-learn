import chalk from 'chalk'
import GraphUtils from '../GraphUtils.js'
import GraphDAO from '../GraphDAO.js'
import _ from 'lodash'

const distinctOperator = () => {
  const q = `
    MATCH (n: GPerson)
    RETURN DISTINCT n.eyes AS eyeColor
  `
  console.log(chalk.dim.magenta('[Q]'), chalk.dim(q))
  return GraphUtils.runQueryAndFetchResult(q)
  .then(result => {
    console.log(chalk.dim.magenta('[Result]'), chalk.dim(JSON.stringify(result)))
    _.forEach(result, row => {
      const eyeColor = row.eyeColor
      console.log(chalk.magenta('[Eye Color'), chalk.bold(eyeColor))
    })
    return Promise.resolve()
  })
}

const literalOperator = () => {
  const q = `
    WITH { person: { name: 'Anne', age: 25 }} AS p
    RETURN p.person.name AS name
  `
  console.log(chalk.dim.magenta('[Q]'), chalk.dim(q))
  return GraphUtils.runQueryAndFetchResult(q)
  .then(result => {
    console.log(chalk.dim.magenta('[Result]'), chalk.dim(JSON.stringify(result)))
    return Promise.resolve()
  })
}

const dynamicPropertyAccess = () => {
  const q = `
    CREATE (a: Restaurant { name: 'Hungry Jo', rating_hygiene: 10, rating_food: 7 }),
           (b: Restaurant { name: 'Buttercups Tea Rooms', rating_hygiene: 5, rating_food: 6 }),
           (c1: Category { name: 'hygiene' }),
           (c2: Category { name: 'food' })
    
    WITH a, b, c1, c2
    MATCH (r: Restaurant), (c: Category)
    WHERE r['rating_' + c.name] > 6

    RETURN r, c
    
  `
  console.log(chalk.dim.magenta('[Q]'), chalk.dim(q))
  return GraphUtils.runQueryAndFetchResult(q)
  .then(result => {
    console.log(chalk.dim.magenta('[Result]'), chalk.dim(JSON.stringify(result)))
    _.forEach(result, row => {
      const restaurantName = row.r.properties.name
      const categoryName = row.c.properties.name
      console.log(chalk.magenta('[Restaurant]'), chalk.bold(restaurantName),
          chalk.magenta('[Category]'), chalk.bold(categoryName))
    })
    return Promise.resolve()
  })
  .then(() => {
    const deleteQ = `
      MATCH (r: Restaurant), (c: Category)
      DELETE r, c
    `
    console.log(chalk.dim.magenta('[Q]'), chalk.dim(deleteQ))
    return GraphUtils.runQueryAndFetchResult(deleteQ)
    .then(result => {
      console.log(chalk.dim.magenta('[Result]'), chalk.dim(JSON.stringify(result)))
      return Promise.resolve()
    })
  })
}

const startsWith = () => {
  const namesArray = ['John', 'Mark', 'Jonathan', 'Bill']
  const startsWith = 'Jo'
  const q = `
    WITH ${JSON.stringify(namesArray)} AS someNames
    UNWIND(someNames) AS names

    WITH names AS candidate
    WHERE candidate STARTS WITH '${startsWith}'
    RETURN candidate
  `
  console.log(chalk.dim.magenta(q), chalk.dim(q))
  return GraphUtils.runQueryAndFetchResult(q)
  .then(result => {
    console.log(chalk.dim.magenta('[Result]'), chalk.dim(JSON.stringify(result)))
    _.forEach(result, row => {
      console.log(chalk.magenta('[Candidate]'), chalk.bold(row.candidate))
    })
    return Promise.resolve()
  })
}

const booleanOperators = () => {
  const numbersArray = [2, 4, 7, 9, 12]
  const q = `
  WITH ${JSON.stringify(numbersArray)} AS numbers
  UNWIND(numbers) AS number

  WITH number
  WHERE number = 4 OR (number > 6 AND number < 10)
  RETURN number
  `
  console.log(chalk.dim.magenta('[Q]'), chalk.dim(q))
  return GraphUtils.runQueryAndFetchResult(q)
  .then(result => {
    console.log(chalk.dim.magenta('[Result]'), chalk.dim(JSON.stringify(result)))
    _.forEach(result, row => {
      console.log(chalk.magenta('[Number]'), chalk.bold(row.number))
    })
    return Promise.resolve()
  })
}

const main = () => {
  console.log(chalk.bold.cyan('[STARTING]'))
  return distinctOperator()
  .then(() => {
    return literalOperator()
  })
  .then(() => {
    return dynamicPropertyAccess()
  })
  .then(() => {
    return startsWith()
  })
  .then(() => {
    return booleanOperators()
  })
  .then(() => {
    console.log(chalk.bold.cyan('[ENDING]'))
    GraphDAO.shutdown()
  })
}

main()
