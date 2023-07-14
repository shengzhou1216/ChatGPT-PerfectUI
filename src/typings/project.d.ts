declare namespace Project {
	interface Project {
		id: string
		name: string
		url?: string
		avatar?: string
		description?: string
	}

	interface ProjectState {
		activeProject?: Project
	}
}
