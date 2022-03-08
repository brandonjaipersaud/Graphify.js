let links = document.querySelectorAll("#nav a ")

for (let l of links) {
    l.style.borderBottom = ''
}

let clickedLink = document.querySelectorAll("#nav li:nth-child(1) a ")[0]
clickedLink.style.borderBottom = '2px solid black' 



config = {
    graphBuilder: true,
    styles: {
             dimensions: [100, 400]
    }

}

ctx = document.getElementsByClassName("container")[0]
graph = new Graph(config, ctx)

graph.visualize()