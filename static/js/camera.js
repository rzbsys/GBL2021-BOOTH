var str = "";
var flag = 0;
document.addEventListener("DOMContentLoaded", function() {
  var video = document.createElement("video");		
  var canvasElement = document.getElementById("canvas");
  var canvas = canvasElement.getContext("2d");
  var loadingMessage = document.getElementById("loadingMessage");
  function drawLine(begin, end, color) {
    canvas.beginPath();
    canvas.moveTo(begin.x, begin.y);
    canvas.lineTo(end.x, end.y);
    canvas.lineWidth = 4;
    canvas.strokeStyle = color;
    canvas.stroke();
              }
        // 카메라 사용시
  navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } }).then(function(stream) {
                video.srcObject = stream;
                video.setAttribute("playsinline", true);      // iOS 사용시 전체 화면을 사용하지 않음을 전달
           video.play();
                requestAnimationFrame(tick);
  });
  function tick() {
    loadingMessage.innerText = "카메라를 로딩하고 있습니다.";
    if(video.readyState === video.HAVE_ENOUGH_DATA) {
                loadingMessage.hidden = true;
                canvasElement.hidden = false;
                // 읽어들이는 비디오 화면의 크기
                canvasElement.height = screen.availHeight;
                 canvasElement.width = screen.availWidth;
                canvas.drawImage(video, 0, 0, canvasElement.width, canvasElement.height);
                var imageData = canvas.getImageData(0, 0, canvasElement.width, canvasElement.height);
                var code = jsQR(imageData.data, imageData.width, imageData.height, {
                                  inversionAttempts : "dontInvert",
                });
                            // QR코드 인식에 성공한 경우
                            if(code) {
                                   // 인식한 QR코드의 영역을 감싸는 사용자에게 보여지는 테두리 생성
                                   
                                  drawLine(code.location.topLeftCorner, code.location.topRightCorner, "#FCD770");
                                  drawLine(code.location.topRightCorner, code.location.bottomRightCorner, "#FCD770");
                                  drawLine(code.location.bottomRightCorner, code.location.bottomLeftCorner, "#FCD770");
                                  drawLine(code.location.bottomLeftCorner, code.location.topLeftCorner, "#FCD770");
                                  // QR코드 메시지 출력
                                  parent.console.log(code.data);

                                  if (flag == 0) {
                                    parent.add_score(code.data);
                                    flag = 1;
                                  }
                            }
                            else {
                            }
                    }
              requestAnimationFrame(tick);
    }
});
