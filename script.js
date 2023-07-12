const itemForm = document.querySelector("#item-form");
const itemInput = document.querySelector("#item-input");
const itemList = document.querySelector("#item-list");
const addBtn = document.querySelector(".btn");
const filterText = document.querySelector("#filter");
const clearBtn = document.querySelector("#clear");
let isEditMode = false

function displayItems(){
    const itemsFromStorage = getItemsFromLocalStorage()
    itemsFromStorage.forEach(item => addItemToDOM(item))
}

const onAddItem = (e) => {
    // stops form submission 
    e.preventDefault();
    const newItem = itemInput.value;

    //Validation 
     if(newItem === '') {
          alert("Please enter item's name");
          return
     };

     

     // check for edit mode 
     if(isEditMode){
         const itemToEdit = itemList.querySelector('li');

         removeItemsFromLocalStorage(itemToEdit.textContent);
         itemToEdit.classList.remove('edit-mode')
         itemToEdit.remove()
         isEditMode = false
         resetAddBtn()
     } else {
         if(itemCheck(newItem)){
             alert('That item already exists')
             return
         }
     }

     //create list items
     addItemToDOM(newItem)
     
     // added items to local storage
     addItemToStorage(newItem)
     itemInput.value = ''

     if(itemList.children.length > 0){
         removeHidden()
     }

}

// check for edit mode



function addItemToDOM(item){
    const listItem = document.createElement("li");
    listItem.appendChild(document.createTextNode(item));
    const btn = createBtn('remove-item btn-link text-red');
    listItem.appendChild(btn);
    itemList.appendChild(listItem);

}

function onClickItem(e){
    if(e.target.parentElement.classList.contains("remove-item")){
       remomveItems(e.target.parentElement.parentElement)
    } else {
        setItemToEdit(e.target)
    }
}


function itemCheck(item){
    const itemsFromStorage = getItemsFromLocalStorage()
    return itemsFromStorage.includes(item)
}

function setItemToEdit(item){
    isEditMode = true
    itemList.querySelectorAll('li').forEach(i => i.classList.remove("edit-mode"))
    itemInput.value = item.textContent.trim()
    item.classList.add("edit-mode")
    addBtn.innerHTML = '<i class="fa-solid fa-pen"></i> Update Item'
    addBtn.style.backgroundColor = 'green'
    
}

// remove items
const remomveItems = (item) => {

    // remove item from DOM 
    if(confirm("Are you sure")){
        item.remove()
    }

    // remove item from storage 
    removeItemsFromLocalStorage(item.textContent)

    
    if(itemList.children.length === 0){
        toggleHidden()
    }
}


// create button to appened to items
const createBtn = classes => {
    const btn = document.createElement("btn");
    btn.className = classes;
    const icon = createIcon("fa-solid fa-xmark")
    btn.appendChild(icon)
    return btn;
}

// create icon to append to buttons 
const createIcon = classes => {
    const icon = document.createElement('i');
    icon.className = classes;
    return icon;
}



// adding items to local storage
// newItem from onAddItem function gets passed as the item arguement
function addItemToStorage(item){
    // variable initialized for to hold values 
    const itemsFromStorage = getItemsFromLocalStorage()
    //add new items to arrays
    itemsFromStorage.push(item)
    //convert to JSON string and set to local storage
    localStorage.setItem('items', JSON.stringify(itemsFromStorage))
}

function getItemsFromLocalStorage(){
    // variable initialized for to hold values 
    let itemsFromStorage;
    // items is the key
    if(localStorage.getItem('items') === null){
        itemsFromStorage = []
    } else {
        itemsFromStorage = JSON.parse(localStorage.getItem('items'));
    } 
    return itemsFromStorage
}

function removeItemsFromLocalStorage(item){
    let itemsFromStorage = getItemsFromLocalStorage()
    // filter out item to be remove
      
    itemsFromStorage = itemsFromStorage.filter(itemFromLocal => itemFromLocal !== item)
    // re-set to localstorage
    localStorage.setItem('items', JSON.stringify(itemsFromStorage))
}


// clear UI State

const toggleHidden = () => {
    filterText.classList.toggle("hide") 
    clearBtn.classList.toggle("hide")
}

const removeHidden = () => {
    filterText.classList.remove("hide") 
    clearBtn.classList.remove("hide")
}

const emptyUI = () => {
    if(itemList.children.length === 0){
      toggleHidden()
        console.log("Clear UI")
    } else {
        toggleHidden()
        console.log("UI is visible")
    }
}

//reset button
function resetAddBtn(){
    if(isEditMode === false){
        addBtn.style.backgroundColor = "black"
        addBtn.innerHTML = ' <i class="fa-solid fa-plus"></i> Add Item'
    }
} 

// filtering 

const filterItems = (e) => {
    // grabs text from filter input feild
    const text = e.target.value.toLowerCase();

    // grabs the list items 
    const items = itemList.querySelectorAll('li')
    items.forEach(item => {
        // first child is the text node 
        // do not confused this with firstChildElement
        const itemName = item.firstChild.textContent.toLowerCase();
        if(itemName.indexOf(text) !== -1 ){
            item.style.display = 'flex'
            console.log(true)
        } else {
            item.style.display = 'none'
            console.log(false)
        }
    });
    console.log(items)
    console.log(text)
}




//Event Listeners
itemForm.addEventListener("submit", onAddItem);
itemList.addEventListener("click", onClickItem)
filterText.addEventListener("input", filterItems)

clearBtn.addEventListener( "click", () => {
    // using a while loop to clear all elements because it until this is false
    // if item list has a first child it will be removed
   
    if(itemList.children.length > 0){
        // the while loop runs completely
        while(itemList.firstChild){
            itemList.removeChild(itemList.firstChild)
        } 
        // clears out local storage completely
        localStorage.removeItem('items')
        toggleHidden()
    } 
})

document.addEventListener("DOMContentLoaded", displayItems)

