// === AUTOBIND decoratar
const autobind = (
	target : any,
	methodName: string,
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

// ====

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

	private gatherUserInput(): [string, string, number] | void {
		const title = this.titleInputElement.value;
		const description = this.descriptionInputElement.value;
		const people = this.peopleInputElement.value;

		if (
			!title.trim().length ||
			!description.trim().length ||
			!people.trim().length
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

	@autobind
	private submitHandler(event: Event) {
		event.preventDefault();
		const userInput = this.gatherUserInput();
		if (Array.isArray(userInput)) {
			console.log(userInput);
			this.clearInputs();			
		}
	};

	private configure() {
		this.element.addEventListener('submit', this.submitHandler);
	}
}

const projInput = new ProjectInput();