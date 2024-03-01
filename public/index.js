const socket = io()

const totalUser = document.getElementById('clients-total')
const msgbox = document.getElementById('message-container')
const msginput = document.getElementById('message-input')
const msgform =document.getElementById('message-form')
const nameinput = document.getElementById('name-input')
const feedback = document.getElementById('feedback')
const msgtone = new Audio('/tone.mp3')

msgform.addEventListener('submit',(e)=>{
            e.preventDefault();
            sendmessage()
           
})

socket.on('totalclient',(data)=>{
    console.log(data)
    totalUser.innerText = `Total Clients : ${data}`
})

function sendmessage (){
    if(msginput.value === '')return
    console.log(msginput.value)
    const data ={
        name: nameinput.value,
        message: msginput.value,
        datetime: new Date()
    }
    socket.emit('message',data)
    addmsgToUI(true,data)
    msginput.value=''

}

socket.on('chatmessage',(data)=>{
    //receiver
    console.log(data)
    msgtone.play()
    addmsgToUI(false,data)
})

function addmsgToUI(isownmsg,data){
    clearfeedback()
const element = `
<li class="${isownmsg? "message-right ": "message-left"}">
                <p class="message">
                    ${data.message}
                    <span>${data.name}|${moment(data.datetime).fromNow()}</span>
                </p>
            </li>
            `

        msgbox.innerHTML += element;
        scrolltobtn();
}


    msginput.addEventListener('focus',(e)=>{
       socket.emit('feedback',{
        feedback: `${nameinput.value} is typing a msggggg`
       })
    })
    msginput.addEventListener('keypress',(e)=>{
        socket.emit('feedback',{
            feedback: `${nameinput.value} is typing a msggggg`
           })
    })
    msginput.addEventListener('blur',(e)=>{
        socket.emit('feedback',{
            feedback: ``
           })
    })

    socket.on('feedback',(data)=>{
        clearfeedback()
        const element =`
        <li class="message-feedback">
        <p class="feedback" id="feedback">
            ${data.feedback}
        </p>
    </li>
        `
        msgbox.innerHTML+=element;
        scrolltobtn()
    })

function clearfeedback(){
    document.querySelectorAll('li.message-feedback').forEach(element=>element.parentNode.removeChild(element))
}

function scrolltobtn(){
msgbox.scrollTo(0,msgbox.scrollHeight)
}
