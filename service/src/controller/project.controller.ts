import projectService from 'src/service/project.service'
import pick from 'src/utils/pick'
import { Success } from '../utils/index'

const getList = async (req, res) => {
  const filter = pick(req.query, ['name'])
  if (filter.name)
    filter.name = { $regex: filter.name, $options: 'i' }
  const options = pick(req.query, ['sortBy', 'limit', 'page'])
  const result = await projectService.getList(filter, options)
  res.send(Success({ data: result }))
}

export default {
  getList,
}
