
// BUTTON VARIABLES
let currentSection = 1;
let selectedChips = 0;
const chipsArray = Array(false, false, false, false);


$(document).ready(function () {

    // BUTTONS ASSIGN
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

    // VALIDATION ON FILING INPUTS
    $("input[name=managerName]").on("blur",function(){
        validateName("managerName", "فیلد را پر نمایید.");
    });

    $("input[name=managerPosition]").on("blur",function(){
        validateName("managerPosition", "فیلد را پر نمایید.");
    });

    $("input[name=managerPhoneNumber]").on("blur",function(){
        validatePhoneNumber("managerPhoneNumber");
    });

    $("input[name=schoolName]").on("blur",function(){
        validateName("schoolName", "فیلد را پر نمایید.");
    });

    $("input[name=projectName]").on("blur",function(){
        validateName("projectName", "فیلد را پر نمایید.");
    });

    $("textarea[name=projectDescription]").on("blur",function(){
        validateName("projectDescription", "فیلد را پر نمایید.");
    });


    // VALIDATE ON SUBMIT
    $("#api").on("click", function (){
        var res1 = validateName("managerName", "فیلد را پر نمایید.");

        var res2 = validateName("managerPosition", "فیلد را پر نمایید.");

        var res3 = validatePhoneNumber("managerPhoneNumber");

        var res4 = validateName("schoolName", "فیلد را پر نمایید.");

        var res5 = validateName("projectName", "فیلد را پر نمایید.");

        var res6 = validateName("projectDescription", "فیلد را پر نمایید.");

        if(res1 && res2 && res3 && res4 && res5 && res6){
            createManager()
        } else {
            alert("مقادیر را بدرستی وارد نمایید.");
        }
    });

});

//////////////////////////// API SECTION ////////////////////////////
const mainURL = "https://localhost:7010/";
const header = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Credentials": "true",
    "Content-Type": "application/json"
};
const dataType ='json';

function getNames() {
    $.get("https://api.rainviewer.com/public/weather-maps.json", function(data, status){
        alert("Data: " + data["host"] + "\nStatus: " + status);
    });
}

function createManager() {
    console.log($("input[name=managerName]").val())
    console.log($("input[name=managerPosition]").val())
    console.log($("input[name=managerPhoneNumber]").val())
    console.log(chipsArray)

    const name = $("input[name=managerName]").val();
    const position = $("input[name=managerPosition]").val()
    const phone =  $("input[name=managerPhoneNumber]").val()

    // $.ajax({
    //     url: mainURL + "manager/create",
    //     type: 'post',
    //     data: JSON.stringify({
    //         name: name,
    //         phone: phone,
    //         isVerify: true,
    //         position: position
    //     }),
    //     headers: header,
    //     dataType: dataType,
    //     success: function (data) {
    //         console.info(data);
    //     }
    // }).done(function (response) {
    //     console.log(response);
    // }).fail(function (res){
    //     console.log(res)
    // });

}

function registerForm() {
    let managerName = $("input[name=managerName]").val();
    let managerPosition = $("input[name=managerPosition]").val();
    let phoneNumber = $("input[name=managerPhoneNumber]").val();
    let schoolName = $("input[name=schoolName]").val();
    let schoolGrade = $("input[name=gradeSelector]").val();
    let studentsGender = $("input[name=genderSelector]").val();
    let schoolType = $("input[name=schoolKind]").val();
    let isProgrammer = $("input[name=isProgrammer]").val();
    let programmingLanguage = $("input[name=programmingLanguage]").val();
    let hasProject = $("input[name=hasProject]").val();
    let projectTitle = $("input[name=projectName]").val();
    let projectExplanation = $("textarea[name=projectDescription]").val();

    let selectedDays = $("input[name=managerPhoneNumber]").val();
    let uploadedForm = $("input[name=managerPhoneNumber]").val();
}

$('form').submit( function (event) {
    // prevent the usual form submission behaviour; the "action" attribute of the form
    event.preventDefault();
    // validation goes below...

    // now for the big event
    $.ajax({
        // the server script you want to send your data to
        'url': 'destination.php',
        // all of your POST/GET variables
        'data': {
            // 'dataname': $('input').val(), ...
        },
        // you may change this to GET, if you like...
        'type': 'post',
        // the kind of response that you want from the server
        'dataType': 'html',
        'beforeSend': function () {
            // anything you want to have happen before sending the data to the server...
            // useful for "loading" animations
        }
    })
        .done( function (response) {
            // what you want to happen when an ajax call to the server is successfully completed
            // 'response' is what you get back from the script/server
            // usually you want to format your response and spit it out to the page
        })
        .fail( function (code, status) {
            // what you want to happen if the ajax request fails (404 error, timeout, etc.)
            // 'code' is the numeric code, and 'status' is the text explanation for the error
            // I usually just output some fancy error messages
        })
        .always( function (xhr, status) {
            // what you want to have happen no matter if the response is success or error
            // here, you would "stop" your loading animations, and maybe output a footer at the end of your content, reading "done"
        });
});

/////////////////////////////////////////////////////////////////////





//////////////////////////// VALIDATIONS FUNCTIONS ////////////////////////////
function validateName(id, error) {
    const errorId = id.toString() + "Error";
    let name = document.forms["registerForm"][id].value;

    if (name === "") {
        $("#" + errorId).text( error);
        return false;
    } else {
        $("#" + errorId).text("");
        return true;
    }
}

function validatePhoneNumber(id) {
    const errorId = id.toString() + "Error";
    let phone = document.forms["registerForm"][id].value;
    const validationRegex = "(0|\\+98)?([ ]|-|[()]){0,2}9[1|2|3|4]([ ]|-|[()]){0,2}(?:[0-9]([ ]|-|[()]){0,2}){8}";
    if (phone === "") {
        $("#" + errorId).text( "فیلد را پر نمایید.");
        return false;
    } else {
        if(!phone.toString().match(validationRegex)){
            $("#" + errorId).text("لطفا شماره را بدرستی وارد نمایید.");
            return false;
        } else {
            $("#" + errorId).text("");
            return true;
        }
    }
}

///////////////////////////////////////////////////////////////////////////////






//////////////////////////// BUTTONS FUNCTIONS ////////////////////////////
function nextSection() {
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
            } else {
                $("#chips" + id).removeClass("selected-chips")
            }
        }
    }


}
function checkSelectedChips(){
    for (let i = 0; i < chipsArray.length; i++){
        $("#chips" + chipsArray[i].toString()).addClass("selected-chips")
    }
}

/////////////////////////////////////////////////////////////////////////////

