var siteName = document.querySelector('#siteName');
var siteURL = document.querySelector('#siteURL');
var submitBtn = document.querySelector('#submitBtn');
var deleteBtn = document.querySelector('tbody button'); 
var modalElem  = document.querySelector('#exampleModal');


var sites = [];
if (localStorage.getItem('sites')) {
    sites = JSON.parse(localStorage.getItem('sites'));
    displaySites();
}
// event listener for the site name input
siteName.addEventListener('input', function () {
    
    validateInput(siteName);

});

// event listener for the site url input
siteURL.addEventListener('input', function () {
    validateInput(siteURL);

});

// event listener for the submit button
submitBtn.addEventListener('click', function (event) {
    event.preventDefault();//to prevent the submit button from submitting the form
    if(validateInput(siteName) && validateInput(siteURL))
    {
        addSite();
        clear();
        modal.hide();
    }
    else
    {
        showModal();
    }
});
function validateInput(element)
{
    //site name should be at least 3 characters and of chars and integers no special chars
    //site url should be sitename.com or sitename.com/anything but no special chars or spaces
    var regex = {
        siteName: /^[a-zA-Z0-9]{3,}$/,
        siteURL: /^[a-zA-Z0-9]{3,}\.[a-zA-Z]{2,}$/,
    }
    if(regex[element.id].test(element.value))
    {
        element.classList.add('is-valid');
        element.classList.remove('is-invalid');
        return true;
    }
    else
    {
        element.classList.add('is-invalid');
        element.classList.remove('is-valid');
        return false;
    }

}
function clear()
{
    siteName.value = '';
    siteURL.value = '';

    siteName.classList.remove('is-valid');
    siteURL.classList.remove('is-valid');
    
    siteName.classList.remove('is-invalid');
    siteURL.classList.remove('is-invalid');

}
function addSite() {
    var site = {
        index: sites.length,
        name: siteName.value,
        url: siteURL.value.startsWith('http') ? siteURL.value : 'http://' + siteURL.value

    }
    sites.push(site);
    updateLocalStorage();
    displaySites();

}

function updateLocalStorage() {
    localStorage.setItem('sites', JSON.stringify(sites));
}

function displaySites() {
    var content = ``;
    sites.forEach(site => {
        site.index = sites.indexOf(site);//this line is to add an index property to the site object
        content += `
        <tr>
            <td>${site.index + 1}</td>
            <td class = "text-capitalize">${site.name}</td>
            <td><button class = "btn btn-green"><a class = "text-decoration-none text-white" href = ${site.url} target = "_blank">
            <i class="fa-solid fa-eye pe-2"></i>
            Visit</a></button>
            </td>
            <td><button onclick = "deleteSite(${site.index})" class = "btn btn-watermelon text-white">
            <i class="fa-solid fa-trash-can"></i>
            Delete
            </button></td>
        </tr>
        `
    });
    document.querySelector('tbody').innerHTML = content;

}


function deleteSite(index)
{

    sites.splice(index, 1);
    updateLocalStorage();
    displaySites();

}

function showModal() {
    
    var modalElem = document.createElement('div');
    modalElem.classList.add('modal', 'fade');
    modalElem.setAttribute('tabindex', '-1');
    modalElem.setAttribute('aria-labelledby', 'exampleModalLabel');
    modalElem.setAttribute('aria-hidden', 'true');
    modalElem.innerHTML = `
        <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content p-3">
                <div class="modal-header border-0 d-flex justify-content-between">
                    <div class="circles d-flex column-gap-1">
                        <div class="bg-danger rounded-circle"></div>
                        <div class="bg-warning rounded-circle"></div>
                        <div class="bg-success rounded-circle"></div>
                    </div>
                    <button type="button" class="btn-close text-dark" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <p class="fw-medium fs-5 mt-3">Site Name or Url is not valid, Please follow the rules below :</p>
                    <div class="d-flex column-gap-1">
                        <i class="fa-regular fa-circle-right p-1"></i>
                        <p class="fw-light">Site name must contain at least 3 characters</p>
                    </div>
                    <div class="d-flex column-gap-1">
                        <i class="fa-regular fa-circle-right p-1"></i>
                        <p>Site URL must be a valid one</p>
                    </div>
                </div>
            </div>
        </div>
    `;

    document.body.appendChild(modalElem); 

    var modal = new bootstrap.Modal(modalElem); 
    modal.show(); 

    modalElem.addEventListener('hidden.bs.modal', function () {
        //without this line the modal will not be removed from the DOM
        modalElem.remove(); 
    });
}