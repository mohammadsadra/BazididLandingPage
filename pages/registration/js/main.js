// BUTTON VARIABLES
let currentSection = 1;
const statesNumber = 6;

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

    setInterval(function (){
        console.log( $("#genderSelector option:selected").val());
    }, 1000);

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

    $("#isProgrammer").on("change",checkShowingItems);

    // $("input[name=projectName]").on("blur",function(){
    //     validateName("projectName", "فیلد را تکمیل نمایید.");
    // });

    // $("textarea[name=projectDescription]").on("blur",function(){
    //     validateName("projectDescription", "فیلد را تکمیل نمایید.");
    // });

    // $("#hasProject").on("change", checkShowingItems);



    // VALIDATE ON SUBMIT
    $("#submit").on("click", function (){
        // const res0 = $("input[name=rulesCheckbox]").val();
        // if (res0 === ""){
        //     alert("قوانین را مطالعه فرمایید.");
        //     return;
        // }
        // let hasProject = $("#hasProject option:selected").val();

        const res1 = validateName("managerName", "فیلد را تکمیل نمایید.");

        const res2 = validateName("managerPosition", "فیلد را تکمیل نمایید.");

        const res3 = validatePhoneNumber("managerPhoneNumber");

        const res4 = validateName("schoolName", "فیلد را تکمیل نمایید.");

        // const res5 = hasProject === "1" ? validateName("projectName", "فیلد را تکمیل نمایید.") : true;

        // const res6 = hasProject === "1" ? validateName("projectDescription", "فیلد را تکمیل نمایید.") : true;

        const res7 = validateDropDowns();

        const res8 = selectedDays.length >= 1 || selectedDays.length <= 2;

        if(res1 && res2 && res3 && res4 && res7 && res8){
            uploadFile(1)
            uploadFile(2)
            registerForm()
        } else {
            $("#alert").show();
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
const mainURL = "https://bazididapi.hamrah.academy/";
// const mainURL = "https://localhost:7010/";
const header = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Credentials": "true",
    "Content-Type": "application/json"
};

let studentFileId = 0;
let managerFormFileId = 0;

const dataType ='json';

document.getElementById('manager-file-upload').onchange = function () {
    $("#uploadedPDF").text(this.files[0].name);
};
document.getElementById('excel-file-upload').onchange = function () {
    $("#uploadedExcel").text(this.files[0].name);
};
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
            if(fileKind === 1){
                localStorage.setItem("studentFileId", data);
                studentFileId = data;
                console.log(data)
            } else if (fileKind === 2){
                localStorage.setItem("managerFormFileId", data);
                managerFormFileId = data;
                console.log(data)
            }
        }
    }).done(function (response) {
        if(fileKind === 1){
            localStorage.setItem("studentFileId", response);
            studentFileId = response;
            console.log(response)
        } else if (fileKind === 2){
            localStorage.setItem("managerFormFileId", response);
            managerFormFileId = response;
            console.log(response)
        }
        console.log(response);
    }).fail(function (res){
        console.log(res)
    });
}
function registerForm(){
    showLoading()
    let managerName = $("input[name=managerName]").val();
    let managerPosition = $("input[name=managerPosition]").val();
    let phoneNumber = toEnDigit($("input[name=managerPhoneNumber]").val());
    let schoolName = $("input[name=schoolName]").val();
    let schoolGrade = $("#gradeSelector option:selected").val();
    let studentsGender = $("#genderSelector option:selected").val();
    let schoolType = $("#schoolKind option:selected").val();
    let isProgrammer = $("#isProgrammer option:selected").val() === "1";
    let programmingLanguage = $("#programmingLanguage option:selected").val();
    let hasProject = false;
    // let hasProject = $("#hasProject option:selected").val() === "1";
    // let projectTitle = $("input[name=projectName]").val();
    // let projectExplanation = $("textarea[name=projectDescription]").val();

    let month;

    if (selectedMonth === 1 || selectedMonth === "1"){
        month = parseInt(todayArray[1]);
    } else {
        month = parseInt(todayArray[1]) + 1;
    }

    const englishCalendarDay1 =  moment.from(todayArray[0].toString() + '/' + month + '/' + $("#day" + selectedDays[0]).attr("number"), 'fa', 'YYYY/MM/DD').format('YYYY/MM/DD');
    const temp = englishCalendarDay1.toString().split('/')
    let  day1 = new Date(Number(temp[0]), Number(temp[1]) - 1, Number(temp[2]));


    let day2;
    if(selectedDays.length === 2){
        const englishCalendarDay2 =  moment.from(todayArray[0].toString() + '/' + month + '/' + $("#day" + selectedDays[1]).attr("number"), 'fa', 'YYYY/MM/DD').format('YYYY/MM/DD');
        const temp = englishCalendarDay2.toString().split('/')
        day2 = new Date(Number(temp[0]), Number(temp[1]) - 1, Number(temp[2]));
    } else {
        day2 = null;
    }

    const managerFile = Number(localStorage.getItem("managerFormFileId"))
    const studentListFile = Number(localStorage.getItem("studentFileId"))
    console.log(localStorage.getItem("managerFormFileId"))
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
                reservationSelectedDays: {
                    FirstDay: day1.toISOString(),
                    SecondDay: day2 === null ? null : day2.toISOString()
                },
                managerFormFileId: managerFile,
                studentListFileId: studentListFile,
                hasProject: hasProject,
                projectCreationDto: {}
            // projectCreationDto: hasProject ? {
            //         projectName: projectTitle,
            //         description: projectExplanation
            //     } : {}
        }),
        headers: header,
        dataType: dataType,
        success: function (data) {
            window.location.href = "https://bazididapi.hamrah.academy/pages/registration/succeedRegistration.html";
            console.info(data);
        }
    }).done(function (response) {
        console.log(response);

    }).fail(function (res){
        console.log(res);
        // localStorage.clear();
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
    let phone = toEnDigit(document.forms["registerForm"][id].value);
    const validationRegex = "(0|\\+98)?([ ]|-|[()]){0,2}9[1|2|3|4]([ ]|-|[()]){0,2}(?:[0-9]([ ]|-|[()]){0,2}){8}";
    if (phone === "") {
        $("#" + errorId).text( "فیلد را تکمیل نمایید.");
        return false;
    } else {
        console.log(phone)
        if(!phone.toString().match(validationRegex)){
            $("#" + errorId).text("لطفا شماره را بدرستی وارد نمایید.");
            return false;
        } else {
            $("#" + errorId).text("");
            return true;
        }
    }
}
function toEnDigit(s) {
    return s.replace(/[\u0660-\u0669\u06f0-\u06f9]/g,    // Detect all Persian/Arabic Digit in range of their Unicode with a global RegEx character set
        function(a) { return a.charCodeAt(0) & 0xf }     // Remove the Unicode base(2) range that not match
    )
}
function validateDropDowns(){
    // const hasProject = $("#hasProject option:selected").val() === "-1";
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

    // if (hasProject) {
    //     $("#hasProjectError").text( "یک گزینه را انتخاب نمایید.");
    // } else {
    //     $("#hasProjectError").text( "");
    // }

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

    return !isProgrammer && !genderSelector && !gradeSelector && !schoolKind && programmingLanguage;
    // return !hasProject && !isProgrammer && !genderSelector && !gradeSelector && !schoolKind && programmingLanguage;

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

// function hideProjectMenu(){
//     $("#showProjectNameBox").hide();
//     $("#showProjectDescriptionBox").hide();
// }
//
// function showProjectMenu(){
//     $("#showProjectNameBox").show();
//     $("#showProjectDescriptionBox").show();
// }
function hideProgrammingMenu(){
    $("#showProgrammingLanguageBox").hide();
}

function showProgrammingMenu(){
    $("#showProgrammingLanguageBox").show();
}

function checkShowingItems() {
    // let hasProject = $("#hasProject option:selected").val();
    let isProgrammer = $("#isProgrammer option:selected").val();

    // if (hasProject === "1"){
    //    showProjectMenu();
    // } else {
    //     hideProjectMenu();
    // }
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
        $("#day" + i.toString()).removeClass('last-days');
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
            if (holidays[month.toString()][todayArray[0] + '/' + month.toString() +'/' + (i+1).toString()]){
                $("#day" + dayOfTable.toString()).addClass('holiday');
                $("#day" + dayOfTable.toString()).attr({
                    "title" : "تعطیل"
                });
                $("#day" + dayOfTable.toString()).prop("onclick", null).off("click");
            }
        }
        $("#day" + dayOfTable.toString()).removeClass('hide');
        $("#day" + dayOfTable.toString()).text((i + 1).toString().toIndiaDigits());
        $("#day" + dayOfTable.toString()).attr({
            "number" : (i + 1).toString()
        });
        if(i < (parseInt( todayArray[2]) + 7) && selectedMonth.toString() === "1") {
            $("#day" + dayOfTable.toString()).addClass('last-days');
            $("#day" + dayOfTable.toString()).prop("onclick", null).off("click");
        }

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
    dayFillNumbers(selectedMonth === "1" ? parseInt(todayArray[1]) :parseInt(todayArray[1])+1 , selectedMonth === "1" ? firstMonth : secondMonth);
}




function selectDay(i){
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
