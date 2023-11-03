import {api, createProjectHome, createCategoryFilter, openModal, isConnected, createProjectModal, closeModal} from './fonctions.js';

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

    document.querySelectorAll('[data-close]').forEach(elem => {
        elem.addEventListener('click', closeModal);
    });
    document.querySelectorAll('[data-return]').forEach(elem => {
        elem.addEventListener('click', function(e){
            openModal('suppressions')
        })
    });

    document.getElementById('ajoutForm').addEventListener('change', function(e){
        const checkValue = "#upload, #title, #category";
        const allFilled = checkValue.split(', ').every(selector => {
            return document.querySelector(selector).value;
        });
        if (allFilled) {
            document.querySelector('#ajoutForm [type="submit"]').removeAttribute('disabled');
        }else{
            document.querySelector('#ajoutForm [type="submit"]').setAttribute('disabled', 'disabled');
        }
    });

    document.getElementById('upload').addEventListener('change', function(e){
        console.log(this.files[0]);
        console.log(e.target.result);
        document.querySelector('.upload-field label').innerHTML = `<img>`;
        const reader = new FileReader();
        reader.onload = function(e){
            document.querySelector('.upload-field label img').src = e.target.result;
        }
        reader.readAsDataURL(this.files[0]);
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
