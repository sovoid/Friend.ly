const micTrigger = document.createElement("a");
micTrigger.style.position = "absolute";
micTrigger.style.top = "26%";
micTrigger.style.right = "25px";
micTrigger.style.textDecoration = "none";
micTrigger.style.color = "blue";
micTrigger.innerHTML = '<i id="microphone" class="fa fa-microphone"></i>';

var recognizing = false, ignore_onend, start_timestamp, transcript = "";

micTrigger.onclick = event => {
  if (recognizing) {
    recognition.stop();
    return;
  }
  var microphone = document.getElementById("microphone");
  microphone.classList.remove("fa-microphone");
  microphone.classList.add("fa-microphone-slash");
  microphone.style.color = "red";
  transcript = "";
  recognition.lang = "en-IN";
  recognition.start();
  ignore_end = false;
  start_timestamp = event.timeStamp;
};

document.getElementById("emojiContainer").appendChild(micTrigger);

function upgrade() {
  document.getElementById("microphone").visibility = "hidden";
  alert("Web Speech API is not supported by this browser.");
};

if (!('webkitSpeechRecognition' in window)) {
  upgrade();
} else {
  var recognition = new webkitSpeechRecognition();
  recognition.continuous = true;
  recognition.interimResults = true;

  recognition.onstart = function () {
    recognizing = true;
  };

  recognition.onerror = function (event) {
    if (event.error === "no-speech") {
      alert("No speech was detected! You may need to adjust your microphone settings.");
      ignore_onend = true;
    }
    if (event.error === "audio-capture") {
      alert("No microphone detected! Ensure that a microphone is installed and that microphone settings are configured correctly.");
      ignore_onend = true;
    }
    if (event.error === "not-allowed") {
      if (event.timestamp - start_timestamp < 100) {
        alert("Permision to use microphone is blocked.");
      } else {
        alert("Permission to use microphone was denied.");
      }
      ignore_onend = true;
    }
  };

  recognition.onend = function() {
    recognizing = false;
    if(ignore_onend) {
      return;
    }

    var microphone = document.getElementById("microphone");
    microphone.classList.remove("fa-microphone-slash");
    microphone.classList.add("fa-microphone");
    microphone.style.color = "blue";

    if(!transcript) {
      return;
    }
  }

  recognition.onresult = function (event) {
    transcript = "";
    if(typeof(event.results) == 'undefined') {
      recognition.onend = null;
      recognition.stop();
      upgrade();
      return;
    }
    
    console.log(event);
    for (var i = event.resultIndex; i < event.results.length; i++) {
      if (event.results[i].isFinal) {
        transcript += event.results[i][0].transcript;
      }
    }
    if (transcript) {
      document.getElementById("msg").value += transcript;
    }
  }
}


