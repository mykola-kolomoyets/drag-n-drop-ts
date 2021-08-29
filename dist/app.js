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
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var ProjectStatus;
(function (ProjectStatus) {
    ProjectStatus["ACTIVE"] = "active";
    ProjectStatus["FINISHED"] = "finished";
})(ProjectStatus || (ProjectStatus = {}));
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
        var _this = this;
        var newProject = new Project(Math.random().toString(), title, description, people, ProjectStatus.ACTIVE);
        this.projects.push(newProject);
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
var autobind = function (target, methodName, descriptor) {
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
var ProjectInput = (function (_super) {
    __extends(ProjectInput, _super);
    function ProjectInput() {
        var _this = _super.call(this, 'project-input', 'app', true, 'user-input') || this;
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
    ProjectInput.prototype.submitHandler = function (event) {
        event.preventDefault();
        var userInput = this.gatherUserInput();
        if (Array.isArray(userInput)) {
            var title = userInput[0], description = userInput[1], people = userInput[2];
            projectState.addProject(title, description, people);
            this.clearInputs();
        }
    };
    ;
    __decorate([
        autobind
    ], ProjectInput.prototype, "submitHandler", null);
    return ProjectInput;
}(Component));
var ProjectList = (function (_super) {
    __extends(ProjectList, _super);
    function ProjectList(projectType) {
        var _this = _super.call(this, 'project-list', 'app', false, projectType + "-projects") || this;
        _this.projectType = projectType;
        _this.assignedProjects = [];
        _this.configure();
        _this.renderContent();
        return _this;
    }
    ProjectList.prototype.renderProjects = function () {
        var listEl = document.getElementById(this.projectType + "-projects-list");
        listEl.innerHTML = '';
        this.assignedProjects.forEach(function (projectItem) {
            var listItem = document.createElement('li');
            listItem.textContent = projectItem.title;
            listEl.appendChild(listItem);
        });
    };
    ProjectList.prototype.configure = function () {
        var _this = this;
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