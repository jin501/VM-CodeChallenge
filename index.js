const root = 'https://jsonplaceholder.typicode.com/users';
// Make requests //
$.get(`${root}`)
  .then(function(res) {
    $('#user1').html(res[0].name)
    $('#user2').html(res[1].name)
  });

$.get(`${root}/1/albums`)
  .then(function(res){
    makeTable(res)
});

$.get(`${root}/2/albums`)
  .then(function(res) {
    makeTable(res)
});

// Parse response to create table //
function makeTable(res){
  let string = ""
  let id = res[0].userId
  res.forEach((el, i)=>{
    string += `<div class="row" data-id="${el.id}" data-user="${el.userId}" data-title="${el.title}" draggable="true" ondragenter="dragEnter(event)" ondragstart="dragStart(event)"><div class="cell"> ${el.id} </div>`
    string += `<div class="cell"> ${el.title} </div></div>`
  })
  $(`#table${id}`).html(string)
}

// Step 3: Drag-&-Drop //
let source;
function isbefore(a, b) {
  if (a.parentNode == b.parentNode) {
    for (var cur = a; cur; cur = cur.previousSibling) {
      if (cur === b) {
        return true;
      }
    }
  }
  return false;
}

function dragEnter(e) {
  let albumId = e.currentTarget.attributes[1].value
  let initialUserId = e.currentTarget.attributes[2].value
  let title = e.currentTarget.attributes[3].value

  if (isbefore(source, e.currentTarget)) {
    e.currentTarget.parentNode.insertBefore(source, e.currentTarget);
    let newUserId = e.currentTarget.parentNode.attributes[2].value

    // make AJAX call to update userID if album was moved to another user's table
    if(initialUserId != e.currentTarget.parentNode.attributes[2].value){
      updateTable(newUserId, albumId, title);
    }
  }
  else {
    e.currentTarget.parentNode.insertBefore(source, e.currentTarget.nextSibling);
    // make AJAX patch request to update userID if album was moved to other table
    // if(initialUserId != newUserId){
    //   updateTable(newUserId, albumId, title);
    // }
  }
}

function dragStart(e) {
  source = e.target;
  e.dataTransfer.effectAllowed = 'move';
}

function updateTable(newUserId, albumId, title){
  let data =  {
    "userId": newUserId,
    "id": albumId,
    "title": title
  }
  $.ajax({
    url: `${root}/${userId}/albums`,
    method: 'patch',
    data: data
    })
    .then(function(res) {
      makeTable(res);
    });
}
