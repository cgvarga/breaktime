function TimeManager (element) {
    var timeManager = {};
    var dependencies = ['js/Utils.js'];
    var timer;
    var BASEINTERVAL = 1000;

    function handleTick (evt) {
        utils.triggerEvent('timer-tick', {}, element);
    }

    timeManager.start = function () {
        console.log('timerManager start');
        dependencyManager.getDependencies(dependencies)
            .then(function () {
                console.log('timerManager timer =');
                timer = setInterval(handleTick.bind(this), BASEINTERVAL);
            });
    };

    timeManager.stop = function () {
        clearInterval(timer);
    };

    return timeManager;
}