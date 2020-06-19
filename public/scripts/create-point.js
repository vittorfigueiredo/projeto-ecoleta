function populateUFs() {
    const ufSelect = document.querySelector("select[name=uf]")
    fetch("https://servicodados.ibge.gov.br/api/v1/localidades/estados")
    .then( (res) => { return res.json( )}) // Quando tem só um carinha aqui não precisa dos "()" e qaundo estou retornando um valo simples eu posso tirar a palavra chave "return" e as "{}".
    .then( cities => {

        for( state of cities ) {
            ufSelect.innerHTML += `<option value="${state.id}">${state.nome}</option>`
        }
    })
}

populateUFs()

function getCities(event) {
    const citySelect = document.querySelector("select[name=city]")
    const stateInput = document.querySelector("input[name=state]")

    const ufValue = event.target.value

    const indexOfSelectedState = event.target.selectedIndex
    stateInput.value = event.target.options[indexOfSelectedState].text

    const url = `https://servicodados.ibge.gov.br/api/v1/localidades/estados/${ufValue}/municipios`
    
    // Reescreve o conteúdo de option no HTML e desativa o select de cidade.
    citySelect.innerHTML = "<option value>Selecione a Cidade</option>"
    citySelect.disabled = true

    // Busca as cidades referente ao estado selecionado.
    fetch(url)
    .then( (res) => { return res.json( )}) // Quando tem só um carinha aqui não precisa dos "()" e qaundo estou retornando um valo simples eu posso tirar a palavra chave "return" e as "{}".
    .then( cities => {

        for( city of cities ) {
            citySelect.innerHTML += `<option value="${city.nome}">${city.nome}</option>`
        }

        citySelect.disabled = false
    })
}

document
    .querySelector("select[name=uf]")
    .addEventListener("change", getCities)

// Itens de coleta
// Pegar todos os li's
const itemsToCollect = document.querySelectorAll(".items-grid li")

for (const item of itemsToCollect) {
    item.addEventListener("click", habdleSelectedItem)
}

const collectedItems = document.querySelector("input[name=items]")

let selectedItems = []

function habdleSelectedItem(event) {
    const itemLi = event.target

    // Adicionar ou remover uma classe com javascript
    itemLi.classList.toggle("selected")

    const itemId = itemLi.dataset.id

    console.log('ITEM ID: ', itemId)

    // Verificar se existem itens selecionados, se sim
    // pegar os itens selecionado
    const alreadySelected = selectedItems.findIndex( function(item) {
        const itemFound = item == itemId // Isso será true ou false
        return itemFound
    })

    // Se já estiver selecionado, tirar da seleção
    if( alreadySelected >= 0 ) {
        // Tirar da seleção
        const filteredItems = selectedItems.filter( item => {
            const itemIsDifferent = item != itemId // false
            return false
        })

        selectedItems = filteredItems

        // Se não estiver selecionado
    } else {
        //adicionar à seleção
        selectedItems.push(itemId)

    }

    console.log('selectedItems', selectedItems)

    // Atualizar o campo escondido com os itens selecionados
    collectedItems.value = selectedItems
    
}