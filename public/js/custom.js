$(document).ready(function(){
  var requiredFieldsFilled = false;

  var skillsAliases = ['Cm', 'Comms', 'Ca', 'Dd', 'Fm', 'Pm', 'Ppm', 'Ps']

  for(var i=0; i<skillsAliases.length; i++){
    revealAndRequire(skillsAliases[i] + "-checkbox-a", ".skills-" + skillsAliases[i], "experience" + skillsAliases[i])
    revealAndRequire(skillsAliases[i] + "-checkbox-b", "." + skillsAliases[i], "role" + skillsAliases[i])
  }

  $('input[type="checkbox"]').click(function() {
    if ($('.required').length === 0){
      requiredFieldsFilled = true
    }
    else {
      requiredFieldsFilled = false
    }
    goodToGo()
  })

  function revealAndRequire(checkboxId, revealClass, infoField){
    $("#" + checkboxId).click(function() {
      if ($(this).attr("id") == checkboxId) {
        $(revealClass).toggle();
        $("input#" + infoField).toggleClass("required");
      }
    })
  }

  $( "input[type='text']" ).keyup(function() {
    if ($(this).val().length > 0) {
      $(this).removeClass('required')
    }
    else {
      $(this).addClass('required')
    }

    if ($('.required').length === 0){
      requiredFieldsFilled = true
    }
    else {
      requiredFieldsFilled = false
    }

    // goodToGo()

  })

  function goodToGo(){
    // if ($("input[name='areasToDevelop']:checked").length > 0) {
    //   $("#send").removeClass("disabled");
    // }
    // else {
    //   $("#send").addClass("disabled")
    //   $("#detailsMessage").toggle();
    // }
  }
});

