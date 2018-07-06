var btn = document.querySelector('button');
btn.addEventListener('click', function () {
  var value = document.querySelector('input').value;
  ajax(value);
  console.log(value);
}, true);

function ajax(value) {
  var xmlhttp;
  if (window.XMLHttpRequest) {
    xmlhttp = new XMLHttpRequest();
  } else {
    xmlhttp = new ActiveXObject('Microsoft.XMLHTTP');
  }

  xmlhttp.onreadystatechange = function () {
    if (xmlhttp.readyState === 4 && xmlhttp.status === 200) {
      document.querySelector('p').innerHTML = xmlhttp.responseText;
    }
  }

  xmlhttp.open('GET', '/upload?value=' + value, true);
  xmlhttp.send();
}