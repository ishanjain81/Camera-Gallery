let video = document.querySelector("video");
let recordBtnCont = document.querySelector(".record-btn-cont");
let recordBtn = document.querySelector(".record-btn");
let captureBtnCont = document.querySelector(".capture-btn-cont");
let captureBtn = document.querySelector(".capture-btn");

let recordFlag = false;

let recorder;
let chunks = []; // Media data in chunks

let constraints = {
    video: true,
    audio: true
};

// navigator -> global, browser info
navigator.mediaDevices.getUserMedia(constraints)
.then((stream)=>{
    video.srcObject = stream;
    recorder = new MediaRecorder(stream);
    recorder.addEventListener("start",(e)=>{
        chunks = [];
    });
    recorder.addEventListener("dataavailable",(e)=>{
        chunks.push(e.data);
    });
    recorder.addEventListener("stop",(e)=>{
        // Conversion of media chunks data to video
        console.log(chunks);
        let blob = new Blob(chunks,{type: "video/mp4"});
        let videoURL = window.URL.createObjectURL(blob);

        let a = document.createElement("a");
        a.href = videoURL;
        a.download = "stream.mp4";
        a.click();
    });
});

recordBtnCont.addEventListener("click",(e)=>{
    if(!recorder) return;

    recordFlag = !recordFlag;

    if(recordFlag){
        recorder.start();
        recordBtn.classList.add("scale-record");
        startTimer();
    }
    else{
        recorder.stop();
        recordBtn.classList.remove("scale-record");
        stopTimer();
    }
});

let timerId;
let counter = 0; // represents total seconds
let timer = document.querySelector(".timer");
function startTimer(){
    timer.style.display = "block";
    function displayTimer(){
        let totalSeconds = counter;
        let hours = Number.parseInt(totalSeconds/3600);
        totalSeconds = totalSeconds % 3600;

        let minutes = Number.parseInt(totalSeconds/60);
        totalSeconds = totalSeconds % 60;

        let seconds = totalSeconds;

        hours = (hours < 10) ? `0${hours}` : hours;
        minutes = (minutes < 10) ? `0${minutes}` : minutes;
        seconds = (seconds < 10) ? `0${seconds}` : seconds;

        timer.innerText = `${hours}:${minutes}:${seconds}`;
        counter++;
    }
    timerId= setInterval(displayTimer,1000);
}
function stopTimer(){
    clearInterval(timerId);
    timer.innerText = "00:00:00";
    timer.style.display = "none";
    counter = 0;
}
