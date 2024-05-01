//function Kaputt:((
function UploadImage() {
    var fileInput = document.getElementById("fileInput");
    var file = fileInput.files[0];

    if (file)
    {
        var formData = new formData();
        formData.append("file", file);

        var ajaxReq = new XMLHttpRequest();
        ajaxReq.open("POST", "/MenuImages");

        ajaxReq.onload = function () {

            let p = document.createElement("p");
            if (ajaxReq == 200) {
                let p = document.createElement("p");
                p.style.content = "Image Added";
                p.style.color = "Green";
            }
            else {
                p.style.content = "Could not add file."
                p.style.color = "Red";
            }
        };
        ajaxReq.send(formData);
    }
}