import type { Model } from 'mongoose'
import mongoose, { Schema } from 'mongoose'
import toJSON from './plugins/toJSON'
import paginate from './plugins/paginate'
export interface IProject {
  name: string
  url?: string
  description?: string
  avatar?: string
}

export interface IProjectModel extends Model<IProject> {
  paginate(filter: any, options: any): Promise<any>
}

const projectSchema = new Schema<IProject>(
  {
    name: {
      type: String,
      requried: true,
      trim: true,
      unique: true,
    },
    url: {
      type: String,
    },
    description: {
      type: String,
    },
    avatar: {
      type: String,
    },
  },
  {
    timestamps: true,
  },
)

projectSchema.plugin(toJSON)
projectSchema.plugin(paginate)

const Project = mongoose.model<IProject, IProjectModel>('Project', projectSchema)

export default Project
