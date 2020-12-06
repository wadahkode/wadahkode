import {isNull} from 'lodash';
import {register,validation} from '../services/authenticated';

class Register {
    constructor(props) {
        this.formId = props.formId;
        this.btnSubmit = props.btnSubmit;
        this.setUp();
    }
    
    handleChange(form,btn) {
        return register(form,btn);
    }
    
    setUp() {
        let form = document.getElementById(this.formId),
            btnForm = document.querySelector("." + this.btnSubmit);
        
        //var validate = validation(form, "bidang %s tidak boleh kosong!");
        
        if (!isNull(form)) {
            btnForm.addEventListener('click', event => {
                btnForm.disabled = true;
                btnForm.innerHTML = `
                    <span id="register-spinner"></span>
                    <span class="uk-margin-small-left">Please wait</span>
                `;
                form.onsubmit = this.handleChange(form, btnForm);
                event.preventDefault();
            });
        }
    }
}

export default Register;