import chalk from 'chalk'
import GraphUtils from '../GraphUtils.js'
import GraphDAO from '../GraphDAO.js'
import DeleteGraph from './delete.js'
import _ from 'lodash'

const createPersonNode = (name) => {
  const q = `
    CREATE (person: GPerson { name: '${name}' })
    RETURN person
  `
  console.log(chalk.dim.magenta('[Q]'), chalk.dim(q));
  return GraphUtils.runQueryAndFetchResult(q)
  .then(result => {
    console.log(chalk.dim.magenta('[Result]'), chalk.dim(JSON.stringify(result)));
    return Promise.resolve()
  })
}

const createFriendRelation = (fromName, toName) => {
  const q = `
    MATCH (from: GPerson), (to: GPerson)
    WHERE from.name = '${fromName}' AND to.name = '${toName}'
    CREATE (from)-[r: friend]->(to)
    RETURN r
  `
  return GraphUtils.runQueryAndFetchResult(q)
  .then(result => {
    console.log(chalk.dim.magenta('[Q]'), chalk.dim(JSON.stringify(result)));
    return Promise.resolve()
  })
}

const makeGraph = () => {
  return createPersonNode('John')
  .then(() => {
    return createPersonNode('Joe')
  })
  .then(() => {
    return createPersonNode('Steve')
  })
  .then(() => {
    return createPersonNode('Sara')
  })
  .then(() => {
    return createPersonNode('Maria')
  })
  .then(() => {
    return createFriendRelation('John', 'Joe')
  })
  .then(() => {
    return createFriendRelation('John', 'Sara')
  })
  .then(() => {
    return createFriendRelation('Joe', 'Steve')
  })
  .then(() => {
    return createFriendRelation('Sara', 'Maria')
  })
}

const johnFriendsOfFriends = () => {
  // This functions gets John from the graph and his friends of friends.
  // Returns both John and his friends of friends
  const johnPersonName = 'John'
  const q = `
    MATCH (john: GPerson { name: '${johnPersonName}' })-[r:friend]->()-[r1:friend]->(fof)
    RETURN john, fof
  `
  console.log(chalk.dim.magenta('[Q]'), chalk.dim(q))
  return GraphUtils.runQueryAndFetchResult(q)
  .then(result => {
    console.log(chalk.dim.magenta('[Results]'), chalk.dim(JSON.stringify(result)))
    _.forEach(result, row => {
      const johnName = row.john.properties.name
      const fofName = row.fof.properties.name
      console.log(chalk.magenta('[John Name]'), chalk.bold(johnName),
          chalk.magenta('[FoF Name]'), chalk.bold(fofName))
      return Promise.resolve()
    })
  })
}

const fromAList = () => {
  // Get people from a list of names, get their friends whose names begin with S
  const peopleNames = ['Joe', 'John', 'Sara', 'Maria', 'Steve']
  const beginsWith = 'S'
  const q = `
    MATCH (person: GPerson)-[r: friend]->(friend)
    WHERE person.name IN ${JSON.stringify(peopleNames)} AND friend.name =~ '${beginsWith}.*'
    RETURN person, friend
  `
  console.log(chalk.dim.magenta('[Q]'), chalk.dim(q))
  return GraphUtils.runQueryAndFetchResult(q)
  .then(result => {
    console.log(chalk.dim.magenta('[Results]'), chalk.dim(JSON.stringify(result)))
    _.forEach(result, row => {
      const personName = row.person.properties.name
      const friendName = row.friend.properties.name
      console.log(chalk.magenta('[Person Name]'), chalk.bold(personName),
          chalk.magenta('[Friend Name]'), chalk.bold(friendName))
      return Promise.resolve()
    })
  })
}

const main = () => {
  console.log(chalk.bold.cyan('[STARTING]'))
  return DeleteGraph.deleteAllFromGraph()
  .then(() => {
    return makeGraph()
  })
  .then(() => {
    return johnFriendsOfFriends()
  })
  .then(() => {
    return fromAList()
  })
  .then(() => {
    console.log(chalk.bold.cyan('[ENDING]'))
    GraphDAO.shutdown()
  })
}

main()
