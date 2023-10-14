
// BUTTON VARIABLES
let currentSection = 1;
let selectedChips = 0;
const statesNumber = 6;
const chipsArray = Array(false, false, false, false);


$(document).ready(function () {
    hideLoading();

    // BUTTONS ASSIGN
    for (let i = 1; i <= statesNumber; i++) {
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

    $('input[name=rulesCheckbox]').click(function() {
        if ( $("input[name=rulesCheckbox]").attr('value')) {
            $('input[name=rulesCheckbox]').attr('value', '');
        } else {
            $('input[name=rulesCheckbox]').attr('value', 'checked');
        }
    });
    checkVisibility();

    // VALIDATION ON FILING INPUTS
    $("input[name=managerName]").on("blur",function(){
        validateName("managerName", "فیلد را تکمیل نمایید.");
    });

    $("input[name=managerPosition]").on("blur",function(){
        validateName("managerPosition", "فیلد را تکمیل نمایید.");
    });

    $("input[name=managerPhoneNumber]").on("blur",function(){
        validatePhoneNumber("managerPhoneNumber");
    });

    $("input[name=schoolName]").on("blur",function(){
        validateName("schoolName", "فیلد را تکمیل نمایید.");
    });

    $("input[name=projectName]").on("blur",function(){
        validateName("projectName", "فیلد را تکمیل نمایید.");
    });

    $("textarea[name=projectDescription]").on("blur",function(){
        validateName("projectDescription", "فیلد را تکمیل نمایید.");
    });


    // VALIDATE ON SUBMIT
    $("#submit").on("click", function (){
        const res0 = $("input[name=rulesCheckbox]").val();
        if (res0 === ""){
            alert("قوانین را مطالعه فرمایید.");
            return;
        }
        const res1 = validateName("managerName", "فیلد را تکمیل نمایید.");

        const res2 = validateName("managerPosition", "فیلد را تکمیل نمایید.");

        const res3 = validatePhoneNumber("managerPhoneNumber");

        const res4 = validateName("schoolName", "فیلد را تکمیل نمایید.");

        const res5 = validateName("projectName", "فیلد را تکمیل نمایید.");

        const res6 = validateName("projectDescription", "فیلد را تکمیل نمایید.");

        if(res1 && res2 && res3 && res4 && res5 && res6){
            uploadFile(1)
            uploadFile(2)
            registerForm()
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

var studentFileId = 0;
var managerFormFileId = 0;

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

function uploadFile(fileKind){

    let formData = new FormData();
    var file;

    if(fileKind === 1){
        formData.append("FilePathType", "3");
        file = $("#excel-file-upload").prop('files')[0];
    } else if (fileKind === 2){
        formData.append("FilePathType", "1");
        file = $("#manager-file-upload").prop('files')[0];
    }

    formData.append("FileKind", fileKind);
    formData.append("FileDetails", file);

    $.ajax({
        url: mainURL + "files/PostSingleFile",
        type: 'post',
        data: formData,
        contentType: false, // Not to set any content header
        processData: false,
        success: function (data) {
            console.info(data);
        }
    }).done(function (response) {
        if(fileKind === 1){
            studentFileId = response;
        } else if (fileKind === 2){
            managerFormFileId = response;
        }
        console.log(response);
    }).fail(function (res){
        console.log(res)
    }).always(function (){
        console.log("UPLOADING FILE ALWAYS!");
    });
}
function registerForm(){
    showLoading()
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

    let uploadedForm = $("input[name=managerPhoneNumber]").val();

    $.ajax({
        url: mainURL + "registrationForm/createFullForm",
        type: 'post',
        data: JSON.stringify({
                managerCreationDto: {
                    name: managerName,
                    phone: phoneNumber,
                    isVerify: true,
                    position: managerPosition
                },
                schoolCreationDto: {
                    name: schoolName,
                    schoolType: schoolType,
                    gender: studentsGender
                },
                schoolClassCreationDto: {
                    grade: schoolGrade,
                    isProgrammer: isProgrammer,
                    programmingLanguage: isProgrammer ? programmingLanguage : -1,
                },
                eventDaysCreationDto: {
                    saturday: false,
                    sunday: chipsArray[0],
                    monday: chipsArray[1],
                    tuesday: chipsArray[2],
                    wednesday: chipsArray[3],
                    thursday: false,
                    friday: false
                },
                managerFormId: managerFormFileId,
                studentListFileId: studentFileId,
                hasProject: hasProject,
                projectCreationDto: hasProject ? {
                    projectName: projectTitle,
                    description: projectExplanation
                } : {}
        }),
        headers: header,
        dataType: dataType,
        success: function (data) {
            console.info(data);
        }
    }).done(function (response) {
        console.log(response);
    }).fail(function (res){
        console.log(res)
    }).always(
            () => hideLoading()
    );

}

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
        $("#" + errorId).text( "فیلد را تکمیل نمایید.");
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
    for (let i = 1; i <= statesNumber; i++) {
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
    for (let i = 1; i <= statesNumber; i++) {
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
    if(currentSection !== statesNumber){
        $(".next-btn").show();
        $("#submit").hide();
    }
    if(currentSection === statesNumber){
        $(".next-btn").hide();
        $("#submit").show();
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

//////////////////////////// LOADING FUNCTIONS ////////////////////////////

function hideLoading(){
    $("#loading").hide()
    $("#loading-background").hide()

}

function showLoading(){
    $("#loading").show()
    $("#loading-background").show()

}

/////////////////////////////////////////////////////////////////////////////
