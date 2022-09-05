//const urlGlobal = `http://${window.location.host}`;
const urlGlobal = 'http://192.168.2.78:8000';
let dataGlobal;
let isDeleteMode = false;
function createTagText(tag_name, text = '') {
    let tag = document.createElement(tag_name);
    tag.innerText = text;
    return tag;
}

const checkAll = ()=>{
    let allStatuses = document.querySelectorAll('[data-status]');
    allStatuses.forEach(statusDiv=>{
        checkStatus(statusDiv.dataset.status.slice(1,));
    })
}

const deletePortItem = async (id)=>{
    const fetchOptions = {
        method: "Delete",
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
        },
    };
    const response = await fetch(`${urlGlobal}/ports/${id}`, fetchOptions);
    if (!response.ok) {
        const errorMessage = await response.text();
        throw new Error(errorMessage);
    }
}

const checkStatus = (id) => {
    fetch(`${urlGlobal}/ports/${id}?status=check`)
        .then(response => response.json())
        .then(data => {
            const statusDiv = document.querySelector(`[data-status=s${id}]`)
            if (data.status) {
                statusDiv.innerText = "Up";
                statusDiv.setAttribute('class', "s_green");
            } else {
                statusDiv.innerText = "Down";
                statusDiv.setAttribute("class", "s_red")
            }
        })
}

async function getAllPorts(){
    const response = await fetch(`${urlGlobal}/ports`);
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    return  await response.json();
}

const addPortSubmit = async (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    try {
        const formData = new FormData(form);
        const url = `${urlGlobal}/ports`;
        const method = "POST";
        const responseData = await postFormDataAsJson({url, formData, method});
        if(dataGlobal){
            dataGlobal = [...dataGlobal, responseData]
        }else{
            dataGlobal = [responseData];
        }
        show_all_ports([responseData]);
        form.reset();
    } catch (error) {
        console.log(error)
    }
}

const postFormDataAsJson = async ({url, formData, method}) => {
    const plainFormData = Object.fromEntries(formData.entries());
    const forDataJsonString = JSON.stringify(plainFormData);
    const fetchOptions = {
        method: `${method}`,
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
        },
        body: forDataJsonString,
    };
    const response = await fetch(url, fetchOptions);
    if (!response.ok) {
        const errorMessage = await response.text();
        throw new Error(errorMessage);
    }
    return response.json();
}

//Popup form
const patchPort = async (event, id)=>{
    event.preventDefault();
    const form = event.currentTarget;

    try {
        const formData = new FormData(form);
        const url = `${urlGlobal}/ports/${id}`;
        const method = "PATCH";
        console.log(formData);
        const responseData = await postFormDataAsJson({url, formData, method});
        document.getElementById("ports").remove();
        getAllPorts();
        closePopupForm(id);

    } catch (error) {
        console.log(error)
    }

}


const openForm = (port_item, item)=> {
    const divForm = document.getElementById("popupForm");

    divForm.setAttribute('id', `popupForm${item.id}`)
    const form = divForm.getElementsByTagName('form')[0];
    form.reset();
    divForm.style.display = "block";
    //form.addEventListener("submit", (event=event, id=item.id, port_item)=>patchPort(vent, id, port_item);
    const inputs = form.getElementsByTagName('input');
    for(const key in item){
        const input = inputs[key];
        if(input){
            inputs[key].value = item[key];
        }
    }
}

const closePopupForm = (id)=> {
    document.getElementById(`popupForm${id}`).style.display = "none";
}

//-----------
const globalEvenListener = (event)=>{
    if (event.target.dataset.btnCheck){
        checkStatus(event.target.dataset.btnCheck);
    }
    if (event.target.dataset.btnCheck1s){
        let portsId = event.target.dataset.btnCheck1s.slice(1,);
        console.log(portsId);
        if($.checkPortTimers[portsId]){
            clearInterval($.checkPortTimers[portsId]);
            $.checkPortTimers[portsId]=NaN;
            document.querySelector(`[data-btn-check1s=_${portsId}]`).classList.remove("s_green");
        }else {
            $.checkPortTimers[portsId] = setInterval(()=>checkStatus(portsId), 1000);
            document.querySelector(`[data-btn-check1s=_${portsId}]`).classList.add("s_green");
        }
    }
    if(event.target.dataset.checkAll){
        checkAll();
    }
}


const portItemToHTML = (port) => {
    return(`
        <div id="${port.id}" class="port_item d_flex ports_color">
            <div class="patch_desk">${port.patch_desk}</div>
            <div class="path_desk">${port.current_patch_desk}</div>
            <div>${port.dev_name}</div>
            <div>${port.port_description}</div>
            <div data-status="s${port.id}" class= ${port.status === false ? "s_red" : "s_green"}>
                ${port.status === false ? 'Down' : 'Up'}
            </div>
            <div class="button_div d_flex">
                <button data-btn-check=${port.id}>CheckStatus</button>
                <button data-btn-check1s=_${port.id}>CheckStatus_1s</button>
            </div>  
        </div>
    `)
}

const editPortModal = ()=>{

}
const render = ()=>{
    getAllPorts().then(items=>{
        const html = items.map(item => portItemToHTML(item)).join('');
        document.querySelector('#ports').innerHTML = html;
    })
}

render();
document.addEventListener("click", (event)=>globalEvenListener(event));
const modal = $.modal();
//getAllPorts();
const addPortForm = document.getElementById('add_port_form');
addPortForm.addEventListener("submit", addPortSubmit);
const deleteModeButton = document.getElementById('delete_mode_button');
deleteModeButton.addEventListener("click",(event)=>{
    isDeleteMode=!isDeleteMode;
    if(isDeleteMode){
        event.target.setAttribute("class", "s_green");
    }
    else{
        event.target.removeAttribute('class');
    }
});
