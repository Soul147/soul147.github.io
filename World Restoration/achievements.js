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
}
function createAchievement(name,desc,cond,comp=false){
  var achievement=new Achievement({name:name,desc:desc,cond:cond,comp:comp});
  achievement.id=Achievements.length; //achievement id
  Achievements[Achievements.length]=achievement; //add to the list
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
Achievemets.getCompletions=function (){
  var array=[];
  for (var id in Achievements){
    if (!isNaN(+id)) array[+id]=Achievements[id].getCompletion();
  }
  return array;
}


createAchievement("Test","test",function(){return false;});
