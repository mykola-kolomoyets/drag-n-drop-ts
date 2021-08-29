"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var ProjectStatus;
(function (ProjectStatus) {
    ProjectStatus["ACTIVE"] = "active";
    ProjectStatus["FINISHED"] = "finished";
})(ProjectStatus || (ProjectStatus = {}));
var autobind = function (_, _2, descriptor) {
    var originalMethod = descriptor.value;
    var adjDescriptor = {
        configurable: true,
        get: function () {
            var boundFunction = originalMethod.bind(this);
            return boundFunction;
        }
    };
    return adjDescriptor;
};
var Project = (function () {
    function Project(id, title, description, people, status) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.people = people;
        this.status = status;
    }
    return Project;
}());
var Component = (function () {
    function Component(templateId, hostElementId, insertAtStart, newElementId) {
        this.templateElement = document.getElementById(templateId);
        this.hostElement = document.getElementById(hostElementId);
        var importedNode = document.importNode(this.templateElement.content, true);
        this.element = importedNode.firstElementChild;
        if (newElementId) {
            this.element.id = newElementId;
        }
        this.attach(insertAtStart);
    }
    Component.prototype.attach = function (insertAtBeginning) {
        this.hostElement.insertAdjacentElement(insertAtBeginning ? "afterbegin" : 'beforeend', this.element);
    };
    return Component;
}());
var ProjectItem = (function (_super) {
    __extends(ProjectItem, _super);
    function ProjectItem(hostId, project) {
        var _this = _super.call(this, 'single-project', hostId, false, project.id) || this;
        _this.project = project;
        _this.dragStartHandler = function (event) {
            event.dataTransfer.setData('text/plain', _this.project.id);
            event.dataTransfer.effectAllowed = 'move';
        };
        _this.dragEndHandler = function (event) {
            console.log('drag end');
        };
        _this.configure();
        _this.renderContent();
        return _this;
    }
    Object.defineProperty(ProjectItem.prototype, "persons", {
        get: function () {
            var people = this.project.people;
            return people + " " + (people === 1 ? 'person' : 'persons') + " assigned";
        },
        enumerable: false,
        configurable: true
    });
    ProjectItem.prototype.configure = function () {
        this.element.addEventListener('dragstart', this.dragStartHandler);
        this.element.addEventListener('dragend', this.dragEndHandler);
    };
    ProjectItem.prototype.renderContent = function () {
        var _a = this.project, title = _a.title, description = _a.description, people = _a.people;
        this.element.querySelector('h2').textContent = title;
        this.element.querySelector('h3').textContent = this.persons;
        this.element.querySelector('p').textContent = description;
    };
    return ProjectItem;
}(Component));
var State = (function () {
    function State() {
        this.listeners = [];
    }
    State.prototype.addListener = function (listenerFunction) {
        this.listeners.push(listenerFunction);
    };
    return State;
}());
var ProjectState = (function (_super) {
    __extends(ProjectState, _super);
    function ProjectState() {
        var _this = _super.call(this) || this;
        _this.projects = [];
        return _this;
    }
    ProjectState.getInstance = function () {
        if (!this.instance)
            this.instance = new ProjectState();
        return this.instance;
    };
    ProjectState.prototype.addProject = function (title, description, people) {
        var newProject = new Project(Math.random().toString(), title, description, people, ProjectStatus.ACTIVE);
        this.projects.push(newProject);
        this.updateListeners();
    };
    ProjectState.prototype.moveProject = function (projectId, status) {
        var project = this.projects.find(function (project) { return project.id === projectId; });
        if (project && project.status !== status) {
            project.status = status;
            this.updateListeners();
        }
    };
    ProjectState.prototype.updateListeners = function () {
        var _this = this;
        this.listeners.forEach(function (listener) { return listener(_this.projects.slice()); });
    };
    return ProjectState;
}(State));
var projectState = ProjectState.getInstance();
var validate = function (_a) {
    var value = _a.value, required = _a.required, minLength = _a.minLength, maxLength = _a.maxLength, min = _a.min, max = _a.max;
    var isValid = true;
    if (required) {
        isValid && (isValid = value.toString().trim().length !== 0);
    }
    if (minLength != null && typeof value === 'string') {
        isValid && (isValid = value.length >= minLength);
    }
    if (maxLength != null && typeof value === 'string') {
        isValid && (isValid = value.length <= maxLength);
    }
    if (min != null && typeof value === 'number') {
        isValid && (isValid = value >= min);
    }
    if (max != null && typeof value === 'number') {
        isValid && (isValid = value <= max);
    }
    return isValid;
};
var ProjectInput = (function (_super) {
    __extends(ProjectInput, _super);
    function ProjectInput() {
        var _this = _super.call(this, 'project-input', 'app', true, 'user-input') || this;
        _this.submitHandler = function (event) {
            event.preventDefault();
            var userInput = _this.gatherUserInput();
            if (Array.isArray(userInput)) {
                var title = userInput[0], description = userInput[1], people = userInput[2];
                projectState.addProject(title, description, people);
                _this.clearInputs();
            }
        };
        _this.titleInputElement = _this.element.querySelector('#title');
        _this.descriptionInputElement = _this.element.querySelector('#description');
        _this.peopleInputElement = _this.element.querySelector('#people');
        _this.configure();
        return _this;
    }
    ProjectInput.prototype.configure = function () {
        this.element.addEventListener('submit', this.submitHandler);
    };
    ProjectInput.prototype.renderContent = function () {
    };
    ProjectInput.prototype.gatherUserInput = function () {
        var title = this.titleInputElement.value;
        var description = this.descriptionInputElement.value;
        var people = this.peopleInputElement.value;
        var titleValidationSchema = {
            value: title,
            required: true,
            minLength: 5
        };
        var descriptionValidationSchema = {
            value: description,
            required: true,
            minLength: 5
        };
        var peopleValidationSchema = {
            value: people,
            required: true,
            min: 1,
            max: 10
        };
        if (!validate(titleValidationSchema) ||
            !validate(descriptionValidationSchema) ||
            !validate(peopleValidationSchema)) {
            alert("Invalid data!. Try again!");
            return;
        }
        return [title, description, +people];
    };
    ProjectInput.prototype.clearInputs = function () {
        this.titleInputElement.value = '';
        this.descriptionInputElement.value = '';
        this.peopleInputElement.value = '';
    };
    return ProjectInput;
}(Component));
var ProjectList = (function (_super) {
    __extends(ProjectList, _super);
    function ProjectList(projectType) {
        var _this = _super.call(this, 'project-list', 'app', false, projectType + "-projects") || this;
        _this.projectType = projectType;
        _this.dragOverHandler = function (event) {
            var listEl = _this.element.querySelector('ul');
            listEl.classList.add('droppable');
            if (event.dataTransfer && event.dataTransfer.types[0] === 'text/plain') {
                event.preventDefault();
            }
        };
        _this.dragLeaveHandler = function (_) {
            var listEl = _this.element.querySelector('ul');
            listEl.classList.remove('droppable');
        };
        _this.dropHandler = function (event) {
            var projectId = event.dataTransfer.getData('text/plain');
            projectState.moveProject(projectId, _this.projectType === 'active' ? ProjectStatus.ACTIVE : ProjectStatus.FINISHED);
            var listEl = _this.element.querySelector('ul');
            listEl.classList.remove('droppable');
        };
        _this.assignedProjects = [];
        _this.configure();
        _this.renderContent();
        return _this;
    }
    ProjectList.prototype.renderProjects = function () {
        var _this = this;
        var listEl = document.getElementById(this.projectType + "-projects-list");
        listEl.innerHTML = '';
        this.assignedProjects.forEach(function (projectItem) {
            new ProjectItem(_this.element.querySelector('ul').id, projectItem);
        });
    };
    ProjectList.prototype.configure = function () {
        var _this = this;
        this.element.addEventListener('dragover', this.dragOverHandler);
        this.element.addEventListener('dragleave', this.dragLeaveHandler);
        this.element.addEventListener('drop', this.dropHandler);
        projectState.addListener(function (projects) {
            var relevantProjects = projects.filter(function (project) {
                return project.status === (_this.projectType === ProjectStatus.ACTIVE
                    ? ProjectStatus.ACTIVE
                    : ProjectStatus.FINISHED);
            });
            _this.assignedProjects = relevantProjects;
            _this.renderProjects();
        });
    };
    ProjectList.prototype.renderContent = function () {
        var listId = this.projectType + "-projects-list";
        this.element.querySelector('ul').id = listId;
        this.element.querySelector('h2').textContent = this.projectType.toUpperCase() + ' projects'.toUpperCase();
    };
    return ProjectList;
}(Component));
var projInput = new ProjectInput();
var activeProjectList = new ProjectList(ProjectStatus.ACTIVE);
var finishedProjectList = new ProjectList(ProjectStatus.FINISHED);
//# sourceMappingURL=app.js.map