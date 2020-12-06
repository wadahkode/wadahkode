/**
 * Store
 */
let container = document.getElementById('store');

const ProductModel = require('../model/product-model').default;
const GHPages = require('../config/ghpages');
const {formatRupiah} = require('../components/product');

function model() {
    return new ProductModel('products');
}

function Store(data) {
    container.innerHTML = `
        <div class="uk-flex uk-flex-center uk-flex-middle"
            style="height: 100vh;">
            <div class="spinner spinner-medium"></div>
        </div>
    `;
    
    if (data.storeNotFound) {
        setTimeout(function() {
            container.innerHTML = (data.storeNotFound);
        }, 1000);
    } else {
        data.result.forEach(item => {
            const {name,photo,pelanggan,product} = item.val();
            
            if (name === data.search) {
                setTimeout(async function() {
                    container.style.marginTop = "5rem";
                    
                    container.innerHTML = await `
                        <div class="uk-card uk-background-transparent">
                            <a href="#modal-media-image" class="uk-card-header uk-link-reset uk-padding-small"
                                style="height: 60px; background-image: url(${photo}); background-size: cover; background-position: center; background-repeat: no-repeat"
                                uk-toggle>
                                <div class="uk-margin-auto-vertical">
                                    <h2 class="uk-card-title uk-margin-remove-bottom">${name}</h2>
                                    <sub class="">pelanggan: ${subcriber(pelanggan)}</sub>
                                </div>
                            </a>
                            <div id="modal-media-image" class="uk-flex-top" uk-modal>
                                <div class="uk-modal-dialog uk-width-auto uk-margin-auto-vertical">
                                    <button class="uk-modal-close-outside" type="button" uk-close></button>
                                    <img src="${photo}" alt="">
                                </div>
                            </div>
                            <div class="uk-card-body uk-padding-small">
                                <ul uk-tab>
                                    <li><a class="uk-text-capitalize">Profil</a></li>
                                    <li><a class="uk-text-capitalize">Daftar Produk</a></li>
                                    <li><a class="uk-text-capitalize">Umpan balik</a></li>
                                </ul>
                                <ul class="uk-switcher">
                                    <li class="uk-height-large uk-overflow-auto">${getProfileStore()}</li>
                                    <li class="uk-height-large uk-overflow-auto" style="padding-bottom: 5rem">
                                        <div id="product-list" class="uk-child-width-1-2 uk-grid-small" uk-grid="masonry: true" uk-grid-match="target: > div > .uk-card"></div>
                                    </li>
                                    <li class="uk-height-large uk-overflow-auto">umpan balik</li>
                                </ul>
                            </div>
                        </div>
                    `;
                }, 1000);
                
                getProductList(product.length);
                
            } else {
                Store({
                    "storeNotFound": "Toko tidak dapat ditemukan!"
                });
            }
        });
    }
}

function subcriber(total) {
    let length = total.toString().length;
    
    switch (length) {
        case 4:
            return new Intl.NumberFormat().format(total).substring(0,3) + ' ribu';
        
        case 5:
            return new Intl.NumberFormat().format(total).substring(0,4) + ' ribu';
        
        case 6:
            return new Intl.NumberFormat().format(total).substring(0,5) + ' ribu';
        
        case 7:
            return new Intl.NumberFormat().format(total).substring(0,3) + ' juta';
        
        case 8:
            return new Intl.NumberFormat().format(total).substring(0,4) + ' juta';
        
        case 9:
            return new Intl.NumberFormat().format(total).substring(0,5) + ' juta';
        
        case 10:
            return new Intl.NumberFormat().format(total).substring(0,3) + ' milliar';
        
        case 11:
            return new Intl.NumberFormat().format(total).substring(0,4) + ' milliar';
        
        case 12:
            return new Intl.NumberFormat().format(total).substring(0,5) + ' milliar';
        
        case 13:
            return new Intl.NumberFormat().format(total).substring(0,3) + ' triliun';
        
        case 14:
            return new Intl.NumberFormat().format(total).substring(0,4) + ' triliun';
        
        case 15:
            return new Intl.NumberFormat().format(total).substring(0,5) + ' triliun';
        
        case 16:
            return new Intl.NumberFormat().format(total).substring(0,3) + ' billion';
        
        default:
            return total;
    }
}

function getProfileStore() {
    return `
        <div>
            <div class="uk-flex uk-margin-small-bottom">
                <div class="uk-width-1-3">Pemilik</div>
                <div class="uk-margin-small-right">:</div>
                <div>wadahkode</div>
            </div>
            <div class="uk-flex uk-margin-small-bottom">
                <div class="uk-width-1-3">Status toko</div>
                <div class="uk-margin-small-right">:</div>
                <div>resmi</div>
            </div>
            <div class="uk-flex uk-margin-small-bottom">
                <div class="uk-width-1-2 uk-margin-small-right">Alamat toko</div>
                <div class="uk-width-auto uk-margin-small-right">:</div>
                <div class="uk-width-1-1">jl.karang jati RT.07 RW.02 Kec.Margasari Kab.Tegal 52463</div>
            </div>
            <div class="uk-flex uk-margin-small-bottom">
                <div class="uk-width-1-3">Buka</div>
                <div class="uk-margin-small-right">:</div>
                <div class="uk-badge">07.00 - 21.00</div>
            </div>
            <div class="uk-flex uk-margin-small-bottom">
                <div class="uk-width-1-3">Produk</div>
                <div class="uk-margin-small-right">:</div>
                <div>100 produk</div>
            </div>
            <div class="uk-flex uk-margin-small-bottom">
                <div class="uk-width-1-3">Produk terjual</div>
                <div class="uk-margin-small-right">:</div>
                <div>10 produk</div>
            </div>
            <div class="uk-flex uk-margin-small-bottom">
                <div class="uk-width-1-3">Nomor ponsel</div>
                <div class="uk-margin-small-right">:</div>
                <div>-</div>
            </div>
            <div class="uk-flex uk-margin-small-bottom">
                <div class="uk-width-1-3">Email</div>
                <div class="uk-margin-small-right">:</div>
                <div>-</div>
            </div>
            <div class="uk-flex uk-margin-small-bottom">
                <div class="uk-width-1-3">Peringkat</div>
                <div class="uk-margin-small-right">:</div>
                <div class="uk-flex">
                    <div>
                        <span class="starred fa fa-star fa-fw"></span>
                        <span class="starred fa fa-star fa-fw"></span>
                        <span class="starred fa fa-star fa-fw"></span>
                        <span class="starred fa fa-star fa-fw"></span>
                        <span class="starred fa fa-star-half fa-fw"></span>
                    </div>
                    <div>4.8</div>
                </div>
            </div>
            <div class="uk-flex uk-margin-small-bottom">
                <div class="uk-width-1-3">Terdaftar</div>
                <div class="uk-margin-small-right">:</div>
                <div>Jum'at, 20 November 2020</div>
            </div>
        </div>
    `;
}

function getProductList(length) {
    setTimeout(function() {
        let productList = document.getElementById('product-list');
        
        model().getProductByLimit(snapshot => {
            snapshot.forEach(item => {
                productList.innerHTML += viewProduct(item.val());
                setProductPhoto(item.val().productPhoto);
            });
        }, length);
    }, 1000);
}

function viewProduct(product) {
    return `
        <a href="${GHPages.getOrigin('/id').pathname}/home/product/?key=${product.productUrl.split('=')[1]}" class="uk-link-reset">
            <div class="uk-card uk-card-default uk-border-rounded">
                <div class="uk-card-header uk-padding-remove">
                    <div class="uk-cover-container product-photo"
                        style="border-top-left-radius: 4px; border-top-right-radius: 4px;">
                        <canvas width="600" height="400"></canvas>
                    </div>
                </div>
                <div class="uk-card-body uk-padding-small">
                    <h3 class="uk-card-title uk-text-bold uk-text-small uk-margin-remove-bottom">${product.productName}</h3>
                    <sub class="uk-text-danger uk-text-meta uk-text-small uk-margin-remove-top" style="font-size: 11px;">${formatRupiah(product.productPrice, "Rp. ")}</sub>
                </div>
            </div>
        </a>
    `;
}

function setProductPhoto(urlPhoto){
    let photoContainer = document.querySelectorAll('.product-photo');
    let photo = new Image();
    
    photoContainer.forEach(item => {
        photo.src = urlPhoto;
        photo.setAttribute('uk-cover','');
        //photo.className = "uk-border-rounded";
        
        item.insertBefore(photo, item.childNodes[0]);
    });
}

module.exports = Store;