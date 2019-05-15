var Achievements={};
function Achievement(p){
  this.name=p.name; //achievement name
  this.desc=p.desc; //description
  this.cond=p.cond; //achievement earn condition, put function object.
  this.comp=p.comp; //if completed
  
  this.getName=function (){
    return this.name;
  }
  this.getDescription=function (){
    return this.desc;
  }
  this.getID=function (){
    return this.id;
  }
  this.getCondition=function (){
    return this.cond;
  }
  this.updateCompletion=function (){
    this.comp=this.comp||this.cond();
  }
  this.getCompletion=function (){
    return this.comp;
  }
  this.update=function (){
    this.updateCompletion();
    if(this.checkbox) this.checkbox.checked=this.comp;
  }
}
function createAchievement(name,desc,cond,comp=false){
  var achievement=new Achievement({name:name,desc:desc,cond:cond,comp:comp});
  achievement.id=Achievements.asArray().length; //achievement id
  Achievements[Achievements.asArray().length]=achievement; //add to the list
}

Achievements.getAchievementById=function (id){
  return Achievements[id]||undefined;
}
Achievements.getAchievementByName=function (name){
  for (var id in Achievements){
    if (!Achievements[id]) continue;
    if (Achievements[id].name==name) return Achievements[id];
  }
  return undefined;
}
Achievements.asArray=function (){
  var array=[];
  for (var id in Achievements){
    if (!isNaN(+id)) array[+id]=Achievements[id];
  }
  return array;
}
Achievements.getCompletions=function (){
  var array=[];
  for (var id in Achievements){
    if (!isNaN(+id)) array[+id]=Achievements[id].getCompletion();
  }
  return array;
}

function updateAchievements(){
  for (var id in Achievements.asArray()){
    Achievements.asArray()[id].update();
  }
}


createAchievement("The First One's Always Free","Get the first Fork Repellent.",function(){return game.fr1.amount.gte(1)});
createAchievement("One of Many","Start a New Episode.",function(){return game.newEpisode.gte(1)});
createAchievement("Quad Core","Get a fourth tier FR.",function(){return game.fr4.amount.gte(1)});
createAchievement("Three-pronged Fork","Repel 1 trillion forks.",function(){return game.forks.gte(1e12)});
createAchievement("The Grind Begins","Start 500 New Episodes.",function(){return game.newEpisode.gte(5e2)});
createAchievement("Episodeon","Start 5,000 New Episodes.",function(){return game.newEpisode.gte(5e3)});
createAchievement("I Hope You Automated This","Start 50,000 New Episodes.",function(){return game.newEpisode.gte(5e4)});
createAchievement("You Can Stop Now","Start 500,000 New Episodes.",function(){return game.newEpisode.gte(5e5)});
createAchievement("Pain","Start 5,000,000 New Episodes.",function(){return game.newEpisode.gte(5e6)});
createAchievement("Protect the Cake!","Start a New Cake at Stake.",function(){return game.newCakeAtStake.gte(1)});
createAchievement("The 9th FR is a Lie","Get an eighth tier FR.",function(){return game.fr8.amount.gte(1)});
createAchievement("Feel the Power","Obtain an empowered cake.",function(){return game.empoweredCakes.gte(1)});
createAchievement("Ten-pronged Fork","Repel 1 decillion forks.",function(){return game.forks.gte(1e33)});
createAchievement("Why?","Start 69,000 New Cake At Stakes.",function(){return game.newCakeAtStake.gte(5e3)});
createAchievement("Where You Can Present Yourself","Start a New Contest",function(){return game.newContest.gte(1)});
createAchievement("Quantum Mechanics Forbids This","Get a ninth tier FR.",function(){return game.fr9.amount.gte(1)});
createAchievement("Twenty-pronged Fork","Repel 1 vigintillion forks",function(){return game.forks.gte(1e63)});
createAchievement("It's Over 9000","Get at least 9001 empowered cakes.",function(){return game.empoweredCakes.gte(9000)});
createAchievement("A Googol Forks","Repel 10 dutrigintillion forks",function(){return game.forks.gte(1e100)});
createAchievement("Not Two Googol","Repel 100 quinquasexagintillion forks",function(){return game.forks.gte(1e200)});
