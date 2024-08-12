var buttonColours = ["red", "blue", "green", "yellow"];

var gamePattern = [];
var userClickedPattern = [];

// Variable to track if the game has started
var started = false;

// Variable to keep track of the level
var level = 0;

// Start the game on the first keypress or touch
$(document).on("keypress touchstart", function() {
  if (!started) {
    $("#level-title").text("Level " + level);
    nextSequence();
    started = true;
  } else if (started && gamePattern.length === 0) {
    // Restart the game if it's over and user interacts
    startOver();
  }
});

// Handle both click and touch events on buttons
$(".btn").on("click touchstart", function(event) {
  // Prevent default behavior for touch events
  event.preventDefault();

  if (started) {
    var userChosenColour = $(this).attr("id");
    userClickedPattern.push(userChosenColour);

    // Play the sound and animate the press
    playSound(userChosenColour);
    animatePress(userChosenColour);

    // Check the user's answer
    checkAnswer(userClickedPattern.length - 1);
  }
});

function nextSequence() {
  userClickedPattern = []; // Clear the user's pattern for the new sequence
  level++; // Increment the level
  $("#level-title").text("Level " + level); // Update the level title

  var randomNumber = Math.floor(Math.random() * 4);
  var randomChosenColour = buttonColours[randomNumber];
  gamePattern.push(randomChosenColour);

  // Animate the button
  $("#" + randomChosenColour).fadeIn(100).fadeOut(100).fadeIn(100);
  playSound(randomChosenColour);
}

function playSound(name) {
  var audio = new Audio("sounds/" + name + ".mp3");
  audio.play();
}

function animatePress(currentColour) {
  $("#" + currentColour).addClass("pressed");
  setTimeout(function() {
    $("#" + currentColour).removeClass("pressed");
  }, 100);
}

function checkAnswer(currentLevel) {
  // Check if the most recent user click matches the corresponding game pattern
  if (userClickedPattern[currentLevel] === gamePattern[currentLevel]) {
    // If the user's click is correct and the pattern is complete, proceed to the next sequence
    if (userClickedPattern.length === gamePattern.length) {
      setTimeout(function() {
        nextSequence();
      }, 1000); // Wait 1 second before starting the next sequence
    }
  } else {
    // Handle game over scenario
    playSound("wrong");
    $("body").addClass("game-over");
    setTimeout(function() {
      $("body").removeClass("game-over");
    }, 200);
    $("#level-title").text("Game Over, Press Any Key or Touch to Restart");
    started = false;
    level = 0;
    gamePattern = [];
    userClickedPattern = []; // Reset the user's pattern
  }
}

function startOver() {
  level = 0;
  gamePattern = [];
  userClickedPattern = []; // Reset the user's pattern
  $("#level-title").text("Press Any Key or Touch to Start");
  started = false;
}
