
; // always need semicolon before IIFE

(function (global, document) { 

    const state = ["nothing clicked", "algorithm clicked", "execute algorithm,"]
    const algorithms = ["none", "bfs", "dfs", "dijkstra"]
    class Graph {
        constructor(config={styles: {}}, ctx) {

            if (!config.styles) {
                config.styles = {}
            }

            const {
                edgeColor="black",
                size="medium",
                dimensions=[60,300],
                vertexDistance=50
            } = config.styles

            const styles = {
                edgeColor: edgeColor,
                size: size,
                dimensions: dimensions, 
                vertexDistance: vertexDistance
            }


            // default configurations
            const {directed=false, showEdgeWeights=false, vertices=[], 
                    type="none", vertexDisplay="none", graphBuilder=false,
                    bfsSpeed='medium', dfsSpeed='medium', dijkstraSpeed='medium',
                    autoGenerate=false, numVertices=4, numEdges=5 } = config
            this.directed = directed 
            this.showEdgeWeights = showEdgeWeights 
            this.vertices = vertices // array of vertex objects
            this.type = type // tree, DAG, ...
            this.styles = styles 
            this.vertexDisplay = vertexDisplay // none, name, degree

            this.autoGenerate = autoGenerate
            this.numVertices = numVertices
            this.numEdges = numEdges

            this.graphBuilder = graphBuilder
            this.bfsSpeed = bfsSpeed
            this.dfsSpeed = dfsSpeed
            this.dijkstraSpeed = dijkstraSpeed
            

            this.vertexCounter = 0 // inc every time a vertex is added
            this.edgeCounter = 0 // inc every time a vertex is added

            let libContainer = document.createElement("div")
            ctx.appendChild(libContainer)

            let toolBar = document.createElement("div")
            toolBar.classList.add("toolBar")
            
            ctx.appendChild(toolBar)

        
            this.ctx = ctx
            this.libContainer = libContainer
            this.toolBar = toolBar

        

            const containerBoundary = this.libContainer.getBoundingClientRect()
            this.width = (this.styles.dimensions[0] / 100) * containerBoundary.width
            this.height = this.styles.dimensions[1]


            this.state = state[0]
            this.selectedAlgorithm = algorithms[0]
            this.selectedVertex = null



            // graph builder state

            this.clickedVertex1 = null 
            this.clickedVertex2 = null

            if (this.graphBuilder) {
                this.directed = true
            }

            this.edges = []
            this.curEdge = null
            this.buildComplete = null



            if (this.autoGenerate) {
                this.autoGenerateVerticesAndEdges()
            }
            

        }

        autoGenerateVerticesAndEdges() {

            let numVertices = this.numVertices
            let numEdges = this.numEdges
            let edges = []

            
            for (let i = 0; i < numVertices; i++) {
                let v = new Vertex()
                this.addVertex(v, false)
            }

            for (let i = 0; i < numEdges; i++) {
                let found = false 
                while (!found) {
                    let e1 = randomIntFromInterval(0, numVertices-1)
                    let e2 = randomIntFromInterval(0, numVertices-1)
                    if (e1 != e2) {
                        let flag = true
                        for (let edge of edges) {
                            if (edge[0] == e1 && edge[1] == e2 || edge[0] == e2 && edge[1] == e1) { 
                                flag = false
                                break
                            }
                        }
                        if (flag) {
                            edges.push([e1,e2])
                            this.addEdge(this.vertices[e1], this.vertices[e2], {})
                            found = true
                        }
                    }
                    
                }
                
            }


        }


        setBFSSpeed(speed) {
            this.bfsSpeed = speed
        }
        setDFSSpeed(speed) {
            this.dfsSpeed = speed
        }
        setDijkstraSpeed(speed) {
            this.dijkstraSpeed = speed
        }

        addVertex(vertex, isBuilder) {
            if (vertex.name === "") {
                vertex.name = "v"+this.vertexCounter
            }
            this.vertices.push(vertex)
            this.vertexCounter += 1

            if (isBuilder) {
                vertex.styles.radius = 20 // not using % for builder
            }
        }

        removeVertex(vertex) {

            for (const v of this.vertices) {
                if (this.directed) {
                
                    if (v === vertex) {
                        const adjacencyList = v.adjacencyList
                        for (const neighbourObject of adjacencyList) {
                            if (neighbourObject.vertex === v) {
                                const neighbourIndex = adjacencyList.indexOf(neighbourObject)
                                adjacencyList.splice(neighbourIndex, 1)
                                v.degree -= 1
                            }
                        }


                    }

                } else {

                    const adjacencyList = v.adjacencyList
                    for (const neighbourObject of adjacencyList) {
                        if (neighbourObject.vertex === v) {
                            const neighbourIndex = adjacencyList.indexOf(neighbourObject)
                            adjacencyList.splice(neighbourIndex, 1)
                            v.degree -= 1
                        }
                    }

                }
                
            }

            const removeVertex = this.vertices.filter(vertexObject => {
                vertexObject.vertex !== vertex 
            })

            this.vertices = removeVertex

        }

        
        addEdge(v1, v2, config={}) {

            let oldEdgeCounter = null



            const defaultStyles = {
                color: "black"
            }
            config.edgeWeight = config.edgeWeight ? config.edgeWeight : 1
            config.defaultStyles =  config.defaultStyles ? config.defaultStyles : defaultStyles
            config.name = this.edgeCounter

            oldEdgeCounter = config.name

            
            const v1AdjacencyList = v1.adjacencyList // array of edge objects
            const v2AdjacencyList = v2.adjacencyList // array of edge objects
            
            const v1EdgeObject = {
                vertex: v2,
                config: config
            }
            

            v1AdjacencyList.push(v1EdgeObject)
            v1.degree += 1

            this.edgeCounter += 1

            if (!this.directed) {
                const newConfig = {}
                newConfig.edgeWeight = config.edgeWeight
                newConfig.defaultStyles = config.defaultStyles
                newConfig.name = this.edgeCounter

                const v2EdgeObject = {
                    vertex: v1,
                    config: newConfig
                }
            
                v2AdjacencyList.push(v2EdgeObject)
                v2.degree += 1
                this.edgeCounter += 1
            }

            return oldEdgeCounter

            

        }

        removeEdge(v1, v2, edgeWeight=1) {

            const v1AdjacencyList = v1.adjacencyList
            
            for (let i = 0; i < v1AdjacencyList.length; i++) {
                const edgeObject = v1AdjacencyList[i]
                if (edgeObject.vertex === v2 && edgeObject.config.edgeWeight === edgeWeight) {
                    v1AdjacencyList.splice(i,1)
                    break
                }
            }

            v1.degree -= 1

            if (!this.directed) {
                const v2AdjacencyList = v2.adjacencyList
                for (let i = 0; i < v2AdjacencyList.length; i++) {
                    const edgeObject = v2AdjacencyList[i]
                    if (edgeObject.vertex === v1 && edgeObject.config.edgeWeight === edgeWeight) {
                        v2AdjacencyList.splice(i,1)
                        v2.degree -= 1
                        break
                    }
                }
            } 

        }

        injectButtons(divContainer) {


            const toolBar = divContainer.getElementsByClassName("toolBar")[0]

            let selectAlgText = document.createElement("p")
            selectAlgText.textContent = "Select an algorithm to animate:"
            selectAlgText.classList.add("state0Text")
            toolBar.appendChild(selectAlgText)

            const btnGroup = document.createElement("div")
            btnGroup.classList.add("btnGroup")

            
            const btn = document.createElement("button")
            btn.appendChild(document.createTextNode('BFS'))
            btn.classList.add("bfsBtn")
            btn.addEventListener('click', (e) => {

                this.selectedAlgorithm = algorithms[1]
                algBtnEventHandler(this, e, divContainer)
            })
            btnGroup.appendChild(btn)

            const dfsBtn = document.createElement("button")
            dfsBtn.appendChild(document.createTextNode('DFS'))
            dfsBtn.classList.add("dfsBtn")
            dfsBtn.addEventListener('click', (e) => {
                this.selectedAlgorithm = algorithms[2]
                algBtnEventHandler(this, e, divContainer)
                
            
            })
            btnGroup.appendChild(dfsBtn)

            if (this.graphBuilder) {

                const dijkstraBtn = document.createElement("button")
                dijkstraBtn.appendChild(document.createTextNode('Dijkstra'))
                dijkstraBtn.classList.add("dijkstraBtn")
                dijkstraBtn.addEventListener('click', (e) => {
                    this.selectedAlgorithm = algorithms[3]

                    algBtnEventHandler(this, e, divContainer)
                })
                btnGroup.appendChild(dijkstraBtn)
            }

            toolBar.appendChild(btnGroup)

        }


        buildGraph() {

            // setup svg container
            const divContainer = this.libContainer
            const toolBar = this.toolBar
            divContainer.style.height = `${this.styles.dimensions[1]}px`

            
            const svgContainer = document.createElementNS("http://www.w3.org/2000/svg", "svg")

            // taken from: http://thenewcode.com/1068/Making-Arrows-in-SVG
            const arrowheadString = `<defs>
                                                <marker id="arrowhead" markerWidth="10" markerHeight="7" 
                                                refX="0" refY="3.5" orient="auto">
                                                <polygon points="0 0, 10 3.5, 0 7" />
                                                </marker>
                                        </defs>`
            svgContainer.insertAdjacentHTML('afterbegin', arrowheadString)

            svgContainer.setAttributeNS("http://www.w3.org/2000/xmlns/", "xmlns:xlink", "http://www.w3.org/1999/xlink");
            
            svgContainer.setAttribute("width", `${this.styles.dimensions[0]}%`)
            svgContainer.setAttribute("height", "80%")
            svgContainer.style.backgroundColor = '#d3d3d326'


            // allow user to draw vertices and directed edges

            let drawVertices = document.createElement("p")
            drawVertices.textContent = "Click above to place vertices. Click done when finished"
            toolBar.appendChild(drawVertices)

            let state = 'vertex'

            svgContainer.addEventListener('click', (e) => {

                if (state === 'vertex') {
                    userDrawVertex(this, svgContainer, e)
                }

                if (state === 'edge') {
                    userDrawEdges(this, svgContainer, e)
                }

                if (state === 'edgeWeights') {
                    //userDrawEdgeWeights(this, svgContainer, e)
                    ;
                }
            
            })

            

            let finishButton = document.createElement("button")
            finishButton.appendChild(document.createTextNode('Done'))
            finishButton.classList.add("finishButton")
            finishButton.addEventListener('click', (e) => {

                if (state === 'vertex'){
                    drawVertices.textContent = "Click two vertices to place a directed edge between them"
                    state = 'edge'
                } else if (state === 'edge') { // finished adding edges
                    state = 'edgeWeights'
                    
                    // DOM manipulation

                    let vertices = this.vertices 
                    

                    for (let v of vertices) {
                        for (let u of v.adjacencyList) { // edge object (modify to add weight)
                            this.edges.push([v, u])
                        } 
                    }

                    this.curEdge = this.edges.pop()
        

                    // collect edge weight
                    let textInput = document.createElement("input")
                    textInput.type= 'text'
                

                    drawVertices.textContent = `Add edge weight for (${this.curEdge[0].name}, ${this.curEdge[1].vertex.name}): `
                    drawVertices.style.display = 'inline'
                    finishButton.innerText = 'Add'

                    drawVertices.parentNode.insertBefore(textInput, drawVertices.nextSibling)

                } else if (state === 'edgeWeights') {

                    // get weight from text input and insert into svg
                    let inputEle = this.ctx.querySelectorAll("input")[0]
                    let weight = parseInt(inputEle.value) // weight of this.curEdge
                    this.curEdge[1].config.edgeWeight = weight

                    // add edge weight to DOM

                    let v = this.curEdge[0]
                    let u = this.curEdge[1].vertex

                    let [midX, midY] = midPoint(v.styles.position[0], v.styles.position[1], u.styles.position[0], u.styles.position[1])
                    const drawWeight = document.createElementNS("http://www.w3.org/2000/svg", "text")
                    const textNode = document.createTextNode(`${weight}`);
                
                    drawWeight.appendChild(textNode);
                    midY-=3
                    drawWeight.setAttribute("x", `${midX}`)
                    drawWeight.setAttribute("y", `${midY}`)

                    svgContainer.appendChild(drawWeight)

                    inputEle.value = ""

                    this.curEdge = this.edges.pop()
                    if (this.curEdge) {
                        drawVertices.textContent = `Add edge weight for (${this.curEdge[0].name}, ${this.curEdge[1].vertex.name}): `
                    } else {
                        let hideInput = this.ctx.querySelectorAll('input')[0]
                        let addBtn = this.ctx.querySelectorAll('button')[0]
                        drawVertices.style.display = 'None'
                        hideInput.style.display = 'None'
                        addBtn.style.display = 'None'

                        this.injectButtons(this.ctx)
                        this.buildComplete = true

                    }
                    
                } else {
                    console.log('error')
                }


            })

            divContainer.appendChild(svgContainer)
            toolBar.appendChild(finishButton)

        }

        // inject into the DOM
        visualize(config={}) {  
        

            if (this.graphBuilder) {
                this.buildGraph()
            } else {
            
                
                const divContainer = this.libContainer
                divContainer.style.height = `${this.styles.dimensions[1]}px`

                

                // dom manipulation
                const svgContainer = document.createElementNS("http://www.w3.org/2000/svg", "svg")

                if (this.directed) {
                    // taken from: http://thenewcode.com/1068/Making-Arrows-in-SVG
                    const arrowheadString = `<defs>
                                                    <marker id="arrowhead" markerWidth="10" markerHeight="7" 
                                                    refX="0" refY="3.5" orient="auto">
                                                    <polygon points="0 0, 10 3.5, 0 7" />
                                                    </marker>
                                            </defs>`
                    svgContainer.insertAdjacentHTML('afterbegin', arrowheadString)
                    
                }
                
                

                svgContainer.setAttributeNS("http://www.w3.org/2000/xmlns/", "xmlns:xlink", "http://www.w3.org/1999/xlink");
                // svgContainer.setAttribute("viewBox", `0 0 ${this.styles.dimensions[0]} ${this.styles.dimensions[1]} `)
                svgContainer.setAttribute("width", `${this.styles.dimensions[0]}%`)
                svgContainer.setAttribute("height", "80%")
                svgContainer.style.backgroundColor = '#d3d3d326'
                
                this.drawVertices(svgContainer)
                this.drawEdges(svgContainer)

                divContainer.appendChild(svgContainer)
                

                this.injectButtons(this.ctx)

            }


        }

        drawVertices(svgContainer) {
            //for (let i = 0; i < this.vertices.length; i++) {

            for (let i = 0; i < this.vertices.length; i++) {
                
                const vertexObject = this.vertices[i]
                const drawVertex = document.createElementNS("http://www.w3.org/2000/svg", "circle")
                drawVertex.setAttribute("class", "vertex")
            
                // determine where to put vertex in the container
                let xPos, yPos = 0
                const containerSize = [this.styles.dimensions[0], this.styles.dimensions[1]]

                if (i == 0) {
                    xPos = 50
                    yPos = 50

                } else {
                    //const lower = vertexObject.styles.radius+2
                    //const upper = 96;
                    const lower = vertexObject.styles.radius+10
                    const upper = 96;
                    [xPos, yPos] = this.findRandomPosition(lower, upper)
                    
                }

                
                vertexObject.styles.position[0] = xPos
                vertexObject.styles.position[1] = yPos

                
                
                drawVertex.setAttribute("cx", `${xPos}%`)
                drawVertex.setAttribute("cy", `${yPos}%`)
                drawVertex.setAttribute("r", `${vertexObject.styles.radius}%`)
                drawVertex.setAttribute("style", `fill: ${vertexObject.styles.color}`)
                drawVertex.setAttribute("opacity", '0.5')

                drawVertex.classList.add(vertexObject.name)
                drawVertex.addEventListener('click', (e) => {selectStartingVertex(this, e, this.ctx, this.vertices[i])})
                
                svgContainer.appendChild(drawVertex)
                if (this.vertexDisplay != "none") {

                    const x = xPos 
                    const y = yPos + 1

                    let display = null;
                    if (this.vertexDisplay === "name") {
                        display = vertexObject.name
                    }

                    if (this.vertexDisplay === "degree") {
                        display = vertexObject.degree
                        
                    }

                    const vertexNameString = ` <text text-anchor="middle" x="${x}%" y="${y}%" class="small ${vertexObject.name}">${display}</text>`
                    svgContainer.insertAdjacentHTML('beforeend', vertexNameString)
                    
                } else {
                    const x = xPos 
                    const y = yPos + 1
                    let vertexNameString = ` <text text-anchor="middle" x="${x}%" y="${y-8}%" class="small">${vertexObject.name}</text>`
                    svgContainer.insertAdjacentHTML('beforeend', vertexNameString)
                    vertexNameString = ` <text text-anchor="middle" x="${x}%" y="${y}%" class="small insideVertexText ${vertexObject.name}"></text>`
                    svgContainer.insertAdjacentHTML('beforeend', vertexNameString)

                }


            }

        }

        findRandomPosition(min, max) {
            let found = false // found a valid vertex that is within distance -> try again
            let tries = 50
            let xPos, yPos = 0
            while (!found && tries > 0) {
                tries -= 1
                xPos = randomIntFromInterval(min, max)
                yPos = randomIntFromInterval(min, max)
                

                let foundVertexDistance = false

                // initially vertex position uninitialized
                for (const vertex of this.vertices) {
                    if (vertex.styles.position[0] != -1) {

                        const distance = euclideanDistance(xPos, yPos, vertex.styles.position[0], vertex.styles.position[1])
                        if (distance < this.styles.vertexDistance) {
                            foundVertexDistance = true
                            break
                        }

                    }
                
                }

                if (!foundVertexDistance) {
                    found = true // break out of while loop
                }
                
            }

            return [xPos, yPos]
        }

        drawEdges(svgContainer) {

            for (const vertex of this.vertices) {

                for (const neighbourObject of vertex.adjacencyList) {  // [{v1: config }]
                
                    const neighbouringVertex = neighbourObject.vertex
                    const {edgeWeight, styles, name} = neighbourObject.config // config object
                    

                    // draw an edge going between vertex and neighbouringVertex
                    const drawEdge = document.createElementNS("http://www.w3.org/2000/svg", "line")
                    const p1 = [vertex.styles.position[0], vertex.styles.position[1]]
                    const p2 = [neighbouringVertex.styles.position[0], neighbouringVertex.styles.position[1]]

                    let directedRadius = vertex.styles.radius
                    if (this.directed) {
                        directedRadius += 1.5

                    }

        
                    const p3 = circleBorderCoordinates(p1, p2, vertex.styles.radius, this.width, this.height)
                    const p4 = circleBorderCoordinates(p2, p1, directedRadius, this.width, this.height)
                
                    
                    drawEdge.setAttribute("x1", `${p3[0]}%`)
                    drawEdge.setAttribute("y1", `${p3[1]}%`)
                    drawEdge.setAttribute("x2", `${p4[0]}%`)
                    drawEdge.setAttribute("y2", `${p4[1]}%`)
                    drawEdge.setAttribute("stroke", "black")
                    drawEdge.setAttribute("opacity", "0.4")

                    drawEdge.classList.add(name)
                    drawEdge.classList.add("edge")


                    if (this.directed){
                        drawEdge.setAttribute("marker-end", "url(#arrowhead)")
                    }
                    
                    drawEdge.setAttribute("stroke-width", "1.5")

                    if (this.showEdgeWeights) {
                        
                        [midX, midY] = midPoint(vertex.styles.position[0], vertex.styles.position[1], neighbouringVertex.styles.position[0], neighbouringVertex.styles.position[1])
                        const drawWeight = document.createElementNS("http://www.w3.org/2000/svg", "text")
                        const textNode = document.createTextNode(`${edgeWeight}`);
                        //const textNode = document.createTextNode("1");
                        drawWeight.appendChild(textNode);
                        midY-=3
                        drawWeight.setAttribute("x", `${midX}%`)
                        drawWeight.setAttribute("y", `${midY}%`)
                        svgContainer.appendChild(drawWeight)
                    } 

                    svgContainer.appendChild(drawEdge)



                } 
            }

        }

    
    }




    function selectStartingVertex(graph, e, divContainer, vertex) {

        if (graph.isBuilder && !graph.buildComplete) {
            return
        }

        if (graph.state === state[1]) {
            graph.selectedVertex = vertex
            const clickedVertex = e.srcElement
            // change color of clickedVertex and reset color of all other vertices
            const vertices = divContainer.querySelectorAll("circle")
            for (let vertex of vertices) {
                vertex.style.fill = 'lightgreen'
            }
            clickedVertex.style.fill = 'lightblue'

            let checkText = divContainer.getElementsByClassName("executeAlgText")[0]
            if (checkText) {
                checkText.textContent = ""
            }

            let text = divContainer.getElementsByClassName("selectStartingVertexText")[0]
                if (text) {
                    text.style.display = "None"
                }

        }
    }



    async function userDrawEdges(graph, svgContainer, e) {

        // idea taken from: https://stackoverflow.com/questions/29261304/how-to-get-the-click-coordinates-relative-to-svg-element-holding-the-onclick-lis
        let dim = svgContainer.getBoundingClientRect();
        let x = e.clientX - dim.left
        let y = e.clientY - dim.top

        let clickedVertex = null 

        for (let v of graph.vertices) {
            let v_x = v.styles.position[0]
            let v_y = v.styles.position[1]
            if (euclideanDistance(x,y, v_x, v_y) <= v.styles.radius) {
                clickedVertex = v 
                break
            } 
        }

        // no vertex clicked on or double clicking on the same vertex
        if (!clickedVertex || (clickedVertex === graph.clickedVertex1)) {
            if (graph.clickedVertex1) {
                let v = graph.ctx.querySelectorAll(`.${graph.clickedVertex1.name}`)[0]
                v.style.stroke = 'none'
            }
            
            
            graph.clickedVertex1 = null 
            graph.clickedVertex2 = null

            return
        }
        

        
        if (graph.clickedVertex1 === null) {
            graph.clickedVertex1 = clickedVertex

            // color it brown to indicate selection
            let v = graph.ctx.querySelectorAll(`.${clickedVertex.name}`)[0]
            v.style.stroke = 'black'
            
        } else if (graph.clickedVertex2 === null) {
            graph.clickedVertex2 = clickedVertex

            let v = graph.ctx.querySelectorAll(`.${clickedVertex.name}`)[0]
            v.style.stroke = 'black'
        
            // add directed edge
        
            let name = graph.addEdge(graph.clickedVertex1, graph.clickedVertex2)
            let directedRadius = graph.clickedVertex1.styles.radius + 15


            const drawEdge = document.createElementNS("http://www.w3.org/2000/svg", "line")
            const p1 = [graph.clickedVertex1.styles.position[0], graph.clickedVertex1.styles.position[1]]
            const p2 = [graph.clickedVertex2.styles.position[0], graph.clickedVertex2.styles.position[1]]

            const p3 = circleBorderCoordinatesNoPercentage(p1, p2, graph.clickedVertex1.styles.radius)
            const p4 = circleBorderCoordinatesNoPercentage(p2, p1, directedRadius)


            drawEdge.setAttribute("x1", `${p3[0]}`)
            drawEdge.setAttribute("y1", `${p3[1]}`)
            drawEdge.setAttribute("x2", `${p4[0]}`)
            drawEdge.setAttribute("y2", `${p4[1]}`)
            drawEdge.setAttribute("stroke", "black")
            drawEdge.setAttribute("opacity", "0.4")

            drawEdge.classList.add(name)
            drawEdge.classList.add("edge")


            drawEdge.setAttribute("marker-end", "url(#arrowhead)")
            drawEdge.setAttribute("stroke-width", "1.5")

            await delay(100)

            v = graph.ctx.querySelectorAll(`.${graph.clickedVertex1.name}`)[0]
            v.style.stroke = 'none'
            v = graph.ctx.querySelectorAll(`.${graph.clickedVertex2.name}`)[0]
            v.style.stroke = 'none'

            svgContainer.appendChild(drawEdge)

            graph.clickedVertex1 = null
            graph.clickedVertex2 = null

        }

    }



    function userDrawVertex(graph, svgContainer, e) {
    
        
        const vertex = new Vertex()
        graph.addVertex(vertex, true)


        const drawVertex = document.createElementNS("http://www.w3.org/2000/svg", "circle")
        drawVertex.setAttribute("class", "vertex")
        
        // idea taken from: https://stackoverflow.com/questions/29261304/how-to-get-the-click-coordinates-relative-to-svg-element-holding-the-onclick-lis
        let dim = svgContainer.getBoundingClientRect();
        

        let xPos = e.clientX - dim.left
        let yPos = e.clientY - dim.top
        vertex.styles.position[0] = xPos
        vertex.styles.position[1] = yPos

        drawVertex.setAttribute("cx", `${xPos}`)
        drawVertex.setAttribute("cy", `${yPos}`)
        drawVertex.setAttribute("r", `${vertex.styles.radius}`)
        drawVertex.setAttribute("style", `fill: ${vertex.styles.color}`)
        drawVertex.setAttribute("opacity", '0.5')
        drawVertex.classList.add(vertex.name)
        drawVertex.addEventListener('click', (e) => {selectStartingVertex(graph, e, graph.ctx, vertex)})

        svgContainer.appendChild(drawVertex)

        let vertexNameString = ` <text text-anchor="middle" x="${xPos}" y="${yPos-23}" class="small">${vertex.name}</text>`
        svgContainer.insertAdjacentHTML('beforeend', vertexNameString)
        vertexNameString = ` <text text-anchor="middle" x="${xPos}" y="${yPos}" class="small insideVertexText ${vertex.name}"></text>`
        svgContainer.insertAdjacentHTML('beforeend', vertexNameString)

    }

    function algBtnEventHandler(graph, e, divContainer) {

        const toolBar = divContainer.getElementsByClassName("toolBar")[0]
        const algType = e.target.innerHTML
        


        graph.state=state[1]
        

        let text = divContainer.querySelectorAll(".state0Text")[0]
        text.style.display = 'None'


        const hideBtnGroup = divContainer.querySelectorAll(".btnGroup")[0]
        hideBtnGroup.style.display = "None"



        text = divContainer.querySelectorAll(".state1Text")[0]

        if (!text){
            text = document.createElement("p")
            text.textContent = "Click on a starting vertex"
            text.classList.add("state1Text")
            toolBar.appendChild(text)

            const execAlg = document.createElement("button")
            execAlg.appendChild(document.createTextNode('Execute Algorithm'))
            execAlg.classList.add("execAlgBtn")

            execAlg.addEventListener('click', () => {executeAlgorithm(graph, e, divContainer, algType)})

            toolBar.appendChild(execAlg)

        } else { // show the appropriate state
            let execBtn = divContainer.querySelectorAll(".execAlgBtn")[0]
            execBtn.style.display=""
            text.style.display=""

        }
            
    }




    function executeAlgorithm(graph, e, divContainer, algType) {
        const selectedVertex = graph.selectedVertex
        const toolBar = divContainer.getElementsByClassName("toolBar")[0]

        
        algType = graph.selectedAlgorithm
        
    
        if (selectedVertex) {
            if (graph.state === state[1]) { // algorithm clicked
                graph.state = state[2] // execute algorithm


                let text = divContainer.querySelectorAll(".state1Text")[0] 
                text.style.display = "None"
        
                const button = divContainer.querySelectorAll(".execAlgBtn")[0] 
                button.style.display = "None"


                if (algType === "bfs") { // BFS
                    executeBFS(divContainer, graph, graph.vertices, selectedVertex)
                } else if (algType === "dfs") {
                    // execute DFS
                    executeDFS(divContainer, graph, graph.vertices, selectedVertex)
                } else if (algType === "dijkstra") {
                    executeDijkstra(divContainer, graph, graph.vertices, selectedVertex)
                } else {
                    console.log("Error")
                }
            
            }

        } else {
            let text = divContainer.getElementsByClassName("selectStartingVertexText")[0]

            if (!text) {
                text = document.createElement("p")
                text.textContent = "Please select a starting vertex!"
                text.classList.add("selectStartingVertexText")
                text.style.display = "inline"
                toolBar.appendChild(text)
            } else {
                text.style.display = "inline"
            }
            

        }

    }




    /** Graph Algorithms Implementation */

    /** Note that the implementations below are based on their implementations in the CLRS textbook */


    let DFS_time = 0

    /** DFS Helper Function */
    async function DFS_visit(divContainer, graph, vertex, speed) {

        DFS_time += 1
        
        vertex.color = 'lightblue'
        vertex.s = DFS_time
        let vDOM = divContainer.getElementsByClassName(vertex.name)[0]
        vDOM.style.fill = 'lightblue'

        let vTextDOM = divContainer.getElementsByClassName(vertex.name)[1]
        vTextDOM.textContent = `${vertex.s}/${vertex.f}`

        for (let v of vertex.adjacencyList) {
            // highlight edge currently considering

            // await delay(2000)
            let eDOM = divContainer.getElementsByClassName(v.config.name)[0]
            eDOM.setAttribute("stroke", "red")
            if (!graph.directed) { // stroke the opposite edge: (v,u)
                for (let v2 of v.vertex.adjacencyList) {
                    if (v2.vertex === vertex) {
                        
                        let eDOM = divContainer.getElementsByClassName(v2.config.name)[0]
                        eDOM.setAttribute("stroke", "red")

                    }
                }
            }

            await delay(speed)

        //eDOM.setAttribute("stroke", "black") move here instead?
            if (v.vertex.color === 'lightgreen') {
                //eDOM.setAttribute("stroke", "black")
                await DFS_visit(divContainer, graph, v.vertex, speed)
            }

        }

        await delay(speed)

        DFS_time += 1
        vertex.f = DFS_time
        vTextDOM.textContent = `${vertex.s}/${vertex.f}`


    }


    async function executeDFS(divContainer, graph, vertices, startingVertex) {

        let dfsSpeed = null
        let speed = graph.dfsSpeed
        if (speed === 'medium') {
            dfsSpeed = 1000 // 500 1000 1500 
        } else if (speed === 'slow') {
            dfsSpeed = 1500
        } else if (speed === 'fast') { 
            dfsSpeed = 500
        } else {
            console.log('error')
        }

        let toolBar = divContainer.getElementsByClassName("toolBar")[0]
        let text = toolBar.getElementsByClassName("executeAlgText")[0]
        if (!text) {
            text = document.createElement("p")
            text.textContent = "Executing Algorithm ..."
            text.classList.add("executeAlgText")
            toolBar.appendChild(text)
        } else {
            text.textContent = "Executing Algorithm ..."
            text.style.display = ""
        }
        

        for (let v of vertices) {
            v.color = 'lightgreen'
            v.s = '-'
            v.f = '-'
            let vDOM = divContainer.getElementsByClassName(v.name)[0]
            vDOM.style.fill = 'lightgreen'

            let vTextDOM = divContainer.getElementsByClassName(v.name)[1]
            vTextDOM.textContent = `${v.s}/${v.f}`
        }

        await DFS_visit(divContainer, graph, startingVertex, dfsSpeed)
        await delay(dfsSpeed)

        for (let v of vertices) {
            if (v.color === 'lightgreen') {
                await DFS_visit(divContainer, graph, v, dfsSpeed)
                await delay(dfsSpeed)
            }
            
        }

        DFS_time = 0
        
        text.textContent = "Algorithm Complete!"
        let resetBtn = divContainer.getElementsByClassName("resetBtn")[0]

        if (!resetBtn) {
            resetBtn = document.createElement("button")
            resetBtn.appendChild(document.createTextNode("Reset")) 
            resetBtn.classList.add("resetBtn")

            resetBtn.addEventListener('click', (e) => {reset(e, divContainer, graph)})
            toolBar.appendChild(resetBtn)
        } else {
            resetBtn.style.display = "block"
        }

    }


    /** BFS Helper Functions */


    function queueToString(queue) {
        let q = queue.map((v) => {return v.name})
        return q.toString()
    }

    function displayQueue(toolBar, queue) {

        let text = null

        let queueTextEle = toolBar.getElementsByClassName("queueText")[0]
        let queueTextContent = `Q=[${queueToString(queue)}]`
        if (!queueTextEle) {
            text = document.createElement("p")
            text.textContent = queueTextContent
            text.classList.add("queueText")
            toolBar.appendChild(text)
        } else {
            if (queueTextEle.style.display === "none") {
                queueTextEle.style.display = ""
            }
            queueTextEle.textContent = queueTextContent

        }
        
    }

    function displayCurrentlyExploring(toolBar, vertexName) {

        let currentlyExploring = toolBar.getElementsByClassName("currentlyExploringText")[0]
        let currentlyExploringText = `Currently Exploring: ${vertexName}`
        if (!currentlyExploring) {
            currentlyExploring = document.createElement("p")
            currentlyExploring.textContent = currentlyExploringText
            currentlyExploring.classList.add("currentlyExploringText")
            toolBar.appendChild(currentlyExploring)
        } else {
            if (currentlyExploring.style.display === "none") {
                currentlyExploring.style.display = ""
            }
            currentlyExploring.textContent = currentlyExploringText

        }
        
    }

    async function executeBFS(divContainer, graph, vertices, startingVertex) {

        let bfsSpeed = null
        let speed = graph.bfsSpeed
        if (speed === 'medium') {
            bfsSpeed = 800 
        } else if (speed === 'slow') {
            bfsSpeed = 1500
        } else if (speed === 'fast') { 
            bfsSpeed = 200
        } else {
            console.log('error')
        }

        let toolBar = divContainer.getElementsByClassName("toolBar")[0]
        let text = toolBar.getElementsByClassName("executeAlgText")[0]
        if (!text) {
            text = document.createElement("p")
            text.textContent = "Executing Algorithm ..."
            text.classList.add("executeAlgText")
            toolBar.appendChild(text)
        } else {
            text.textContent = "Executing Algorithm ..."
            text.style.display = ""
        }

        
        
        for (let v of vertices) {
            v.color = 'lightgreen'
            v.d = 'inf'
            
            let vDOM = divContainer.getElementsByClassName(v.name)[0]
            vDOM.style.fill = 'lightgreen'

            let vTextDOM = divContainer.getElementsByClassName(v.name)[1]
            vTextDOM.textContent = v.d
        }
        startingVertex.color = 'lightblue'
        startingVertex.d = 0
        let vDOM = divContainer.getElementsByClassName(startingVertex.name)[0]
        vDOM.style.fill = 'lightblue'

        let vTextDOM = divContainer.getElementsByClassName(startingVertex.name)[1]
        vTextDOM.textContent = startingVertex.d

        
        let Q = []
        Q.push(startingVertex)
        
        displayQueue(toolBar, Q)
        displayCurrentlyExploring(toolBar, "")
        
        
        await delay(bfsSpeed);

        while (Q.length > 0) {
            let u = Q.shift()
            displayQueue(toolBar, Q)
            displayCurrentlyExploring(toolBar, u.name)
            
            for (let v of u.adjacencyList) {
                await delay(bfsSpeed);
                
            
                
                if (v.vertex.color === 'lightgreen') {
                    
                    v.vertex.color = 'lightblue'
                    v.vertex.d = u.d + 1

                    let vDOM = divContainer.getElementsByClassName(v.vertex.name)[0]
                    vDOM.style.fill = 'lightblue'


                    let vTextDOM = divContainer.getElementsByClassName(v.vertex.name)[1]
                    vTextDOM.textContent = v.vertex.d
                

                    Q.push(v.vertex)
                    displayQueue(toolBar, Q)
                }
                let eDOM = divContainer.getElementsByClassName(v.config.name)[0]
                eDOM.setAttribute("stroke", "red")
                if (!graph.directed) { // stroke the opposite edge: (v,u)
                        
                    for (let v2 of v.vertex.adjacencyList) {
                        if (v2.vertex === u) {
                            
                            
                            let eDOM = divContainer.getElementsByClassName(v2.config.name)[0]
                            eDOM.setAttribute("stroke", "red")

                        }
                    }
                }
            }

            await delay(bfsSpeed);

        }

        displayCurrentlyExploring(toolBar, "")

        
        text.textContent = "Algorithm Complete!"
        let resetBtn = divContainer.getElementsByClassName("resetBtn")[0]

        if (!resetBtn) {
            resetBtn = document.createElement("button")
            resetBtn.appendChild(document.createTextNode("Reset")) 
            resetBtn.classList.add("resetBtn")

            resetBtn.addEventListener('click', (e) => {reset(e, divContainer, graph)})
            toolBar.appendChild(resetBtn)
        } else {
            resetBtn.style.display = "block"
        }

    }



    /** Dijkstra helper functions */

    function extractMin(Q) {
        let minVertex = 0

        for (let i = 0; i < Q.length; i++) {
            if (Q[i].score < Q[minVertex].score) {
                minVertex = i
            }

        }

        let poppedVertex = Q.splice(minVertex, 1)
        return poppedVertex[0]
    }


    async function relax(divContainer, u, edgeObj) {
        let newScore = u.score + edgeObj.config.edgeWeight

        let updateVertex = edgeObj.vertex 
        if (newScore < updateVertex.score) {
            updateVertex.score = newScore
            // display new Dijkstra score
            let vTextDOM = divContainer.getElementsByClassName(updateVertex.name)[1]
            vTextDOM.textContent = newScore
        }

    }


    async function executeDijkstra(divContainer, graph, vertices, startingVertex) {

        
        let speed = graph.dijkstraSpeed
        if (speed === 'medium') {
            speed = 800 
        } else if (speed === 'slow') {
            speed = 1500
        } else if (speed === 'fast') { 
            speed = 200
        } else {
            console.log('error')
        }

        let toolBar = divContainer.getElementsByClassName("toolBar")[0]
        let text = toolBar.getElementsByClassName("executeAlgText")[0]
        if (!text) {
            text = document.createElement("p")
            text.textContent = "Executing Algorithm ..."
            text.classList.add("executeAlgText")
            toolBar.appendChild(text)
        } else {
            text.textContent = "Executing Algorithm ..."
            text.style.display = ""
        }

        let Q = []


        for (let v of vertices) {
            v.color = 'lightgreen'
            v.score = Infinity
            let vDOM = divContainer.getElementsByClassName(v.name)[0]
            vDOM.style.fill = 'lightgreen'

            let vTextDOM = divContainer.getElementsByClassName(v.name)[1]
            vTextDOM.textContent = 'inf'

            Q.push(v)
        }

        startingVertex.color = 'lightblue'
        startingVertex.score = 0
        let vDOM = divContainer.getElementsByClassName(startingVertex.name)[0]
        vDOM.style.fill = 'lightblue'

        let vTextDOM = divContainer.getElementsByClassName(startingVertex.name)[1]
        vTextDOM.textContent = startingVertex.score


        while (Q.length > 0) {
            await delay(speed)
            let u = extractMin(Q)
            if (u.score < Infinity) {
                u.color = 'lightblue'
                let uDOM = divContainer.getElementsByClassName(u.name)[0]
                uDOM.style.fill = 'lightblue'

                for (let v of u.adjacencyList) {
                    let eDOM = divContainer.getElementsByClassName(v.config.name)[0]
                    eDOM.setAttribute("stroke", "red")
                    await delay(speed)
                    relax(divContainer, u, v) // note v is the edge object
                }
            }

        }


        
        text.textContent = "Algorithm Complete!"
        let resetBtn = divContainer.getElementsByClassName("resetBtn")[0]

        if (!resetBtn) {
            resetBtn = document.createElement("button")
            resetBtn.appendChild(document.createTextNode("Reset")) 
            resetBtn.classList.add("resetBtn")

            resetBtn.addEventListener('click', (e) => {reset(e, divContainer, graph)})
            toolBar.appendChild(resetBtn)
        } else {
            resetBtn.style.display = "block"
        }

    }






    /** Reset state when graph alg is finished executing */

    function reset(e, divContainer, graph) {

        const vertexText = divContainer.querySelectorAll(".insideVertexText")
        const vertices = divContainer.querySelectorAll(".vertex")
        const edges = divContainer.querySelectorAll(".edge")
        // reset DOM state
        for (let vertex of vertexText) {
            vertex.textContent = ""
        }
        for (let vertex of vertices) {
            vertex.style.fill = 'lightgreen'
        }
        for (let edge of edges) {
            edge.setAttribute("stroke", "black")
        }

        // reset graph state

        const hideText = divContainer.querySelectorAll(".toolBar p")

        for (let t of hideText) {
        t.style.display = 'None'
        }

        const hideResetBtn = divContainer.querySelectorAll(".resetBtn")[0]
        hideResetBtn.style.display='None'

        // re-show the appropriate state

        const btnGroup = divContainer.querySelectorAll(".btnGroup")[0]
        btnGroup.style.display = ""

        // const bfsBtn = divContainer.querySelectorAll(".bfsBtn")[0]
        // bfsBtn.style.display = ""

        let text = divContainer.querySelectorAll(".state0Text")[0]
        text.style.display = ''

        graph.selectedAlgorithm = algorithms[0]
        graph.state = state[0]
        graph.selectedVertex = null

    }






    class Vertex {

        constructor(config={styles: {}}) {
            
            const {
                color="lightgreen",
                size="medium",
                className="vertex",
                position=[-1,-1], // canvas position
                radius=3.5,
            } = config.styles

        
            const styles = {
                color: color,
                size: size, 
                className: className,
                position: position,
                radius: radius
            }
            const {name="", adjacencyList=[]} = config


            this.name = name
            this.adjacencyList = adjacencyList 
            this.styles = styles
            this.degree = this.adjacencyList.length
            
        
        }

        
    }





    /** Utility Functions */


    function euclideanDistance(x1, y1, x2, y2) {

        const xDiff = x1 - x2;
        const yDiff = y1 - y2;

        return Math.sqrt( xDiff*xDiff + yDiff*yDiff );


    }
    function randomIntFromInterval(min, max) { // min and max included 
        return Math.floor(Math.random() * (max - min + 1) + min)
    }

    function midPoint(x1, y1, x2, y2) {
        const midX = (x1+x2)/2
        const midY = (y1+y2)/2
        return [midX, midY]
    }


    // taken from: https://stackoverflow.com/questions/14226803/wait-5-seconds-before-executing-next-line
    const delay = ms => new Promise(res => setTimeout(res, ms));

    // only finds outer border for p1
    function circleBorderCoordinates(p1, p2, radius, width, height) {

    
        // convert percentages to lengths
        const x1 = (p1[0] / 100) * width
        const y1 = (p1[1] / 100) * height
        const x2 = (p2[0] / 100) * width
        const y2 = (p2[1] / 100) * height


        const vectorX = x2-x1
        const vectorY = y2-y1
        const magnitude = Math.sqrt(vectorX*vectorX + vectorY*vectorY)
        const unitVector = [vectorX / magnitude, vectorY / magnitude]

        // convert radius to length
        // formula taken from: https://oreillymedia.github.io/Using_SVG/extras/ch05-percentages.html
        const convertRadius = (radius / 100) * ((Math.sqrt(width*width + height*height))/Math.sqrt(2))

        
        // new points on outer edge of circle (based on length, not percentage)
        let newp1 = [x1 + (convertRadius * unitVector[0]), y1 + (convertRadius * unitVector[1])] 
        let newp2 = [x2 + (convertRadius * unitVector[0]), y2 + (convertRadius * unitVector[1])]

        
        // convert back to %
        newp1[0] = (newp1[0] / width) * 100
        newp2[0] = (newp1[0] / width) * 100

        newp1[1] = (newp1[1] / height) * 100
        newp2[1] = (newp1[1] / height) * 100

        

        return newp1

    }

    function circleBorderCoordinatesNoPercentage(p1, p2, radius) {

        const x1 = p1[0]
        const y1 = p1[1]
        const x2 = p2[0] 
        const y2 = p2[1] 


        const vectorX = x2-x1
        const vectorY = y2-y1
        const magnitude = Math.sqrt(vectorX*vectorX + vectorY*vectorY)
        const unitVector = [vectorX / magnitude, vectorY / magnitude]

        
        
        // new points on outer edge of circle (based on length, not percentage)
        let newp1 = [x1 + (radius * unitVector[0]), y1 + (radius * unitVector[1])] 
        let newp2 = [x2 + (radius * unitVector[0]), y2 + (radius * unitVector[1])]

        return newp1
    }


    // add objects to the window object

    global.Graph = global.Graph || Graph
    global.Vertex = global.Vertex || Vertex

})(window, window.document);







