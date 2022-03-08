let links = document.querySelectorAll("#nav a ")

for (let l of links) {
    l.style.borderBottom = ''
}

let clickedLink = document.querySelectorAll("#nav li:nth-child(3) a ")[0]
clickedLink.style.borderBottom = '2px solid black' 


let config = null

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
let v4 = new Vertex()


graph.addVertex(v0)
graph.addVertex(v1)
graph.addVertex(v2)
graph.addVertex(v3)
graph.addVertex(v4)


graph.addEdge(v0, v1)
graph.addEdge(v0, v2)
graph.addEdge(v1, v2)
graph.addEdge(v1, v3)
graph.addEdge(v3, v4)

graph.setDFSSpeed('fast')


graph.visualize()



/* Graph 2 */
ctx = document.getElementsByClassName("container")[1]
graph = new Graph({
    directed: true,
    styles: {
        dimensions: [100, 500]
    }
}, ctx)

v0 = new Vertex()
v1 = new Vertex()
v2 = new Vertex()
v3 = new Vertex()
v4 = new Vertex()


graph.addVertex(v0)
graph.addVertex(v1)
graph.addVertex(v2)
graph.addVertex(v3)
graph.addVertex(v4)


graph.addEdge(v0, v1)
graph.addEdge(v0, v2)
graph.addEdge(v1, v2)
graph.addEdge(v1, v3)
graph.addEdge(v3, v4)

graph.setDFSSpeed('fast')


graph.visualize()




config = {
    graphBuilder: true,
    styles: {
             dimensions: [100, 400]
    }

}

ctx = document.getElementsByClassName("container")[2]
graph = new Graph(config, ctx)
graph.setDijkstraSpeed('slow')

graph.visualize()



/* Graph 4 */
ctx = document.getElementsByClassName("container")[3]
graph = new Graph({
    autoGenerate: true,
    styles: {
        dimensions: [100, 500]
    }
}, ctx) 

graph.visualize()







