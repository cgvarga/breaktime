function ReminderTimePeriod (options, element) {
    var reminderTimePeriod = {};
    var dependencies = ['js/Utils.js'];
    var timeOptions = {
        options: [
            {label: '1:00', value: '1:00'},
            {label: '2:00', value: '2:00'},
            {label: '3:00', value: '3:00'},
            {label: '4:00', value: '4:00'},
            {label: '5:00', value: '5:00'},
            {label: '6:00', value: '6:00'},
            {label: '7:00', value: '7:00'},
            {label: '8:00', value: '8:00'},
            {label: '9:00', value: '9:00'},
            {label: '10:00', value: '10:00'},
            {label: '11:00', value: '11:00'},
            {label: '12:00', value: '12:00'},
        ]
    };
    var periodOptions = {
        options: [
            {label: 'AM', value: 'am'},
            {label: 'PM', value: 'pm'}
        ]
    };

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

    function buildStart() {
        var startContainer = document.createElement('div');
        startContainer.classList.add('reminder-period');
        startContainer.classList.add('start-period');

        var startHourSelect = reminderTimePeriod.startHourSelect = buildSelectBox(timeOptions);
        startHourSelect.classList.add('reminder-start-hour');
        startContainer.appendChild(startHourSelect);
        if (options.startHour) {
            startHourSelect.value = options.startHour;
        }

        var startPeriodSelect = reminderTimePeriod.startPeriodSelect = buildSelectBox(periodOptions);
        startPeriodSelect.classList.add('reminder-start-period');
        startContainer.appendChild(startPeriodSelect);
        if (options.startPeriod) {
            startPeriodSelect.value = options.startPeriod;
        }

        element.appendChild(startContainer);
    }

    function buildEnd() {
        var endContainer = document.createElement('div');
        endContainer.classList.add('reminder-period');
        endContainer.classList.add('end-period');

        var endHourSelect = reminderTimePeriod.endHourSelect = buildSelectBox(timeOptions);
        endHourSelect.classList.add('reminder-end-hour');
        endContainer.appendChild(endHourSelect);
        if (options.endHour) {
            endHourSelect.value = options.endHour;
        }

        var endPeriodSelect = reminderTimePeriod.endPeriodSelect = buildSelectBox(periodOptions);
        endPeriodSelect.classList.add('reminder-end-period');
        endContainer.appendChild(endPeriodSelect);
        if (options.endPeriod) {
            endPeriodSelect.value = options.endPeriod;
        }

        element.appendChild(endContainer);
    }

    function renderLayout () {
        var title = document.createElement('h2');
        title.innerHTML = 'Time Period';
        element.appendChild(title);

        buildStart();

        var spacerContent = document.createElement('span');
        spacerContent.classList.add('period-spacer');
        spacerContent.innerHTML = '&ndash;';
        element.appendChild(spacerContent);

        buildEnd();
    }

    function handlePeriodChange (evt) {
        var details = {};
        details.startHour = reminderTimePeriod.startHourSelect.value;
        details.startPeriod = reminderTimePeriod.startPeriodSelect.value;
        details.endHour = reminderTimePeriod.endHourSelect.value;
        details.endPeriod = reminderTimePeriod.endPeriodSelect.value;
        utils.triggerEvent('period-change', details, element);
    }

    function bindListeners () {
        reminderTimePeriod.startHourSelect.addEventListener('change', handlePeriodChange.bind(this));
        reminderTimePeriod.startPeriodSelect.addEventListener('change', handlePeriodChange.bind(this));
        reminderTimePeriod.endHourSelect.addEventListener('change', handlePeriodChange.bind(this));
        reminderTimePeriod.endPeriodSelect.addEventListener('change', handlePeriodChange.bind(this));
    }

    reminderTimePeriod.destroy = function () {
        element.remove();
    };

    function init () {
        reminderTimePeriod.options = options || {};
        renderLayout();
        bindListeners();
    }

    dependencyManager.getDependencies(dependencies)
        .then(function () {
            init();
        });

    return reminderTimePeriod;
}