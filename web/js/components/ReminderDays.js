function ReminderDays (options, element) {
    var reminderDays = {};
    var dependencies = ['js/Utils.js'];

    function renderLayout () {

        var title = document.createElement('h2');
        title.innerHTML = 'Active Days';
        element.appendChild(title);

        days = ['Su', 'M', 'Tu', 'W', 'Th', 'F', 'Sa'];
        days.forEach(function (day) {
            btn = document.createElement('button');
            btn.classList.add('reminder-day');
            btn.setAttribute('data-val', day);
            btn.innerText = day;
            if (reminderDays.options.days[day]) {
                btn.classList.add('active');
            }
            element.appendChild(btn);
        });
    }

    function getDaysState() {
        var days = {};
        var buttons = element.querySelectorAll('button');
        utils.forEach(buttons, function(i, day) {
            days[day.getAttribute('data-val')] = day.classList.contains('active');
        });
        return days;
    }

    function toggleDay (btn) {
        if (btn.classList.contains('active')) {
            btn.classList.remove('active');
        } else {
            btn.classList.add('active');
        }
        options.days = getDaysState();
        utils.triggerEvent('days-change', {days: options.days}, element);
    }

    function handleElementClick (evt) {
        btn = evt.target;
        if (evt.target.nodeName.toLowerCase() === 'button') {
            toggleDay(btn);
        }
    }

    function bindListeners () {
        element.addEventListener('click', handleElementClick.bind(this));
    }

    function init () {
        reminderDays.options = options || {days: {}};
        renderLayout();
        bindListeners();
        utils.triggerEvent('days-change', {days: getDaysState()}, element);
    }

    reminderDays.destroy = function () {
        element.removeEventListener('click', handleElementClick);
        element.remove();
    };

    dependencyManager.getDependencies(dependencies)
        .then(function () {
            init();
        });

    return reminderDays;
}