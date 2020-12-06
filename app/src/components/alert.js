import UIKit from 'uikit';
import Icons from 'uikit/dist/js/uikit-icons';

export const noInternet = (message) => {
    let container = document.querySelector('.AppContent');
    
    //container.className('uk-text-center uk-margin-remove-horizontal');
    container.style.height = '60vh';
    //document.body.style.margin = 0;
    container.innerHTML = `
        <div class="uk-container uk-flex uk-flex-center uk-flex-middle uk-flex-column uk-height-1-1 uk-text-center">
            <div class="uk-width-1-1">
               <span uk-icon="icon: rss; ratio: 4"></span>
            </div>
            <p>${message}</p>
        </div>
    `;
};