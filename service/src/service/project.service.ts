import type { IProject } from 'src/models/project.model'
import Project from 'src/models/project.model'

/**
 * Get list of projects
 * @param filter - Mongo filter
 * @param options - Query options
 * @returns {Promise<IProject[]>}
 */
const getList = async (filter, options): Promise<IProject[]> => {
  const list = await Project.find(filter, null, options)
  return list
}

export default {
  getList,
}
