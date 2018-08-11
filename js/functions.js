


function sendReview(){


      const name = document.getElementById("nameReview").value;
      const rating = document.getElementById("ratingReview").value;
      const comments = document.getElementById("commentsReview").value; 
      const restaurant_id = document.getElementById("restId").value;


      // String message;
     const review = { 
      'restaurant_id': parseInt(restaurant_id),
      'name': String(name),
      'rating': parseInt(rating),
      'comments': String(comments),
      //'createdAt': new Date(),
      //'updatedAt': new Date()
    }

      //document.getElementById("commentForm").reset();
       
  if(!navigator.onLine){
    //Show a notification
             var x = document.getElementById("notification");
    x.className = "show";
    x.innerHTML="It seems like you're OFFLINE. The review will be updated when you're ONLINE again.";
    setTimeout(function(){ x.className = x.className.replace("show", ""); }, 3000);

}
      
      //adding review to idb
const dbPromise = idb.open('db-project2', 1);
          dbPromise.then(db =>{
             const tx = db.transaction("reviewsOS", "readwrite");
             const reviewsOS = tx.objectStore("reviewsOS");
             reviewsOS.add(review);
            // console.log("added to idb");
           });

     

    fetch('http://localhost:1337/reviews/',

        {
        method: 'POST',
  headers: {
    'Accept': 'application/json, text/plain, */*',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify(review)
}).then( function() {


//add the review to the bottom in the review list
const container = document.getElementById('reviews-container');
const ul = document.getElementById('reviews-list');

const li = document.createElement('li');
  const name = document.createElement('p');
  name.innerHTML = review.name;
  name.setAttribute(`aria-label`,`reviewer name: ${review.name}`);
  name.setAttribute("tabindex","0");
  li.appendChild(name);

  const date = document.createElement('p');
  date.innerHTML = new Date();
  date.setAttribute(`aria-label`,`review date: `);
  date.setAttribute("tabindex","0");
  li.appendChild(date);


const stars = document.createElement('p');
   const starsNumber = parseInt(review.rating);
   stars.innerHTML = '<i style="font-size:12px;">Rating:</i> ';
   if(starsNumber!=0){
   for (var i=0; i<starsNumber; i++){
     temp = '<i class="fa fa-star-o"></i>';
  stars.innerHTML+=temp;
    }
  stars.setAttribute(`aria-label`,`rating: ${review.rating}`);
  stars.setAttribute("tabindex","0");
  li.appendChild(stars);
   }


   const comments = document.createElement('p');
  comments.innerHTML = review.comments;
  comments.setAttribute(`aria-label`,`review comment: ${review.comments}`);
  comments.setAttribute("tabindex","0");
  li.appendChild(comments);


  ul.appendChild(li);
  container.appendChild(ul);
    //console.log("added review to bottom page");

    //scroll page to the new added review
    var el = document.getElementById('reviews-list').lastElementChild;
    el.scrollIntoView({behavior: "smooth"});



    //Show notification
    if(navigator.onLine){
     var x = document.getElementById("notification");
    
    x.className = "show";
    x.innerHTML="Review added correctly";
    setTimeout(function(){ x.className = x.className.replace("show", ""); }, 3000);
  }

        });
}