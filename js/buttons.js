AFRAME.registerComponent("create-buttons", {
    init: function(){
        var button1 = document.createElement("button");
        button1.innerHTML = "Rate Game";
        button1.setAttribute("id", "rating-button");
        button1.setAttribute("class", "btn btn-warning ml-3 mr-3");

        var button2 = document.createElement("button");
        button2.innerHTML = "Play now";
        button2.setAttribute("id", "play-button");
        button2.setAttribute("class", "btn btn-warning mr-3");

        var button3 = document.createElement("button");
        button3.innerHTML = "Order Summary";
        button3.setAttribute("id", "order-summary-button");
        button3.setAttribute("class", "btn btn-warning ml-3");

        var buttonDiv = document.getElementById("button-div");
        buttonDiv.appendChild(button1);
        buttonDiv.appendChild(button2);
        buttonDiv.appendChild(button3);
    }
})