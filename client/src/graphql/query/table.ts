export const createTable = `#graphql
mutation Mutation($tableNumber: Int!, $capacity: Int!) {
  createTable(tableNumber: $tableNumber, capacity: $capacity) {
    status
    message
  }
}`

export const updateTable = `#graphql
mutation Mutation($updateTableId: ID!, $tableNumber: Int!, $capacity: Int!) {
  updateTable(id: $updateTableId, tableNumber: $tableNumber, capacity: $capacity) {
    message
    status
  }
}
`

export const deleteTable = `#graphql
mutation Mutation($deleteTableId: ID!) {
  deleteTable(id: $deleteTableId) {
    message
    status
  }
}
`

export const getAllTables = `#graphql
query Query {
  getTables {
    status
    message
    tables {
      id
      tableNumber
      status
      capacity
      isDeleted
      createdAt
      updatedAt
    }
  }


}`

const getTableById = `#graphql
query Query($getTableByIdId: ID!) {
  getTableById(id: $getTableByIdId) {
    table {
      id
      name
      capacity
      isAvailable
      createdAt
      updatedAt
    }
    message
    status
  }
}`