/**
 * Date Formater
 * 
 * Mengatur waktu dan tugas berulang dengan waktu tertentu.
 * 
 * @author wadahkode <mvp.dedefilaras@gmail.com>
 * @since version 1.0.8
 */
class DateFormater {
    constructor(props) {
        this.date = props;
    }
    
    halfTime() {
        return this.date.toLocaleString('en-US',{
            hour12: false
        });
    }
    
    getFullYear(date) {
        return date.toLocaleDateString('en-US', {
            hour12: false
        }).split('/');
    }
    
    getFullTime(date) {
        return date.toLocaleTimeString('en-US', {
            hour12: false
        }).split(/:| /);
    }
    
    setCurrentAt(time) {
        let start, end;
        
        start = new Date(time);
        end = new Date();
        
        let [cmonth, cday, cyear] = this.getFullYear(end),
            [chour, cminutes, cseconds] = this.getFullTime(end),
            [month, day, year] = this.getFullYear(start),
            [hour, minutes, seconds] = this.getFullTime(start);
        
        if ((cyear > year) && (cmonth == month) && (cday == day)) return cyear - year;
        else if ((cyear > year) && (cmonth > month) && (cday == day)) return ((cmonth - month) + 10) + ' bulan yang lalu';
        else if ((cmonth > month) && (cday == day)) return ((cmonth - month)) + ' bulan yang lalu';
        else {
            console.log(cday);
            if (cday > day) {
                return (parseInt(cday) - parseInt(day)) + ' hari yang lalu';
            } else {
                let current = parseInt(31 - day) + parseInt(cday);
            
                if (current < 31 && current > 7 && current < 14) return '1 minggu yang lalu';
                else if (current < 31 && current > 14 && current < 21) return '2 minggu yang lalu';
                else if (current < 31 && current >= 21) return '3 minggu yang lalu';
                else if (current > 31) return '3 minggu yang lalu';
                else {
                    let current = parseInt(23 - hour) + parseInt(chour),
                        currentMinutes = parseInt(60 - minutes) + parseInt(cminutes);
                        
                    if (current > 23 && currentMinutes >= 60) return (current - 23) + ' jam yang lalu';
                    else {
                        let current = parseInt(60 - minutes) + parseInt(cminutes);
                        
                        if (current > 60) return (current - 60) + ' menit yang lalu';
                        else {
                            //let current = parseInt(sec) - parseInt(seconds) + 1;
                            
                            if (currentMinutes < 60) {
                                return (currentMinutes) + ' menit yang lalu';
                            } else if (seconds == cseconds) {
                                return 'baru saja';
                            } else {
                                return (cseconds) + ' detik yang lalu';
                            }
                        }
                    }
                }
            }
        }
    }
    
    setTimeCronJob(callback) {
        let finishMaintence = new Date(/*"May 7, 2021 00:00:00"*/).getTime();

        let timeLimit = setInterval(() => {
            let nowDate = new Date().getTime(),
                distance = /*finishMaintence - */nowDate,
                days = Math.floor(distance / (1000 * 60 * 60 * 24)),
                hour = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
                minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
                seconds = Math.floor((distance % (1000 * 60)) / 1000);
            
            /**
             * Refresh otomatis
             * 
             *---------------------------------*
             | #       | Penjelasan            |
             *---------------------------------*
             | seconds | Setiap 1 menit sekali |
             | minutes | Setiap 1 jam sekali   |
             | hour    | Setiap 1 hari sekali  |
             | days    | Setiap 1 bulan sekali |
             *---------------------------------*
             */
            callback(seconds);
            
            if (distance < 0) {
                clearInterval(timeLimit);
            }
        }, 1000);
    }
    
    setCookieTime(exdays) {
        return this.date.setTime(
            this.date.getTime() + (exdays * 24 * 60 * 60 * 1000)
        );
    }
}

export default DateFormater;