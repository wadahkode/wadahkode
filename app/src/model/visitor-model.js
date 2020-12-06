import * as firebase from 'firebase/app';
//import * as URL from '../utility/url';
import DateFormater from '../utility/dateformater';
import {isNull} from 'lodash';

class VisitorModel {
    constructor(table) {
        this.ref = firebase.database().ref(table);
        this.table = table;
        this.ipAddress = [];
        this.counter;
    }
    
    setIpAddress(data) {
        var d = new DateFormater(new Date());
        //var visitorKey = d.date.getTime();
        //var ref = firebase.database().ref(this.table + '/' + visitorKey);
        var ref = firebase.database().ref(this.table + '/' + data.ip.split('.').join('-'));
        var auth = firebase.auth().onAuthStateChanged(user => !isNull(user) ? user.uid : false);
        
        if (!data.path.match(/\/id\/.*/)) {
            return false;
        } else {
            if (auth() == "Oht0jHsudug0x5QJkKiqSoiAuDe2") {
                return false;
            } else if (data.ip.toString().match('114.142')) {
                // jangan tambahkan ipku sebagai pengunjung.
                return false;
            } else {
                ref.set({
                    "ip": data.ip,
                    "path": data.path,
                    "created_at": d.halfTime()
                });
            }
        }
    }
    
    setUp() {
        this.counter = () => {
            return new Promise(resolve => {
                this.ref.on('value', snapshot => isNull(snapshot.val()) ? resolve(0) : resolve(Object.keys(snapshot.val()).length));
            });
        };
    }
}

export default VisitorModel;