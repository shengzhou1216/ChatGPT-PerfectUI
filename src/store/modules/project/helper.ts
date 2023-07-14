import { ss } from '@/utils/storage'

const LOCAL_NAME = 'projectStorage'

export function defaultState(): Project.ProjectState {
  return { activeProject: undefined }
}

export function getLocalState(): Project.ProjectState {
  const localState = ss.get(LOCAL_NAME)
  return { ...defaultState(), ...localState }
}

export function setLocalState(state: Project.ProjectState) {
  ss.set(LOCAL_NAME, state)
}
