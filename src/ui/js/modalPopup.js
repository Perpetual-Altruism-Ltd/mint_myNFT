export let showModalPopup = function(){
  let mainCont = document.querySelector("#MainContainer");
  mainCont.classList.add('Blurred');

  let body = document.getElementsByTagName('body')[0];
  body.classList.add('ModalOpen');

  //Show popup box after blur effect transition finished
  setTimeout(()=>{
    let modalCont = document.querySelector("#ModalBackground");
    modalCont.classList.remove('Hidden');
  }, 800);

}

export let hideModalPopup = function(){
  //Hide modal box
  let modalCont = document.querySelector("#ModalBackground");
  modalCont.classList.add('Hidden');

  let body = document.getElementsByTagName('body')[0];
  body.classList.remove('ModalOpen');

  let mainCont = document.querySelector("#MainContainer");
  mainCont.classList.remove('Blurred');

  //clear input
  document.getElementById("ReceiverAddrInput").value = "";

  //Clear send btn callback
  let sendBtn = document.getElementById("ModalSendTokenBtn");
  sendBtn.addEventListener('click', (e) => {});

  //Hide message
  showModalMsg(false, "", '');
}

export let showModalMsg = function(show, txt, color){
  let modalErrElem = document.querySelector("#ModalMsg");
  modalErrElem.innerHTML = txt;
  modalErrElem.style.display = show ? 'flex' : 'none';
  modalErrElem.style.color = color;
}
