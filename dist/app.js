"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
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
var ProjectInput = (function () {
    function ProjectInput() {
        this.templateElement = document.getElementById('project-input');
        this.hostElement = document.getElementById('app');
        var importedNode = document.importNode(this.templateElement.content, true);
        this.element = importedNode.firstElementChild;
        this.element.id = 'user-input';
        this.titleInputElement = this.element.querySelector('#title');
        this.descriptionInputElement = this.element.querySelector('#description');
        this.peopleInputElement = this.element.querySelector('#people');
        this.configure();
        this.attach();
    }
    ProjectInput.prototype.attach = function () {
        this.hostElement.insertAdjacentElement('afterbegin', this.element);
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
            console.log(userInput);
            this.clearInputs();
        }
    };
    ;
    ProjectInput.prototype.configure = function () {
        this.element.addEventListener('submit', this.submitHandler);
    };
    __decorate([
        autobind
    ], ProjectInput.prototype, "submitHandler", null);
    return ProjectInput;
}());
var projInput = new ProjectInput();
//# sourceMappingURL=app.js.map