(() => {
	function debounce(fn, delay) {
		let timer;
		return function(...args) {
			clearTimeout(timer);
			timer = setTimeout(() => {
				fn.apply(this, args)
			}, delay)
		}
	}

	class View {
		constructor() {
			this.app = document.querySelector('.container');
			this.form = this.createElement('form', 'search-form');
			this.form.setAttribute('action', '#')
			this.input = this.createElement('input', 'search-form__input');

			this.searchReposList = this.createElement('ul', 'search-list', 'list-reset');
			this.reposList = this.createElement('ul', 'repositories', 'list-reset')

			this.form.appendChild(this.input);
			this.form.appendChild(this.searchReposList);
			this.app.appendChild(this.form);
			this.app.appendChild(this.reposList)
		}

		createElement(elementTag, ...elementClass) {
			const element = document.createElement(elementTag);
			const classes = [...elementClass]
			if (elementClass) {
				classes.forEach((el) => {
					element.classList.add(el);
				})
			}

			return element;
		}

		createRepos(reposData) {
			const repo = this.createElement('li', 'search-list__item');
			repo.textContent = `${reposData.name}`;
			this.searchReposList.appendChild(repo)

			repo.addEventListener('click', () => {
				const addRepo = this.createElement('li', 'repositories__item');
				const repoName = this.createElement('span', 'repositories__item-name');
				repoName.textContent = `name: ${reposData.name}`;
				const repoOwner = this.createElement('span', 'repositories__item-owner');
				repoOwner.textContent = `owner: ${reposData.owner.login}`;
				const repoStars = this.createElement('span', 'repositories__item-stars');
				repoStars.textContent = `stars: ${reposData.size}`;

				[repoName, repoOwner, repoStars].forEach(el => addRepo.appendChild(el))

				this.reposList.appendChild(addRepo);
			})
		}
	}

	class Search {
		constructor(view) {
			this.view = view;

			this.view.input.addEventListener('keyup', debounce(this.searchRepositories.bind(this), 400) );
		}

		async searchRepositories() {
			if(this.view.input.value === '') {
				this.view.searchReposList.innerHTML = '';
				return;
			}
			return await fetch(`https://api.github.com/search/repositories?q=${this.view.input.value}`)
				.then((res) => {
					if (res.ok) {
						res.json().then((res) => {
							const repos = res.items;
							this.view.searchReposList.innerHTML = '';
							
							for (let i = 0; i < 5; i++) {
								const element = repos[i];
								this.view.createRepos(element)
								console.log(element.name)
								console.log(element)
							}
						})
					}
				})
		}
	}

	new Search(new View());
})()
