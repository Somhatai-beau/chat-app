const chatForm = document.getElementById('chat-form');
const chatMessages = document.querySelector('.chat-messages');
const roomList = document.getElementById('rooms');
const userList = document.getElementById('users');

var faq =[{id: 1, q: "ลืมรหัสผ่าน"}, {id: 2, q: "เบอร์ติดต่อเจ้าหน้าที่"}, {id: 3, q: "การใช้งานเบื้องต้น"}, {id: 4, q: "ส่งเอกสารผิดทำอย่างไร?"} ];
var ans =[{id: 1, a: "คลิ๊กที่ข้อความลืมรหัสผ่าน ระบบจะส่ง email เพื่อแจ้งรหัสผ่านชั่วคราวให้อัตโนมัติ"}, 
          {id: 2, a: "122345 - 99"}, {id: 3, a: "สามารถศึกษาการใช้งานได้ที่ลิ้งค์ postdoc.co.th/howto"}, {id: 4, a: "ไปที่เมนู Edit แล้วคลิ๊กยกเลิกการส่ง"} ];

const socket = io();

// Join chatroom
socket.emit('joinRoom', { username, room, type });


//console.log('main:', username);

// Get room and users
socket.on('Users', ({ users }) => {
  //console.log(users);
  outputRooms(users);
  outputUsers(users);
});

// Message from server
socket.on('message', (message) => {
  //console.log(message);
  outputMessage(message);

  // Scroll down
  chatMessages.scrollTop = chatMessages.scrollHeight;
});

// Message FAQ from server
socket.on('messageFAQ', (message) => {
  //console.log(message);
  outputMsgFAQ(message);

  // Scroll down
  chatMessages.scrollTop = chatMessages.scrollHeight;
});

// Message FAQ from server
socket.on('messageAns', (message) => {
  //console.log(message);
  outputMsgAns(message);
  var date = new Date;
  var min = date.getMinutes();
  var hr = date.getHours();

  outputMsgFAQ({
    username:"ChatBot",
    text:"FAQ",
    time: hr+':'+min
  });
  // Scroll down
  chatMessages.scrollTop = chatMessages.scrollHeight;
});


// Message submit
chatForm.addEventListener('submit', (e) => {
  e.preventDefault();

  // Get message text
  let msg = e.target.elements.msg.value;

  msg = msg.trim();

  if (!msg) {
    return false;
  }

  // Emit message to server
  socket.emit('chatMessage', msg);

  // Clear input
  e.target.elements.msg.value = '';
  e.target.elements.msg.focus();
});

// Output message to DOM
function outputMessage(message) {
  const div = document.createElement('div');
  div.classList.add('message');
  const p = document.createElement('p');
  p.classList.add('meta');
  p.innerText = message.username;
  p.innerHTML += `<span> @${message.time}</span>`;
  div.appendChild(p);
  const para = document.createElement('p');
  para.classList.add('text');
  para.innerText = message.text;
  div.appendChild(para);
  document.querySelector('.chat-messages').appendChild(div);
}

// Output FAQ message to DOM
function outputMsgFAQ(message) {
  const div = document.createElement('div');
  div.classList.add('message');
  const p = document.createElement('p');
  p.classList.add('meta');
  p.innerText =  message.username;
  p.innerHTML += `<span> @${message.time}</span>`;
  div.appendChild(p);
  const para = document.createElement('p');
  para.classList.add('text');
  para.innerText = message.text;
  div.appendChild(para);
  const ul = document.createElement('ul');
    faq.forEach((q) => {
      const li = document.createElement('li');
      const qid = q.id
      li.setAttribute("id", qid)
      li.classList.add('bullet');
      li.classList.add('underline');
      li.classList.add('cursor-pointer');
      li.innerText = q.q;
      li.onclick = function() { 
        //console.log('click faq user:', username)
        socket.emit('faq', {qid, username});
      };
      ul.appendChild(li);
    });
  div.appendChild(ul);
  document.querySelector('.chat-messages').appendChild(div);
}

// Output Ans message to DOM
function outputMsgAns(message) {
  console.log('ans:', message)
  const div = document.createElement('div');
  div.classList.add('message');
  const p = document.createElement('p');
  p.classList.add('meta');
  p.innerText ="ChatBot";
  p.innerHTML += `<span> @${message.time}</span>`;
  div.appendChild(p);
  const para = document.createElement('p');
  para.classList.add('text');
  para.innerText = "Answer";
  div.appendChild(para);
  const answer = document.createElement('p');
    ans.forEach((a) => {
      console.log(a,'vs',message.text)
      if(a.id==message.text){
        answer.classList.add('text');
        answer.innerText = a.a;
        return;
      }
    });
  div.appendChild(answer);
  document.querySelector('.chat-messages').appendChild(div);
}

// Add room name to DOM
function outputRooms(users) {
  roomList.innerHTML = '';
  users.forEach((user) => {
    if(user.type!='admin'){
      var userroom = user.room;
      const li2 = document.createElement('li');
      li2.innerText = userroom;
      li2.title="Click user to join chat";
      li2.classList.add("cursor-pointer");
      li2.onclick = function() { 
        socket.emit('joinUser', { username, userroom });
      };
      roomList.appendChild(li2);
    }
  });
  
}

// Add users to DOM
function outputUsers(users) {
  userList.innerHTML = '';
  users.forEach((user) => {
    if(user.room=='admin'){
      const li = document.createElement('li');
      li.innerText = user.username;
      userList.appendChild(li);
    }
  });
}

//Prompt the user before leave chat room
document.getElementById('leave-btn').addEventListener('click', () => {
  document.getElementById("chat-popup").style.display = "none";
});
