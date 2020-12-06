let isCacheSupported = 'caches' in window,
    cacheManager = {};

cacheManager.setCacheName = function(name) {
    cacheManager.name = name;
};

cacheManager.save = function(urls){
    if (isCacheSupported) {
        caches.open(this.name).then(cache => {
            cache.addAll(urls);
        });
    }
};

cacheManager.getCache = function(url){
    if (isCacheSupported) {
        caches.open(this.name).then(cache => {
            cache.match(url).then(response => response);
        });
    }
};

cacheManager.delete = function(){
    
};

export {cacheManager};