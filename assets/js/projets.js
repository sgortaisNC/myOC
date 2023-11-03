import {api, createProjectHome, createCategoryFilter, openModal, isConnected, createProjectModal} from './fonctions.js';

const works = await api('http://localhost:5678/api/works','GET');
if (works.length) {
    works.forEach(work => {
        createProjectHome(work.id, work.title, work.imageUrl, work.categoryId);
        if (isConnected()){
            createProjectModal(work.id, work.imageUrl);
        }
    });
}

const categories = await api('http://localhost:5678/api/categories','GET');
if (categories.length) {
    createCategoryFilter(0, 'Tous',true);
    categories.forEach(category => {
        createCategoryFilter(category.id, category.name)
    });
}

if(isConnected()){
    document.querySelectorAll('[data-modal]').forEach(elem => {
        elem.addEventListener('click', function(e){
            e.preventDefault();
            openModal(elem.dataset.modal);
        });
    });

    document.getElementById('ajoutForm').addEventListener('submit', async function(e){
        e.preventDefault();
        let form = new FormData(this);
        let ajout = await api('http://localhost:5678/api/works', 'POST', form, true, false);
        if (ajout.id) {
            createProjectHome(ajout.id, ajout.title, ajout.imageUrl, ajout.categoryId);
            createProjectModal(ajout.id, ajout.imageUrl);
            openModal('suppressions');
        };
    });

}
