const {isUndefined, isEmpty, isNull} = require('lodash');

export const parse = (uri, pattern) => {
    let url = require('url'),
        address = window.location.href,
        q = url.parse(address, true),
        m;
        
    return new Promise((resolve, reject) => {
        
        if (!isUndefined(uri) && !isEmpty(uri)) {
            q = url.parse(uri, true);
            m = q.pathname.match(pattern);
            return (!isNull(m) ? resolve(m) : reject('url not valid'));
        } else {
            m = q.pathname.match(pattern);
            return (!isNull(m) ? resolve(m) : reject('url not valid'));
        }
    });
};

export const search = (uri, pattern) => {
    let url = require('url'),
        address = location.href,
        q = url.parse(address, true),
        m;
        
    return new Promise((resolve, reject) => {
        
        if (!isUndefined(uri) && !isEmpty(uri)) {
            q = url.parse(location.origin + uri, true);
            m = q.search.match(pattern);
            return (!isNull(m) ? resolve(m) : reject('url not valid'));
        } else {
            m = q.search.match(pattern);
            return (!isNull(m) ? resolve(m) : reject('url not valid'));
        }
    });
};

/**
 * Get the user IP throught the webkitRTCPeerConnection
 * @param onNewIP {Function} listener function to expose the IP locally
 * @return undefined
 * @source https://ourcodeworld.com/articles/read/257/how-to-get-the-client-ip-address-with-javascript-only
 */
export const getUserIP = (onNewIP) => { //  onNewIp - your listener function for new IPs
    //compatibility for firefox and chrome
    var myPeerConnection = window.RTCPeerConnection || window.mozRTCPeerConnection || window.webkitRTCPeerConnection;
    var pc = new myPeerConnection({
        iceServers: []
    }),
    noop = function() {},
    localIPs = {},
    ipRegex = /([0-9]{1,3}(\.[0-9]{1,3}){3}|[a-f0-9]{1,4}(:[a-f0-9]{1,4}){7})/g,
    key;

    function iterateIP(ip) {
        if (!localIPs[ip]) {
            return onNewIP(ip);
        }
        localIPs[ip] = true;
        
        return localIPs[ip];
    }

     //create a bogus data channel
    pc.createDataChannel("");

    // create offer and set local description
    pc.createOffer().then(function(sdp) {
        sdp.sdp.split('\n').forEach(function(line) {
            if (line.indexOf('candidate') < 0) return;
            line.match(ipRegex).forEach(iterateIP);
        });
        
        pc.setLocalDescription(sdp, noop, noop);
    }).catch(function(reason) {
        // An error occurred, so handle the failure to connect
    });

    //listen for candidate events
    pc.onicecandidate = function(ice) {
        if (!ice || !ice.candidate || !ice.candidate.candidate || !ice.candidate.candidate.match(ipRegex)) return;
        ice.candidate.candidate.match(ipRegex).forEach(iterateIP);
    };
    
    return onNewIP;
};

export const getIP = (url,cfg) => {
    return new Promise((resolve,reject) => {
        return fetch(url,cfg)
            .then(response => response.json())
            .then(response => resolve(response))
            .catch(error => reject(error));
    });
};

export const getPathname = path => {
    if (!isUndefined(path)) {
        return setPathname(path);
    }
};

export const setPathname = path => {
    return (location.pathname == path ? path : false);
};

export const filter = (pathname, pattern) => {
    return parse('', pattern).then(request => {
        
        request = getPathname(request);
        
        return (request == pathname) ? true : false;
        
    }).catch(error => {});
};

export const filterSearch = (query, callback) => {
    return callback(!isNull(location.search) ? true : false);
};