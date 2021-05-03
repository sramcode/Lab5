// script.js

//on starting the page
const img = new Image(); // used to load image from <input> and draw to canvas
const canvas = document.getElementById('user-image');
const ctx = canvas.getContext('2d');

populateVoiceList();
document.getElementById('voice-selection').disabled = false;

  if (typeof speechSynthesis !== 'undefined' && speechSynthesis.onvoiceschanged !== undefined) {
    
    //removes the first no options selection
    let x = document.getElementById("voice-selection");
    x.remove(0);

    speechSynthesis.onvoiceschanged = populateVoiceList;
    
  }

// Fires whenever the img object loads a new image (such as with img.src =)
img.addEventListener('load', () => {  
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = 'black';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  let dimension = getDimmensions(canvas.width, canvas.height, img.width, img.height);

  ctx.drawImage(img, dimension.startX, dimension.startY, dimension.width, dimension.height);

  const c = document.querySelector("[type='submit']");
  const r = document.querySelector("[type='reset']");
  const b = document.querySelector("[type='button']");

  c.disabled = false;
  r.disabled = false;
  b.disabled = true;
});

//event listener for the image input
const input = document.getElementById('image-input');
input.addEventListener('change', onChange);

function onChange(e) {
  img.src = URL.createObjectURL(input.files[0]);
  img.alt = img.src.substring(img.src.lastIndexOf('/')+1);
}


//event listener for generate 
const submit = document.getElementById("generate-meme");
submit.addEventListener('submit', event => {

  let topText = document.getElementById('text-top').value;
  let bottomText = document.getElementById('text-bottom').value;
  console.log(topText);
  console.log(bottomText);
    
  ctx.font = "30px Arial";
  ctx.fillStyle = "white";
  ctx.textAlign = "center"; 

    
  ctx.fillText(topText.toUpperCase(), canvas.width/2, 50);
  ctx.fillText(bottomText.toUpperCase(), canvas.width/2, canvas.height - 25);
  ctx.strokeText(topText.toUpperCase(), canvas.width/2, 50);
  ctx.strokeText(bottomText.toUpperCase(), canvas.width/2, canvas.height - 25);

  document.querySelector("[type='reset']").disabled = false;
  document.querySelector("[type='submit']").disabled = true;


  document.querySelector("[type='button']").disabled = false;
  event.preventDefault();


});





//event listener for clear
const clear = document.querySelector("[type='reset']");

clear.addEventListener('click', event => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  document.querySelector("[type='reset']").disabled = true;
  document.querySelector("[type='button']").disabled = true;
  document.querySelector("[type='submit']").disabled = false;
});

//event listener for read text
const read = document.querySelector("[type='button']");

read.addEventListener('click', event => {
  let topText = document.getElementById('text-top').value;
  let bottomText = document.getElementById('text-bottom').value;
  let text = topText + bottomText;
  
  let utterance = new SpeechSynthesisUtterance(text);
  let l = document.getElementById("voice-selection").value;
  l = l.substring(l.indexOf('(')+1, l.length - 1);
  console.log(l);
  
  let vol = document.querySelector("[type='range']").value;
  utterance.volume = vol / 100;
  utterance.lang = l;

  console.log(vol);
  speechSynthesis.speak(utterance);
});


//gets the voice selections
function populateVoiceList() {
  if(typeof speechSynthesis === 'undefined') {
    return;
  }

  var voices = speechSynthesis.getVoices();

  for(var i = 0; i < voices.length; i++) {
    var option = document.createElement('option');
    option.textContent = voices[i].name + ' (' + voices[i].lang + ')';

    if(voices[i].default) {
      option.textContent += ' -- DEFAULT';
    }

    option.setAttribute('data-lang', voices[i].lang);
    option.setAttribute('data-name', voices[i].name);
    document.getElementById("voice-selection").appendChild(option);
  }
}

//event listener for the volume slider
const range = document.querySelector("[type='range']");
range.addEventListener('input', updateIcon);

function updateIcon(e) {
  let vol = range.value;
  console.log(vol);

  if(vol >= 67 && vol <= 100) {
    let icon = document.querySelector("#volume-group > img");
    icon.src = "icons/volume-level-3.svg";
    icon.alt =  "Volume Level 3";
  }
  else if(vol >= 34 && vol <= 66) {
    let icon = document.querySelector("#volume-group > img");
    icon.src = "icons/volume-level-2.svg";
    icon.alt =  "Volume Level 2";
  }
  else if(vol >= 1 && vol <= 33) {
    let icon = document.querySelector("#volume-group > img");
    icon.src  = "icons/volume-level-1.svg";
    icon.alt =  "Volume Level 1";
  }
  else if(vol == 0) {
    let icon = document.querySelector("#volume-group > img");
    icon.src  =  "icons/volume-level-0.svg";
    icon.alt = "Volume Level 0";
  }
}


/**
 * Takes in the dimensions of the canvas and the new image, then calculates the new
 * dimensions of the image so that it fits perfectly into the Canvas and maintains aspect ratio
 * @param {number} canvasWidth Width of the canvas element to insert image into
 * @param {number} canvasHeight Height of the canvas element to insert image into
 * @param {number} imageWidth Width of the new user submitted image
 * @param {number} imageHeight Height of the new user submitted image
 * @returns {Object} An object containing four properties: The newly calculated width and height,
 * and also the starting X and starting Y coordinate to be used when you draw the new image to the
 * Canvas. These coordinates align with the top left of the image.
 */
function getDimmensions(canvasWidth, canvasHeight, imageWidth, imageHeight) {
  let aspectRatio, height, width, startX, startY;

  // Get the aspect ratio, used so the picture always fits inside the canvas
  aspectRatio = imageWidth / imageHeight;

  // If the apsect ratio is less than 1 it's a verical image
  if (aspectRatio < 1) {
    // Height is the max possible given the canvas
    height = canvasHeight;
    // Width is then proportional given the height and aspect ratio
    width = canvasHeight * aspectRatio;
    // Start the Y at the top since it's max height, but center the width
    startY = 0;
    startX = (canvasWidth - width) / 2;
    // This is for horizontal images now
  } else {
    // Width is the maximum width possible given the canvas
    width = canvasWidth;
    // Height is then proportional given the width and aspect ratio
    height = canvasWidth / aspectRatio;
    // Start the X at the very left since it's max width, but center the height
    startX = 0;
    startY = (canvasHeight - height) / 2;
  }

  return { 'width': width, 'height': height, 'startX': startX, 'startY': startY }
}
