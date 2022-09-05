const _createModal = (options)=>{
    const modalDiv = document.createElement('div');
    modalDiv.classList.add( "form-popup", "form-close");
    modalDiv.insertAdjacentHTML("afterbegin", `
                
                    <form action="#" className="form-container">
                        <input name="patch_desk" placeholder="Patch panel" type="text">
                        <input name="current_patch_desk" placeholder="Temp patch panel" type="text">
                        <input name="dev_name" placeholder="Device" type="text">
                        <input name="port_description" placeholder="Port description" type="text">
                        <input name="oid" placeholder="oid" type="text">
                        <input name="ip" placeholder="ip" type="text">
                        <button type="submit" className="btn-popup">Отправить</button>
                        <button type="button" className="btn-popup cancel" onClick="closePopupForm()">Закрыть</button>
                    </form>
                `);
    document.body.appendChild(modalDiv);
    return modalDiv;
}

$.modal = (options)=>{
    const $modal = _createModal(options);
    let closing = true;
    return{
        open(){

            if(closing){
                console.log("OPEN");
                $modal.classList.remove("form-close");
                $modal.classList.add("form-open");
                closing = false;
            }
        },
        close(){
            closing = true;
            console.log("CLOSE");
            $modal.classList.remove("form-open");
            $modal.classList.add("form-close");
        },
        destroy(){}

    }

}
