/**
 * Pagination for article
 * 
 * @author wadahkode <mvp.dedefilaras@gmail.com>
 * @since version 1.1.5
 */
export const createLink = (container, data, total) => {
    container.innerHTML += `
        <ul class="uk-pagination uk-flex uk-flex-between uk-flex-center" uk-switcher>
            <li class="uk-disabled"><a><span class="uk-margin-small-right" uk-pagination-previous></span>Sebelumnya</a></li>
            <li><a>Selanjutnya<span class="uk-margin-small-left" uk-pagination-next></span></a></li>
        </ul>
    `;
};

export const createLoadMore = (container, total) => {
    console.log(total.length);
};