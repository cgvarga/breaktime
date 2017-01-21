function Reminder (options, element) {
    var reminder = {},
        dependencies = [
            'js/Utils.js',
            'js/components/ReminderLabel.js',
            'js/components/ReminderTimePeriod.js',
            'js/components/ReminderInterval.js',
            'js/components/ReminderDays.js',
            'js/components/ReminderMessage.js',
            'js/components/ReminderToggle.js'
        ];

    var DAYS_MAP = {0: 'Su', 1: 'M', 2: 'Tu', 3: 'W', 4: 'Th', 5: 'F', 6: 'Sa' };

    function buildLabel () {
        var container = document.createElement('div');
        var labelOptions = options.label ? {label: options.label} : {label: ''};
        container.classList.add('reminder-component');
        container.classList.add('reminder-label');
        reminder.reminderLabel = ReminderLabel(labelOptions, container);
        element.appendChild(container);
    }

    function buildTimePeriod () {
        var periodOptions = {
            startHour: reminder.options.startHour ? reminder.options.startHour : '9:00',
            startPeriod: reminder.options.startPeriod ? reminder.options.startPeriod : 'am',
            endHour: reminder.options.endHour ? reminder.options.endHour : '6:00',
            endPeriod: reminder.options.endPeriod ? reminder.options.endPeriod : 'pm'
        };
        var container = document.createElement('div');
        container.classList.add('reminder-component');
        container.classList.add('reminder-timeperiod');
        reminder.timePeriod = ReminderTimePeriod(periodOptions, container);
        element.appendChild(container);
    }

    function buildInterval () {
        var intervalOptions = {
            interval: reminder.options.interval ? reminder.options.interval : '1',
            unit: reminder.options.unit ? reminder.options.unit : 'hours'
        }
        var container = document.createElement('div');
        container.classList.add('reminder-component');
        container.classList.add('reminder-interval');
        reminder.interval = ReminderInterval(intervalOptions, container);
        element.appendChild(container);
    }

    function buildDays () {
        var defaults = {'M': true, 'Tu': true, 'W': true, 'Th': true, 'F': true};
        var daysOptions = reminder.options.days ?{days: reminder.options.days} : {days: defaults};
        var container = document.createElement('div');
        container.classList.add('reminder-component');
        container.classList.add('reminder-days');
        reminder.days = ReminderDays(daysOptions, container);
        element.appendChild(container);
    }

    function buildMessage () {
        var messageOptions = reminder.options.message ? {message: reminder.options.message} : {message: ''};
        var container = document.createElement('div');
        container.classList.add('reminder-component');
        container.classList.add('reminder-message');
        reminder.message = ReminderMessage(messageOptions, container);
        element.appendChild(container);
    }

    function buildToggle () {
        var toggleOptions = reminder.options.active ? {active: reminder.options.active} : {active: false};
        var container = document.createElement('div');
        container.classList.add('reminder-component');
        container.classList.add('reminder-toggle');
        reminder.toggle = ReminderToggle(toggleOptions, container);
        element.appendChild(container);
    }

    function renderLayout() {
        buildLabel();
        buildToggle();
        buildTimePeriod();
        buildInterval();
        buildDays();
        buildMessage();
    }

    function handleComponentChange(evt) {
        var type = evt.type,
            detail = evt.detail;
        switch (type) {
            case 'label-change':
                reminder.options.label = evt.detail.label;
                break;
            case 'days-change':
                reminder.options.days = evt.detail.days;
                break;
            case 'message-change':
                reminder.options.message = evt.detail.message;
                break;
            case 'period-change':
                reminder.options.startHour = evt.detail.startHour;
                reminder.options.startPeriod = evt.detail.startPeriod;
                reminder.options.endHour = evt.detail.endHour;
                reminder.options.endPeriod = evt.detail.endPeriod;
                break;
            case 'toggle-change':
                reminder.options.active = evt.detail.active;
                break;
            case 'interval-change':
                reminder.options.interval = evt.detail.interval;
                reminder.options.unit = evt.detail.unit;
                break;
            default:
                break;
        }
        utils.triggerEvent('reminder-change', reminder.options, element);
    }

    function bindListeners() {
        element.addEventListener('label-change', handleComponentChange.bind(this));
        element.addEventListener('days-change', handleComponentChange.bind(this));
        element.addEventListener('message-change', handleComponentChange.bind(this));
        element.addEventListener('period-change', handleComponentChange.bind(this));
        element.addEventListener('interval-change', handleComponentChange.bind(this));
        element.addEventListener('toggle-change', handleComponentChange.bind(this));
    }

    function testDay(now) {
        var shouldTrigger = false;
        var day;
        for (day in options.days) {
            if (options.days.hasOwnProperty(day)) {
                if (now.day === day && options.days[day] === true) {
                    shouldTrigger = true;
                }
            }
        }
        return shouldTrigger;
    }

    function testHours (now) {
        var shouldTrigger = false;
        if (now.hours % reminder.options.interval === 0 &&
           now.seconds === 0 &&
           now.minutes === 0) {
            shouldTrigger = true;
        }
        return shouldTrigger;
    }

    function testMinutes(now) {
        var shouldTrigger = false;
        if (now.minutes % reminder.options.interval === 0 &&
           now.seconds === 0) {
            shouldTrigger = true;
        }
        return shouldTrigger;
    }

    function testSeconds(now) {
        var shouldTrigger = false;
        if (now.seconds % reminder.options.interval === 0) {
            shouldTrigger = true;
        }
        return shouldTrigger;
    }

    function testInterval(now) {
        var shouldTrigger = false;
        var unit = reminder.options.unit;
        switch(unit) {
            case 'hours':
                shouldTrigger = testHours(now);
                break;
            case 'minutes':
                shouldTrigger = testMinutes(now);
                break;
            case 'seconds':
                shouldTrigger = testSeconds(now);
                break;
            default:
                break;
        }
        return shouldTrigger;
    }

    reminder.testDate = function (date) {
        var now = {
            day: DAYS_MAP[date.getDay()],
            hours: date.getHours(),
            minutes: date.getMinutes(),
            seconds: date.getSeconds()
        }
        var shouldTrigger = false;

        //validate day

        if (!testDay(now)) {
            return false;
        }

        var startHours;
        var startHour = parseInt(reminder.options.startHour);
        if (startHour === 12 && reminder.options.startPeriod === 'am') {
            startHours = 0;
        } else {
            startHours =  startHour + (reminder.options.startPeriod === 'pm' ? 12 : 0);
        }
        var endHours;
        endHours = parseInt(reminder.options.endHour) + (reminder.options.endPeriod === 'pm' ? 12 : 0);

        //account for overnight intervals. ex: 11:00pm - 5:00am = 23:00 - 29:00
        if (endHours < startHours) {
            endHours += endHours === 12 ? 12 : 24;
        }

        //within period hours
        if (now.hours >= startHours && now.hours <= endHours) {
            //is exact interval
            //nowDelta need to allow for interval calculations
            //only need to account for hours since selector only allows for start time by hours.
            var nowDelta = {
                hours: now.hours - startHours,
                minutes: now.minutes,
                seconds: now.seconds
            }
            shouldTrigger = testInterval(nowDelta);
        }

        return shouldTrigger;
    };

    reminder.triggerReminder = function () {
        console.log('triggerReminder');
        //code to switch between browser notifications.
        //can cause spamming notifcations.
        /*if (Notification.permission === 'granted') {
            var notification = new Notification(reminder.options.label, {
              body: reminder.options.message,
            });
        } else {
            var alertMessage = [];
            alertMessage.push(reminder.options.label + '\n');
            alertMessage.push(reminder.options.message);
            alert(alertMessage);
        }*/

        var alertMessage = [];
        alertMessage.push(reminder.options.label + '\n');
        alertMessage.push(reminder.options.message);
        alert(alertMessage.join('\n'));
    };

    function init () {
        console.log('Reminder init');
        reminder.options = options || {};
        reminder.element = element;
        renderLayout();
        bindListeners();
    }

    reminder.destroy = function () {
        reminder.reminderLabel.destroy();
        reminder.timePeriod.destroy();
        reminder.interval.destroy();
        reminder.days.destroy();
        reminder.message.destroy();
        reminder.toggle.destroy();
        element.parentElement.removeChild(element);
    }

    dependencyManager.getDependencies(dependencies)
        .then(function () {
            init();
        });

    return reminder;
}