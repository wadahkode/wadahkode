/**
 * Service Worker
 * 
 * Memberikan dukungan saat jaringan internet tidak ada.
 * 
 * @author wadahkode <mvp.dedefilaras@gmail.com>
 */
export const register = (path) => {
    const pathManager = require('path');
    
    const swPath = pathManager.resolve(__dirname, path);
    
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', function() {
            navigator.serviceWorker.register((swPath != undefined) ? swPath + '/service-worker.js' : './service-worker.dev.js')
                .then(function(registration) {
                    //console.log(registration.scope, ' berjalan pada mode offline!');
                })
                .catch(function(error){
                    // error
                    console.error(error);
                });
        });
    }
};

export const unregister = (path="") => {
    const pathManager = require('path');
    
    const swPath = pathManager.resolve(__dirname, path);
    
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', function() {
            navigator.serviceWorker.register(swPath + 'service-worker.dev.js')
                .then(function(registration) {
                    //console.log(registration.scope, ' berjalan pada mode offline!');
                })
                .catch(function(error){
                    // error
                    console.error(error);
                });
        });
    }
};