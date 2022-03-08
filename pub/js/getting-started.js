let links = document.querySelectorAll("#nav a ")

for (let l of links) {
    l.style.borderBottom = ''
}

let clickedLink = document.querySelectorAll("#nav li:nth-child(2) a ")[0]
clickedLink.style.borderBottom = '2px solid black' 


/* Graph 1 */
let ctx = document.getElementsByClassName("container")[0]
let graph = new Graph({
    styles: {
        dimensions: [100, 400]
    }
}, ctx)

let v0 = new Vertex()
let v1 = new Vertex()
let v2 = new Vertex()
let v3 = new Vertex()
//let v4 = new Vertex()

// // make ability to add 3 arbitrary vertices
graph.addVertex(v0)
graph.addVertex(v1)
graph.addVertex(v2)
graph.addVertex(v3)


graph.addEdge(v0, v1)
graph.addEdge(v0, v2)
graph.addEdge(v1, v2)
graph.addEdge(v2, v3)



graph.visualize()




/* Graph 4 */


config = {
    graphBuilder: true,
    styles: {
                 dimensions: [100, 400]
    }
        
}


ctx = document.getElementsByClassName("container")[1]
graph = new Graph(config, ctx)

graph.visualize()





function randomIntFromInterval(min, max) { // min and max included 
    return Math.floor(Math.random() * (max - min + 1) + min)
}



