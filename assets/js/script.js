$(document).ready(initializeApp);

var characterCardArray = ['ashuri', 'chocolate', 'cicini', 'cocoa', 'irisu', 'keke',
 'kotri', 'lilith', 'miru', 'nieve',
'nixie', 'pandora', 'rita',
 'rumi', 'saya', 'seana', 'syaro', 'vanilla'];

var audio;
var slicedArray;
var firstCardClickedBack = null;
var secondCardClickedBack = null;
var firstCardClickedFront = null;
var secondCardClickedFront = null;
var disabledFirstCard = null;
var disabledSecondCard = null;
var matches = null;
var retrys = null;
var attempts = null;
var gamesPlayed = null;
var accuracy = null;
var maxMatches = 9;


function initializeApp () {
 gameTitle();
  $('body').on('click', '.card', handleCardClick);
  $('body').on('click', '.play-again', resetEverything);
  $('body').on('click', '.refresh-game', refreshGame);
  $('body').on('mouseenter', '.card', mouseOnHover);
  $('body').on('mouseenter', 'button', mouseOnHover);
  $('body').on('click', 'button', mouseClick);
}


function handleCardClick(event) {
  var cardback = event.currentTarget.children[0];
  $(cardback).addClass('hidden');
  var ribisHealthBar = $('.ribiHealthBar').width()
  var enemysHealthBar = $('.enemyHealthBar').width();

  if(!firstCardClickedBack) {
    disabledFirstCard = $(event.currentTarget).addClass('disabled');
    firstCardClickedBack = $(event.currentTarget.children[0]);
    firstCardClickedFront = $(event.currentTarget.children[1]).attr('class');
  } else {
    attempts++;
    $('.attempts').text(attempts);
    disabledSecondCard = $(event.currentTarget).addClass('disabled');
    secondCardClickedBack = $(event.currentTarget.children[0]);
    secondCardClickedFront = $(event.currentTarget.children[1]).attr('class');
  }
  if (firstCardClickedFront === secondCardClickedFront) {
    matches++;
    characterDialogueContent(secondCardClickedFront);
    $('.accuracy').text(calculateAccuracy() + '%');
    $('.enemyHealthBar').width(enemysHealthBar -= 45);
    if(gamesPlayed === null) {
      $('.level1EnemySideStance').effect('shake');
    } else if(gamesPlayed === 1) {
      $('.level2EnemySideStance').effect('shake');
    } else if (gamesPlayed === 2) {
      $('.level3EnemySideStance').effect('shake');
    }

    battleSound('enemyDamage.wav');
    firstCardClickedBack = null;
    secondCardClickedBack = null;
    firstCardClickedFront = null;
    secondCardClickedFront = null;
    disabledFirstCard = null;
    disabledSecondCard = null;
  } else if (secondCardClickedBack) {
    if (gamesPlayed === null) {
      $('.ribiHealthBar').width(ribisHealthBar -= 18);
    } else if (gamesPlayed === 1) {
      $('.ribiHealthBar').width(ribisHealthBar -= 50);
    } else if (gamesPlayed === 2) {
      $('.ribiHealthBar').width(ribisHealthBar -= 80);
    }
    $('.ribiSideStance').effect('shake');
    battleSound('selfDamage.wav');
    $('body').addClass('disabled');
    setTimeout(function () {
      firstCardClickedBack.removeClass('hidden');
      secondCardClickedBack.removeClass('hidden');
      disabledFirstCard.removeClass('disabled');
      disabledSecondCard.removeClass('disabled');
      firstCardClickedBack = null;
      secondCardClickedBack = null;
      firstCardClickedFront = null;
      secondCardClickedFront = null;
      disabledFirstCard = null;
      disabledSecondCard = null;
      $('body').removeClass('disabled');
    }, 500);

    $('.accuracy').text(calculateAccuracy() + '%');
  }
  if (matches === maxMatches) {
    matches = null;
    gamesPlayed++;
    if(gamesPlayed === 1) {
      $('body').empty();
      level2Dialogue();
    } else if (gamesPlayed === 2) {
      $('body').empty();
      level3Dialogue();
    } else if (gamesPlayed === 3) {
      $('body').empty();
      endingScene();
    }

  }
  if (ribisHealthBar <= 0) {
    $('.modal').toggleClass('hidden');
  }

}

function calculateAccuracy() {
  accuracy = Math.floor(24 / attempts * 100);
  return accuracy;
}
function resetEverything() {
  matches = null;
  retrys++;
  $('.card').removeClass('disabled');
  if (gamesPlayed === null) {
    $('.cardBack1').removeClass('hidden');
  } else if (gamesPlayed === 1) {
    $('.cardBack2').removeClass('hidden');
  } else if (gamesPlayed === 2) {
    $('.cardBack3').removeClass('hidden');
  }
  $('.modal').toggleClass('hidden');
  $('.enemyHealthBar').width(400);
  $('.ribiHealthBar').width(400);
}

function gameTitle() {
  $('body').css('background-image', 'url(assets/images/backgrounds/gameTitle.jpg)');
  var gameTitleContainer = $('<div>').addClass('gameTitleContainer');
  var gameTitleLogo = $('<div>').addClass('gameTitleLogo').css('background-image', 'url(assets/images/Title.png)');
  var gameStartButton = $('<button>').addClass('gameStartButton').text('START GAME');
  $(gameTitleContainer).append(gameTitleLogo, gameStartButton);
  $('body').append(gameTitleContainer);
  backgroundMusic('rabiRibiTown.mp3');
  $('.gameStartButton').click(beginGame);
  function beginGame() {
    $('body').empty();
    audio.pause();
    level1Dialogue();
  }
}

function level1Dialogue() {
  backgroundMusic('startingForest.mp3');
  var ribisDialogueImage = 'url(assets/images/characters/ribbon.png)';
  var aruraunesDialogueImage = 'url(assets/images/characters/aruraune.png)'
  $('body').css('background-image', 'url(assets/images/backgrounds/firstBattle.gif)');
  var firstConversationContainer = $('<div>').addClass('conversationContainer');
  var firstConversationEnemy = $('<div>').addClass('level1EnemySideStance');
  var firstConversationRibi = $('<div>').addClass('ribiSideStance');
  var firstConversationDialogueContainer = $('<div>').addClass('conversationBox');
  var firstConversationDialogueContent = $('<div>').addClass('dialogueContent')
                                                    .text('Ribi: Aruraune! Have you seen Erina anywhere?')
                                                    .append('<br/> <br/>')
                                                    .append('(Click on the box to continue)');
  var firstConversationDialogueCharacter = $('<div>').addClass('dialogueCharacter')
                                                      .css('background-image', ribisDialogueImage);
  $(firstConversationDialogueContainer).append(firstConversationDialogueContent, firstConversationDialogueCharacter);
  $(firstConversationContainer).append(firstConversationDialogueContainer);
  $('body').append(firstConversationEnemy, firstConversationRibi, firstConversationContainer);

  $('.conversationBox').on('click', aruraune1);

  function aruraune1() {
    $('.dialogueContent').text('He-.. help me..');
    $('.dialogueCharacter').css('background-image', aruraunesDialogueImage);
    $('.conversationBox').on('click', ribi2);
  }
  function ribi2() {
    $('.dialogueContent').text('Oh no! What\'s wrong?');
    $('.dialogueCharacter').css('background-image', ribisDialogueImage);
    $('.conversationBox').on('click', aruraune2);
  }
  function aruraune2() {
    $('.dialogueContent').text('Noah has gone on another rampage.. I can\'t..');
    $('.dialogueCharacter').css('background-image', aruraunesDialogueImage);
    $('.conversationBox').on('click', ribi3);
  }
  function ribi3() {
    $('.dialogueContent').text('Noahs at it again? maybe she took Erina!');
    $('.dialogueCharacter').css('background-image', ribisDialogueImage);
    $('.conversationBox').on('click', aruraune3);
  }
  function aruraune3() {
    $('.dialogueContent').text('I can\'t..');
    $('.dialogueCharacter').css('background-image', aruraunesDialogueImage);
    $('.conversationBox').on('click', ribi4);
  }
  function ribi4() {
    $('.dialogueContent').text('I have to find her.. Are you ok?');
    $('.dialogueCharacter').css('background-image', ribisDialogueImage);
    $('.conversationBox').on('click', aruraune4);
  }
  function aruraune4 () {
    $('.dialogueContent').text('I can\'t control myself, please stop me..');
    $('.dialogueCharacter').css('background-image', aruraunesDialogueImage);
    $('.conversationBox').on('click', ribi5);
  }
  function ribi5() {
    $('.dialogueContent').text('I\'ll save you Aruraune! Please help me get Erina back!');
    $('.dialogueCharacter').css('background-image', ribisDialogueImage);
    $('.conversationBox').on('click', generateLevel1);
  }
  function generateLevel1() {
    $('body').empty();
    level1GameGeneration();
  }
}


function level1GameGeneration () {

  var modal = $('<div>').addClass('modal hidden');
  var modalContent = $('<div>').addClass('game-over-modal');
  var loseMessage = $('<h1>').text('GAME OVER');
  var ribiLossPose = $('<div>').addClass('ribi-loss-pose');
  var playAgainButton = $('<button>').addClass('play-again').text('Retry?');
  $(modalContent).append(loseMessage, ribiLossPose, playAgainButton);
  $(modal).append(modalContent);
  var header = $('<header>').addClass('healthBarZone');
  var enemyPhoto = $('<div>').addClass('enemyLevel1');
  var enemyBarContainer = $('<div>').addClass('enemyHealthBarContainer');
  var enemyBar = $('<div>').addClass('enemyHealthBar');
  $(enemyBarContainer).append(enemyBar);
  var timerContainer = $('<div>').addClass('timerContainer');
  var timer = $('<p>').addClass('timer').text('99');
  $(timerContainer).append(timer);
  var ribiPhoto = $('<div>').addClass('ribbon');
  var ribiBarContainer = $('<div>').addClass('ribiHealthBarContainer');
  var ribiBar = $('<div>').addClass('ribiHealthBar');
  $(ribiBarContainer).append(ribiBar)

  $(header).append(enemyPhoto, enemyBarContainer, timerContainer, ribiBarContainer, ribiPhoto);

  var mainContainer = $('<main>').addClass('mainContainer');
  var cardContainer = $('<div>').addClass('cardContainer');
  var enemySideStance = $('<div>').addClass('level1EnemySideStance');
  var ribiSideStance = $('<div>').addClass('ribiSideStance');
  shuffledArrayGeneration();
  for (var i = 0; i < slicedArray.length; i++) {
    var cardSet = $('<div>').addClass('card');
    var cardSetBack = $('<div>').addClass('cardBack1');
    var randomCharacterCard = $('<div>').addClass(slicedArray[i]);
    $(cardSet).append(cardSetBack, randomCharacterCard);
    $(cardContainer).append(cardSet);
  }
  $(mainContainer).append(cardContainer);
  var dialogueContainer = $('<div>').addClass('dialogueContainer hidden');
  var dialogueContent = $('<div>').addClass('dialogueContent')
                                  .text('Cocoa: This is text content');
  var dialogueCharacter = $('<div>').addClass('dialogueCharacter');
  $(dialogueContainer).append(dialogueContent, dialogueCharacter);

  $('body').append(modal, header, enemySideStance, ribiSideStance, mainContainer, dialogueContainer);


}

function level2Dialogue() {
  var ribisDialogueImage = 'url(assets/images/characters/ribbon.png)';
  var aruraunesDialogueImage = 'url(assets/images/characters/aruraune.png)';
  var noahsDialogueImage = 'url(assets/images/characters/noah.png)';
  var firstConversationContainer = $('<div>').addClass('conversationContainer');
  var firstConversationEnemy = $('<div>').addClass('level1EnemySideStance');
  var firstConversationRibi = $('<div>').addClass('ribiSideStance');
  var firstConversationDialogueContainer = $('<div>').addClass('conversationBox');
  var firstConversationDialogueContent = $('<div>').addClass('dialogueContent')
                    .text('*huff* *puff* *huff* *puff* Are you okay Aruraune?');
  var firstConversationDialogueCharacter = $('<div>').addClass('dialogueCharacter')
    .css('background-image', ribisDialogueImage);
  $(firstConversationDialogueContainer).append(firstConversationDialogueContent, firstConversationDialogueCharacter);
  $(firstConversationContainer).append(firstConversationDialogueContainer);
  $('body').append(firstConversationEnemy, firstConversationRibi, firstConversationContainer);

  $('.conversationBox').on('click', aruraune1);

  function aruraune1() {
    $('.dialogueContent').text('I\'m so sorry, I tried protecting Erina..');
    $('.dialogueCharacter').css('background-image', aruraunesDialogueImage);
    $('.conversationBox').on('click', ribi2);
  }
  function ribi2() {
    $('.dialogueContent').text('*gasp* What happened! Is she hurt?');
    $('.dialogueCharacter').css('background-image', ribisDialogueImage);
    $('.conversationBox').on('click', aruraune2);
  }
  function aruraune2() {
    $('.dialogueContent').text('Noah took her.. I was defeated');
    $('.dialogueCharacter').css('background-image', aruraunesDialogueImage);
    $('.conversationBox').on('click', ribi3);
  }
  function ribi3() {
    $('.dialogueContent').text('Where did she go?! I need to find her');
    $('.dialogueCharacter').css('background-image', ribisDialogueImage);
    $('.conversationBox').on('click', aruraune3);
  }
  function aruraune3() {
    $('.dialogueContent').text('Noah took her to a nearby town.');
    $('.dialogueCharacter').css('background-image', aruraunesDialogueImage);
    $('.conversationBox').on('click', ribi4);
  }
  function ribi4() {
    $('.dialogueContent').text('Can you help me get to her?');
    $('.dialogueCharacter').css('background-image', ribisDialogueImage);
    $('.conversationBox').on('click', aruraune4);
  }
  function aruraune4() {
    $('.dialogueContent').text('I can only show you the way, I need to recover.');
    $('.dialogueCharacter').css('background-image', aruraunesDialogueImage);
    $('.conversationBox').on('click', ribi5);
  }
  function ribi5() {
    $('.dialogueContent').text('Okay! I\'m coming Erina!');
    $('.dialogueCharacter').css('background-image', ribisDialogueImage);
    $('.conversationBox').on('click', transitionToLevel2);
  }
  function transitionToLevel2() {
    audio.pause();
    backgroundMusic('noRemorse.mp3');
    $('.conversationBox').off();
    $('body').css('background-image', 'url(assets/images/backgrounds/noahBattle.gif)');
    $('.level1EnemySideStance').addClass('level2EnemySideStance');
    $('.level2EnemySideStance').removeClass('level1EnemySideStance');
    $('.dialogueContent').text(' ... ');
    $('.dialogueCharacter').css('background-image', noahsDialogueImage);
    $('.conversationBox').on('click', ribi6);
  }

  function ribi6() {
    $('.dialogueContent').text('Where is she Noah!');
    $('.dialogueCharacter').css('background-image', ribisDialogueImage);
    $('.conversationBox').on('click', noah1);
  }
  function noah1() {
    $('.dialogueContent').text('You really think you\'re going to get info out of me?');
    $('.dialogueCharacter').css('background-image', noahsDialogueImage);
    $('.conversationBox').on('click', ribi7);
  }
  function ribi7() {
    $('.dialogueContent').text('Tell me! Rabi town needs her back!');
    $('.dialogueCharacter').css('background-image', ribisDialogueImage);
    $('.conversationBox').on('click', noah2);
  }
  function noah2() {
    $('.dialogueContent').text('You\'re going to have to beat me if you want to find out.');
    $('.dialogueCharacter').css('background-image', noahsDialogueImage);
    $('.conversationBox').on('click', ribi8);
  }
  function ribi8() {
    $('.dialogueContent').text('I don\'t want to do this Noah, please.');
    $('.dialogueCharacter').css('background-image', ribisDialogueImage);
    $('.conversationBox').on('click', noah3);
  }
  function noah3() {
    $('.dialogueContent').text('The longer you wait, the less chance she\'ll ever be the same again.');
    $('.dialogueCharacter').css('background-image', noahsDialogueImage);
    $('.conversationBox').on('click', ribi9);
  }
  function ribi9() {
    $('.dialogueContent').text('Looks like theres no other choice, here I come!');
    $('.dialogueCharacter').css('background-image', ribisDialogueImage);
    $('.conversationBox').on('click', generateLevel2);
  }
  function generateLevel2() {
    $('body').empty();
    level2GameGeneration();
  }
}

function level2GameGeneration() {

  var modal = $('<div>').addClass('modal hidden');
  var modalContent = $('<div>').addClass('game-over-modal');
  var loseMessage = $('<h1>').text('GAME OVER');
  var ribiLossPose = $('<div>').addClass('ribi-loss-pose');
  var playAgainButton = $('<button>').addClass('play-again').text('Retry?');
  $(modalContent).append(loseMessage, ribiLossPose, playAgainButton);
  $(modal).append(modalContent);
  var header = $('<header>').addClass('healthBarZone');
  var enemyPhoto = $('<div>').addClass('enemyLevel2');
  var enemyBarContainer = $('<div>').addClass('enemyHealthBarContainer');
  var enemyBar = $('<div>').addClass('enemyHealthBar');
  $(enemyBarContainer).append(enemyBar);
  var timerContainer = $('<div>').addClass('timerContainer');
  var timer = $('<p>').addClass('timer').text('99');
  $(timerContainer).append(timer);
  var ribiPhoto = $('<div>').addClass('ribbon');
  var ribiBarContainer = $('<div>').addClass('ribiHealthBarContainer');
  var ribiBar = $('<div>').addClass('ribiHealthBar');
  $(ribiBarContainer).append(ribiBar)

  $(header).append(enemyPhoto, enemyBarContainer, timerContainer, ribiBarContainer, ribiPhoto);

  var mainContainer = $('<main>').addClass('mainContainer');
  var cardContainer = $('<div>').addClass('cardContainer');
  var enemySideStance = $('<div>').addClass('level2EnemySideStance');
  var ribiSideStance = $('<div>').addClass('ribiSideStance');
  shuffledArrayGeneration();
  for (var i = 0; i < slicedArray.length; i++) {
    var cardSet = $('<div>').addClass('card');
    var cardSetBack = $('<div>').addClass('cardBack2');
    var randomCharacterCard = $('<div>').addClass(slicedArray[i]);
    $(cardSet).append(cardSetBack, randomCharacterCard);
    $(cardContainer).append(cardSet);
  }
  $(mainContainer).append(cardContainer);
  var dialogueContainer = $('<div>').addClass('dialogueContainer hidden');
  var dialogueContent = $('<div>').addClass('dialogueContent')
    .text('Cocoa: This is text content');
  var dialogueCharacter = $('<div>').addClass('dialogueCharacter');
  $(dialogueContainer).append(dialogueContent, dialogueCharacter);

  $('body').append(modal, header, enemySideStance, ribiSideStance, mainContainer, dialogueContainer);


}

function level3Dialogue() {
  var ribisDialogueImage = 'url(assets/images/characters/ribbon.png)';
  var noahsDialogueImage = 'url(assets/images/characters/noah.png)';
  var shadowErinasDialogueImage = 'url(assets/images/characters/shadow-erina.png)';
  var firstConversationContainer = $('<div>').addClass('conversationContainer');
  var firstConversationEnemy = $('<div>').addClass('level2EnemySideStance');
  var firstConversationRibi = $('<div>').addClass('ribiSideStance');
  var firstConversationDialogueContainer = $('<div>').addClass('conversationBox');
  var firstConversationDialogueContent = $('<div>').addClass('dialogueContent')
    .text('*huff* *puff* Noah...');
  var firstConversationDialogueCharacter = $('<div>').addClass('dialogueCharacter')
    .css('background-image', ribisDialogueImage);
  $(firstConversationDialogueContainer).append(firstConversationDialogueContent, firstConversationDialogueCharacter);
  $(firstConversationContainer).append(firstConversationDialogueContainer);
  $('body').append(firstConversationEnemy, firstConversationRibi, firstConversationContainer);
  $('.conversationBox').off();
  $('.conversationBox').on('click', noah1);

  function noah1() {
    $('.dialogueContent').text('...');
    $('.dialogueCharacter').css('background-image', noahsDialogueImage);
    $('.conversationBox').on('click', ribi2);
  }
  function ribi2() {
    $('.dialogueContent').text('NOAH!');
    $('.dialogueCharacter').css('background-image', ribisDialogueImage);
    $('.conversationBox').on('click', noah2);
  }
  function noah2() {
    $('.dialogueContent').text('You\'re already too late..');
    $('.dialogueCharacter').css('background-image', noahsDialogueImage);
    $('.conversationBox').on('click', ribi3);
  }
  function ribi3() {
    $('.dialogueContent').text('What do you mean?! What did you do?!');
    $('.dialogueCharacter').css('background-image', ribisDialogueImage);
    $('.conversationBox').on('click', noah3);
  }
  function noah3() {
    $('.dialogueContent').text('Shes gone now, theres nothing you can do.');
    $('.dialogueCharacter').css('background-image', noahsDialogueImage);
    $('.conversationBox').on('click', ribi4);
  }
  function ribi4() {
    $('.dialogueContent').text('Just tell me where she is.. please..');
    $('.dialogueCharacter').css('background-image', ribisDialogueImage);
    $('.conversationBox').on('click', noah4);
  }
  function noah4() {
    $('.dialogueContent').text('She\'s probably in the next town over by now..');
    $('.dialogueCharacter').css('background-image', noahsDialogueImage);
    $('.conversationBox').on('click', ribi5);
  }
  function ribi5() {
    $('.dialogueContent').text('*Ribi sprints off towards the next town*');
    $('.dialogueCharacter').css('background-image', ribisDialogueImage);
    $('.conversationBox').on('click', transitionToLevel3);
  }
  function transitionToLevel3() {
    audio.pause();
    backgroundMusic('truthNeverSpoken.mp3');
    $('.conversationBox').off();
    $('body').css('background-image', 'url(assets/images/backgrounds/erinaBattle.gif)');
    $('.level2EnemySideStance').addClass('level3EnemySideStance');
    $('.level3EnemySideStance').removeClass('level2EnemySideStance');
    $('.dialogueContent').text(' ... ');
    $('.dialogueCharacter').css('background-image', shadowErinasDialogueImage);
    $('.conversationBox').on('click', ribi6);
  }

  function ribi6() {
    $('.dialogueContent').text('... Master... ?');
    $('.dialogueCharacter').css('background-image', ribisDialogueImage);
    $('.conversationBox').on('click', erina1);
  }
  function erina1() {
    $('.dialogueContent').text('...');
    $('.dialogueCharacter').css('background-image', shadowErinasDialogueImage);
    $('.conversationBox').on('click', ribi7);
  }
  function ribi7() {
    $('.dialogueContent').text('Master please, snap out of it!');
    $('.dialogueCharacter').css('background-image', ribisDialogueImage);
    $('.conversationBox').on('click', erina2);
  }
  function erina2() {
    $('.dialogueContent').text('...');
    $('.dialogueCharacter').css('background-image', shadowErinasDialogueImage);
    $('.conversationBox').on('click', ribi8);
  }
  function ribi8() {
    $('.dialogueContent').text('Master please.. I need you ...');
    $('.dialogueCharacter').css('background-image', ribisDialogueImage);
    $('.conversationBox').on('click', erina3);
  }
  function erina3() {
    $('.dialogueContent').text('... help ... me ...');
    $('.dialogueCharacter').css('background-image', shadowErinasDialogueImage);
    $('.conversationBox').on('click', ribi9);
  }
  function ribi9() {
    $('.dialogueContent').text('Mast - ?');
    $('.dialogueCharacter').css('background-image', ribisDialogueImage);
    $('.conversationBox').on('click', generateLevel3);
  }
  function generateLevel3() {
    $('body').empty();
    level3GameGeneration();
  }
}

function level3GameGeneration() {

  var modal = $('<div>').addClass('modal hidden');
  var modalContent = $('<div>').addClass('game-over-modal');
  var loseMessage = $('<h1>').text('GAME OVER');
  var ribiLossPose = $('<div>').addClass('ribi-loss-pose');
  var playAgainButton = $('<button>').addClass('play-again').text('Retry?');
  $(modalContent).append(loseMessage, ribiLossPose, playAgainButton);
  $(modal).append(modalContent);
  var header = $('<header>').addClass('healthBarZone');
  var enemyPhoto = $('<div>').addClass('enemyLevel3');
  var enemyBarContainer = $('<div>').addClass('enemyHealthBarContainer');
  var enemyBar = $('<div>').addClass('enemyHealthBar');
  $(enemyBarContainer).append(enemyBar);
  var timerContainer = $('<div>').addClass('timerContainer');
  var timer = $('<p>').addClass('timer').text('99');
  $(timerContainer).append(timer);
  var ribiPhoto = $('<div>').addClass('ribbon');
  var ribiBarContainer = $('<div>').addClass('ribiHealthBarContainer');
  var ribiBar = $('<div>').addClass('ribiHealthBar');
  $(ribiBarContainer).append(ribiBar)

  $(header).append(enemyPhoto, enemyBarContainer, timerContainer, ribiBarContainer, ribiPhoto);

  var mainContainer = $('<main>').addClass('mainContainer');
  var cardContainer = $('<div>').addClass('cardContainer');
  var enemySideStance = $('<div>').addClass('level3EnemySideStance');
  var ribiSideStance = $('<div>').addClass('ribiSideStance');
  shuffledArrayGeneration();
  for (var i = 0; i < slicedArray.length; i++) {
    var cardSet = $('<div>').addClass('card');
    var cardSetBack = $('<div>').addClass('cardBack3');
    var randomCharacterCard = $('<div>').addClass(slicedArray[i]);
    $(cardSet).append(cardSetBack, randomCharacterCard);
    $(cardContainer).append(cardSet);
  }
  $(mainContainer).append(cardContainer);
  var dialogueContainer = $('<div>').addClass('dialogueContainer hidden');
  var dialogueContent = $('<div>').addClass('dialogueContent')
    .text('Cocoa: This is text content');
  var dialogueCharacter = $('<div>').addClass('dialogueCharacter');
  $(dialogueContainer).append(dialogueContent, dialogueCharacter);

  $('body').append(modal, header, enemySideStance, ribiSideStance, mainContainer, dialogueContainer);


}

function endingScene() {
  var modal = $('<div>').addClass('modal hidden').css('background-image', 'url(assets/images/backgrounds/endingScene.jpg)');
  var modalContent = $('<div>').addClass('game-over-modal');
  var endingMessage = $('<h1>').text('Thanks for playing!');
  var ribiLossPose = $('<div>').addClass('ribi-loss-pose');
  var statsContainer = $('<div>').addClass('stats').text('Final Stats');
  var retrysDisplay = $('<div>').addClass('statsDisplay').html('Total Retrys:')
                                                          .append('</br>')
                                                          .append(retrys);
  var attemptsDisplay = $('<div>').addClass('statsDisplay').text('Total Attempts: ' + attempts);
  var accuracyDisplay = $('<div>').addClass('statsDisplay').text('Total Accuracy: ' + calculateAccuracy() + '%');
  $(statsContainer).append(retrysDisplay, attemptsDisplay, accuracyDisplay);
  var backToTitleButton = $('<button>').addClass('refresh-game').text('Back to title');
  $(modalContent).append(endingMessage, ribiLossPose, statsContainer, backToTitleButton);
  $(modal).append(modalContent);

  var ribisDialogueImage = 'url(assets/images/characters/ribbon.png)';
  var shadowErinasDialogueImage = 'url(assets/images/characters/shadow-erina.png)';
  var erinasDialogueImage = 'url(assets/images/characters/erina.png)';
  var firstConversationContainer = $('<div>').addClass('conversationContainer');
  var firstConversationEnemy = $('<div>').addClass('level3EnemySideStance');
  var firstConversationRibi = $('<div>').addClass('ribiSideStance');
  var firstConversationDialogueContainer = $('<div>').addClass('conversationBox');
  var firstConversationDialogueContent = $('<div>').addClass('dialogueContent')
                                                  .text('master ... ?');
  var firstConversationDialogueCharacter = $('<div>').addClass('dialogueCharacter')
                                                      .css('background-image', ribisDialogueImage);
  $(firstConversationDialogueContainer).append(firstConversationDialogueContent, firstConversationDialogueCharacter);
  $(firstConversationContainer).append(firstConversationDialogueContainer);
  $('body').append(modal, firstConversationEnemy, firstConversationRibi, firstConversationContainer);
  audio.pause();
  backgroundMusic('endingScene.mp3');
  $('.conversationBox').off();
  $('.conversationBox').on('click', erina1);

  function erina1() {
    $('.dialogueContent').text('...');
    $('.dialogueCharacter').css('background-image', shadowErinasDialogueImage);
    $('.conversationBox').on('click', ribi2);
  }
  function ribi2() {
    $('.dialogueContent').text('MASTER!');
    $('.dialogueCharacter').css('background-image', ribisDialogueImage);
    $('.conversationBox').on('click', erina2);
  }
  function erina2() {
    $('.level3EnemySideStance').css('background-image', 'url(assets/images/characters-side/erina.png)');
    $('.dialogueContent').text('Ribi... ?');
    $('.dialogueCharacter').css('background-image', erinasDialogueImage);
    $('.conversationBox').on('click', ribi3);
  }
  function ribi3() {
    $('.dialogueContent').text('MASTER!!!');
    $('.dialogueCharacter').css('background-image', ribisDialogueImage);
    $('.conversationBox').on('click', triggerEndingModal);
  }
  function triggerEndingModal() {
    $('.modal').toggleClass('hidden');
  }

}

function refreshGame() {
  $('.conversationBox').off();
  $('body').empty();
  audio.pause();
  retrys = null;
  matches = null;
  attempts = null;
  gamesPlayed = null;
  accuracy = null;
  gameTitle();
}


function shuffleDeck (array) {
  var randomNumber;
  var arrayLength = array.length-1
  var spotHolder;
  for (var i = 0; i < arrayLength; i++) {
    randomNumber = Math.floor(Math.random() * (array.length));
    spotHolder = array[i];
    array[i] = array[randomNumber];
    array[randomNumber] = spotHolder;
  }
  return array;
}

function shuffledArrayGeneration () {
  slicedArray = shuffleDeck(characterCardArray);
  slicedArray = slicedArray.slice(9);
  slicedArray = slicedArray.concat(slicedArray);
  slicedArray = shuffleDeck(slicedArray);
}
function characterDialogueContent(character) {
  $('.dialogueCharacter').css('background-image', 'url(assets/images/characters/' + character + '.png)');
  switch(character) {
    case 'ashuri':
    $('.dialogueContent').text('Ashuri: Rita would kill me if I didn\'t help.');
      increaseRibiHealth(21);
    break;
    case 'chocolate':
      $('.dialogueContent').text('Chocolate: Keep going!');
      break;
    case 'cicini':
      $('.dialogueContent').text('Cicini: My hypothesis worked! Here\'s a boost!');
      increaseRibiHealth(21);
      break;
    case 'cocoa':
      $('.dialogueContent').text('Cocoa: I don\'t have my bombs, take this instead.');
      increaseRibiHealth(21);
      break;
    case 'irisu':
      $('.dialogueContent').text('Irisu: P- please save Erina..');
      break;
    case 'keke':
      $('.dialogueContent').text('keke: FOOD FOOD FOOD! HAVE SUM FOOD');
      increaseRibiHealth(21);
      break;
    case 'kotri':
      $('.dialogueContent').text('Kotri: You got this Ribi!');
      break;
    case 'lilith':
      $('.dialogueContent').text('Lilith: Take it to the skies!');
      break;
    case 'miru':
      $('.dialogueContent').text('Miru: Erina saved me, now save her. Here.');
      increaseRibiHealth(21);
      break;
    case 'nieve':
      $('.dialogueContent').text('Nieve: Ribi!');
      break;
    case 'nixie':
      $('.dialogueContent').text('Nixie: Where\'d my sister go.');
      break;
    case 'pandora':
      $('.dialogueContent').text('Pandora: Here\'s some health.');
      increaseRibiHealth(21);
      break;
    case 'rita':
      $('.dialogueContent').text('Rita: Let me help.');
      increaseRibiHealth(21);
      break;
    case 'rumi':
      $('.dialogueContent').text('Rumi: Get Erina back Ribi!');
      increaseRibiHealth(50);
      break;
    case 'saya':
      $('.dialogueContent').text('Saya: Thi- This is for Rita.');
      increaseRibiHealth(21);
      break;
    case 'seana':
      $('.dialogueContent').text('Seana: ♫ Saavveee Eriiinnnaa ♫');
      increaseRibiHealth(21);
      break;
    case 'syaro':
      $('.dialogueContent').text('Syaro: Mast- I mean Cicini sent health.');
      increaseRibiHealth(21);
      break;
    case 'vanilla':
      $('.dialogueContent').text('Vanilla: Where\'d Chocolate go..');
      break;
  }
  $('.dialogueContainer').toggleClass('hidden');
  battleSound('dialogue.wav');
  setTimeout(function () {
    $('.dialogueContainer').toggleClass('hidden');
    battleSound('dialogue.wav');
  }, 4000)
}

function increaseRibiHealth(incrementor) {
  var ribiHealthBar = $('.ribiHealthBar').width();
  if (ribiHealthBar >= 400) {
    return;
  } else if (ribiHealthBar + incrementor >= 400) {
    ribiHealthBar = ribiHealthBar + (400 - ribiHealthBar) ;
    $('.ribiHealthBar').width(ribiHealthBar);
  } else {
    ribiHealthBar += incrementor;
    $('.ribiHealthBar').width(ribiHealthBar);
  }
  battleSound('healthincrease.wav');
}

function battleSound(fileName) {
  var battleAudio = new Audio('Audio/' + fileName);
  battleAudio.play();
}
function mouseOnHover() {
  battleSound('hover.wav');
}
function mouseClick() {
  battleSound('click.wav');
}

function backgroundMusic(fileName) {
  audio = new Audio('Audio/Background/' + fileName);
  audio.volume = 0.2;
  audio.loop = true;
  audio.play();
}
