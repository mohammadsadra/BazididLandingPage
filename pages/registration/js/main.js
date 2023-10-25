// BUTTON VARIABLES
let currentSection = 6;
const statesNumber = 7;
const chipsArray = Array(false, false, false, false);

// MONTH SELECTOR VARIABLE
let today = moment().locale('fa').format('YYYY/M/D');
let todayArray = today.split("/");
let monthLength= {1:31, 2:31, 3:31, 4:31, 5:31, 6:31, 7:30, 8:30, 9:30, 10:30, 11:30, 12:29}
let firstMonth = {}
let secondMonth = {}
let holidays;
let selectedDays = []

let selectedMonth = 1

String.prototype.toIndiaDigits= function(){
    var id= ['۰','۱','۲','۳','۴','۵','۶','۷','۸','۹'];
    return this.replace(/[0-9]/g, function(w){
        return id[+w]
    });
}

$(document).ready(function () {
    $("#alert").hide();
    $("#close-alert").on("click", function (){
        $("#alert").hide();
    });

    hideLoading();
    openModal();
    checkShowingItems();
    monthFillNames();

    readjson().then(r => {
        console.log(holidays["8"]);
        dayFillNumbers(todayArray[1], firstMonth);
    });


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
    $("#isProgrammer").on("change",checkShowingItems);
    $("#hasProject").on("change", checkShowingItems);



    // VALIDATE ON SUBMIT
    $("#submit").on("click", function (){
        // const res0 = $("input[name=rulesCheckbox]").val();
        // if (res0 === ""){
        //     alert("قوانین را مطالعه فرمایید.");
        //     return;
        // }
        let hasProject = $("#hasProject option:selected").val();

        const res1 = validateName("managerName", "فیلد را تکمیل نمایید.");

        const res2 = validateName("managerPosition", "فیلد را تکمیل نمایید.");

        const res3 = validatePhoneNumber("managerPhoneNumber");

        const res4 = validateName("schoolName", "فیلد را تکمیل نمایید.");

        const res5 = hasProject === "1" ? validateName("projectName", "فیلد را تکمیل نمایید.") : true;

        const res6 = hasProject === "1" ? validateName("projectDescription", "فیلد را تکمیل نمایید.") : true;

        const res7 = validateDropDowns();



        if(res1 && res2 && res3 && res4 && res5 && res6 && res7){
            uploadFile(1)
            uploadFile(2)
            registerForm()
        } else {
            $("#alert").show();
            // alert("مقادیر را بدرستی وارد نمایید.");
        }
    });

    //
    $("#month" + selectedMonth).addClass("selected-chips")
    $("#month1").on("click", function (){
        selectMonth("1")
    })
    $("#month2").on("click", function (){
        selectMonth("2")
    })
});

//////////////////////////// API SECTION ////////////////////////////
const mainURL = "https://localhost:7010/";
const header = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Credentials": "true",
    "Content-Type": "application/json"
};

let studentFileId = 0;
let managerFormFileId = 0;

const dataType ='json';

function uploadFile(fileKind){

    let formData = new FormData();
    let file;

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
    let schoolGrade = $("#gradeSelector option:selected").val();
    let studentsGender = $("#genderSelector option:selected").val();
    let schoolType = $("#schoolKind option:selected").val();
    let isProgrammer = $("#isProgrammer option:selected").val() === "1";
    let programmingLanguage = $("#programmingLanguage option:selected").val();
    let hasProject = $("#hasProject option:selected").val() === "1";
    let projectTitle = $("input[name=projectName]").val();
    let projectExplanation = $("textarea[name=projectDescription]").val();

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

function validateDropDowns(){
    const hasProject = $("#hasProject option:selected").val() === "-1";
    const isProgrammer = $("#isProgrammer option:selected").val() === "-1";
    const genderSelector = $("#genderSelector option:selected").val() === "-1";
    const gradeSelector = $("#gradeSelector option:selected").val() === "-1";
    const schoolKind = $("#schoolKind option:selected").val() === "-1";
    let programmingLanguage;
    if ($("#programmingLanguage option:selected").val() === "-1"){
        programmingLanguage = $("#isProgrammer option:selected").val() !== "1";
    } else {
        programmingLanguage = true;
    }

    if (hasProject) {
        $("#hasProjectError").text( "یک گزینه را انتخاب نمایید.");
    } else {
        $("#hasProjectError").text( "");
    }

    if (isProgrammer) {
        $("#isProgrammerError").text( "یک گزینه را انتخاب نمایید.");
    } else {
        $("#isProgrammerError").text( "");
    }

    if (genderSelector) {
        $("#genderSelectorError").text( "یک گزینه را انتخاب نمایید.");
    } else {
        $("#genderSelectorError").text( "");
    }

    if (gradeSelector) {
        $("#gradeSelectorError").text( "یک گزینه را انتخاب نمایید.");
    } else {
        $("#gradeSelectorError").text( "");
    }

    if (schoolKind) {
        $("#schoolKindError").text( "یک گزینه را انتخاب نمایید.");
    } else {
        $("#schoolKindError").text( "");
    }

    if (!programmingLanguage) {
        $("#programmingLanguageError").text( "یک گزینه را انتخاب نمایید.");
    } else {
        $("#programmingLanguageError").text( "");
    }

    return !hasProject && !isProgrammer && !genderSelector && !gradeSelector && !schoolKind && programmingLanguage;

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

//////////////////////////// MENU FUNCTIONS ////////////////////////////

function hideProjectMenu(){
    $("#showProjectNameBox").hide();
    $("#showProjectDescriptionBox").hide();
}

function showProjectMenu(){
    $("#showProjectNameBox").show();
    $("#showProjectDescriptionBox").show();
}
function hideProgrammingMenu(){
    $("#showProgrammingLanguageBox").hide();
}

function showProgrammingMenu(){
    $("#showProgrammingLanguageBox").show();
}

function checkShowingItems() {
    let hasProject = $("#hasProject option:selected").val();
    let isProgrammer = $("#isProgrammer option:selected").val();

    if (hasProject === "1"){
       showProjectMenu();
    } else {
        hideProjectMenu();
    }
    if (isProgrammer === "1"){
        showProgrammingMenu();
    } else {
        hideProgrammingMenu();
    }

}

/////////////////////////////////////////////////////////////////////////////

//////////////////////////// MODAL FUNCTIONS ////////////////////////////

// Get the modal
let modal = document.getElementById("myModal");

// Get the button that opens the modal
let btn = document.getElementById("myBtn");

// Get the <span> element that closes the modal
let span = document.getElementsByClassName("close")[0];

// When the user clicks the button, open the modal
function openModal() {
    modal.style.display = "block";
}

// When the user clicks on <span> (x), close the modal
span.onclick = function() {
    modal.style.display = "none";
}

// When the user clicks anywhere outside the modal, close it
window.onclick = function(event) {
    if (event.target === modal) {
        modal.style.display = "none";
    }
}
/////////////////////////////////////////////////////////////////////////////

//////////////////////////// MODAL FUNCTIONS ////////////////////////////
function monthFillNames(){
    $("#month1").text(moment().locale('fa').month(parseInt(todayArray[1]) - 1).format('MMMM'));
    $("#month2").text(moment().locale('fa').month(parseInt(todayArray[1])).format('MMMM'));
}

function dayFillNumbers(month, monthDictionary){
    selectedDays = []
    for (let i = 1; i < 36; i++){
        $("#day" + i.toString()).addClass('hide');
        $("#day" + i.toString()).removeClass('holiday');
        $("#day" + i.toString()).removeAttr("title");
        $("#day" + i.toString()).prop("onclick", null).off("click");
        $("#day" + i.toString()).on("click",function (){
            selectDay(i)
        });
        $("#day" + i).removeClass("selected-chips");
    }
    const firstDayCompleteFormat = todayArray[0]+ '/' + month + '/1';
    const firstDayOfMonth = moment(firstDayCompleteFormat, 'jYYYY/jMM/jDD').locale('fa').format('e');
    let tempDay = firstDayOfMonth;
    let dayOfTable = parseInt(firstDayOfMonth) + 1;
    for (let i = 0; i < monthLength[month]; i++){
        monthDictionary[i + 1] = tempDay;
        if ( dayOfTable !== 0 && dayOfTable !== 5 && dayOfTable !== 6 ){
            console.log()
            if (holidays[month.toString()][todayArray[0] + '/' + month.toString() +'/' + (i+1).toString()]){
                $("#day" + dayOfTable.toString()).addClass('holiday');
                $("#day" + dayOfTable.toString()).attr({
                    "title" : "تعطیل"
                });
            }
        }
        $("#day" + dayOfTable.toString()).removeClass('hide');
        $("#day" + dayOfTable.toString()).text((i + 1).toString().toIndiaDigits());
        $("#day" + dayOfTable.toString()).attr({
            "number" : i + 1
        });

        if (tempDay.toString() === "6"){
            tempDay = 0;
        } else{
            tempDay++;
        }
        dayOfTable++;
    }
}

function selectMonth(monthNumber){
    $("#month" + selectedMonth).removeClass("selected-chips");
    selectedMonth = monthNumber;

    $("#month" + selectedMonth).addClass("selected-chips");
    dayFillNumbers(selectedMonth === "1" ? todayArray[1] :parseInt(todayArray[1])+1 , selectedMonth === "1" ? firstMonth : secondMonth);
}




function selectDay(i){
    console.log("click")
    if (include(selectedDays, i)) {
        const index = selectedDays.indexOf(i);
        if (index > -1) {
            selectedDays.splice(index, 1);
            $("#day" + i).removeClass("selected-chips");
        }

    } else{
        if (selectedDays.length < 2) {
            $("#day" + i).addClass("selected-chips");
            selectedDays.push(i);
        }
    }
}

/////////////////////////////////////////////////////////////////////////

//////////////////////////// JSON FUNCTIONS ////////////////////////////
async function readjson() {
     await fetch("./json/holidays.json")
        .then((res) => {
            return res.json();
        })
        .then((data) => {
            holidays = data;
            // console.log(holidays)
        });
}
/////////////////////////////////////////////////////////////////////////

function include(arr,obj) {
    return (arr.indexOf(obj) !== -1);
}
