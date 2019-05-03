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
    this.checkbox.checked=this.comp;
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


createAchievement("Rule 1: The first one is free. <s>No exceptions.</s>","Get 1 FR 1",function(){return game.fr1.amount.gte(1)});
createAchievement("Period","Start a New Episode",function(){return game.newEpisode.gte(1)});
createAchievement("Quad Core","Get 1 FR 4",function(){return game.fr4.amount.gte(1)});
createAchievement("Three-pronged Fork","Repel 1 T forks",function(){return game.forks.gte(1e12)});
createAchievement("Protect the Cake!","Start a New Cake at Stake",function(){return game.newCakeAtStake.gte(1)});
createAchievement("Ten-pronged Fork","Repel 1 Dc forks",function(){return game.forks.gte(1e33)});
createAchievement("Episodeon","Start 5 K New Episodes",function(){return game.newEpisode.gte(5000)});
createAchievement("Where You Can Present Yourself","Start a New Contest",function(){return game.newContest.gte(1)});
createAchievement("Feel the Power...","Get empowored cakes",function(){return game.empoworedCakes.gte(1)});
createAchievement("Twenty-pronged Fork","Repel 1e63 forks",function(){return game.forks.gte(1e63)});
