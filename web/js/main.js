function Main () {

    function init () {
        dependencyManager.getDependencies(['js/components/ReminderManager.js'])
            .then(function () {
                ReminderManager({}, document.querySelector('.reminder-manager'));
            });
    }

    init();

};