export const createFood = `#graphql
mutation Mutation($name: String!, $description: String!, $price: Float!, $category: String!, $file: FileUploadInput) {
  createFood(name: $name, description: $description, price: $price, category: $category, file: $file) {
    message
    status
  }
}
`

export const getAllFoods = `#graphql
query Foods($page: Int, $limit: Int, $search: String, $category: String, $sortBy: String, $sortOrder: String) {
  getFoods(page: $page, limit: $limit, search: $search, category: $category, sortBy: $sortBy, sortOrder: $sortOrder) {
    status
    message
    foods {
      id
      name
      description
      price
      image
      slug
      category
      numberOfOrders
      isDeleted
      createdAt
      updatedAt
    }
    pagination {
      totalItems
      totalPages
      currentPage
      limit
    }
  }
}
`


export const editFood = `#graphql
mutation Mutation($id: ID!, $name: String, $description: String, $price: Float, $category: String, $file: FileUploadInput) {
  updateFood(id: $id, name: $name, description: $description, price: $price, category: $category, file: $file) {
    message
    status
  }
}
`

export const getCategoriesCount = `#graphql
query Query {
  getCategoriesCount {
    status
    message
    categories {
      category
      count
    }
  }
}
`

export const deleteFood = `#graphql
mutation Mutation($deleteFoodId: ID!) {
  deleteFood(id: $deleteFoodId) {
    message
    status
  }
}
`