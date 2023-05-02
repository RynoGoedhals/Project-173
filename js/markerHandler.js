var userNumber = null;

AFRAME.registerComponent("markerhandler", {
    init: async function(){
        if(userNumber === null){
            this.askUserNumber();
        }

        var games = await this.getGames();

        this.el.addEventListener("markerFound", () => {
            var markerId = this.el.id;
            this.handleMarkerFound(games, markerId);
        });

        this.el.addEventListener("markerLost", () => {
            this.handleMarkerLost();
        });
    },

    handleMarkerFound: function(games, markerId){
        var todaysDate = new Date();
        var todaysDay = todaysDate.getDate();
        var days = [
            "sunday",
            "monday",
            "tuesday",
            "wednesday",
            "thursday",
            "friday",
            "saturday"
        ];

        var game = games.filter(game => game.id === markerId)[0];

        if(game.unavailable_days.includes(days[todaysDay])){
            swal({
                icon: "warning",
                title: game.game_name.toUpperCase(),
                text: "This game is not available today!",
                timer: 2500,
                buttons: false
            });
        } else {
            var model = document.querySelector(`#model-${game.id}`);

            model.setAttribute("position", game.model_geometry.position);
            model.setAttribute("rotation", game.model_geometry.rotation);
            model.setAttribute("scale", game.model_geometry.scale);
            model.setAttribute("visible", true);

            var descriptionContainer = document.querySelector(`#main-plane-${game.id}`);

            descriptionContainer.setAttribute("visible", true);

            var priceplane = document.querySelector(`#price-plane-${game.id}`);

            priceplane.setAttribute("visible", true);

            var buttonDiv = document.getElementById("button-div");
            buttonDiv.style.display = "flex";

            var ratingButton = document.getElementById("rating-button");
            var playButton = document.getElementById("play-button");
            var orderSummaryButton = document.getElementById("order-summary-button");
            var payButton = document.getElementById("pay-button");

            if(userNumber != null){
                ratingButton.addEventListener("click", function(){this.handleRatings(game)});

                playButton.addEventListener("click", () => {
                    var uNumber;

                    userNumber <= 9 ? (uNumber = `U0${userNumber}`) : `U${userNumber}`;

                    this.handleOrder(uNumber, game);
                    swal({
                        icon: "https://i.imgur.com/4NZ6uLY.jpg",
                        title: "Thanks for choosing to play!",
                        text: "You will play shortly!",
                        timer: 2500,
                        buttons: false
                    });
                });
            }

            orderSummaryButton.addEventListener("click", () => this.handleOrderSummary());

            payButton.addEventListener("click", () => this.handlePayment());
        }
    },

    handleMarkerLost: function(){
        var buttonDiv = document.getElementById("button-div");
        buttonDiv.style.display = "none";
    },

    getGames: async function(){
        return await firebase
        .firebase()
        .collection("games")
        .get()
        .then(snap => {
            return snap.docs.map(doc => doc.data());
        });
    },

    handleOrder: function(uNumber, game){
        firebase
        .firestore()
        .collection("users")
        .doc(uNumber)
        .get()
        .then(doc => {
            var details = doc.data();

            if(details["current_orders"][game.id]){
                details["current_orders"][game.id]["quantity"] += 1;

                var currentQuantity = details["current_orders"][game.id]["quantity"];
                
                details["current_orders"][game.id]["subtotal"] = currentQuantity * game.price;
            } else {
                details["current_orders"][game.id] = {
                    item: game.game_name,
                    price: game.price,
                    quantity: 1,
                    subtotal: game.price * 1
                };
            }

           details.total_bill += game.price;

           firebase
           .firestore()
           .collection("users")
           .doc(doc.id)
           .update(details);
        });
    },

    askUserNumber: function(){
        var iconUrl = "https://raw.githubusercontent.com/whitehatjr/menu-card-app/main/hunger.png";

        swal({
            title: "Welcome to the arcade!",
            icon: iconUrl,
            content: {
                element: "input",
                attributes: {
                    placeholder: "Type your user number",
                    type: "number",
                    min: 1
                }
            },

            closeOnClickOutside: false,
        }).then(inputValue => {
            userNumber = inputValue;
        });
    },

    getOrderSummary: async function(uNumber){
        return await firebase
        .firestore()
        .collection("users")
        .doc(uNumber)
        .then(doc => doc.data());
    },

    handleOrderSummary: async function(){
        var uNumber;

        userNumber <= 9 ? (uNumber = `U0${userNumber}`) : `U${userNumber}`;

        var orderSummary = await this.getOrderSummary(uNumber);
        var modalDiv = document.getElementById("modal-div");

        modalDiv.style.display = "flex";

        var tableBodyTag = document.getElementById("bill-table-body");

        tableBodyTag.innerHTML = "";

        var currentOrders = Object.keys(orderSummary.current_orders);

        currentOrders.map(i => {
            var tr = document.createElement("tr");
            var item = document.createElement("td");
            var price = document.createElement("td");
            var quantity = document.createElement("td");
            var subtotal = document.createElement("td");

            item.innerHTML = orderSummary.current_orders[i].item;

            price.innerHTML = "$" + orderSummary.current_orders[i].price;
            price.setAttribute("class", "text-center");

            quantity.innerHTML = orderSummary.current_orders[i].quantity;
            quantity.setAttribute("class", "text-center");

            subtotal.innerHTML = orderSummary.current_orders[i].subtotal;
            subtotal.setAttribute("class", "text-center");

            tr.appendChild(item);
            tr.appendChild(price);
            tr.appendChild(quantity);
            tr.appendChild(subtotal);
            tableBodyTag.appendChild(tr);
        });

        var totalTr = document.createElement("tr");

        var td1 = document.createElement("td");
        td1.setAttribute("class", "no-line");

        var td2 = document.createElement("td");
        td1.setAttribute("class", "no-line");

        var td3 = document.createElement("td");
        td1.setAttribute("class", "no-line text-center");

        var strongTag = document.createElement("strong");
        strongTag.innerHTML = "Total";

        td3.appendChild(strongTag);

        var td4 = document.createElement("td");
        td1.setAttribute("class", "no-line text-right");
        td4.innerHTML = "$" + orderSummary.total_bill;

        totalTr.appendChild(td1);
        totalTr.appendChild(td2);
        totalTr.appendChild(td3);
        totalTr.appendChild(td4);

        tableBodyTag.appendChild(totalTr);
    },

    handlePayment: function(){
        document.getElementById("modal-div").style.display = "none";

        var uNumber;

        userNumber <= 9 ? (uNumber = `U0${userNumber}`) : `U${userNumber}`;

        firebase
        .firestore()
        .collection("users")
        .doc(uNumber)
        .update({
            current_orders: {},
            total_bill: 0
        })
        .then(() => {
            swal({
                icon: "success",
                title: "Thanks For Playing!",
                text: "We Hope You Enjoyed Playing!",
                timer: 2500,
                buttons: false
            });
        });
    },

    handleRatings: async function(game){
        var uNumber;

        userNumber <= 9 ? (uNumber = `U0${userNumber}`) : `U${userNumber}`;

        var orderSummary = await this.getOrderSummary(uNumber);
        var currentOrders = Object.keys(orderSummary.current_orders);

        if(currentOrders.length > 0 && currentOrders == game.id){
            document.getElementById("raing-modal-div").style.display = "flex";
            document.getElementById("rating-input").value = "0";
            document.getElementById("feedback-input").value = "";

            var saveRatingButton = document.getElementById("save-rating-button");

            saveRatingButton.addEventListener("click", () => {
                document.getElementById("rating-modal-div").style.display = "none";

                var rating = document.getElementById("rating-input").value;
                var feedback = document.getElementById("feedback-input").value;

                firebase
                .firestore()
                .collection("games")
                .doc(game.id)
                .update({
                    last_review: feedback,
                    last_rating: rating
                })
                .then(() => {
                    swal({
                        icon: "success",
                        title: "Thanks For Rating!",
                        text: "We Hope You Liked The Game!",
                        timer: 2500,
                        buttons: false
                    });
                });
            });
        } else {
            swal({
                icon: "warning",
                title: "Oops!",
                text: "No Game Was Found To Give Ratings To!",
                timer: 2500,
                buttons: false
            });
        }
    }
})