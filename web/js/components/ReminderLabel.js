function ReminderLabel (options, element) {
    var reminderLabel = {};

    var dependencies = ['js/Utils.js'];
    function buildLabel() {
        var label = reminderLabel.label = document.createElement('input');
        label.setAttribute('type', 'text');
        label.classList.add('reminder-label');
        label.value = reminderLabel.options.label || 'New Reminder';
        element.appendChild(label);
    }

    function renderLayout() {
        var title = document.createElement('h2');
        title.innerHTML = 'Reminder Label';
        element.appendChild(title);
        buildLabel();
    }

    function handleLabelInput(evt) {
        utils.triggerEvent('label-change', {label: reminderLabel.label.value}, element);
    }

    function bindListeners() {
        reminderLabel.label.addEventListener('input', handleLabelInput.bind(this));
    }

    function init() {
        reminderLabel.options = options || {};
        renderLayout();
        bindListeners();
        utils.triggerEvent('label-change', {label: reminderLabel.label.value}, element);
    }

    reminderLabel.destroy = function () {
        reminderLabel.label.removeEventListener('input', handleLabelInput);
        element.remove();
    };

    dependencyManager.getDependencies(dependencies)
        .then(function () {
            init();
        });

    return reminderLabel;
}