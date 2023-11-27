(() => {
    class View {
        constructor() {
            this.app = document.querySelector('.container');
            this.form = this.createElement('form', 'search-form');
            this.input = this.createElement('input', 'search-form__input');

            this.usersList = this.createElement('ul', 'users', 'list-reset');
            this.user = this.createElement('li');

            this.form.appendChild(this.input);
            this.app.appendChild(this.form);
            this.app.appendChild(this.usersList);
        }

        createElement(elementTag, ...elementClass) {
            const element = document.createElement(elementTag);
            const classes = [...elementClass]
            if(elementClass) {
                classes.forEach((el) => {
                    element.classList.add(el);
                })
            }

            return element;
        }
    }

    class Search {
        constructor(view) {
            this.view = view;

            this.view.input.addEventListener('keyup', this.searchRepositories.bind(this));
        }

        async searchRepositories(){
            return await fetch(`https://api.github.com/search/repositories?q=${this.view.input.value}`)
                .then((res) => {
                    if(res.ok) {
                        res.json().then((res) => console.log(res))  
                    }
                })
        }
    }

    new Search(new View());
})()
