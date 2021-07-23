let listItems = {};

// Function triggered after body is loaded
const initialLoad = () => {
  document.getElementById("addNewTask").addEventListener("click", addNewTask); //add Click event to add button.
  const list = localStorage.getItem("listItems"); //get persisted list.
  if(list) {
    listItems = JSON.parse(list);
    const existingListItems = Object.keys(listItems);
    for(let i = 0; i < existingListItems.length; i++) {
      const currentListItem = listItems[existingListItems[i]];
      createlistElement(currentListItem["task"], currentListItem["checked"], existingListItems[i]);
    }
  }
}

//store list items for persisting data.
const storeListItems = () => {
  localStorage.setItem("listItems", JSON.stringify(listItems));
}


//List Item or task Object.
class listItem {
    constructor(task, checked, id) {
    // super(task,checked);
    this.task = task;
    this.checked = checked ? checked : false;
    this.id = id ? id : new Date().getTime();
    this.incompleteTasksHolder = document.getElementById("incomplete-tasks");
    this.completedTasksHolder = document.getElementById("completed-tasks");
  }

  //create a new element.
  createNewListElement() {
    const item = document.createElement("li");
    item.id = this.id;
    const checkBox = document.createElement("input");
    checkBox.type = "checkbox";
    checkBox.tabIndex = "0";
    checkBox.checked = this.checked;
    checkBox.onchange = (e) => this.onCheckBoxChange(this,e);
    const taskLabel = document.createElement("label");
    taskLabel.innerText = this.task;
    const taskInput = document.createElement("input");
    taskInput.type = "text";
    taskInput.onkeydown = (e) => this.taskInputKeyDown(this,e);
    const taskEditBtn = document.createElement("button");
    taskEditBtn.innerText = "Edit";
    taskEditBtn.id = "editTask";
    taskEditBtn.className = "button-edit";
    taskEditBtn.onclick = (e) => this.editTask(e);
    taskEditBtn.onkeydown = (e) => this.editTask(e);
    const taskDeleteBtn = document.createElement("button");
    taskDeleteBtn.innerText = "Delete";
    taskDeleteBtn.id = "deleteTask";
    taskDeleteBtn.className = "button-delete";
    taskDeleteBtn.onclick = (e) => this.deleteTask(e);
    taskDeleteBtn.onkeydown = (e) => this.deleteTask(e);

    item.appendChild(checkBox);
    item.appendChild(taskLabel);
    item.appendChild(taskInput);
    item.appendChild(taskEditBtn);
    item.appendChild(taskDeleteBtn);
    
    if(this.checked) {
      this.completedTasksHolder.appendChild(item);
    } else {
      this.incompleteTasksHolder.appendChild(item);
    }

    return item;
  }

  // list input element key down
  taskInputKeyDown(that, e) {
    if(e.key === "Enter") {
      that.editTask(e);
    }
  }

  //list item checkbox change
  onCheckBoxChange(that,e) {
    that.checked = e.target.checked;
    if(that.checked) {
      that.taskCompleted(that,e);
    } else {
      that.taskIncomplete(that,e);
    }
  }

  //list item edit button click.
  editTask(e) {
    const activeListItem = e.target.parentNode;
    const taskInput = activeListItem.querySelectorAll("input[type=text]")[0];
    const taskLabel = activeListItem.querySelector("label");
    const taskEditBtn = activeListItem.getElementsByTagName("button")[0];

    const containsClass = activeListItem.classList.contains("editMode");
    if(containsClass) {
      taskLabel.innerText = taskInput.value;
      listItems[activeListItem["id"]]["task"] = taskInput.value;
      storeListItems();
      taskEditBtn.innerText = "Edit";
    } else {
      taskInput.value = taskLabel.innerText;
      taskEditBtn.innerText = "Save";
    }
    activeListItem.classList.toggle("editMode");
  }

  //list item delete button click.
  deleteTask(e) {
    const activeListItem = e.target.parentNode;
    const ul = activeListItem.parentNode;
    delete listItems[activeListItem["id"]];
    storeListItems();
    ul.removeChild(activeListItem);
  }

  //move the list item to completed folder
  taskCompleted(that,e) {
    const activeListItem = e.target.parentNode;
    listItems[activeListItem["id"]]["checked"] = true;
    storeListItems();
    that.completedTasksHolder.appendChild(activeListItem);
  }

  //move the list item to incomplete folder.
  taskIncomplete(that,e) {
    const activeListItem = e.target.parentNode;
    listItems[activeListItem["id"]]["checked"] = false;
    storeListItems();
    that.incompleteTasksHolder.appendChild(activeListItem);
  }
  
}

//adding new task to the list.
const addNewTask = () => {
  let newTask = document.getElementById("newTaskInput");
  if(newTask.value) {
    const currentListObj = createlistElement(newTask.value, false);
    listItems[currentListObj["id"]] = {"task" : currentListObj["task"], "checked": currentListObj["checked"]};
    storeListItems();
    newTask.value = "";  
  } else {
    alert("Please enter a task name to add");
  }
};

//Create a list item Object with properties.
const createlistElement = (taskValue, checked, id) => {
  const currentTask = new listItem(taskValue, checked, id);
  currentTask.createNewListElement();
  return currentTask;
}

//New task Input keydown functionality.
const newtaskKeyDown = () => {
  if(this.event.key === "Enter") {
    addNewTask();
  }
}