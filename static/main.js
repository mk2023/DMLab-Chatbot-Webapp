
const Chat = (function() {
    const myName = "blue";

    function init() {

        let name_input = document.getElementById('user_id')
        let msg_textarea = document.getElementById('msg_chat')
        let msg_cont = document.querySelector('.input-div')
        var arrayofchatbox = document.getElementsByClassName('chat');
        var arrayofcheckbox = document.getElementsByClassName('checkboxname');
        msg_cont.addEventListener('keydown', function(e){
                for(var target = e.target; target && target != this; target = target.parentNode){
                    if(target.matches('div.input-div textarea')){
                        if (e.keyCode == 13 && !e.shiftKey) {
                            e.preventDefault();
                            let msg_textarea = document.getElementById('msg_chat')
                            //did this again to make sure that msg_textarea is what i want
    
                            const message = msg_textarea.value;
                            let user_id = document.getElementById('user_id').value

                            //making inputs and outputs
                            for(let i = 0; i<arrayofcheckbox.length-1; i++){
                                if(arrayofcheckbox[i].checked==true)
                                {
                                    chatbox = arrayofcheckbox[i].parentNode.parentNode;
                                    sendMessage(message, chatbox.id);
                                }
                            }
                            for(let i = 0; i<arrayofcheckbox.length-1; i++){
                                if(arrayofcheckbox[i].checked==true)
                                {
                                    chatbox = arrayofcheckbox[i].parentNode.parentNode;
                                    sendMessage_chat(user_id, message, chatbox);
                                }
                            }

                            //clearing the text area
                            clearTextarea();
                        }
                        break;
                    }
                }
        });

        name_input.addEventListener('change', (event) => {
            let regex = /^[a-zA-Z]+$/
            let userId = name_input.value
            if (regex.test(userId)) {
                msg_textarea.disabled = false
                msg_textarea.placeholder = "Press Enter to send a message to " + (msg_textarea.hasAttribute('data-engine') && msg_textarea.hasAttribute('data-prompt') ? msg_textarea.getAttribute('data-prompt') : "Skye")
            } else {
                msg_textarea.disabled = true
                msg_textarea.placeholder = "First input your name on the top of the screen"
            }
        })

        let bot_name = document.getElementById('cb_name')
        bot_name.innerHTML = msg_textarea.hasAttribute('data-engine') && msg_textarea.hasAttribute('data-prompt') ? msg_textarea.getAttribute('data-prompt').toUpperCase() : "SKYE"

    }

    // creating a message tag
    function createMessageTag(LR_className, senderName, message) {
        // bringing the initially created template
        let target_li = document.querySelector('div.format ul li');
        let chatLi = target_li.cloneNode(true); //putting the paramter "true" clones all the things in the node will be copied

        chatLi.classList.add(LR_className);
        
        const tmp = chatLi.querySelector('.sender span') //have to add span to the end so the senderName is added to the span instead of just inside the .sender. If the latter happens, the whole structure can be detroyed.
        tmp.innerText = senderName;
        
        const tmp2 = chatLi.querySelector('.message span');
        tmp2.innerText=message;

        return chatLi;
    }

    // adding the message tag
    function appendMessageTag(LR_className, senderName, message, chatbox_id) {
        target = 0;
        let chatbox = document.querySelector('#'+ chatbox_id);
        chatLi = createMessageTag(LR_className, senderName, message);

        //the message tag is added to the target element
        var target = chatbox.querySelector('ul');
        target.append(chatLi); 

        //fixing the scrollbar on the bottom
        let tmp = chatbox.scrollHeight;
        chatbox.scrollTo(0, tmp);
    }

    function scrolltoTop() {
        window.scroll({top: 0, left: 0, behavior: 'smooth'});
      }
    
    //function that connects with the server
    function request_api_chat(user_id, user_says, secondClass, _id_chatbox) {
        var myHeaders = {
            'Content-Type': 'application/json',
        }
        
        //data needed to create the chatbot response
        let body = {
            "user_id": user_id,
            "user_input": user_says,
            "ai_name": secondClass,
            "id_ai_name": _id_chatbox,

        }
        
        let msg_textarea = document.getElementById('msg_chat')

        if (msg_textarea.hasAttribute('data-engine') && msg_textarea.hasAttribute('data-prompt')) {
            body["engine"] = msg_textarea.getAttribute('data-engine')
            body["prompt"] = msg_textarea.getAttribute('data-prompt')
        }

        var raw = JSON.stringify(body);

        var requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: raw,
            redirect: 'follow'
        };

        let url = "/chat"

        if (msg_textarea.hasAttribute('data-engine') && msg_textarea.hasAttribute('data-prompt')) {
            url = "/custom/chat"
        }

        fetch(url, requestOptions)
            .then(response => response.json())
            .then(result => {
                var chat_message = result
                const data = { //data received from server/python file
                    "senderName": msg_textarea.hasAttribute('data-engine') && msg_textarea.hasAttribute('data-prompt') ? msg_textarea.getAttribute('data-prompt') : "skye",
                    "message": chat_message['skye_says'],
                    "id_ai_name": chat_message['id_model_name'],
                };
                receive_chat(data);

            })
            .catch(error => console.log('error', error))

    }
    // requests api from flask server
    
    // sending the inputed message to screen
    function sendMessage(message, chatbox_id) {

        const data = { //sent by python file
            "senderName": "user",
            "message": message,
            "chatbox": chatbox_id
        };
        receive(data);
    }

    //sending inputted message to server
    function sendMessage_chat(user_id, message, chatbox) {
        secondClass = chatbox.classList[1];
        chatbox_id = chatbox.id;
        request_api_chat(user_id, message, secondClass, chatbox_id);
    }

    function clearTextarea() {
       
        const box = document.querySelector('div.input-div textarea');
        box.value ='';
        //('div.input-div textarea').value = '';
    }

    // receiving inputted message by user
    function receive(data) {
        const LR = (data.senderName != myName) ? "left" : "right";
        appendMessageTag("right", data.senderName, data.message, data.chatbox);
    }

    // receiving chatbot message
    function receive_chat(data) {
        const LR = (data.senderName != myName) ? "left" : "right";
        console.log(data)
        appendMessageTag("left", data.senderName, data.message, data.id_ai_name);
    }

    //makes a function in Chat() in public (initially private)
    return {
        'init': init,
        'sendMessage': sendMessage
    };
})();

document.addEventListener("DOMContentLoaded", ()=>{
    Chat.init();
})

//closing chatboxes that have its close button clicked
const updateListeners = () =>{

    var closeBoxBtn = document.getElementsByClassName('close_button');

    for (const closebtn of closeBoxBtn) {
        closebtn.addEventListener('click', e=>{
            closebtn.parentNode.parentNode.remove();
        console.log('box closed!');
        });
    }    
}

selectedainame = 0; //variable that will the identify the type of chatbot ai that will be used for that chatbox
const containertmp = document.querySelector('.grid-container');
const addBoxBtn = document.querySelector('#addBoxBtn');
const popup  = document.getElementById("myPopup");

//if the plus button is clicked, then the popup is shown
addBoxBtn.addEventListener('click', e => {
  e.preventDefault();
  document.getElementById("myPopup").style.display = "block";
});

//if the aboutskye button is clicked, then the about skye popup is shown
const aboutboxbtn = document.querySelector('.button_aboutskye');
const popupaboutskye = document.querySelector('.popupforskye');
aboutboxbtn.addEventListener('click', e=> {
    e.preventDefault();
    document.querySelector(".popupforskye").style.display = "block";
});


//created this dictionary to keep track how many of each chatbot models there are (to make different ids for each chatbox)
dict = {
    "text-curie-001": 1,
    "text-babbage-001": 1,
    "text-ada-001": 1,
    "text-davinci-002": 1,
    "text-davinci-003":1
  };
  
const selectAiBtn = document.querySelector('#ai_type_select');

//creating a new box after selecting the chatbot model name in the popup
selectAiBtn.addEventListener('click', e=>{
    var listtmp = document.getElementById("ai-names"); //ai-nane selected from dropdown
    selectedainame = listtmp.value;

    let myText = document.createTextNode("AI model: " + selectedainame);
    var ul = document.createElement('ul');

    //making a new element, which will later become the chatbox itself
    let newBox = document.createElement('div');

    //copying the elements template containing the close button and checkbox
    const element_template = document.getElementById('element_template');
    let element_clone = element_template.cloneNode(true);

    //assigning the chat class to the element "newBox"
    newBox.setAttribute('class', 'chat');
    //assigning another class
    newBox.classList.add(selectedainame);

    //makes its id based on their chatbot name and counting number
    newBox.id = selectedainame + dict[selectedainame];
    dict[selectedainame]=dict[selectedainame]+1;
    
    //adding the button & checkmark, text, and ul to the element "newBox"
    newBox.append(element_clone); //uses the copied version of button & checkmark
    newBox.appendChild(myText);
    newBox.appendChild(ul);

    //getting rid of the popup on the screen so that instead of the popup, the chatbox will appear
    const deleting = document.querySelector('.popup');
    document.getElementById("myPopup").style.display = "none";  
    containertmp.removeChild(deleting);
    
    //adding the element "newBox" to the screen
    containertmp.appendChild(newBox);

    //add the plus sign to the screen
    containertmp.appendChild(deleting);

    console.log('new box added!');

    //checking to see if any boxes should be deleted due to the user clicking its "close" button
    updateListeners()
    console.log('listeners updated!');
  });

//making the timestamp
const displayTime = document.querySelector(".display-time");

function showTime() {
  let time = new Date();
  displayTime.innerText = time.toLocaleTimeString("en-KR", { hour12: false });
  displayTime.innerText +=' '
  displayTime.innerText+='  Sent'
  setTimeout(showTime, 1000);
}

showTime();

//hiding the aboutskye popup after clicking anywhere on the screen
var wholepage = document.querySelector('.popupforskye');
if(wholepage.style.display!="none"){
    document.addEventListener("click", function(event) {
        // If user clicks inside the element, do nothing
        if(event.target.closest(".popupforskye")) return;
        if(event.target.closest(".button_aboutskye")) return;
        if(wholepage.style.display =="none") return;
        // If user clicks outside the element, hide it!
        wholepage.style.display = "none";
        document.querySelector('.button_aboutskye').style.display = "block"
    });    
}