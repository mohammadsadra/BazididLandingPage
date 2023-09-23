$(document).ready(function () {

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

});

function validateName(id, error) {
    const errorId = id.toString() + "Error";
    let name = document.forms["registerForm"][id].value;

    if (name === "") {
        $("#" + errorId).text( error);
    } else {
        $("#" + errorId).text("");
    }
}

function validatePhoneNumber(id) {
    const errorId = id.toString() + "Error";
    let phone = document.forms["registerForm"][id].value;
    const validationRegex = "(0|\\+98)?([ ]|-|[()]){0,2}9[1|2|3|4]([ ]|-|[()]){0,2}(?:[0-9]([ ]|-|[()]){0,2}){8}";
    if (phone === "") {
        $("#" + errorId).text( "فیلد را پر نمایید.");
    } else {
        $("#" + errorId).text("");
        if(!phone.toString().match(validationRegex)){
            $("#" + errorId).text("لطفا شماره را بدرستی وارد نمایید.");
        } else {
            $("#" + errorId).text("");
        }
    }
}

