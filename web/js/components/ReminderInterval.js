function ReminderInterval (options, element) {
    var reminderInterval = {};
    var dependencies = ['js/Utils.js'];

    function buildSelectBox (options) {
        var defaults = {
            options: []
        };
        options = options || {};
        var container = document.createElement('div');
        container.classList.add('period-component');
        var selectBox = document.createElement('select');
        options.options.forEach(function (option) {
            var optionEl = document.createElement('option');
            optionEl.innerText = option.label;
            optionEl.value = option.value || option.label;
            selectBox.appendChild(optionEl);
        });
        container.appendChild(selectBox);
        return selectBox;
    }

    function buildIntSelect () {
        var intOptions = {
            options:[
                {label: '1', value:'1'},
                {label: '5', value:'5'},
                {label: '10', value:'10'},
                {label: '15', value:'15'},
                {label: '20', value:'20'},
                {label: '30', value:'30'}
            ]
        };
        reminderInterval.intSelect = buildSelectBox(intOptions);
        element.appendChild(reminderInterval.intSelect);
        if (reminderInterval.options.interval) {
            reminderInterval.intSelect.value = reminderInterval.options.interval;
        }
    }

    function buildUnitSelect() {
        var unitOptions = {
            options: [
                {label: 'Second(s)', value: 'seconds'},
                {label: 'Minute(s)', value: 'minutes'},
                {label: 'Hour(s)', value: 'hours'}
            ]
        };
        reminderInterval.unitSelect = buildSelectBox(unitOptions);
        element.appendChild(reminderInterval.unitSelect);
        if (reminderInterval.options.unit) {
            reminderInterval.unitSelect.value = reminderInterval.options.unit;
        }
    }

    function renderLayout () {
        var title = document.createElement('h2');
        title.innerHTML = 'Time Interval';
        element.appendChild(title);
        buildIntSelect();
        buildUnitSelect();
    }

    function updateState() {
        reminderInterval.options.int = reminderInterval.intSelect.value;
        reminderInterval.options.unit = reminderInterval.unitSelect.value;
        utils.triggerEvent('interval-change', {
            interval: reminderInterval.options.int,
            unit: reminderInterval.options.unit
        }, element);
    }

    function handleChange (evt) {
        updateState();
    }

    function bindListeners () {
        reminderInterval.intSelect.addEventListener('change', handleChange.bind(this));
        reminderInterval.unitSelect.addEventListener('change', handleChange.bind(this));
    }

    function init () {
        reminderInterval.options = options || {};
        renderLayout();
        bindListeners();
        updateState();
    }

    reminderInterval.destroy = function () {
        reminderInterval.intSelect.removeEventListener('change', handleChange);
        reminderInterval.unitSelect.removeEventListener('change', handleChange);
        element.remove();
    }

    dependencyManager.getDependencies(dependencies)
        .then(function () {
            init();
        });

    return reminderInterval;
}