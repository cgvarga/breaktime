function ReminderManager (options, element) {
    var reminderManager = {};
    var dependencies = [
        'js/components/Reminder.js',
        'js/components/TimeManager.js'
    ];
    function getReminders () {
        reminders = {
            hash: {},
            order:[]
        };
        fromStorage = localStorage.getItem('reminders');
        if (fromStorage) {
            reminders = JSON.parse(fromStorage);
        }
        return reminders;
    }

    function saveReminders () {
        localStorage.setItem('reminders', JSON.stringify(reminderManager.reminders));
    }

    function removeReminder (id) {
        var orderIndex = reminderManager.reminders.order.indexOf(id);
        reminderManager.reminders.hash[id].destroy();
        delete reminderManager.reminders.hash[id];
        reminderManager.reminders.order.splice(orderIndex, 1);
        saveReminders();
    }

    function getId() {
        var sorted = reminderManager.reminders.order.sort(function(a,b) {
            return parseInt(a) - parseInt(b);
        });
        return (sorted[sorted.length - 1] + 1) || 1;
    }

    function updateReminder(id, data) {
        reminderManager.reminders.hash[id].options = data;
        saveReminders();
    }

    function createReminder (options) {
        options = options || {};
        var reminderContainer = document.createElement('div');
        reminderContainer.classList.add('reminder-container');
        reminderManager.reminderContainer.appendChild(reminderContainer);
        var reminder= Reminder(options, reminderContainer);

        var delBtn = document.createElement('button');
        delBtn.classList.add('delete');
        delBtn.innerText = 'Delete';
        delBtn.setAttribute('data-action', 'delete');
        delBtn.setAttribute('data-id', options.id);
        reminderContainer.appendChild(delBtn);
        if (options.id) {
            reminderContainer.setAttribute('data-id', options.id);
        }

        return reminder;
    }

    function addReminder () {
        var id = getId();
        reminderManager.reminders.hash[id] = createReminder({id: id});
        reminderManager.reminders.order.push(id);
        saveReminders();
    }

    function populateReminders () {
        if (reminderManager.reminders.order.length) {
            reminderManager.reminders.order.forEach(function (reminderId) {
                var reminderData = reminderManager.reminders.hash[reminderId];
                reminderData.options = reminderData.options || {id: reminderId};
                reminderManager.reminders.hash[reminderId] = createReminder(reminderData.options);
            });
        }
    }

    function renderLayout () {
        reminderManager.reminderContainer = document.createElement('div');
        element.appendChild(reminderManager.reminderContainer);
        reminderManager.buttonContainer = document.createElement('div');
        element.appendChild(reminderManager.buttonContainer);

        reminderManager.addButton = document.createElement('button');
        reminderManager.addButton.innerHTML = 'Add Reminder';
        reminderManager.addButton.classList.add('add');
        reminderManager.buttonContainer.appendChild(reminderManager.addButton);

        populateReminders();
    }

    function handleDelete (evt) {
        var id = evt.target.getAttribute('data-id');
        removeReminder(id);
    }

    function handleTick () {
        var date = new Date();
        reminderManager.reminders.order.forEach(function (reminderId) {
            var reminderInstance = reminderManager.reminders.hash[reminderId];
            if (reminderInstance.options.active) {
                var shouldTrigger = reminderInstance.testDate(date);
                if (shouldTrigger) {
                    reminderInstance.triggerReminder();
                }
            }
        });
    }

    function handleElementClick(evt) {
        var action;
        if (evt.target.nodeName === 'BUTTON') {
            action = evt.target.getAttribute('data-action');
            switch(action) {
                case 'delete':
                    handleDelete(evt);
                    break;
                default:
                    break;
            }
        }
    }

    function handleAddClick(evt) {
        addReminder();
    }

    function handleReminderChange(evt) {
        var id = evt.detail.id;
        updateReminder(id, evt.detail);
    }

    function bindListeners () {
        reminderManager.addButton.addEventListener('click', handleAddClick.bind(this));
        element.addEventListener('click', handleElementClick.bind(this));
        element.addEventListener('reminder-change', handleReminderChange.bind(this));
        element.addEventListener('timer-tick', handleTick.bind(this));
    }

    function init () {
        reminderManager.options = options || {};
        reminderManager.element = element;
        reminderManager.reminders = getReminders();
        reminderManager.timeManager = TimeManager(element);
        getReminders();
        renderLayout();
        bindListeners();
        reminderManager.timeManager.start();
    }

    dependencyManager.getDependencies(dependencies)
        .then(function () {
            init();
        })
        .catch(function (err) {
            console.log('Failed to get dependencies');
            console.log(err);
        });

    return reminderManager;
}