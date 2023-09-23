$(document).ready(function(){
    $("#api").on('click', function (){
        console.log("api click")
        createManager()
    });
});

let mainURL = "https://localhost:7010/";

function getNames() {
    $.get("https://api.rainviewer.com/public/weather-maps.json", function(data, status){
        alert("Data: " + data["host"] + "\nStatus: " + status);
    });
}

function createManager() {
    console.log($("input[name=managerName]").val())
    console.log($("input[name=managerPosition]").val())
    console.log($("input[name=managerPhoneNumber]").val())

    const name = $("input[name=managerName]").val();
    const position = $("input[name=managerPosition]").val()
    const phone =  $("input[name=managerPhoneNumber]").val()

    $.ajax({
        url: mainURL + "manager/create",
        type: 'post',
        data: JSON.stringify({
            name: name,
            phone: phone,
            isVerify: true,
            position: position
        }),
        headers: {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Credentials": "true",
            "Content-Type": "application/json"
        },
        dataType: 'json',
        success: function (data) {
            console.info(data);
        }
    }).done(function (response) {
        console.log(response);
    }).fail(function (res){
        console.log(res)
    });

}

function registerForm() {
    let managerName = "";
    let managerPosition = "";
    let phoneNumber = "";
    let schoolName = "";
    let schoolGrade = "";
    let studentsGender = "";
    let schoolType = "";
    let isProgrammer = "";
    let programmingLanguage = "";
    let hasProject = "";
    let projectTitle = "";
    let projectExplanation = "";
    let selectedDays = "";
    let uploadedForm = "";
}



// submit is an action performed ON THE FORM ITSELF...
// probably best to give the form an ID attribute and refer to it by that
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
