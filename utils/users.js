const users = [];

// Join user to chat
function userJoin(id, username, room, type) {
  const user = { id, username, room , type};

  users.push(user);

  return user;
}

// Get current user
function getCurrentUser(id) {
  return users.find(user => user.id === id);
}

// === Switch user room  ===
function switchRoom(name,rm) {
  console.log(name, 'switch to room', rm);
  users.forEach((user, index) => {
    if(user.username === name) {
        user.room = rm;
        return;
    }
  });
}

// User leaves chat
function userLeave(id) {
  const index = users.findIndex(user => user.id === id);

  if (index !== -1) {
    return users.splice(index, 1)[0];
  }
}

// Get room users
function getUsers() {
  return users;
}

module.exports = {
  userJoin,
  getCurrentUser,
  userLeave,
  getUsers,
  switchRoom
};
