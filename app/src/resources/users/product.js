import ProductModel from '../../model/product-model';
import * as URL from '../../utility/url';
import * as GHPages from '../../config/ghpages';
import {isNull} from 'lodash';

export const model = () => {
    return new ProductModel('products');
};

export const getProduct = (id) => {
    const container = document.getElementById(id),
        loading = document.getElementById('product-loaded');
    
    if (!isNull(container) && !isNull(loading)) {
        // tampilkan loading
        loading.hidden = false;
        
        setTimeout(async () => {
            await model().getProduct(response => {
                // sembunyikan kembali loading
                loading.hidden = true;
                container.innerHTML += viewProduct(response);
                container.style.marginTop = "2.3rem";
            });
        }, 1000);
    }
};

export const getPPNProduct = (price, lat) => {
    let ppn = 0;
    
    switch (lat) {
        case 'margasari':
            ppn = (price / (0.1 * 100) + 3000);
            break;
        
        case 'pagerbarang':
        case 'jatibarang':
            ppn = (price / (0.1 * 100) + 10000);
            break;
    }
    
    return {
        "result": ppn
    };
};

export const getDetailProduct = (id,key) => {
    const container = document.getElementById(id);
        // patternPath = /\/home\/product/g,
        // patternKey = /\?key.*/g,
        // total = [];
    showDetailProduct(key.toString().split('=')[1], container);
};

const showDetailProduct = (name, container) => {
    
    if (isNull(container)) return false;
    
    container.innerHTML = `
        <div class="uk-flex uk-flex-center uk-flex-middle"
            style="height: 80vh">
            <div class="spinner spinner-medium"></div>
        </div>
    `;
    //container.style.marginTop = "-0.5rem";
    
    return model().getProduct(response => {
        if (!isNull(response.productUrl.match(name))) {
            let productPPN = formatRupiah(getPPNProduct(response.productPrice, response.productLocation).result, "Rp. "),
                productPrice = formatRupiah(response.productPrice, "Rp. "),
                title = document.querySelector('title');
            
            container.removeAttribute('uk-grid');
            container.removeAttribute('uk-height-match');
            container.className = "";
            title.innerHTML = 'Wadahkode | detail dari ' + response.productName;
            //container.style.marginTop = "-2rem";
            
            container.innerHTML = `
                <div class="uk-card uk-card-default">
                    <figure class="@uk-card-media-left uk-margin-remove-bottom uk-cover-container">
                        <img src="${response.productPhoto}" class="@uk-width-1-1 @uk-height-medium" alt="" uk-cover/>
                        <canvas width="600" height="400"></canvas>
                    </figure>
                    <div class="uk-card-body uk-padding-small">
                        <h3 class="uk-text-warning uk-text-bolder uk-margin-remove-bottom">${productPrice}</h3>
                        <p class="uk-margin-remove-top">${response.productName}</p>
                    </div>
                </div>
                <!-- PPN -->
                <a class="uk-card uk-card-default uk-card-body uk-flex uk-flex-between uk-flex-center uk-padding-small uk-margin-small-top uk-margin-small-bottom uk-link-reset">
                    <div class="uk-text-bold">Pengiriman</div>
                    <div>
                        <span>${productPPN}</span>
                        <span uk-icon="icon: chevron-right"></span>
                    </div>
                </a>
                <!-- END PPN -->
                <!-- SPESIFIKASI AND GARANSI -->
                <a class="uk-card uk-card-default uk-card-body uk-padding-small uk-link-reset" style="border-bottom: 1px solid #f2f2f2;">
                    <div class="uk-flex uk-flex-between">
                        <span class="uk-text-bold">Spesifikasi</span>
                        <span uk-icon="icon: chevron-right"></span>
                    </div>
                    <div>${response.productCategory}</div>
                </a>
                <a class="uk-card uk-card-default uk-card-body uk-padding-small uk-link-reset">
                    <div class="uk-flex uk-flex-between">
                        <span class="uk-text-bold">Pengembalian dan garansi</span>
                        <span uk-icon="icon: chevron-right"></span>
                    </div>
                    <div>
                        <span uk-icon="icon: reply"></span>
                        <span>tidak ada garansi</span>
                    </div>
                </a>
                <!-- END SPESIFIKASI AND GARANSI -->
                <!-- DESKRIPSI -->
                <div class="uk-card uk-card-default uk-margin-small-top" style="margin-bottom: 4.5rem;">
                    <div class="uk-card-header uk-padding-small">
                        <b>Deskripsi</b>
                    </div>
                    <div class="uk-card-body uk-padding-small">
                        <p>${response.productDetail}</p>
                    </div>
                </div>
                <!-- END DESKRIPSI -->
                <!-- TOMBOL BELI, CHAT -->
                <ul class="uk-card uk-card-default uk-card-body uk-position-fixed uk-position-bottom uk-padding-small uk-margin-remove uk-flex uk-flex-center uk-flex-between uk-flex-middle uk-position-z-index" style="height: 80px; list-style: none;">
                    <li>
                        <a href="${GHPages.getOrigin('/id').pathname}/home/store/?ref=${response.productStore}" class="uk-button uk-button-small uk-padding-remove-horizontal uk-text-capitalize">
                            <i class="fas fa-store-alt fa-fw" style="font-size: 16pt;"></i>&nbsp;Toko
                        </a>
                    </li>
                    <li>
                        <a href="${GHPages.getOrigin('/id').pathname}/home/chat/seller?rc=${response.productStore}" class="uk-button uk-button-small uk-padding-remove-horizontal uk-text-capitalize">
                            <i uk-icon="icon: commenting; ratio: 1.4"></i>
                        </a>
                    </li>
                    <li>
                        <a href="${GHPages.getOrigin('/id').pathname}/home/checkout/?ro=${response.productKey}" class="uk-button uk-button-primary uk-border-rounded uk-button-small uk-text-capitalize">
                            Beli sekarang
                        </a>
                    </li>
                    <li>
                        <a data-target="${response.productKey}"
                            class="uk-button uk-button-danger uk-border-rounded uk-button-small uk-text-capitalize cart">
                            <div class="uk-flex uk-flex-center uk-flex-middle">
                                <span class="spinner uk-margin-small-right" hidden></span>
                                <span>Keranjang</span>
                            </div>
                        </a>
                        
                    </li>
                </ul>
                <!-- END TOMBOL BELI, CHAT -->
            `;
            
            return container;
        } else {
           return false;
        }
    });
};

export const formatRupiah = (angka,prefix) => {
    var number_string = new Intl.NumberFormat().format(angka);
    return `${prefix}${number_string}`;
};

export const viewProduct = item => {
    return `
        <a href="product/?key=${item.productUrl.split('=')[1]}" class="uk-link-reset">
            <div class="uk-card @uk-card-default uk-background-default uk-box-shadow-small uk-border-rounded">
                <div class="@uk-card-media-top uk-cover-container @uk-height-small"
                    style="border-top-left-radius: 4px; border-top-right-radius: 4px;">
                    <img src="${item.productPhoto}" class="@uk-width-* @uk-height-*" alt="" uk-cover>
                    <canvas width="600" height="400"></canvas>
                </div>
                <div class="uk-card-body uk-padding-small">
                    <h3 class="uk-card-title uk-text-bold uk-text-small uk-margin-remove-bottom">${item.productName}</h3>
                    <sub class="uk-text-danger uk-text-meta uk-text-small uk-margin-remove-top" style="font-size: 11px;">${formatRupiah(item.productPrice, "Rp. ")}</sub>
                </div>
                <div class="uk-card-footer uk-padding-remove-top uk-padding-small">
                    ${ (item.productStock == 0) ? `
                        <div class="">
                            <div class="uk-text-danger uk-text-small">stock sudah habis</div>
                            <progress style="height: 2px;" class="uk-progress uk-margin-remove-top uk-margin-remove-bottom" max="${item.productStockMax}" value="${item.productStock}"></progress>
                        </div>
                    ` : `
                        <div class="">
                            <div class="uk-text-meta uk-text-small">tersedia ${item.productStock}</div>
                            <progress style="height: 2px;" class="uk-progress uk-margin-remove-top uk-margin-remove-bottom" max="${item.productStockMax}" value="${item.productStock}"></progress>
                        </div>
                    `}
                </div>
            </div>
        </a>
    `;
};