class ProjectInput {
	// DOM elements
	public templateElement: HTMLTemplateElement;
	public hostElement: HTMLDivElement;
	public element: HTMLFormElement;
	public titleInputElement: HTMLInputElement;
	public descriptionInputElement: HTMLInputElement;
	public peopleInputElement: HTMLInputElement;

	constructor() {
		this.templateElement = document.getElementById('project-input') as HTMLTemplateElement;
		this.hostElement = document.getElementById('app') as HTMLDivElement;

		const importedNode = document.importNode(this.templateElement.content, true);

		this.element = importedNode.firstElementChild as HTMLFormElement;
		this.element.id = 'user-input';

		this.titleInputElement = this.element.querySelector('#title') as HTMLInputElement;
		this.descriptionInputElement = this.element.querySelector('#description') as HTMLInputElement;
		this.peopleInputElement = this.element.querySelector('#people') as HTMLInputElement;

		this.configure();
		this.attach();
	}

	private attach() { 
		this.hostElement.insertAdjacentElement('afterbegin', this.element);
	}

	private submitHandler(event: Event) {
		event.preventDefault();

		console.log(this.titleInputElement.value);
	};

	private configure() {
		this.element.addEventListener('submit', this.submitHandler.bind(this));
	}
}

const projInput = new ProjectInput();