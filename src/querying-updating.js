import chalk from 'chalk'
import GraphUtils from '../GraphUtils.js'
import GraphDAO from '../GraphDAO.js'
import DeleteGraph from './delete.js'
import _ from 'lodash'

const getFriendsCount = () =>{
  const personName = 'John'
  const friendCount = 1
  const q = `
    MATCH (johnPerson: GPerson { name: '${personName}' })-[r: friend]-(friend)

    WITH johnPerson, COUNT(friend) AS friendsCount
    WHERE friendsCount > ${friendCount}

    RETURN johnPerson, friendsCount
  `
  console.log(chalk.dim.magenta('[Q]'), chalk.dim(q))
  return GraphUtils.runQueryAndFetchResult(q)
  .then(result => {
    console.log(chalk.dim.magenta('[Result]'), chalk.dim(JSON.stringify(result)))
    _.forEach(result, row => {
      const johnPersonName = row.johnPerson.properties.name
      const friendsCount = row.friendsCount
      console.log(chalk.magenta('[Person Name]'), chalk.bold(johnPersonName),
          chalk.magenta('[Friends Count]'), chalk.bold(friendsCount))
    })
    return Promise.resolve()
  })
}

const readingAndUpdating = () => {
  // Update a property on all nodes with the number of friends they have
  const q = `
    MATCH (person: GPerson)-[r:friend]->(friend: GPerson)

    WITH person, COUNT(friend) AS friendCount
    SET person.friendCount = friendCount

    RETURN person
  `
  console.log(chalk.dim.magenta('[Q]'), chalk.dim(q))
  return GraphUtils.runQueryAndFetchResult(q)
  .then(result => {
    console.log(chalk.dim.magenta('[Result]'), chalk.dim(JSON.stringify(result)))
    _.forEach(result, row => {
      const personName = row.person.properties.name
      const friendCount = row.person.properties.friendCount
      console.log(chalk.magenta('[Person Name]'), chalk.bold(personName),
          chalk.magenta('[Friend Count]'), chalk.bold(friendCount))
    })
    return Promise.resolve()
  })
}

const getAllPersons = () => {
  const q = `
    MATCH (person: GPerson)
    RETURN person
  `
  console.log(chalk.dim.magenta('[Q]'), chalk.dim(q))
  return GraphUtils.runQueryAndFetchResult(q)
  .then(result => {
    console.log(chalk.dim.magenta('[Result]'), chalk.dim(JSON.stringify(result)))
    _.forEach(result, row => {
      const personName = row.person.properties.name
      const friendCount = row.person.properties.friendCount
      console.log(chalk.magenta('[Person]'), chalk.bold(personName),
          chalk.magenta('[Friend Count]'), chalk.bold(friendCount))
    })
    return Promise.resolve()
  })
}

const main = () => {
  console.log(chalk.bold.cyan('[STARTING]'))
  return getFriendsCount()
  .then(() => {
    return readingAndUpdating()
  })
  .then(() => {
    return getAllPersons()
  })
  .then(() => {
    console.log(chalk.bold.cyan('[ENDING]'))
    GraphDAO.shutdown()
  })
}

main()
