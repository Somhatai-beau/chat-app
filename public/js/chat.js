

var username = findGetParameter('username');
var type = findGetParameter('type');
var room;

if(type=='admin'){
  room = 'admin';
}else{
  room = username;
}

console.log(username, type, room);

if(type=='admin'){
  $('body').append(
    `
    <button class="open-button" onclick="openForm()">Live Chat</button>
    <div class="chat-popup" id="chat-popup"> 
      <div class="chat-container">
        <header class="chat-header">
          <h1><i class="fas fa-smile"></i> Live Chat</h1>
          <a id="leave-btn" class="btn">Leave</a>
        </header>
        <main class="chat-main">
          <div class="chat-sidebar">
            <h3><i class="fas fa-comments"></i> Users:</h3>
            <!--<h2 id="room-name"></h2>-->
            <ul id="rooms"></ul>
            <h3><i class="fas fa-users"></i> Admins:</h3>
            <ul id="users"></ul>
          </div>
          <div class="chat-messages"></div>
        </main>
        <div class="chat-form-container">
          <form id="chat-form">
            <input
              id="msg"
              type="text"
              placeholder="Enter Message"
              required
              autocomplete="off"
            />
            <button class="btn"><i class="fas fa-paper-plane"></i> Send</button>
          </form>
        </div>
      </div>
    </div>
    `      
  );
}else{
    $('body').append(
        `
        <button class="open-button" onclick="openForm()">Live Chat</button>
        <div class="chat-popup" id="chat-popup"> 
          <div class="chat-container">
            <header class="chat-header">
              <h1><i class="fas fa-smile"></i> Live Chat</h1>
              <a id="leave-btn" class="btn">Leave</a>
            </header>
            <main class="chat-main">
              <div class="chat-sidebar" >

                    <h3 style="display:none;"><i class="fas fa-comments"></i> Rooms:</h3>
                    <h2 id="room-name" style="display:none;"></h2>
                    <ul id="rooms" style="display:none;"></ul>
                    <h3 style="display:none;"><i class="fas fa-users"></i> Users</h3>
                    <ul id="users"></ul>

              </div>
              <div class="chat-messages"></div>
            </main>
            <div class="chat-form-container">
              <form id="chat-form">
                <input
                  id="msg"
                  type="text"
                  placeholder="Enter Message"
                  required
                  autocomplete="off"
                />
                <button class="btn"><i class="fas fa-paper-plane"></i> Send</button>
              </form>
            </div>
          </div>
        </div>
        `    
    );  
}

function openForm() {
    document.getElementById("chat-popup").style.display = "block";
}

function closeForm() {
    document.getElementById("chat-popup").style.display = "none";
}
function findGetParameter(parameterName) {
    var result = null,
        tmp = [];
    var items = location.search.substr(1).split("&");
    for (var index = 0; index < items.length; index++) {
        tmp = items[index].split("=");
        if (tmp[0] === parameterName) result = decodeURIComponent(tmp[1]);
    }
    return result;
}


