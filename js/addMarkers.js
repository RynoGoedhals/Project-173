AFRAME.registerComponent("create-markers", {
  init: async function(){
    var mainScene = document.querySelector("#main-scene");
    var games = await this.getGames();

    games.map(game => {
      var marker = document.createElement("a-marker");

      marker.setAttribute("id", game.id);
      marker.setAttribute("type", "pattern");
      marker.setAttribute("url", game.marker_pattern_url);
      marker.setAttribute("cursor",{
        rayOrigin: "mouse"
      });
      marker.setAttribute("markerhandler", {});

      mainScene.appendChild(marker);

      var todaysDate = new Date();
      var todaysDay = todaysDate.getDay();
      var days = [
        "sunday",
        "monday",
        "tuesday",
        "wednesday",
        "thursday",
        "friday",
        "saturday"
      ];

      if(!game.unavailable_days.include(days[todaysDay])){
        var model = document.createElement("a-entity");

        model.setAttribute("id", `model-${game.id}`);
        model.setAttribute("position", game.model_geometry.position);
        model.setAttribute("rotation", game.model_geometry.rotaion);
        model.setAttribute("scale", game.model_geometry.scale);
        model.setAttribute("gltf-model", `url(${game.model_url})`);
        model.setAttribute("gesture-handler", {});
  
        marker.appendChild(model);
  
        var mainPlane = document.createElement("a-plane");
  
        mainPlane.setAttribute("id", `main-plane-${game.id}`);
        mainPlane.setAttribute("position", {x: 0, y: 0, z: 0});
        mainPlane.setAttribute("rotation", {x: -90, y: 0, z: 0});
        mainPlane.setAttribute("width", 2.3);
        mainPlane.setAttribute("height", 2.5);
        mainPlane.setAttribute("material", {color: "#F0C30F"});
  
        marker.appendChild(mainPlane);
  
        var titlePlane = document.createElement("a-plane");
  
        titlePlane.setAttribute("id", `title-plane-${game.id}`);
        titlePlane.setAttribute("position", {x: 0, y: 1.1, z: 0.1});
        titlePlane.setAttribute("rotation", {x: 0, y: 0, z: 0});
        titlePlane.setAttribute("width", 2.31);
        titlePlane.setAttribute("height", 0.4);
        titlePlane.setAttribute("material", {color: "#F0C30F"});
  
        mainPlane.appendChild(titlePlane);
  
        var gameTitle = document.createElement("a-plane");
  
        gameTitle.setAttribute("id", `game-title-${game.id}`);
        gameTitle.setAttribute("position", {x: 1.3, y: 0, z: 0.1});
        gameTitle.setAttribute("rotation", {x: 0, y: 0, z: 0});
        gameTitle.setAttribute("text", {
          font: "monoid",
          color: "black",
          width: 4.5,
          height: 3,
          align: "left",
          value: game.game_name.toUpperCase()
        });
  
        titlePlane.appendChild(gameTitle);

        var description = document.createElement("a-entity");

        description.setAttribute("id", `description-${game.id}`);
        description.setAttribute("position", {x: 0.04, y: 0, z: 0.1});
        description.setAttribute("rotation", {x: 0, y: 0, z: 0});
        description.setAttribute("text", {
          font: "dejavu",
          color: "#6b011f",
          width: 2,
          height: 5,
          letterSpacing: 2,
          lineHeight: 50,
          align: "left",
          value: `${game.description}`
        });

        mainPlane.appendChild(description);
  
        var ageRec = document.createElement("a-entity");
  
        gameTitle.setAttribute("id", `age-${game.id}`);
        gameTitle.setAttribute("position", {x: -0.75, y: -0.8, z: 0.1});
        gameTitle.setAttribute("rotation", {x: 0, y: 0, z: 0});
        gameTitle.setAttribute("text", {
          font: "monoid",
          color: "black",
          width: 2,
          height: 5,
          align: "center",
          value: `Age: ${game.age_group}`
        });
  
        mainPlane.appendChild(ageRec);

        var pricePlane = document.createElement("a-image");

        pricePlane.setAttribute("id", `price-plane-${game.id}`);
        pricePlane.setAttribute(
          "src", "https://raw.githubusercontent.com/whitehatjr/menu-card-app/main/black-circle.png"
        );
        pricePlane.setAttribute("width", 0.8);
        pricePlane.setAttribute("height", 0.8);
        pricePlane.setAttribute("position", {x: -1.3, y: 0, z: 0.3});
        pricePlane.setAttribute("rotation", {x: -90, y: 0, z: 0});
        pricePlane.setAttribute("visible", false);

        var price = document.createElement("a-entity");

        price.setAttribute("id", `price-${game.id}`);
        price.setAttribute("position", {x: 0.03, y: 0.05, z: 0.1});
        price.setAttribute("rotation", {x: 0, y: 0, z: 0});
        price.setAttribute("text", {
          font: "mozillavr",
          color: "white",
          width: 3,
          align: "center",
          value: `Only\n $${game.price}`
        });

      
        pricePlane.appendChild(price);
        marker.appendChild(pricePlane);

        var ratingPlane = document.createElement("a-entity");

        ratingPlane.setAttribute("id", `rating-plane-${game.id}`);
        ratingPlane.setAttribute("position", {x: 2, y: 0, z: 0.5});
        ratingPlane.setAttribute("geometry", {
          primitive: "plane",
          width: 1.5,
          height: 0.3
        });
        ratingPlane.setAttribute("material", {
          color: "#F0C30F"
        });
        ratingPlane.setAttribute("rotation", {x: -90, y: 0, z: 0});
        ratingPlane.setAttribute("visible", false);

        var rating = document.createElement("a-entity");

        rating.setAttribute("id", `rating-${game.id}`);
        rating.setAttribute("position", {x: 0, y: 0.05, z: 0.1});
        rating.setAttribute("rotation", {x: 0, y: 0, z: 0});
        rating.setAttribute("text", {
          font: "mozillavr",
          color: "black",
          width: 2.4,
          align: "center",
          value: `Customer Rating: ${game.last_rating}`
        });

        ratingPlane.appendChild(rating);
        marker.appendChild(ratingPlane);

        var reviewPlane = document.createElement("a-entity");

        reviewPlane.setAttribute("id", `review-plane-${game.id}`);
        reviewPlane.setAttribute("position", {x: 2, y: 0, z: 0});
        reviewPlane.setAttribute("geometry", {
          primitive: "plane",
          width: 1.5,
          height: 0.5
        });
        reviewPlane.setAttribute("material", {
          color: "#F0C30F"
        });
        reviewPlane.setAttribute("rotation", {x: -90, y: 0, z: 0});
        reviewPlane.setAttribute("visible", false);
      
        var review = document.createElement("a-entity");

        review.setAttribute("id", `review-${game.id}`);
        review.setAttribute("position", {x: 0, y: 0.05, z: 0.1});
        review.setAttribute("rotation", {x: 0, y: 0, z: 0});
        review.setAttribute("text", {
          font: "mozillavr",
          color: "black",
          width: 2.4,
          align: "center",
          value: `Customer Review: \n${game.last_review}`
        });
        
        reviewPlane.appendChild(review);
        marker.appendChild(reviewPlane);
      }
    });
  },

  getGames: async function(){
    return await firebase
    .firestore()
    .collection("games")
    .get()
    .then(snap => {
      return snap.docs.map(doc => doc.data());
    });
  }
});
  