function fixSave() {
  var save = atob(document.getElementById("brokenSave").value)
  
  var fixed = save.replace(/NaN/gi, "10")
  var stillToDo = JSON.parse(fixed)
  for (var i=0; i<stillToDo.autobuyers.length; i++) stillToDo.autobuyers[i].isOn = false
  stillToDo.mods = stillToDo.mods || {}
  
  document.getElementById("devOut").value = JSON.stringify(stillToDo)
  
  document.getElementById("fixed").value = btoa(JSON.stringify(stillToDo))
}

window.onkeydown = function(e) {
  if(e.controlDown && e.keyCode == 27) document.getElementById("devOut").style.display = ""
}
