import ProductModel from '../model/product-model';
import * as URL from '../utility/url';
import * as GHPages from '../config/ghpages';
import {isNull} from 'lodash';

export const model = () => {
    return new ProductModel('products');
};

export const getProduct = id => {
    const container = document.getElementById(id),
        spinner = document.getElementById('spinner-js'),
        footer = document.querySelector('.foot'),
        iklan = document.getElementById('iklan');
    let text = ``;
    
    if (isNull(container) && isNull(iklan)) return false;
    footer.hidden = false;
    
    container.innerHTML = `
        <div class="uk-flex uk-flex-center uk-flex-middle uk-height-large">
            <div class="spinner spinner-medium"></div>
        </div>
    `;
    
    let title = document.createElement("h4");
    title.innerHTML = "<span>semua product</span>";
    title.className = "uk-container uk-text-capitalize";
    
    model().getProduct(response => {
        text += viewProduct(response);
        container.innerHTML = text;
        container.setAttribute("uk-grid", "masonry: true");
        container.parentElement.insertBefore(title, container);
        container.className = "uk-child-width-1-2 uk-margin-small-top";
        
        iklan.hidden = false;
        
        model().off();
    });
};

export const getProductWithGap = id => {
    const container = document.getElementById(id),
        spinner = document.getElementById('spinner-js'),
        iklan = document.getElementById('iklan');
    let text = ``;
    
    if (isNull(container)) return false;
    
    model().getProduct(response => {
        text += viewProduct(response);
        container.innerHTML = text;
        
        spinner.hidden = true;
        
        if (spinner.hidden == true) {
            iklan.removeAttribute('hidden');
        }
        model().off();
    });
    
    
};

export const getPPNProduct = (price, lat) => {
    let ppn = 0;
    
    switch (lat) {
        case 'margasari':
            ppn = (price / (0.1 * 100) + 3000);
            break;
            
        case 'balapupang':
            ppn = (price / (0.1 * 100) + 7000);
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

export const detailProduct = (id, key) => {
    const container = document.getElementById(id);
    
    if (isNull(container)) return false;
    
    document.body.style.height = "100vh";
    
    container.innerHTML = `
        <div class="uk-flex uk-flex-center uk-flex-middle"
            style="height: 80vh">
            <div class="spinner spinner-medium"></div>
        </div>
    `;
    
    setTimeout(() => {
        let request = key.toString().split('=');
        showDetailProduct(request[1], container);
    }, 2000);
};

export const showDetailProduct = (name, container) => {
    model().getProduct(response => {
        if (!isNull(response.productUrl.match(name))) {
            let productPPN = formatRupiah(getPPNProduct(response.productPrice, response.productLocation).result, "Rp. "),
                productPrice = formatRupiah(response.productPrice, "Rp. "),
                title = document.querySelector('title');
            
            container.removeAttribute('uk-grid');
            container.removeAttribute('uk-height-match');
            container.className = "";
            container.style.marginTop = "-5rem";
            title.innerHTML = 'Wadahkode | Detail dari ' + response.productName;
            
            container.innerHTML = `
                <div class="uk-card uk-card-default">
                    <figure class="@uk-card-media-left uk-margin-remove-bottom uk-cover-container">
                        <img src="${response.productPhoto}"
                            class="@uk-width-1-1 @uk-height-medium"
                            alt=""
                            uk-cover/>
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
                <ul class="uk-card uk-card-default uk-card-body uk-position-fixed uk-position-bottom uk-padding-small uk-margin-remove uk-flex uk-flex-center uk-flex-between uk-flex-middle" style="list-style: none;">
                    <li>
                        <a href="${GHPages.getOrigin('/id').pathname}/login.html"
                            class="uk-button uk-button-small uk-padding-remove-horizontal uk-text-capitalize"
                            onclick="sessionStorage.setItem('user-not-auth','Anda harus login sebelum melanjutkan!')">
                            <i class="fas fa-store-alt fa-fw" style="font-size: 16pt;"></i>&nbsp;Toko
                        </a>
                    </li>
                    <li>
                        <a href="${GHPages.getOrigin('/id').pathname}/login.html"
                            class="uk-button uk-button-small uk-padding-remove-horizontal uk-text-capitalize"
                            onclick="sessionStorage.setItem('user-not-auth','Anda harus login sebelum melanjutkan!')">
                            <i uk-icon="icon: commenting; ratio: 1.4"></i>
                        </a>
                    </li>
                    <li>
                        <a href="${GHPages.getOrigin('/id').pathname}/login.html"
                            class="uk-button uk-button-primary uk-border-rounded uk-button-small uk-text-capitalize"
                            onclick="sessionStorage.setItem('user-not-auth','Anda harus login sebelum melanjutkan!')">
                            Beli sekarang
                        </a>
                    </li>
                    <li>
                        <a href="${GHPages.getOrigin('/id').pathname}/login.html"
                            class="uk-button uk-button-danger uk-border-rounded uk-button-small uk-text-capitalize cart"
                            onclick="sessionStorage.setItem('user-not-auth','Anda harus login sebelum melanjutkan!')">
                            Keranjang
                        </a>
                    </li>
                </ul>
                <!-- END TOMBOL BELI, CHAT -->
            `;
        }
        else {
            //
        }
        
        model().off();
    });
};

export const formatRupiah = (angka,prefix) => {
    var number_string = new Intl.NumberFormat().format(angka);
    return `${prefix}${number_string}`;
};

export const viewProduct = item => {
    return `
        <a href="${GHPages.getOrigin('/id').pathname}/product/?key=${item.productUrl.split('=')[1]}" class="uk-link-reset">
            <div class="uk-card @uk-card-default uk-background-default uk-border-rounded uk-box-shadow-small uk-margin">
                <div class="uk-card-media-top uk-cover-container uk-height-small" style="border-top-left-radius: 4px; border-top-right-radius: 4px;">
                    <img src="${item.productPhoto}" class="@uk-width-1-1 uk-height-*" alt="" uk-cover style="border-top-left-radius: 4px; border-top-right-radius: 4px">
                </div>
                <div class="uk-card-body uk-padding-small">
                    <h3 class="uk-card-title uk-text-bold uk-text-small uk-margin-remove-bottom">${item.productName}</h3>
                    <sub class="uk-text-danger uk-text-meta uk-text-small uk-margin-remove-top" style="font-size: 11px;">${formatRupiah(item.productPrice, "Rp. ")}</sub>
                </div>
                
                <div class="uk-card-footer uk-padding-remove-top uk-padding-small">
                    ${ (item.productStock == 0) ? `
                        <div class="">
                            <div class="uk-text-danger uk-text-small">stock habis</div>
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