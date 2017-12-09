$(document).ready(function(){

  getData();

// Scrape data from website
$("#scrape").click(function(e){
  e.preventDefault();
  $.get("/scrape", function(data) {
    $("#main").empty();
    $('.infoTitle').text('News Scraper');
    $('.infoText').html("<p> Scraped "+ data.length+" new articles.</p>");
    $('.infoModal').modal('toggle')
    
    for (var i = 0; i < data.length; i++) {
      // Display the apropos information on the page
      $("#main").append("<h4><a target='_blank' href='"+ data[i].link+"''>" + data[i].title + "</h4><p>" + data[i].summary + "</p>");
      $("#main").append("<button class='mb-3 btn btn-dark' id='saveArticle'>Save Article</button>");
    }
  });  
});

// Display saved articles
 $("#articles").click(function(e){
  e.preventDefault();
  getData();
});

 function getData() {
  // Grab the articles as a json
  $.getJSON('/articles', function(data) {
    $("#main").empty();
    if(data.length === 0){
      $("#main").append("<p>No saved data!</p>");
    }else{
    //For each one
      for (var i = 0; i < data.length; i++) {
        // Display the apropos information on the page
        $("#main").append("<h4><a target='_blank' href='"+ data[i].urlLink+"''>" + data[i].headLine + "</h4><p>" + data[i].summary + "</p>");
        $("#main").append("<button id='addNote' class='mb-3 btn btn-dark' data-id='"+data[i]._id+"'>Article Note</button><button id='deleteArticle'class='mb-3 ml-2 btn btn-dark' data-id='"+data[i]._id+"'>Delete Article</button>");
      }
    }
   });
 }

// Save an article to the database
$(document).on("click", "#saveArticle", function(){
   // Run a POST request to save the article
   var summary =$(this).prev().text();
   var title =$(this).prev().prev().text();
   var link = $(this).prev().prev().children().attr('href');
    $.ajax({
    method: "POST",
    url: "/api/article/",
     data: {
      // Value taken from title input
      headLine: title,
      // Value taken from link
      urlLink: link,
      summary: summary
      }
    })
    // With that done
    .done(function(data) {
      // Log the response
      console.log(data);
      $('.infoTitle').text('News Scraper');
      $('.infoText').html("<p>"+ data +"</p>");
      $('.infoModal').modal('toggle')
    });

});

// Delete an article
$(document).on("click", "#deleteArticle", function(){
  // Run a DELETE request to save the article
  var id = $(this).attr("data-id");
  $.ajax({
    method: "DELETE",
    url: "/delete/article/"+ id,
    })
    // With that done
    .done(function(data) {
      // Log the response
      console.log(data);
      getData();
    });
});

// Add a note
$(document).on("click", "#addNote", function() {
  $('.noteTitle').text('Article Notes');
  $('.notePad').empty();
  $('.notes').empty();
  $('.noteModal').modal('toggle');

  // Save the id from the button tag
  var thisId = $(this).attr("data-id");

  // Now make an ajax call for the Article
  $.ajax({
    method: "GET",
    url: "/article/" + thisId
  })
    // With that done, add the note information to the page
    .done(function(data) {
      
      if(data.note.length===0){
        $(".notes").append("<h5>Article has no notes!</h5>");
      }else{
        data.note.forEach(function(item){
          // The title of the article
          $(".notes").append("<p>Title: " + item.title +"<br>"+ item.body + " <button data-id='"+item._id+"'class='btn delNote'><i class='fa fa-trash-o' aria-hidden='true'></i></button></p>");
        });
       }  

      // An input to enter a new title
        $(".notePad").append("<input id='titleinput' name='title' class='mb-3 form-control'><br>");
        // A textarea to add a new note body
        $(".notePad").append("<textarea class='form-control' id='bodyinput' name='body'></textarea><br>");
        // A button to submit a new note, with the id of the article saved to it
        $(".notePad").append("<button class='btn btn-dark mt-3' data-id='" + data._id + "' id='savenote'>Save Note</button>");
      // If there's a note in the article
      // if (data.note) {
      //   // Place the title of the note in the title input
      //   $("#titleinput").val(data.note.title);
      //   // Place the body of the note in the body textarea
      //   $("#bodyinput").val(data.note.body);
        
     // }

    });
});

// When you click the savenote button
$(document).on("click", "#savenote", function() {
  // Grab the id associated with the article from the submit button
  var thisId = $(this).attr("data-id");

  // Run a POST request to change the note, using what's entered in the inputs
  $.ajax({
    method: "POST",
    url: "/articles/" + thisId,
    data: {
      // Value taken from title input
      title: $("#titleinput").val(),
      // Value taken from note textarea
      body: $("#bodyinput").val()
    }
  })
    // With that done
    .done(function(data) {
      // Log the response
      console.log(data);
    });

  // Also, remove the values entered in the input and textarea for note entry
  $("#titleinput").val("");
  $("#bodyinput").val("");
});
})

// Delete an article
$(document).on("click", ".delNote", function(){
  // Run a DELETE request to delete note
  var id = $(this).attr("data-id");
  $.ajax({
    method: "DELETE",
    url: "/delete/note/"+ id,
    })
    // With that done
    .done(function(data) {
      // Log the response
      console.log(data);
    });
});