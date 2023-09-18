let currentSection = 1;
let selectedChips = 0;
const chipsArray = Array(false, false, false, false);

$(document).ready(function(){

    for (let i = 1; i <= 5; i++) {
        if (currentSection === i) {
            $(".section-" + i.toString()).show();
        } else {
            $(".section-" + i.toString()).hide();
        }
    }

    $(".next-btn").on("click", () =>
        nextSection()
    );
    $(".back-btn").on("click", () =>
        backSection()
    );
    $("#chips1").on("click", () =>
        selectChips(1)
    );
    $("#chips2").on("click", () =>
        selectChips(2)
    );
    $("#chips3").on("click", () =>
        selectChips(3)
    );
    $("#chips4").on("click", () =>
        selectChips(4)
    );

    checkVisibility();

});
function nextSection() {
    console.log(currentSection);
    currentSection += 1;
    for (let i = 1; i <= 5; i++) {
        if (currentSection === i) {
            $(".section-" + i.toString()).show();
        } else {
            $(".section-" + i.toString()).hide();
        }
    }
    checkVisibility();
}
function backSection(){
    console.log(currentSection);
    currentSection -= 1;
    for (let i = 1; i <= 5; i++) {
        if (currentSection === i) {
            $(".section-" + i.toString()).show();
        } else {
            $(".section-" + i.toString()).hide();
        }
    }
    checkVisibility();
}

function checkVisibility(){
    if(currentSection === 1){
        $(".back-btn").hide();
    }
    if(currentSection !== 1){
        $(".back-btn").show();
    }
    if(currentSection !== 5){
        $(".next-btn").show();
    }
    if(currentSection === 5){
        $(".next-btn").hide();
    }
}

function selectChips(id){
    let selected = 0;
    for (let i = 0; i < chipsArray.length; i++){
        if(chipsArray[i]){
            selected++
        }
    }
    for (let i = 0; i < chipsArray.length; i++){

        if(id === i + 1){
            if(selected < 2 ){
                chipsArray[i] =!chipsArray[i]
            } else {
                if(chipsArray[i] === true){
                    chipsArray[i] =!chipsArray[i]
                }
            }
            if(chipsArray[i]){
                $("#chips" + id).addClass("selected-chips")
                console.log(i.toString() + "     Selected")
            } else {
                $("#chips" + id).removeClass("selected-chips")
                console.log(i.toString() + "     Deselected")
            }
        }
    }


}
 function checkSelectedChips(){
    for (let i = 0; i < chipsArray.length; i++){
        $("#chips" + chipsArray[i].toString()).addClass("selected-chips")
    }
 }
