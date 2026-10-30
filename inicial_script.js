const sabor = document.querySelector('#sabor')
const ingrediente = document.querySelector('#ingrediente')
const lista = document.querySelector('#lista')
const gramatura = document.querySelector('#gramatura')

//SESSÃO DAS NOTIFICAÇÕES
const notificarIngrediente = document.querySelector('#notificacaoIngrediente')
const mensagemIngrediente = document.querySelector('#mensagemIngrediente')
const notificacaoSabor = document.querySelector('#notificacaoSabor')
const mensagemSabor =document.querySelector('#mensagemSabor')


// SESSÃO DOS BOTOES
const botaoSalvar = document.querySelector('#botao_salvar')
const botao_cadastro = document.querySelector("#botao_cadastrar")
const botaoExcluir = document.querySelector('#excluir')
const adicionarIngrediente = document.querySelector('#botao_adicionar_ingrediente')


const produtosSalvos = JSON.parse(localStorage.getItem("produtos")) || []

for(let i = produtosSalvos.length - 1; i >= 0; i--){
    if(produtosSalvos[i] === null){
        produtosSalvos.splice(i, 1);
    }
}

let produtoAtual = null
let produtoEditando = null

//aqui estamos criando uma camada em que ao clicar no botão de cadastrar ele irá gerar um array que vai receber os valor do ingrediente e o peso que cada produto vai ter para compor a pizza
adicionarIngrediente.addEventListener('click', function(){

    if(produtoAtual === null){
        alert('Cadastre o sabor primeiro')
        return
    }

    if(ingrediente.value.trim() === "" || gramatura.value.trim() === ""){
        alert("Preencha o ingrediente e a gramatura!")
        return
    }

    let nomeIngrediente = ingrediente.value.trim()
    const pesoIngrediente = gramatura.value;

    nomeIngrediente = nomeIngrediente.charAt(0).toUpperCase() + nomeIngrediente.slice(1)

    produtoAtual.ingrediente.push({
        nome: nomeIngrediente,
        gramatura: pesoIngrediente
    })

    ingrediente.value = "";
    gramatura.value = ""

    mensagemIngrediente.textContent = `${nomeIngrediente} - ${pesoIngrediente}g cadastrado com sucesso!`

    const toast = bootstrap.Toast.getOrCreateInstance(notificarIngrediente)
    toast.show()


    lista.innerHTML = "";

    mostrarProdutos();

}) 

botao_cadastro.addEventListener('click', function(){

    let nomeSabor = sabor.value.trim()

    if(nomeSabor === ""){
        alert('Cadastre o sabor da pizza!')
        return
    }

    nomeSabor = nomeSabor.charAt(0).toUpperCase() + nomeSabor.slice(1)

    produtoAtual = {
        sabor: nomeSabor,
        imagem: "",
        ingrediente: []
    }

    sabor.value = ""

    //produtosSalvos.push(produtoAtual)

    mensagemSabor.textContent = `${nomeSabor} cadastrado!`

    const toast = bootstrap.Toast.getOrCreateInstance(notificacaoSabor)
    toast.show()

    console.log(produtoAtual)

    lista.innerHTML = "";

    mostrarProdutos();
    
})

botaoSalvar.addEventListener('click', function(){

    produtosSalvos.push(produtoAtual)

    localStorage.setItem("produtos", JSON.stringify(produtosSalvos))

    sabor.value = "";

    mostrarProdutos();

})


// FUNÇÕES

function excluirProduto(index){

    produtosSalvos.splice(index, 1)

    localStorage.setItem("produtos", JSON.stringify(produtosSalvos))

    mostrarProdutos();

}

function excluirItem(indexProduto, indexIngrediente){

    produtosSalvos[indexProduto].ingrediente.splice(indexIngrediente, 1)

    localStorage.setItem("produtos", JSON.stringify(produtosSalvos))

    mostrarProdutos();

}

//TENTAR ENTENDER CADA ETAPA DESSA FUNÇÃO!!!!!

function salvarProduto(index){

    const imagem = document.querySelector(`[data-produto-index="${index}"].nova-imagem`)

    const card = lista.querySelector(`[data-produto-index="${index}"]`)

    const arquivoImagem = imagem.files[0];

    console.log(arquivoImagem);

    const novoSabor = card.querySelector(`[data-campo="sabor"]`).value;

    produtosSalvos[index].sabor = novoSabor;

    const ingredientes = card.querySelectorAll(`[data-campo="nome"]`)
    const gramaturas = card.querySelectorAll(`[data-campo="gramatura"]`)

    ingredientes.forEach(function(campo, aux){

        produtosSalvos[index].ingrediente[aux].nome = campo.value
        produtosSalvos[index].ingrediente[aux].gramatura = gramaturas[aux].value
    })

    if(arquivoImagem){
        const leitor = new FileReader();

        leitor.onload = function(event){

            produtosSalvos[index].imagem = event.target.result;

            localStorage.setItem("produtos", JSON.stringify(produtosSalvos))

            produtoEditando = null


            mostrarProdutos()
        
        }

        leitor.readAsDataURL(arquivoImagem)

    }else{

        localStorage.setItem("produtos",JSON.stringify(produtosSalvos))

        produtoEditando = null

        mostrarProdutos()

    }

}

function cancelar(index){

    produtoEditando = null

    mostrarProdutos();

}

function editarProduto(index){

    produtoEditando = index

    console.log(produtoEditando)

    mostrarProdutos();

}

function adicionarNovosProdutos(index){

    const novoProduto = document.querySelector(`#novosIngredientes-${index}`)

    novoProduto.innerHTML += `
        <div>
            <label >Nome do ingrediente</label>
            <input type="text" class="form-control mb-2 novo-nome">
        
            <label>Gramatura</label>
            <input type="number" class=" form-control mb-2 nova-gramatura">
        
            <button class="btn btn-outline-success mt-2"
                    onclick="salvarNovosIngredientes(${index})">
                Salvar ingrediente
            </button>

        </div>
    `
}

function salvarNovosIngredientes(index){

    const area = document.querySelector(`#novosIngredientes-${index}`)

    let nome = area.querySelector(".novo-nome").value
    const gramatura = area.querySelector(".nova-gramatura").value

    nome = nome.charAt(0).toUpperCase() + nome.slice(1)

    if(nome.trim() === "" || gramatura === ""){
        alert("Preencha os campos")
        return
    }

    produtosSalvos[index].ingrediente.push({
        nome: nome,
        gramatura: gramatura
    })

    localStorage.setItem("produtos", JSON.stringify(produtosSalvos))

    mensagemIngrediente.textContent = `${nome} adicionado com sucesso!`

    const toast = bootstrap.Toast.getOrCreateInstance(notificarIngrediente)
    toast.show()

    mostrarProdutos();

}

function mostrarProdutos(){

    lista.innerHTML = ""

    //aqui ele deixa a lista em ordem alfabetica
    produtosSalvos.sort(function(a, b){
        return a.sabor.localeCompare(b.sabor, 'pt-BR')
    })

    produtosSalvos.forEach(function(produto, index) {

        let ingredienteHTML = ""
        let ingredienteEditar = ""

        produto.ingrediente.forEach(function(item, aux){

            ingredienteHTML += `
                <div class="d-flex justify-content-between align-items-center mb-2">

                    <span>${item.nome}</span>

                    <div class="d-flex align-items-center gap-2"
                        <span>${item.gramatura}g</span>
                            <button 
                                class="btn btn-outline-danger btn-sm" 
                                onclick="excluirItem(${index}, ${aux})"> 
                                X 
                            </button>    
                        </p>
                    </div>
                </div>
            `

            ingredienteEditar += `
                
                <div>
                    <label>Ingrediente: </label>
                    <input 
                        type="text"
                        class="form-control mb-2"  
                        data-campo="nome"
                        data-index="${aux}"
                        value="${item.nome}">

                    <label>Gramatura: </label>    
                    <input 
                        type="number"
                        class="form-control mb-2" 
                        data-campo="gramatura"
                        data-index="${aux}" 
                        value="${item.gramatura}">
                
                </div>
            `
        })

        if(produtoEditando === index){
            lista.innerHTML += `

            <div class="card">
                <div class="card-body" data-produto-index="${index}">

                <label class="form-label"> Foto da Pizza: </label>
                    <input 
                        type="file"
                        data-produto-index="${index}"
                        class="form-control mb-2 nova-imagem"
                        accept="image/*">

                <label class="form-label">Sabor da pizza: </label>
                    <input 
                        class="form-control mb-2" 
                        type="text" 
                        data-campo="sabor" 
                        value="${produto.sabor}">

                    ${ingredienteEditar}

                    <button class="btn btn-success mb-2" onclick="salvarProduto(${index})"> 
                        Salvar 
                    </button>

                    <button class="btn btn-secondary mb-2" onclick="cancelar(${index})"> 
                        Cancelar 
                    </button>

                </div>
            </div>
                `
        }else{
            lista.innerHTML += `

        <div class="container">

            <div class="card mb-3 mx-auto" style="max-width: 500px;">

                <div class="card-body">

                <img src="${produto.imagem || ''}"    
                     class="img-fluid rounded mb-3"
                     alt="Foto da pizza">

                    <div class="d-flex justify-content-between align-items-center mb-3">
                        <h5 class="card-title mb-0">${produto.sabor}</h5>

                        <button class="btn btn-outline-secondary btn-sm mb-3"
                                type="button"
                                data-bs-toggle="collapse"
                                data-bs-target="#ingredientes-${index}"
                                aria-expanded="false"
                                aria-controls="#ingredientes-${index}">

                                &#9662; 

                        </button>
                    </div>

                    <div class="collapse" id="ingredientes-${index}">
                        ${ingredienteHTML} 
                    </div>

                    <button class="btn btn-danger mb-2" onclick="excluirProduto(${index})"> 
                        Excluir 
                    </button>

                    <button class="btn btn-dark mb-2" onclick="editarProduto(${index})"> 
                        Editar 
                    </button>

                    <button class="btn btn-primary mb-2"
                        onclick="adicionarNovosProdutos(${index})"> 
                        Adicionar 
                    </button>

                    <button class="btn btn-secondary mb-2" onclick="cancelar(${index})"> 
                        Cancelar 
                    </button>

                    <div id="novosIngredientes-${index}"></div>

                </div>

            </div>
            
        </div>
        `
        }

    })

}

mostrarProdutos();

//ESTAMOS TRABALHANDO USANDO BOOTSTRAP PARA ALTERARA O CARD BODY E CARD TITLE

/*sabor.value = "";
    ingrediente.value = "";

    lista.innerHTML = "";

    produtosSalvos.forEach(function(produto){

        lista.innerHTML += `
            <div class="card">
                <h3>${produto.sabor}</h3>
                <p>${produto.ingrediente}</p>
            </div>
        `
    });*/ 