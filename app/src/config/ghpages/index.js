/**
 * Github - Pages
 * 
 * Menentukan alamat dari github pages.
 * 
 * @author wadahkode <mvp.dedefilaras@gmail.com>
 * @since version 1.0.91
 */
let repoUrl = {
    "admin": () => {
        return [
            "/admin",
            "/admin/index.html",
            "/admin/product/index.html",
            "/admin/product/create.html",
            "/admin/product/edit.html"
        ];
    },
    "users": () => {
        return [
            "/home",
            "/home/index.html",
            "/home/logout.html"
        ];
    },
    "root": () => {
        return [
            "/"
        ];
    }
};

export const defaultGhpages = () => location.origin + location.pathname;

export const getOrigin = query => {
    let pathname;
    pathname = defaultGhpages().match((typeof query != 'undefined') ? query : '/id');
    return {
        "origin": defaultGhpages().match(location.origin),
        "href": defaultGhpages() + location.pathname,
        "pathname": pathname == null || pathname == "" ? '' : pathname
    };
};

export const filter = (urlType, urlPathname, callback) => {
    
    pathname = location.pathname == urlPathname ? location.pathname : null;
    
    switch (urlType) {
        case 'admin':
            return repoUrl.admin().includes(pathname) != "" ? true : false;
            
        case 'users':
            return (
                (repoUrl.users().includes(pathname) != "")
                    ? callback(true)
                    : callback(false)
            );
        default:
            return repoUrl.root().includes(pathname) != "" ? true : false;
            
    }
};