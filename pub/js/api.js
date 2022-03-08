let links = document.querySelectorAll("#nav a ")

for (let l of links) {
    l.style.borderBottom = ''
}

let clickedLink = document.querySelectorAll("#nav li:nth-child(4) a ")[0]
clickedLink.style.borderBottom = '2px solid black' 