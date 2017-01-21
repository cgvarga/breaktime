dependencyManager = {
    getDependencies: function (deps) {
        var promise = new Promise(function (resolve, reject){
            var totalDeps = deps.length,
                attemptedDeps = 0,
                loadedDeps = 0;

            function handleLoaded (evt) {
                var scriptNode;
                if (evt) {
                    scriptNode = evt.target;
                    scriptNode.setAttribute('loaded', 'loaded');
                }

                attemptedDeps ++;
                loadedDeps ++;
                if (attemptedDeps === totalDeps) {
                    if (loadedDeps === totalDeps) {
                        resolve('All Deps Loaded');
                    } else {
                        reject(Error('Not All Deps Loaded'));
                    }
                }
            }

            deps.forEach(function (dep) {
                var depScriptNode = document.querySelectorAll('[src="' + dep + '"]');
                if (depScriptNode.length === 0 ||
                   depScriptNode[0].getAttribute('loaded') !== 'loaded') {
                    var script = document.createElement('script');
                    script.setAttribute('type', 'text/javascript');
                    script.setAttribute('src', dep);
                    document.body.appendChild(script);
                    script.addEventListener('load', handleLoaded);
                    script.addEventListener('error', handleLoaded);
                } else {
                    handleLoaded();
                }
            });
            if (deps.length === 0) {
                resolve('No Dependencies');
            }
        });
        return promise;
    }
}
