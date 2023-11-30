(() => {
	function debounce(fn, delay) {
		let timer;
		return function (...args) {
			clearTimeout(timer);
			timer = setTimeout(() => {
				fn.apply(this, args);
			}, delay);
		};
	}

	class View {
		constructor() {
			this.app = document.querySelector('.container');
			this.form = this.createElement('form', 'search-form');
			this.form.setAttribute('action', '#');
			this.input = this.createElement('input', 'search-form__input');
			this.searchReposList = this.createElement('ul', 'search-list', 'list-reset');
			this.reposList = this.createElement('ul', 'repositories', 'list-reset');

			this.form.appendChild(this.input);
			this.form.appendChild(this.searchReposList);
			this.app.appendChild(this.form);
			this.app.appendChild(this.reposList);
		}

		createElement(elementTag, ...elementClass) {
			const element = document.createElement(elementTag);
			if (elementClass) {
				[...elementClass].forEach((el) => {
					element.classList.add(el);
				});
			}

			return element;
		}

		createRepos(reposData) {
			const repo = this.createElement('li', 'search-list__item');
			repo.textContent = `${reposData.name}`;
			this.searchReposList.appendChild(repo);

			repo.addEventListener('click', () => {
				const addRepo = this.createRepoItem(reposData);
				this.reposList.appendChild(addRepo);
				this.input.value = '';
				this.searchReposList.innerHTML = '';
			});
		}

		createRepoItem(reposData) {
			const addRepo = this.createElement('li', 'repositories__item');
			const repoName = this.createElement('p', 'repositories__item-descr');
			repoName.textContent = `Name: ${reposData.name}`;
			const repoOwner = this.createElement('p', 'repositories__item-descr');
			repoOwner.textContent = `Owner: ${reposData.owner.login}`;
			const repoStars = this.createElement('p', 'repositories__item-descr');
			repoStars.textContent = `Stars: ${reposData.stargazers_count}`;
			const deleteBtn = this.createElement('button', 'repositories__item-btn', 'btn-reset');

			[repoName, repoOwner, repoStars, deleteBtn].forEach((el) => addRepo.appendChild(el));

			deleteBtn.addEventListener('click', () => addRepo.remove());

			return addRepo;
		}
	}

	class Search {
		constructor(view) {
			this.view = view;
			this.debouncedSearch = debounce(this.searchRepositories.bind(this), 500);
			this.view.input.addEventListener('input', this.debouncedSearch);
		}

		async searchRepositories() {
			if (this.view.input.value === '') {
				this.view.searchReposList.innerHTML = '';
				return;
			}

			try {
				const response = await fetch(`https://api.github.com/search/repositories?q=${this.view.input.value}`);
				if (response.ok) {
					const res = await response.json();
					const repos = res.items.slice(0, 5);
					this.view.searchReposList.innerHTML = '';

					repos.forEach((element) => {
						this.view.createRepos(element);
					});
				}
			} catch (error) {
				console.error('Error fetching repositories:', error);
			}
		}
	}

	new Search(new View());
})();