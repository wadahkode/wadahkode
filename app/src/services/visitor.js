import VisitorModel from '../model/visitor-model';
import DateFormater from '../utility/dateformater';
import {isNull} from 'lodash';

class Visitor extends VisitorModel {
    constructor(table) {
        super(table);
    }
    
    index() {
        this.setUp();
        
        var containerVisitor = document.getElementById('view-visitor'),
            pvc = document.querySelector('.pageview-count'),
            date = new DateFormater(new Date());
        
        if (!isNull(containerVisitor)) {
            this.counter().then(total => containerVisitor.innerHTML = this.viewVisitor(total, date.halfTime()));
        
           let cron = date.setTimeCronJob(distance => {
                //console.log(distance);
                if (distance < 1) {
                    this.counter().then(total => {
                        containerVisitor.innerHTML = this.viewVisitor(total, date.halfTime());
                        //pvc.innerHTML = this.pageViewCount(total);
                    });
                }
            });
        }
        else if (!isNull(pvc)) {
            this.counter().then(total => pvc.innerHTML = this.pageViewCount(total));
        
           let cron = date.setTimeCronJob(distance => {
                //console.log(distance);
                if (distance < 1) {
                    this.counter().then(total => {
                        pvc.innerHTML = this.pageViewCount(total);
                    });
                }
            });
        } else {
            //console.log(pvc);
        }
    }
    
    pageViewCount(total) {
        return `<span uk-icon="icon: users"></span>&nbsp;${total} pengunjung`;
    }
    
    viewVisitor(total,currentTime) {
        return `
            <span>${total} pengunjung</span>
            <span class="uk-margin-small-left">(${currentTime})</span>
        `;
    }
    
    writeVisitor(data) {
        return this.setIpAddress(data);
    }
}

export default Visitor;