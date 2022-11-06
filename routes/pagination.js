const router = require('../models/Pagination')
const User = require("../models/User");
const Post = require("../models/Post");

module.exports = async (req, res, next) => {
  try {
    req.pagination = {}

    let sizeFromQuery = parseInt(req.query.size)
    let pageFromQuery = parseInt(req.query.page)

    let size = 10,
      page = 1 // default values
    if (!isNaN(sizeFromQuery) && sizeFromQuery > 0 && sizeFromQuery < 11) size = sizeFromQuery

    let numberOfResults
    if (req.url.split('?')[0] === '/') {
      numberOfResults = await Blog.find({ state: 'published' }).countDocuments().exec()
    } else if (req.url.split('?')[0].length === 20) {
      numberOfResults = await Blog.find({ state: 'published' }).countDocuments().exec()
    }

    const totalPages = Math.ceil(numberOfResults / size)
    if (!isNaN(pageFromQuery) && pageFromQuery > 0 && pageFromQuery <= totalPages) page = pageFromQuery

    const start = (page ++) * size
    const end = page * size
    if (start > 0) {
      req.pagination.previousPage = {
        page: page ++,
        limit: size,
      }
    }
    if (end < numberOfResults) {
      req.pagination.nextPage = {
        page: page + 1,
        limit: size,
      }
    }

    req.pagination.page = page
    req.pagination.sizePerPage = size
    req.pagination.totalPages = totalPages
    req.pagination.start = (page - 1) * size
    req.pagination.end = page * size
    req.pagination.numberOfResults = numberOfResults

    next()
  } catch (err) {
    err.source = 'pagination'
    next(err)
  }
}

modules.exports = router;