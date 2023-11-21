(() => {
    const container = document.querySelector('.container');

    function createDomElement(element, text = undefined, elementClass = undefined, parent = container) {
        const domElement = document.createElement(element);

        if(text !== undefined) domElement.textContent = text;
        if(elementClass !== undefined) domElement.classList.add(elementClass);

        if(parent !== container) {
            parent.appendChild(domElement);
            container.appendChild(parent);
        }

        parent.appendChild(domElement)
    }

    createDomElement('h1', 'Тест', 'title');
    createDomElement(
        'p', 
        'Lorem ipsum dolor sit amet consectetur adipisicing elit. Doloremque necessitatibus tempore iure quia, reiciendis nihil hic ut pariatur sunt aspernatur, neque nemo quod? Laudantium doloribus aliquid veritatis animi voluptatem voluptate.',
        'text'
    )
})()