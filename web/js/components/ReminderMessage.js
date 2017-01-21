function ReminderMessage (options, element) {
    var reminderMessage = {};
    var dependencies = ['js/Utils.js'];

    function buildTextBox(options) {
        options = options || {};
        var container = document.createElement('div');
        container.classList.add('textbox-container');
        var textbox = document.createElement('textarea');
        textbox.classList.add('message-textbox');
        if (options.message) {
            textbox.value = options.message;
        }
        container.appendChild(textbox);
        return container;
    }

    function renderLayout () {
        var title = document.createElement('h2');
        title.innerHTML = 'Custom Message';
        element.appendChild(title);
        reminderMessage.textBox = buildTextBox(options);
        element.appendChild(reminderMessage.textBox);
    }

    function handleInput(evt) {
        utils.triggerEvent('message-change', {message: evt.target.value}, element);
    }

    function bindListeners () {
        reminderMessage.textBox.addEventListener('input', handleInput.bind(this));
    }

    reminderMessage.destroy = function () {
        reminderMessage.textBox.removeEventListener('input', handleInput);
        element.remove();
    };

    function init () {
        reminderMessage.options = options || {};
        renderLayout();
        bindListeners();
        utils.triggerEvent('message-change', {message: reminderMessage.textBox.value}, element);
    }

    dependencyManager.getDependencies(dependencies)
        .then(function () {
            init();
        });

    return reminderMessage;
}