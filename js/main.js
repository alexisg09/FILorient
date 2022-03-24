// let myCanvas = document.getElementById('my_canvas');
// let ctx = myCanvas.getContext('2d');
//
// ctx.fillStyle = "transparent";
// ctx.fillRect(0, 0, myCanvas.width, myCanvas.height);
//
// let pos = [];
//
// function draw(startX, startY, len, angle, width) {
//
//   ctx.lineWidth = width;
//
//
//   ctx.beginPath();
//   ctx.save();
//   ctx.strokeStyle = 'rgb(115,50,18)';
//
//   ctx.translate(startX, startY);
//   ctx.rotate(angle * Math.PI / 180);
//   ctx.moveTo(0, 0);
//   // ctx.bezierCurveTo(100, 0, 0, 100, 0, -len);
//   ctx.lineTo(0, -len);
//   ctx.stroke();
//
//
//   // ctx.beginPath();
//   // ctx.moveTo(0, 0)
//   // ctx.bezierCurveTo(0, 1.5, 1, 1, 0, -len);
//   // ctx.stroke();
//
//   if (len < 40) {
//     ctx.strokeStyle = 'rgb(11,255,0)';
//     ctx.fillStyle = 'rgba(30,119,2,0.57)';
//     ctx.beginPath();
//     ctx.arc(0, -len, 10, 0, 2 * Math.PI, false);
//     ctx.stroke();
//     ctx.fill();
//     ctx.restore();
//     pos.push([len])
//     return;
//   }
//
//   // console.log(pos)
//
//   // if (len < 35) {
//   //   if (Math.random() > 0.5) {
//   //     draw(0, -len, len * 0.8, angle - 15, width * 0.9);
//   //     return;
//   //   } else {
//   //     draw(0, -len, len * 0.8, angle + 15, width * 0.9);
//   //   }
//   // }
//
//
//   draw(0, -len * 0.7, len * 0.8, angle + 25, width * 0.6);
//   draw(0, -len * 0.9, len * 0.8, angle - 25, width * 0.6);
//
//
//   // ctx.strokeStyle = 'rgba(255,153,80,0.4)';
//   // ctx.fillStyle = 'rgba(255,153,80,0.4)';
//   // ctx.strokeStyle = 'rgba(255,80,173,0.4)';
//   // ctx.fillStyle = 'rgba(255,80,173,0.4)';
//   // ctx.fill();
//   //
//   // ctx.beginPath();
//   // ctx.arc(0, -len, 5, 0, 2 * Math.PI, false);
//   // ctx.stroke();
//   // ctx.fill();
//
//   // if (len < 35) {
//   //   ctx.restore();
//   //   return;
//   // }
//
//   ctx.restore();
// }
//
// let number = 100
// var interval = setInterval(function () {
//   number++
//   ctx.clearRect(0, 0, myCanvas.width, myCanvas.height);
//   draw(myCanvas.width / 2, myCanvas.height, number, 0, 8, number)
//
//   if (number > 120) {
//     clearInterval(interval); // If exceeded 100, clear interval
//   }
// }, 1); // Run for each second
//
//
// // function testWiki() {
// //   var url = 'https://fr.wikipedia.org/w/api.php?action=opensearch&format=json&search=Terre';
// //   loadJSON(url, gotData, 'jsonp')
// // }
// //
// // testWiki();
// //
// //
// // function gotData(data) {
// //   console.log({data})
// // }


var firstModal = document.getElementById('firstModal');
var secondModal = document.getElementById("secondModal");
var thirdModal = document.getElementById("thirdModal");
var fourthModal = document.getElementById("fourthModal");
let firstClose = document.getElementById('firstClose');
let secondClose = document.getElementById('secondClose');
let thirdClose = document.getElementById('thirdClose');
let fourthClose = document.getElementById('fourthClose');

function callFirst() {
  document.getElementById('firstModal').classList.remove('hidden');
}

function callSecond() {
  document.getElementById('secondModal').classList.toggle('hidden');
}

function callThird() {
  document.getElementById('thirdModal').classList.toggle('hidden');
}

function callFourth() {
  document.getElementById('fourthModal').classList.toggle('hidden');
}

//
// function closeFirst() {
//   console.log('close 111')
//
//   document.getElementById('firstModal').classList.remove('card');
//   document.getElementById('firstModal').classList.add('hidden');
// }
//
//
// function closeSecond() {
//   document.getElementById('secondModal').classList.remove('card');
//   document.getElementById('secondModal').classList.add('hidden');
// }
//
//
// function closeThird() {
//   document.getElementById('thirdModal').classList.remove('card');
//   document.getElementById('thirdModal').classList.add('hidden');
// }
//
//
// function closeFourth() {
//   document.getElementById('fourthModal').classList.remove('card');
//   document.getElementById('fourthModal').classList.add('hidden');
// }


firstClose.onclick = function (e) {
  e.preventDefault()
  firstModal.classList.toggle('hidden')
}

secondClose.onclick = function (e) {
  e.preventDefault()
  secondModal.classList.toggle('hidden')
}

thirdClose.onclick = function (e) {
  e.preventDefault()
  thirdModal.classList.toggle('hidden')
}

fourthClose.onclick = function (e) {
  e.preventDefault()
  fourthModal.classList.toggle('hidden')
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function (event) {
  if (event.target == firstClose) {
    firstModal.classList.toggle('hidden')
  } else if (event.target == secondClose) {
    secondModal.classList.toggle('hidden');
  } else if (event.target == thirdClose) {
    thirdModal.classList.toggle('hidden');
  } else if (event.target == fourthClose) {
    fourthModal.classList.toggle('hidden')
  }
}


window.onload = function () {
  setTimeout(function () {
    console.log('loaded')
    // document.getElementById('body').classList.toggle('loaded')
  }, 5000);
}

