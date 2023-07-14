import { defineStore } from 'pinia'
import { getLocalState, setLocalState } from './helper'

export const useProjectStore = defineStore('project-store', {
  state: (): Project.ProjectState => getLocalState(),
  getters: {
    getActiveProject(state: Project.ProjectState) {
      return state.activeProject
    },
  },

  actions: {
    setActiveProject(project: Project.Project) {
      this.activeProject = project
      this.recordState()
    },
    recordState() {
      setLocalState(this.$state)
    },
  },
})
