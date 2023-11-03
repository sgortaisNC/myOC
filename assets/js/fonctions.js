function isConnected(){
    if (localStorage.getItem('token')) {
        return true;
    } else {
        return false;
    }
}

async function api(url,  method, data = null, auth = false, jsonHeader = true) {
    let args = {
        method: method,
        headers: {
            'content-Type': 'application/json'
        }
    }
    if (!jsonHeader) {
        args.headers = {};
    }
    if (auth) {
        args.headers['Authorization'] = 'Bearer ' + localStorage.getItem('token');
    }
    if (data) {
        args.body = data;
    }
    const apiCall = await fetch(url, args);
    let json = null;

    if (apiCall.status == 200 || apiCall.status == 201) {
        json = await apiCall.json();
    }else{
        json = await apiCall.status;
    }
    return json;
}



function createProjectHome(id, name, img, category){
    const projectDOM = document.createElement('figure');
    projectDOM.dataset.category = category;
    projectDOM.dataset.projetId = id;
    
    const projectImgDOM = document.createElement('img');
    projectImgDOM.src = img;
    projectImgDOM.alt = name;
    
    
    const projectCaptionDOM = document.createElement('figcaption');
    projectCaptionDOM.textContent = name;
    
    projectDOM.appendChild(projectImgDOM);
    projectDOM.appendChild(projectCaptionDOM);
    
    document.querySelector('.gallery').appendChild(projectDOM);
}

function createProjectModal(id, img){
    const projectDOM = document.createElement('figure');
    projectDOM.dataset.projetId = id;
    
    const projectImgDOM = document.createElement('img');
    projectImgDOM.src = img;
    
    const btnRemove = document.createElement('button');
    btnRemove.textContent = 'Supprimer';
    btnRemove.addEventListener('click', async function(e){
        let suppression = await api('http://localhost:5678/api/works/' + id, 'DELETE', null, true);
        if (suppression === 204){   
            document.querySelectorAll(`[data-projet-id="${id}"`).forEach(async (domElement) => {
                domElement.remove();
            });
        }
    });
    
    
    projectDOM.appendChild(projectImgDOM);
    projectDOM.appendChild(btnRemove);
    
    document.querySelector('.projectsToRemove').appendChild(projectDOM);
}

function createCategoryFilter(id, name, active = false){
    const categoryDOM = document.createElement('button');
    categoryDOM.dataset.category = id;
    categoryDOM.textContent = name;
    if (active) {
        categoryDOM.classList.add('active');
    }
    
    categoryDOM.addEventListener('click', function(e){        
        document.querySelectorAll('.filters button').forEach(button => {
            button.classList.remove('active');
        });
        e.target.classList.add('active');
        document.querySelectorAll('.gallery figure').forEach(project => {
            if (id == 0 || project.dataset.category == id) {
                project.style.display = 'block';
            } else {
                project.style.display = 'none';
            }
        });
    })
    
    document.querySelector('.filters').appendChild(categoryDOM);

    if(isConnected){
        let option =  document.createElement('option');
        option.value = id;
        option.textContent = name;

        document.querySelector('#category').appendChild(option);
    }
}

function openModal(elem){
    if (document.querySelector('.modal.active')) {
        document.querySelector('.modal.active').classList.remove('active');
    }
    document.getElementById(elem).classList.add('active');
    
    const backdrop = document.createElement('div');
    backdrop.classList.add('backdrop');
    backdrop.addEventListener('click', function(e){
        closeModal();
    });
    document.querySelector('.modal.active').appendChild(backdrop);
}

function closeModal(){
    document.querySelector('.modal.active').classList.remove('active');
    document.querySelectorAll('.backdrop').forEach(bckdrp => {
        bckdrp.remove();
    });
}


export {
    api,
    createProjectHome,
    createProjectModal,
    createCategoryFilter,
    openModal, 
    closeModal,
    isConnected
};