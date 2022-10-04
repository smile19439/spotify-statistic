const getOffset = (limit, page = 1) => limit * (page - 1)

const getPagination = (total, limit, page = 1) => {
  const totalPage = Math.ceil(total / limit)
  const pages = Array.from({ length: totalPage }, (_, i) => i + 1)
  const currentPage = Number(page < 1 ? 1 : page > totalPage ? totalPage : page)
  const prePage = Number(currentPage - 1 < 1 ? 1 : currentPage - 1)
  const nextPage = Number(currentPage + 1 > totalPage ? totalPage : currentPage + 1)

  return {
    totalPage,
    pages,
    currentPage,
    prePage,
    nextPage
  }
}

module.exports = {
  getOffset,
  getPagination
}