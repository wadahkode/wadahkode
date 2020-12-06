import * as Facebook from '../config/facebook';

function shareToMedia(...props) {
    let fb = document.querySelectorAll(".btn-share-facebook"),
        wa = document.querySelectorAll(".btn-share-whatsapp"),
        tw = document.querySelectorAll(".btn-share-twitter"),
        copy = document.querySelectorAll(".btn-copy-url");
        
    fb.length < 1 ? facebookShare(fb[0], props) : fb.forEach(btn => facebookShare(btn, props));
    wa.length < 1 ? whatsappShare(wa[0], props) : wa.forEach(btn => whatsappShare(btn, props));
    tw.length < 1 ? twitterShare(tw[0], props) : tw.forEach(btn => twitterShare(btn, props));
    copy.length < 1 ? copyUrlToShare(copy[0]) : copy.forEach(btn => copyUrlToShare(btn));
}

function facebookShare(btn, props) {
    Facebook.addMetaProperty("og:url", props[0]);
    Facebook.addMetaProperty("og:type", props[1]);
    Facebook.addMetaProperty("og:title", props[2]);
    Facebook.addMetaProperty("og:description", props[3]);
    Facebook.addMetaProperty("og:image", props[4]);
    
    Facebook.initialize(document, 'script', 'facebook-jssdk', fb => {
        btn.addEventListener('click', function(){
            fb.ui({
                //display: 'popup',
                method: 'share',
                href: props[0]
            }, function(response) {
                if (!response) {
                    return false;
                }
                // kalau berhasil jalankan hasil share untuk disimpan kedalam database,
                // dengan nilai 1 ditambah hasil share sebelumnya dari database.
                return resultShare();
            });
        });
    });
}

function resultShare() {
    alert("artikel berhasil dibagikan!");
}

function whatsappShare(btn, props) {
    btn.addEventListener('click', function(){
        this.href = `whatsapp://send?text=${props[0]}`;
        this.setAttribute('data-action', 'share/whatsapp/share');
    });
}

function twitterShare(btn, props) {
    btn.addEventListener('click', function(){
        this.href = `http://twitter.com/share?url=${props[0]}&text=${props[3]}`;
    });
}

function copyUrlToShare(btn) {
    btn.addEventListener('click', function(){
        
        let Url = this.querySelector('.copied');
        //Url.value = this.getAttribute('data-href');
        try {
            Url.hidden = false;
            Url.select();
            Url.setSelectionRange(0, 99999);
            if (document.execCommand("copy")) {
                Url.hidden = true;
                this.querySelector('.copied-message').classList.add('uk-text-success');
                this.querySelector('.copied-message').innerHTML = `<span uk-icon="icon: check;"></span>&nbsp;tersalin`;
            }
        } catch (e) {
            console.log(e);
            this.querySelector('.copied-message').classList.add('uk-text-danger');
            this.querySelector('.copied-message').innerHTML = `<span uk-icon="icon: warning;"></span>&nbsp;salin gagal`;
        }
    });
}

export {shareToMedia};