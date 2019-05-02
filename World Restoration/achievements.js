var Achievements={};
function Achievement(p){
  this.name=p.name; //achievement name
  this.desc=p.desc; //description
  this.id=p.id; //achievement id
  Achievements[p.id]=this; //add to the list
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

Achievements.getAchievementById=function (id){
  return Achievements[id]||undefined;
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
