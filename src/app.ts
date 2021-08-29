// & === CUSTOM TYPES
enum ProjectStatus {
	ACTIVE = 'active',
	FINISHED = 'finished'
}

type Listener<T> = (items: T[]) => void;

// & === DECORATORS
// use decorators ONLY while using function() instead () => {}
const autobind = (
	_ : any,
	_2: string,
	descriptor: PropertyDescriptor
	) => {
		const originalMethod = descriptor.value;
		const adjDescriptor: PropertyDescriptor = {
			configurable: true,
			get() {
				const boundFunction = originalMethod.bind(this);
				return boundFunction;
			}
		};
		return adjDescriptor;
	}

// & === DRAG-N-DROP

interface Draggable {
	dragStartHandler: (event: DragEvent) => void;
	dragEndHandler: (event: DragEvent) => void;
}

interface DragTarget {
	dragOverHandler: (event: DragEvent) => void;
	dragLeaveHandler: (event: DragEvent) => void;
	dropHandler: (event: DragEvent) => void;
}

// & === CUSTOM CLASSES
class Project {
	constructor(
		public id: string,
		public title: string,
		public description: string,
		public people: number,
		public status: ProjectStatus
	) {}
}

abstract class Component<T extends HTMLElement, U extends HTMLElement> {
	public templateElement: HTMLTemplateElement;
	public hostElement: T;
	public element: U;

	constructor(
		templateId: string,
		hostElementId: string,
		insertAtStart: boolean,
		newElementId?: string,
	) {
		this.templateElement = document.getElementById(templateId) as HTMLTemplateElement;
		this.hostElement = document.getElementById(hostElementId) as T;

		const importedNode = document.importNode(this.templateElement.content, true);
		this.element = importedNode.firstElementChild as U;
		if (newElementId) {
			this.element.id = newElementId;
		}

		this.attach(insertAtStart);
	}

	private attach(insertAtBeginning: boolean) { 
		this.hostElement.insertAdjacentElement(insertAtBeginning ? "afterbegin" : 'beforeend', this.element);
	}

	abstract configure(): void;
	abstract renderContent(): void;
}

class ProjectItem 
	extends Component<HTMLUListElement, HTMLLIElement> 
	implements Draggable {
	constructor(
		hostId: string,
		private project: Project
	) {
		super('single-project', hostId, false, project.id);
		this.configure();
		this.renderContent();
	}

	// use decorators ONLY while using function() instead () => {}
	// @autobind
	dragStartHandler = (event: DragEvent) => {
		event.dataTransfer!.setData('text/plain', this.project.id);
		event.dataTransfer!.effectAllowed = 'move';
	}

	// use decorators ONLY while using function() instead () => {}
	// @autobind
	dragEndHandler = (event: DragEvent) => {
		console.log('drag end');
	}

	get persons() {
		const { people } = this.project;
		return `${people} ${people === 1 ? 'person' : 'persons'} assigned`;
	}

	configure() {
		this.element.addEventListener('dragstart', this.dragStartHandler);
		this.element.addEventListener('dragend', this.dragEndHandler);
	}

	renderContent() {
		const { title, description, people } = this.project;
		this.element.querySelector('h2')!.textContent = title;
		this.element.querySelector('h3')!.textContent = this.persons;
		this.element.querySelector('p')!.textContent = description;
	}
}
// & === BLL

class State<T> {
	protected listeners: Listener<T>[] = [];

	public addListener(listenerFunction: Listener<T>) {
		this.listeners.push(listenerFunction);
	}
}


class ProjectState extends State<Project>{
	private projects: Project[] = [];
	private static instance: ProjectState;

	private constructor() {
		super();
	}

	public static getInstance() {
		if (!this.instance) this.instance = new ProjectState();
		return this.instance;
	}

	public addProject(
		title: string,
		description: string,
		people: number
	) {
		const newProject = new Project(
			Math.random().toString(),
			title,
			description,
			people,
			ProjectStatus.ACTIVE
		);
		this.projects.push(newProject);
		this.updateListeners();
	}

	public moveProject(projectId: string, status: ProjectStatus) {
		const project = this.projects.find(project => project.id === projectId);
		if (project && project.status !== status) {
			project.status = status;
			this.updateListeners();
		}
	}

	private updateListeners() {
		this.listeners.forEach(listener => listener(this.projects.slice()));
	}

}

const projectState = ProjectState.getInstance();

// & === VALIDATION
interface Validatable {
	value: number | string;
	required: boolean;
	minLength?: number;
	maxLength?: number;
	min?: number;
	max?: number;
}

const validate = ({
	value,
	required,
	minLength,
	maxLength,
	min,
	max
}: Validatable) => {
	let isValid = true;

	if (required) {
		isValid &&= value.toString().trim().length !== 0;
	}

	if (minLength != null && typeof value === 'string') {
		isValid &&= value.length >= minLength;
	}

	if (maxLength != null && typeof value === 'string') {
		isValid &&= value.length <= maxLength;
	}

	if (min != null && typeof value === 'number') {
		isValid &&= value >= min;
	}

	if (max != null && typeof value === 'number') {
		isValid &&= value <= max;
	}

	return isValid;
}
// ===

 // === PROJECT_INPUT
class ProjectInput extends Component<HTMLDivElement, HTMLFormElement> {
	public titleInputElement: HTMLInputElement;
	public descriptionInputElement: HTMLInputElement;
	public peopleInputElement: HTMLInputElement;

	constructor() {
		super('project-input', 'app', true, 'user-input');

		this.titleInputElement = this.element.querySelector('#title') as HTMLInputElement;
		this.descriptionInputElement = this.element.querySelector('#description') as HTMLInputElement;
		this.peopleInputElement = this.element.querySelector('#people') as HTMLInputElement;

		this.configure();
	}

	public configure() {
		this.element.addEventListener('submit', this.submitHandler);
	}

	public renderContent() {
		
	}

	private gatherUserInput(): [string, string, number] | void {
		const title = this.titleInputElement.value;
		const description = this.descriptionInputElement.value;
		const people = this.peopleInputElement.value;

		const titleValidationSchema: Validatable = {
			value: title,
			required: true,
			minLength: 5
		};

		const descriptionValidationSchema: Validatable = {
			value: description,
			required: true,
			minLength: 5
		};

		const peopleValidationSchema: Validatable = {
			value: people,
			required: true,
			min: 1,
			max: 10
		}

		if (
			!validate(titleValidationSchema) ||
			!validate(descriptionValidationSchema) ||
			!validate(peopleValidationSchema) 
		) {
			alert("Invalid data!. Try again!");
			return;
		}
		return [ title,  description, +people ];
	}

	private clearInputs() {
		this.titleInputElement.value = '';
		this.descriptionInputElement.value = '';
		this.peopleInputElement.value = '';
	}

	// use decorators ONLY while using function() instead () => {}
	// @autobind
	private submitHandler = (event: Event) => {
		event.preventDefault();
		const userInput = this.gatherUserInput();
		if (Array.isArray(userInput)) {
			// console.log(userInput);
			const [title, description, people] = userInput;
			projectState.addProject(title, description, people);
			this.clearInputs();			
		}
	};
}

// === PROJECT LIST
class ProjectList 
	extends Component<HTMLDivElement, HTMLElement>
	implements DragTarget {
	public assignedProjects: Project[];

	constructor(private projectType: ProjectStatus) {
		super('project-list', 'app', false, `${projectType}-projects`);
		this.assignedProjects = [];

		this.configure();
		this.renderContent();
	}

	private renderProjects() {
		const listEl = document.getElementById(`${this.projectType}-projects-list`) as HTMLUListElement;
		listEl.innerHTML = '';
		this.assignedProjects.forEach(projectItem => {
			new ProjectItem(this.element.querySelector('ul')!.id, projectItem);
		});
	}

	dragOverHandler = (event: DragEvent) => {
		const listEl = this.element.querySelector('ul')!;
		listEl.classList.add('droppable');
		if (event.dataTransfer && event.dataTransfer.types[0] === 'text/plain') {
			event.preventDefault();
		}
	}

	dragLeaveHandler = (_: DragEvent) => {
		const listEl = this.element.querySelector('ul')!;
		listEl.classList.remove('droppable');
	}

	dropHandler = (event: DragEvent) => {
		const projectId = event.dataTransfer!.getData('text/plain');
		projectState.moveProject(projectId, this.projectType === 'active' ? ProjectStatus.ACTIVE : ProjectStatus.FINISHED);
		
		const listEl = this.element.querySelector('ul')!;
		listEl.classList.remove('droppable');
	}

	public configure() {
		this.element.addEventListener('dragover', this.dragOverHandler);
		this.element.addEventListener('dragleave', this.dragLeaveHandler);
		this.element.addEventListener('drop', this.dropHandler);

		projectState.addListener((projects: Project[]) => {
			const relevantProjects = projects.filter(project => {
				return project.status === (
					this.projectType === ProjectStatus.ACTIVE 
						? ProjectStatus.ACTIVE 
						: ProjectStatus.FINISHED
				);
			});
			this.assignedProjects = relevantProjects;
			this.renderProjects();
		});
	}

	public renderContent() {
		const listId = `${this.projectType}-projects-list`;
		this.element.querySelector('ul')!.id = listId;
		this.element.querySelector('h2')!.textContent = this.projectType.toUpperCase() +  ' projects'.toUpperCase();
	}
}

const projInput = new ProjectInput();
const activeProjectList = new ProjectList(ProjectStatus.ACTIVE);
const finishedProjectList = new ProjectList(ProjectStatus.FINISHED);