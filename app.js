class FormSubmit {
    constructor(settings) {
        this.settings = settings;
        this.form = document.querySelector(settings.form);
        this.formButton = this.form ? document.querySelector(settings.button) : null;

        if (this.form) {
            this.url = this.form.getAttribute("action");
        }

        this.sendForm = this.sendForm.bind(this);
    }

    displaySuccess() {
        // Redireciona para a página de sucesso
        window.location.href = "success.html";
    }

    displayError() {
        const errorElement = document.createElement('div');
        errorElement.innerHTML = this.settings.error;
        this.form.innerHTML = '';
        this.form.appendChild(errorElement);
    }

    getFormObject() {
        const formObject = {};
        const fields = this.form.querySelectorAll("[name]");
        fields.forEach((field) => {
            formObject[field.getAttribute("name")] = field.value;
        });
        return formObject;
    }

    onSubmission(event) {
        event.preventDefault();
        const button = event.target;
        button.disabled = true;
        button.innerText = "Enviando...";
        button.classList.add('submitting');
    }

    async sendForm(event) {
        try {
            event.preventDefault();
            
            // Evita o envio do formulário se os campos obrigatórios estiverem vazios
            if (!this.validateForm()) {
                return;
            }

            this.onSubmission(event);

            const response = await fetch(this.url, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Accept: "application/json",
                },
                body: JSON.stringify(this.getFormObject()),
            });

            if (response.ok) {
                this.displaySuccess();
            } else {
                this.displayError();
            }
        } catch (error) {
            this.displayError();
            throw new Error(error);
        }
    }
    
    validateForm() {
        const fields = this.form.querySelectorAll("[name]");
        for (const field of fields) {
            const value = field.value.trim();
    
            // Verifica se o campo está vazio (considerando espaços em branco)
            if (!value && field.type !== "hidden" && !field.disabled) {
                // Exibir mensagem de erro ao usuário, se desejar
                console.error("Campo obrigatório não preenchido:", field.name);
                return false;
            }
        }
        
        // Verifica se o campo textarea está vazio
        const textarea = this.form.querySelector("textarea");
        if (!textarea.value.trim()) {
            console.error("Campo obrigatório não preenchido:", textarea.name);
            return false;
        }
    
        return true;
    }

    init() {
        if (this.form) this.formButton.addEventListener("click", this.sendForm);
        return this;
    }
}

const formSubmit = new FormSubmit({
    form: "[data-form]",
    button: "[data-button]",
    success: "<h1 class='success'>Mensagem enviada!</h1>",
    error: "<h1 class='error'>Não foi possível enviar sua mensagem.</h1>",
});
formSubmit.init();
