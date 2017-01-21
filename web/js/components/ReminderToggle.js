function ReminderToggle (options, element) {
    var reminderToggle = {};
    var dependencies = ['js/Utils.js'];

    function buildToggle () {
        var button = document.createElement('button');
        button.innerText = 'off';
        button.classList.add('toggle-button');
        return button;
    }

    function renderLayout () {
        reminderToggle.toggle = buildToggle();
        if (reminderToggle.options.active) {
            toggleButton(reminderToggle.toggle);
        }
        element.appendChild(reminderToggle.toggle);
    }

    function handleClick (evt) {
        if (evt.target.nodeName.toLowerCase() === 'button') {
            toggleButton(evt.target);
        }
    }

    function toggleButton(btn) {
        if (btn.classList.contains('active')) {
            btn.classList.remove('active');
            btn.innerText = 'off';
        } else {
            btn.classList.add('active');
            btn.innerText = 'on';
        }
        utils.triggerEvent('toggle-change', {active: btn.classList.contains('active')}, element);
    }

    function bindListeners () {
        reminderToggle.toggle.addEventListener('click', handleClick.bind(this));
    }

    reminderToggle.destroy = function () {
        reminderToggle.toggle.removeEventListener('click', handleClick);
        element.remove();
    };

    function init () {
        reminderToggle.options = options || {};
        renderLayout();
        bindListeners();
    }

    dependencyManager.getDependencies(dependencies)
        .then(function () {
            init();
        });

    return reminderToggle;
}