# js-library-jaipers5

## Deployment

The landing page of the library can be found at the following link: https://graphify-js.herokuapp.com/

## API Documentation

The library API can be found at the following link: https://graphify-js.herokuapp.com/pages/api.html

## Getting Started

Below is a copy of the Getting Started page which can also be found at the following link: https://graphify-js.herokuapp.com/pages/getting-started.html. Note that the Getting Started page on the website is more complete since it contains live examples of the library to supplement the code snippets. Below, I only include the code snippets.



### Page Setup

To use graphify.js, you must first include it in your page. Assuming the library is stored within the lib/ directory, this can be done by inserting the following inside the head tag of your document:

 ``` 
  <script defer type="text/javascript" src='lib/graphify.js'>  </script>  

  <link rel="stylesheet" type="text/css" href="lib/graphify.css">
```
             
            
Note that this should be inserted before any scripts that depend on it.


### Using the Library

First, start by creating a basic container to hold the graph canvas:

```
<div class='container'> </div>  
        
```
Then, within an external JavaScript file start by selecting the container:

```
let ctx = document.getElementsByClassName("container")[0]  
```

Now, let's create a new graph and add some vertices and edges:

```
let graph = new Graph({}, ctx)
let v0 = new Vertex()
let v1 = new Vertex()
let v2 = new Vertex() 
let v3 = new Vertex()

graph.addVertex(v0)
graph.addVertex(v1)
graph.addVertex(v2)
graph.addVertex(v3)

graph.addEdge(v0, v1)
graph.addEdge(v0, v2)
graph.addEdge(v1, v2)
graph.addEdge(v2, v3)
```

The first parameter to Graph is a config object which allows you to customize properties such as animation speed. For now we keep it empty. Refer to the API to see all the customization options. The examples page also has examples of graphs that use these options. The second parameter to Graph is the graph context we selected earlier.

Lastly, to display the graph call the graph.visualize() method as follows:

```
graph.visualize() 

```

This generates a graph based on the entered parameters. The vertex positions are randomly generated. Refer to the getting-started page on the website to see the visualization of the graph created above.

To run either BFS/DFS on the generated graph: click the corresponding button, choose a starting vertex, then click the execute algorithm button and enjoy the animation! 



### Interactive Mode

This mode enables you to interactively create a directed graph with edge weights. It also gives you the option of running Dijkstra's algorithm in addition to BFS and DFS. This cannot be done with graphs created in the non-interactive mode.

Start by creating a new container like before:

```
 <div class='container'> </div> 
```

Then, create a new graph and pass a config object to it. Note that we set graphBuilder to true to turn on the interactive graph builder mode. We also set the styles.dimensions property which alters the dimensions of the graph container. Refer to the API to see in detail what these properties mean and how to configure them.

```
ctx = document.getElementsByClassName("container")[1]

let graph = new Graph({
    graphBuilder: true,
        styles: {
        dimensions: [100, 400]
        }
}, ctx)

graph.visualize()
                      
```

This creates an interactive window enabling you to create your graph. Refer to the getting-started page on the website to interact with and try out the graph builder yourself. 

</section>

