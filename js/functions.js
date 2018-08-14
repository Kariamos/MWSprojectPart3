

function checkName(name){
if(name.trim() == ""){
  document.getElementById("nameReview").style.border="solid red";
  }
else
  document.getElementById("nameReview").style.border="initial";

}



function sendReview(){


      const name = document.getElementById("nameReview").value.trim();



      if(name==""){
        document.getElementById("nameReview").style.border="solid red";
        var x = document.getElementById("notification");
        x.className = "show";
    x.innerHTML="Name is required";
    document.getElementById("notification").style.backgroundColor="orange";
    setTimeout(function(){ 
      x.className = x.className.replace("show", ""); 
      document.getElementById("notification").style.backgroundColor="green"; 
      }, 3000);
      return;
      }


      const rating = document.getElementById("ratingReview").value;
      const comments = document.getElementById("commentsReview").value; 
      const restaurant_id = document.getElementById("restId").value;

      document.getElementById("nameReview").value="";
      document.getElementById("ratingReview").value=1;
      document.getElementById("commentsReview").value="";

      document.getElementById("nameReview").style.border="initial";


      // String message;
     const review = { 
      'restaurant_id': parseInt(restaurant_id),
      'name': String(name),
      'rating': parseInt(rating),
      'comments': String(comments),
      'createdAt': new Date()
      //'createdAt': new Date(),
      //'updatedAt': new Date()
    }

      //document.getElementById("commentForm").reset();
       
  if(!navigator.onLine){
    //Show a notification
             var x = document.getElementById("notification");
    x.className = "show";
    x.innerHTML="Ops! It seems like you're OFFLINE. The review will be saved when you're ONLINE again.";
    setTimeout(function(){ x.className = x.className.replace("show", ""); }, 4000);

}
      
      //adding review to idb in both cases if you're online or offline
const dbPromise = idb.open('db-project2', 1);
          dbPromise.then(db =>{
             const tx = db.transaction("reviewsOS", "readwrite");
             const reviewsOS = tx.objectStore("reviewsOS");
             reviewsOS.put(review);
            console.log("added review to idb: "+review.name);
           });

     
//send a fetch request to POST the review. It will be automatically added to the background sync queue if offline
    fetch('http://localhost:1337/reviews/',

        {
        method: 'POST',
  headers: {
    'Accept': 'application/json, text/plain, */*',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify(review)
}).then( function() {


//add the review to the bottom in the review list when the POST got successful
const container = document.getElementById('reviews-container');
const ul = document.getElementById('reviews-list');

const li = document.createElement('li');
  const name = document.createElement('p');
  name.innerHTML = review.name;
  name.style = "font-size:1.2em;"
  name.setAttribute(`aria-label`,`reviewer name: ${review.name}`);
  name.setAttribute("tabindex","0");
  li.appendChild(name);

  const date = document.createElement('p');
  var d = new Date();
  var day = d.getDay();
  var month = d.getMonth();
  var year = d.getFullYear();
  var hour = d.getHours();
  var minutes = d.getMinutes();
  var seconds = d.getSeconds();

  var months= ["January","February","March","April","May","June","July",
            "August","September","October","November","December"];

  date.innerHTML = "<i>"+day+'&nbsp;'+months[month]+'&nbsp;'+year+'&nbsp;-&nbsp;'+hour+':'+minutes+':'+seconds+"</i>";
  date.setAttribute(`aria-label`,`review date: ${date.innerHTML} `);
  date.setAttribute("tabindex","0");
  li.appendChild(date);


const stars = document.createElement('p');
   const starsNumber = parseInt(review.rating);
   stars.innerHTML = '<i style="font-size:1.1em;"></i> ';
   if(starsNumber!=0){
   for (var i=0; i<starsNumber; i++){
     temp = '<i class="fa fa-star" style="font-size:1.5em; color:#FFFF33;"></i>';
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