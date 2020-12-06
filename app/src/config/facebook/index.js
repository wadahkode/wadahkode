/**
 * For share article to facebook
 * 
 * @author wadahkode <mvp.dedefilaras@gmail.com>
 * @since version 1.1.8
 */
let appId = "APP_ID",
    secret = "APP_SECRET",
    token = `${appId}|${secret}`;
        
function addMetaProperty(...props) {
    var head = document.querySelector('head'),
        meta = document.createElement('meta');
        
    meta.setAttribute('property', props[0]);
    meta.setAttribute('content', props[1]);
    
    head.append(meta);
}

function initialize(d,s,id, callback) {
    var js, fjs = d.getElementsByTagName(s)[0];
    if (d.getElementById(id)) return;
        js = d.createElement(s); js.id = id;
        js.src = "https://connect.facebook.net/en_US/sdk.js#xfbml=1&version=v3.0";
        fjs.parentNode.insertBefore(js, fjs);
        
    window.fbAsyncInit = function() {
        FB.init({
            appId      : parseInt(appId),
            xfbml      : true,
            version    : 'v8.0',
            status     : true,
            viewMode   : "website",
            autoRun    : true
        });
        FB.AppEvents.logPageView();
        
        callback(FB);
    };
}

export {addMetaProperty, initialize};